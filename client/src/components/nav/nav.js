import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
export const Navbars = () => {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/admin">Admin</Nav.Link>
                            <Nav.Link href="/student">Student</Nav.Link>
                            {/* <NavDropdown title="More" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/certificate">Certificate Generate</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}