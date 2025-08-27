import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import './OrderPage.css';

const OrderPage = () => {
  const { cartItems, clearCart } = useShoppingCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (successOrder) {
      const timer = setTimeout(() => {
        setSuccessOrder(null);
      }, 5000); // Efface message après 5 sec
      return () => clearTimeout(timer);
    }
  }, [successOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessOrder(null);

    if (!shippingAddress) {
      setError('Veuillez saisir une adresse de livraison.');
      setLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      setError('Votre panier est vide.');
      setLoading(false);
      return;
    }

    const orderPayload = {
      items: cartItems.map(({ _id, quantity, price }) => ({
        product: _id,   // IMPORTANT: product = string ObjectId
        quantity,
        price
      })),
      total,
      shippingAddress,
      paymentMethod: 'on_delivery'
    };

    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur backend lors de la création de la commande :", errorData);
        throw new Error(errorData.message || 'Erreur lors de la commande');
      }

      setSuccessOrder('Commande passée avec succès !');
      clearCart();
      setShippingAddress(''); // Optionnel : reset adresse
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <h2>Passer la commande</h2>

      {successOrder ? (
        <p className="success-message">{successOrder}</p>
      ) : cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <h4>Résumé du panier</h4>
          <ul className="order-summary">
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name || 'Produit inconnu'} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <h5>Total: ${total.toFixed(2)}</h5>

          <form onSubmit={handleSubmit}>
            <label htmlFor="shippingAddress">Adresse de livraison :</label>
            <textarea
              id="shippingAddress"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={3}
              required
              placeholder="Entrez votre adresse complète"
            />

            <p><strong>Méthode de paiement :</strong> Paiement à la livraison</p>

            <button type="submit" disabled={loading}>
              {loading ? 'En cours...' : 'Passer la commande'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </>
      )}
    </div>
  );
};

export default OrderPage;
