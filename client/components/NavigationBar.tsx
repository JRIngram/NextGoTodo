import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Nav className="me-auto">
          <Nav.Link>
            <Link href="/">Home</Link>
          </Nav.Link>
          <Nav.Link>
            <Link href="/add">Add Task</Link>
          </Nav.Link>
          <Nav.Link>
            <Link href="/update">Update Task</Link>
          </Nav.Link>
          <Nav.Link>
            <Link href="/about">About</Link>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
