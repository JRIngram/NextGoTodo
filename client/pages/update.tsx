import { useState, useEffect, use } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { Task } from "../types/Task";

type UpdateProps = {
  todoListIds: Array<number>;
};

const Update = (props: UpdateProps) => {
  // const { todoListIds } = props;
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTaskInfo, setSelectedTaskInfo] = useState<Task>({
    id: -1,
    task: "",
    completed: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);
  const [todoListIds, setTodoListId] = useState<Array<number>>(
    props.todoListIds
  );

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchTaskIds().then((todoListIds) => {
  //     setTodoListId(todoListIds);
  //     setIsLoading(false);
  //   })
  // })

  useEffect(() => {
    setNewRequestState();
    setSelectedTaskInfo({
      id: -1,
      task: "",
      completed: false,
    });

    // fetch task with id
    if(selectedTaskId){
      fetchTaskWithId(selectedTaskId).then((response) => {
        const { status, task } = response;
        if(status && task){
          if (status < 400) {
            setSelectedTaskInfo(task);
          } else {
            setErrorMessage(`Unable to fetch task with id ${selectedTaskId}`);
          }
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false)
    }

  }, [selectedTaskId]);

  const fetchTaskWithId = async (idString: string) => {
    console.log(`http://127.0.0.1:8080/todo/${idString}`)
    const response = await fetch(`http://127.0.0.1:8080/todo/${idString}`);
    const responseJson = await response.json();
    return {
      status: response.status,
      task: responseJson as Task,
    };
  };

  const renderDropdown = (todoListIds): React.ReactElement => {
    return todoListIds.map((id: number) => (
      <Dropdown.Item key={id} eventKey={id}>
        {id}
      </Dropdown.Item>
    ));
  };

  const submitTaskUpdate = async () => {
    setUpdateSuccessful(false);
    setDeleteSuccessful(false);
    setErrorMessage("");
    setIsLoading(true);
    setRequestSent(true);

    const sendTaskUpdate = async () => {
      const response = await fetchTaskWithId(selectedTaskId);
      const { status, task } = response;
      if (status < 400) {
        setSelectedTaskInfo(task);
      } else {
        setErrorMessage(`Unable to fetch task with id ${selectedTaskId}`);
      }

      if (task.id !== -1) {
        const params = {
          task: selectedTaskInfo.task,
          completed: task.completed,
        };

        try {
          const response = await fetch(
            `http://127.0.0.1:8080/todo/${selectedTaskId}`,
            {
              method: "put",
              body: JSON.stringify(params),
            }
          );
          if (response.status < 400) {
            const responseJson = await response.json();
            setUpdateSuccessful(true);
            setSelectedTaskInfo(responseJson);
          } else {
            throw new Error(`Status Code ${response.status}`);
          }
        } catch (err) {
          setUpdateSuccessful(false);
          setErrorMessage(err.message);
        }
      }
    };

    await sendTaskUpdate();
    setIsLoading(false);
  };

  const submitTaskDelete = async () => {
    setUpdateSuccessful(false);
    setDeleteSuccessful(false);
    setErrorMessage("");
    setIsLoading(true);
    setRequestSent(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/todo/${selectedTaskId}`,
        {
          method: "delete",
        }
      );
      if (response.status < 400) {
        setDeleteSuccessful(true);
        setSelectedTaskId("");
        fetchTaskIds().then((todoListIds) => {
          setTodoListId(todoListIds);
          setIsLoading(false);
        });
      } else {
        throw new Error(`Status Code ${response.status}`);
      }
    } catch (err) {
      setErrorMessage(err.message);
      setDeleteSuccessful(false);
    }

    setIsLoading(false);
  };

  const taskSelected = () => selectedTaskId === "";

  const setNewRequestState = () => {
    setUpdateSuccessful(false);
    setDeleteSuccessful(false);
    setErrorMessage("");
    setIsLoading(true);
    setRequestSent(true);
  };

  return (
    <>
      <h1>Update A Task</h1>
      {requestSent && updateSuccessful && (
        <Alert variant="success">{`Updated task ${selectedTaskId} successfully`}</Alert>
      )}
      {requestSent && deleteSuccessful && (
        <Alert variant="success">{`Deleted task successfully.`}</Alert>
      )}
      {errorMessage && requestSent && (
        <Alert variant="danger">{errorMessage}</Alert>
      )}
      <Dropdown
        onSelect={(eventKey) => {
          if (eventKey) {
            setSelectedTaskId(eventKey);
          }
        }}
      >
        <DropdownButton
          id="dropdown-button-dark-example2"
          variant="primary"
          menuVariant="dark"
          title={taskSelected() ? "Select Task" : `Task: ${selectedTaskId}`}
          className="mt-2"
        >
          {renderDropdown(todoListIds)}
        </DropdownButton>
      </Dropdown>
      {isLoading ? (
        <Spinner animation="grow" variant="primary" />
      ) : (
        <>
          <Form>
            <Form.Label>Task Information:</Form.Label>
            <Form.Control
              type="textarea"
              as="textarea"
              size="sm"
              value={selectedTaskInfo.task}
              disabled={taskSelected()}
              onChange={(e) =>
                setSelectedTaskInfo({
                  ...selectedTaskInfo,
                  task: e.target.value,
                })
              }
            />
          </Form>
          <Button
            variant="primary"
            type="submit"
            disabled={taskSelected() || selectedTaskInfo.task === ""}
            onClick={() => submitTaskUpdate()}
          >
            Submit
          </Button>
          <Button
            variant="danger"
            type="submit"
            disabled={taskSelected()}
            onClick={() => submitTaskDelete()}
          >
            Delete
          </Button>
        </>
      )}
    </>
  );
};

const fetchTaskIds = async () => {
  const response = await fetch("http://127.0.0.1:8080/todo");
  const resData = await response.json();
  const todoList = resData.todoList;
  const todoListIds: Array<number> = todoList.map((task: Task) => task.id);
  return todoListIds;
};

export const getServerSideProps = async () => {
  const todoListIds = await fetchTaskIds();

  return {
    props: {
      todoListIds,
    },
  };
};

export default Update;
