import React from "react";
import { Offcanvas, Stack, Button } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import CartItem from "./CartItem";
import FormatCurrency from "./FormatCurrency";
import { useNavigate } from "react-router-dom";

export function ShoppingCart({ isOpen }) {
  const { closeCart, cartItems } = useShoppingCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (total, cartItem) => total + (cartItem.price * cartItem.quantity), 
    0
  );

  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Panier</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {cartItems.map((item) => (
            <CartItem key={item._id} {...item} />
          ))}
          
          {/* Bouton avant le total */}
          <Button
            variant="success"
            className="w-100"
            onClick={() => navigate('/order')}
            disabled={cartItems.length === 0}
          >
            Passer la commande
          </Button>
          
          {/* Total */}
          <div className="ms-auto fw-bold fs-5">
            Total {FormatCurrency(total)}
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default ShoppingCart;
