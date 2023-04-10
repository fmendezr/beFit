import { Navbar, Nav, Container, NavDropdown} from "react-bootstrap";
import beFit from "../assets/BeFit.png";
import { LinkContainer } from "react-router-bootstrap";
import {useAuth} from "../contexts/AuthContext"


export default function NavbarComponent () {

    const { currentUser} = useAuth();

    return (
        <Navbar bg="black" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand>
                <LinkContainer to="/" style={{height: "50px"}}>
                    <img src={beFit}></img>
                </LinkContainer>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav"/>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <LinkContainer className="text-white" to={`/${currentUser.displayName}`}>
                        <Nav.Link >Profile</Nav.Link>
                  </LinkContainer>
                  <LinkContainer className="text-white" to="">
                        <Nav.Link >Friends</Nav.Link>
                  </LinkContainer>
                  <LinkContainer className="text-white" to="/add-post">
                        <Nav.Link >Add Post</Nav.Link>
                  </LinkContainer>
                  <LinkContainer className="text-white" to="/saved-posts">
                    <Nav.Link>Saved Posts</Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </Container>
    </Navbar>
    )
}