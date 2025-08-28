import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/admin">Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin/products">Products</Nav.Link>
              <Nav.Link as={Link} to="/admin/orders">Orders</Nav.Link>
              <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="admin-content">
        {children}
      </Container>
    </div>
  );
};

export default AdminLayout;