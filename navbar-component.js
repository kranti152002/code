import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-hospital-alt me-2"></i>
          HMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <NavDropdown title="Management" id="basic-nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/patients">
                Patients
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/physicians">
                Physicians
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/nurses">
                Nurses
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/departments">
                Departments
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/appointments">
                Appointments
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/procedures">
                Procedures
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Relationships" id="relationship-nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/trained-in">
                Trained In
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/affiliated-with">
                Affiliated With
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Analytics" id="analytics-dropdown">
              <NavDropdown.Item as={NavLink} to="/analytics/patient">
                Patient Analytics
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/analytics/department">
                Department Analytics
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/analytics/procedure">
                Procedure Analytics
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#">
              <i className="fas fa-user me-1"></i> Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
