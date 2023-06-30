import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const Add = () => {
  const [requestSent, setRequestSent] = useState(false);
  const [creationSuccessful, setCreationSuccessful] = useState(false);
  const [taskInformation, setTaskInformation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isTaskInfoEmpty = () => taskInformation === '' ? true : false;

  useEffect(() => {
    setErrorMessage("");
    setCreationSuccessful(false);

    if (taskInformation !== "") {
      const params = JSON.stringify({
        task: taskInformation,
      });
      fetch(`http://127.0.0.1:8080/todo`, {
        method: "post",
        body: params,
      }).then((res) => {
        setCreationSuccessful(true);
        setTaskInformation("");
      }).catch((err) => {
        setErrorMessage("Error creating Task")
        console.error(err)
      })
    } else if (requestSent && taskInformation === '') {
      setErrorMessage("Task Information cannot be empty");
    }
  }, [requestSent]);

  return (
    <>
      {creationSuccessful && <Alert variant='success'>Task successfully created with id</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <h1>Add A Task</h1>
      <Form.Label>Task Information:</Form.Label>
      <Form.Control
        type="textarea"
        as="textarea"
        size="sm"
        onChange={(e) => {
          setTaskInformation(e.target.value)
        }}
        value={taskInformation}
      />
      <Button
        variant="primary"
        type="submit"
        onClick={() => {
          setRequestSent(true);
        }}
        disabled={isTaskInfoEmpty()}
      >
        Submit
      </Button>
    </>
  );
};

export default Add;
