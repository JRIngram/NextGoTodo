package db_queries

import (
	"database/sql"
	"log"
	"os"

	"github.com/go-sql-driver/mysql"
)

type DbTodoItem struct {
	Task_id   int64
	Task_text string
	Completed bool
}

func Connect() *sql.DB {
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "todoApp",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

	log.Println("DB Connection Established.")

	return db
}

func GetAllTasks(db *sql.DB) (dbItems []DbTodoItem, err error) {
	var dbTodoList []DbTodoItem
	rows, err := db.Query("SELECT * FROM tasks")
	if err != nil {
		return dbTodoList, err
	}

	for rows.Next() {
		var dbRow DbTodoItem
		rows.Scan(&dbRow.Task_id, &dbRow.Task_text, &dbRow.Completed)
		dbTodoList = append(dbTodoList, dbRow)
	}

	return dbTodoList, err
}

func GetTaskById(db *sql.DB, id int64) (DbTodoItem, error) {
	var dbRow DbTodoItem
	row := db.QueryRow("SELECT * FROM tasks WHERE task_id = ?", id)
	err := row.Scan(&dbRow.Task_id, &dbRow.Task_text, &dbRow.Completed)
	return dbRow, err
}

func AddTask(db *sql.DB, taskText string) (DbTodoItem, error) {
	var newTask DbTodoItem
	var maxId int64
	row := db.QueryRow("SELECT MAX(task_id) FROM tasks")
	if err := row.Scan(&maxId); err != nil {
		return newTask, err
	}

	newTaskId := maxId + 1

	_, err := db.Exec(
		"INSERT INTO tasks (task_id, task_text, completed) VALUES(?,?,?)",
		newTaskId, taskText, false,
	)

	if err != nil {
		return newTask, err
	}

	newTask, err = GetTaskById(db, newTaskId)
	return newTask, err
}

func UpdateTask(db *sql.DB, item DbTodoItem) (DbTodoItem, error) {
	log.Println(item)
	var numericalBool int
	if item.Completed {
		numericalBool = 1
	} else {
		numericalBool = 0
	}

	log.Println(numericalBool)
	_, _ = db.Exec(
		"UPDATE tasks SET task_text = ?, completed = ? WHERE task_id = ?",
		item.Task_text, item.Completed, item.Task_id,
	)

	task, err := GetTaskById(db, item.Task_id)
	log.Println(task)

	return task, err
}

func DeleteTask(db *sql.DB, taskId int64) (DbTodoItem, error) {
	var taskToDelete DbTodoItem
	taskToDelete, err := GetTaskById(db, taskId)
	if err != nil {
		return taskToDelete, err
	}

	_, err = db.Exec("DELETE FROM tasks WHERE task_id = ?", taskId)

	return taskToDelete, err
}

func Close(db *sql.DB) {
	log.Println("Closing DB Connection.")
	db.Close()
}
