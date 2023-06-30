import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { TodoList } from "../components/TodoList";
import { Container } from "react-bootstrap";

const Home = () => {
  const [includeCompleted, setIncludeCompleted] = useState(false);

  return (
    <>
      <h1>ToDo</h1>
      <Container>
        <Form.Check // prettier-ignore
          type="switch"
          id="show-completed-tasks"
          label="Include completed tasks"
          onChange={() => setIncludeCompleted(!includeCompleted)}
        />
        <TodoList includeCompleted={includeCompleted} />
      </Container>
    </>
  );
};

// export const getStaticProps = async () => {
//   const response = await fetch("http://127.0.0.1:8080/todo");
//   const resData = await response.json();
//   const todoList = resData.todoList;

//   return {
//     props: {
//       todoList,
//     },
//   };
// };

export default Home;
