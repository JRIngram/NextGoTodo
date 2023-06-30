import { useEffect, useState } from "react";
import { Task } from "../types/Task";
import { TaskCard } from "./TaskCard/TaskCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";

export type TodoListProps = {
  includeCompleted: boolean;
};

export const TodoList = (props: TodoListProps) => {
  const { includeCompleted } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [todoList, setTodoList] = useState<Task[]>([]);

  const fetchTodoList = async () => {
    setIsLoading(true);
    const response = await fetch("http://127.0.0.1:8080/todo");
    const resData = await response.json();
    console.log(resData);
    const todoList = resData.todoList as Array<Task>;
    setTodoList(todoList);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTodoList();
  }, []);

  const renderItems = (items: Array<Task>) => {
    const filteredItems = !includeCompleted
      ? items?.filter((item) => !item.completed)
      : items;

    return filteredItems?.map((item) => {
      return (
        <Col key={item.id}>
          <TaskCard 
            task={item} 
            onChangeTaskStatus={() => fetchTodoList()} 
          />
        </Col>
      );
    });
  };

  return (
    <Row md={3} className="g-3 m-3">
      {isLoading ? (
        <Spinner animation="grow" variant="primary" />
      ) : (
        renderItems(todoList)
      )}
    </Row>
  );
};
