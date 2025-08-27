import React, { useState, useEffect } from 'react';
import { Table, Badge, Dropdown } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les commandes au montage
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // récupère le token stocké
      const response = await axios.get('http://localhost:8000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchOrders(); // recharge la liste
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <AdminLayout>
      <h2 className="mb-4">Orders Management</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.user?.name || order.user?.email || 'Guest'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <Badge bg={statusColors[order.status] || 'secondary'}>
                    {order.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" size="sm" id={`dropdown-${order._id}`}>
                      Change Status
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {Object.keys(statusColors).map(statusKey => (
                        <Dropdown.Item
                          key={statusKey}
                          onClick={() => updateOrderStatus(order._id, statusKey)}
                          active={order.status === statusKey}
                        >
                          {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
