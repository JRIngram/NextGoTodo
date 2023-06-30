import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Task } from "../../types/Task";

type TaskCardProps = {
  task: Task;
  onChangeTaskStatus: () => Promise<void>;
};

export const TaskCard = (props: TaskCardProps) => {
  const { id, task, completed } = props.task;
  const [taskCompleted, setTaskCompleted] = useState(completed);

  const updateTaskAndRefetch = async () => {
    const newTaskStatus = !completed
    setTaskCompleted(newTaskStatus);
    const params = JSON.stringify({
      task,
      completed: newTaskStatus,
    });
    console.log('params', {
      url: `http://127.0.0.1:8080/todo/${id}`,
      params: JSON.parse(params)
    })
    await fetch(`http://127.0.0.1:8080/todo/${id}`, {
      method: "put",
      body: params,
    });
    props.onChangeTaskStatus();
  };

  return (
    <Card border="dark">
      <Card.Body>
        <Card.Title>Task {id}</Card.Title>
        <ToggleButton
          id={`${id}`}
          size="lg"
          type="checkbox"
          onClick={() => {
            updateTaskAndRefetch();
          }}
          checked={taskCompleted}
          value={`${id}`}
          variant={taskCompleted ? "primary" : "outline-primary"}
        />
        <Card.Text>{task}</Card.Text>
      </Card.Body>
    </Card>
  );
};
