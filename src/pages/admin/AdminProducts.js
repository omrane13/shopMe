import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const categories = [
    'T-shirts',
    'Hoodies',
    'Pants',
    'Accessories',
    'Shoes',
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imgUrl: '',
    colors: '',
    sizes: ''
  });

  // Récupération du token stocké (adapter selon ton système d'auth)
  const token = localStorage.getItem('token'); 

  // Config axios avec token dans Authorization header
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      imgUrl: '',
      colors: '',
      sizes: ''
    });
    setCurrentProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
        imgUrl: formData.imgUrl
      };

      console.log('Submitting product payload:', payload);

      if (currentProduct) {
        const response = await axios.put(
          `http://localhost:8000/admin/products/${currentProduct._id}`, 
          payload,
          axiosConfig
        );
        console.log('Update product response:', response.data);
      } else {
        const response = await axios.post(
          'http://localhost:8000/admin/products', 
          payload,
          axiosConfig
        );
        console.log('Create product response:', response.data);
      }

      setShowModal(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      if (error.response) {
        console.error('Backend response error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Full error object:', error);
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      imgUrl: product.imgUrl || '',
      colors: (product.colors || []).join(', '),
      sizes: (product.sizes || []).join(', ')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8000/admin/products/${id}`, axiosConfig);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Product
        </Button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>{product.category || 'N/A'}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min={0}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min={0}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Colors (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleInputChange}
                placeholder="e.g. Black, White, Navy"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sizes (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleInputChange}
                placeholder="e.g. Small, Medium, Large"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {currentProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;
