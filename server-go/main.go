package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	db_queries "todo-app-server/internal"

	"github.com/dotenv-org/godotenvvault"
	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

type todoItem struct {
	ID        int64  `json:"id"`
	Task      string `json:"task"`
	Completed bool   `json:"completed"`
}

type errorResponse struct {
	Error string `json:"error"`
}

var db *sql.DB

func main() {
	err := godotenvvault.Load()
	if err != nil {
		log.Fatal("Error loading env vars")
	}

	// gin.SetMode("release")
	router := gin.Default()
	router.SetTrustedProxies([]string{"192.168.1.2", "10.0.0.0/8"})
	corsConfig := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://127.0.0.1",
			"http://127.0.0.1:8080",
			"http://localhost:3000",
		},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		Debug:            false,
	})

	router.Use(corsConfig)

	router.GET("/todo", getTodo)
	router.GET("/todo/:id", getTodoById)
	router.POST("/todo", postTodoItem)
	router.PUT("/todo/:id", putTodoItem)
	router.DELETE("/todo/:id", deleteTodoItem)

	db = db_queries.Connect()
	defer db_queries.Close(db)

	serverHost := os.Getenv("SERVERHOST")
	serverPort := os.Getenv("SERVERPORT")
	router.Run(fmt.Sprintf("%s:%s", serverHost, serverPort))
}

func getTodo(c *gin.Context) {
	var todoList []todoItem

	dbItems, err := db_queries.GetAllTasks(db)
	if err != nil {
		fmt.Println(err)
	}

	for _, item := range dbItems {
		todoList = append(todoList, dbToApiMapper(item))
	}

	res := buildTodoListResponse(todoList)
	c.IndentedJSON(200, res)
}

func getTodoById(c *gin.Context) {
	id := c.Param("id")
	numericalId, err := strconv.Atoi(id)
	if err != nil {
		errorMap := createErrorRespose("Error converting id: ", []string{id})
		c.JSON(http.StatusBadRequest, errorMap)
		return
	}
	int64Id := int64(numericalId)

	row, err := db_queries.GetTaskById(db, int64Id)
	todoItem := dbToApiMapper(row)

	if err != nil {
		errorMap := createErrorRespose("Error getting id: ", []string{id})
		c.JSON(http.StatusBadRequest, errorMap)
		return
	}

	c.IndentedJSON(200, todoItem)
}

func postTodoItem(c *gin.Context) {
	var newTodoItem todoItem

	if err := c.BindJSON(&newTodoItem); err != nil {
		errorMap := createErrorRespose("Error adding todo list item", []string{})
		c.IndentedJSON(http.StatusBadRequest, errorMap)
		return
	}

	result, err := db_queries.AddTask(db, newTodoItem.Task)
	if err != nil {
		errorMap := createErrorRespose("Error adding todo list item", []string{})
		c.IndentedJSON(http.StatusBadRequest, errorMap)
		return
	}

	newTodoItem = dbToApiMapper(result)
	c.IndentedJSON(http.StatusCreated, newTodoItem)
}

func putTodoItem(c *gin.Context) {
	var itemToUpdate todoItem
	taskId := c.Param("id")
	err := c.BindJSON(&itemToUpdate)

	if err != nil {
		errorMap := createErrorRespose("body request body", []string{})
		c.IndentedJSON(http.StatusBadRequest, errorMap)
	}

	if taskId == "" {
		errorMap := createErrorRespose("id is not defined", []string{})
		c.IndentedJSON(http.StatusBadRequest, errorMap)
	}

	convertedId, _ := strconv.Atoi(taskId)
	int64id := int64(convertedId)
	itemToUpdate.ID = int64id

	dbItem := apiToDbMapper(itemToUpdate)
	updatedItem, err := db_queries.UpdateTask(db, dbItem)

	if err != nil {
		errorMap := createErrorRespose("Error updating task with id:", []string{taskId})
		c.JSON(500, errorMap)
		return
	}

	c.IndentedJSON(http.StatusOK, dbToApiMapper(updatedItem))
}

func deleteTodoItem(c *gin.Context) {
	taskId := c.Param("id")
	convertedId, _ := strconv.Atoi(taskId)
	int64id := int64(convertedId)
	deletedItem, err := db_queries.DeleteTask(db, int64id)
	if err != nil {
		errorMap := createErrorRespose("Could not delete item with id: ", []string{taskId})
		c.JSON(http.StatusBadRequest, errorMap)
		return
	}
	c.JSON(200, deletedItem)
}

func createErrorRespose(errorMessage string, argumentsArray []string) errorResponse {
	messageArray := []string{errorMessage}
	messageArray = append(messageArray, argumentsArray...)

	errorMap := errorResponse{
		Error: strings.Join(messageArray, ""),
	}

	return errorMap
}

func dbToApiMapper(dbItem db_queries.DbTodoItem) (item todoItem) {
	item.ID = dbItem.Task_id
	item.Task = dbItem.Task_text
	item.Completed = dbItem.Completed
	return item
}

func apiToDbMapper(item todoItem) (dbItem db_queries.DbTodoItem) {
	dbItem.Task_id = item.ID
	dbItem.Task_text = item.Task
	dbItem.Completed = item.Completed
	return dbItem
}

func buildTodoListResponse(list []todoItem) map[string][]todoItem {
	res := map[string][]todoItem{
		"todoList": list,
	}
	return res
}
