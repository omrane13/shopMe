import React, { useState, useEffect } from "react";
import { Col, Row, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StoreItem from "./StoreItem";
import "./Store.css";

const Store = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Your fixed categories (must match backend exactly)
  const categories = ["All", "shoes", "T-shirts", "Pants"];

  const fetchProducts = async (category) => {
  try {
    setLoading(true);
    setError(null);
    let url = "http://localhost:8000/api/products";

    if (category && category !== "All") {
      // Make sure the category name matches exactly (case-sensitive)
      url = `http://localhost:8000/api/products/category/${encodeURIComponent(category)}`;
    }

    const res = await fetch(url);
    
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    setProducts(data);
  } catch (err) {
    setError(err.message);
    setProducts([]); // Clear products on error
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  if (loading) return <Spinner animation="border" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="store-wrapper">
      <h1 className="store-header">Store</h1>

      <div className="category-filter mb-4">
        <Form.Group controlId="categoryFilter">
          <Form.Label>Filter by Category:</Form.Label>
          <div className="category-buttons">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline-primary"}
                onClick={() => setSelectedCategory(category)}
                className="me-2 mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </Form.Group>
      </div>

      <Row md={2} xs={1} lg={3} className="g-3">
        {products.map((item) => (
          // Dans Store.js, modifiez la partie où vous passez les props à StoreItem
<Col key={item._id || item.id}>
  <div
    className="item-click-wrapper"
    onClick={() => navigate(`/product/${item._id || item.id}`)}
  >
    <StoreItem 
      _id={item._id || item.id}  // Passez _id au lieu de id
      name={item.name}
      price={item.price}
      imgUrl={item.imgUrl}
    />
  </div>
</Col>
        ))}
      </Row>
    </div>
  );
};

export default Store;
