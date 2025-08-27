import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Image, Form, Spinner, Alert } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) return <Spinner animation="border" />;
  if (error)
    return (
      <Alert variant="danger" className="my-4">
        {error} <Button onClick={() => navigate('/store')}>Back to Store</Button>
      </Alert>
    );
  if (!product)
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Button onClick={() => navigate('/store')}>Back to Store</Button>
      </div>
    );

  const handleAddToCart = () => {
    increaseCartQuantity(product._id, quantity);
  };

  const cartQuantity = getItemQuantity(product._id);

  return (
    <div className="product-detail-wrapper">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="back-button">
        &larr; Back to Store
      </Button>

      <div className="product-detail-content">
        <Row className="g-4">
          <Col md={6}>
            <div className="product-image-container">
              <Image src={process.env.PUBLIC_URL + product.imgUrl} alt={product.name} fluid />
            </div>
          </Col>

          <Col md={6}>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-pricing">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">${product.originalPrice}</span>
                  <span className="discount">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="product-description">
              {product.description || 'Premium quality product for your everyday needs.'}
            </p>

            {product.colors && (
              <Form.Group className="color-selection mb-4">
                <Form.Label>Select Colors</Form.Label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </Form.Group>
            )}

            {product.sizes && (
              <Form.Group className="size-selection mb-4">
                <Form.Label>Choose Size</Form.Label>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </Form.Group>
            )}

            <div className="add-to-cart-section">
              {cartQuantity === 0 ? (
                <>
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                      -
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <Button variant="primary" className="add-to-cart-button" onClick={handleAddToCart}>
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                </>
              ) : (
                <div className="d-flex align-items-center flex-column" style={{ gap: '0.5rem' }}>
                  <div className="d-flex align-items-center justify-content-center" style={{ gap: '0.5rem' }}>
                    <Button onClick={() => decreaseCartQuantity(product._id)}>-</Button>
                    <div>
                      <span className="fs-3">{cartQuantity} in cart</span>
                    </div>
                    <Button onClick={() => increaseCartQuantity(product._id)}>+</Button>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(product._id)}>
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProductDetail;
