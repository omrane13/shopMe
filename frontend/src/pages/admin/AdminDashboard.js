import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  // Statistiques factices (remplacez par des appels API réels)
  const stats = [
    { title: "Total Products", value: "245", icon: "📦" },
    { title: "Total Orders", value: "1,234", icon: "🛒" },
    { title: "Total Users", value: "543", icon: "👥" },
    { title: "Revenue", value: "$34,567", icon: "💰" }
  ];

  return (
    <AdminLayout>
      <h2 className="mb-4">Dashboard Overview</h2>
      
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={3} key={index}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">{stat.icon}</div>
                <Card.Title>{stat.value}</Card.Title>
                <Card.Text>{stat.title}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Dernières commandes et autres widgets peuvent être ajoutés ici */}
    </AdminLayout>
  );
};

export default AdminDashboard;