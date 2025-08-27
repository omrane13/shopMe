import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        // Update existing user
        await axios.put(`/api/users/${currentUser._id}`, formData);
      } else {
        // Create new user (normalement pas nécessaire dans admin)
        await axios.post('/api/users', formData);
      }
      setShowModal(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user'
    });
    setCurrentUser(null);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowModal(true);
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Change this user's role to ${newRole}?`)) {
      try {
        await axios.put(`/api/users/${userId}/role`, { role: newRole });
        fetchUsers();
      } catch (error) {
        console.error('Error changing user role:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  {user.role === 'user' ? (
                    <Button 
                      variant="success" 
                      size="sm"
                      className="me-2"
                      onClick={() => handleRoleChange(user._id, 'admin')}
                    >
                      Make Admin
                    </Button>
                  ) : (
                    <Button 
                      variant="warning" 
                      size="sm"
                      className="me-2"
                      onClick={() => handleRoleChange(user._id, 'user')}
                    >
                      Remove Admin
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* User Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!currentUser}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              {currentUser ? 'Update User' : 'Add User'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;