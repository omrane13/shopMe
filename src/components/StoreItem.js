import React from "react";
import { Button, Card } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import FormatCurrency from "./FormatCurrency";

const StoreItem = ({ _id, name, price, imgUrl }) => {  // Changé de id à _id
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  
  const quantity = getItemQuantity(_id);  // Changé de id à _id
  
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={imgUrl}
        style={{ height: "450px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
          <span className="fs-2">{name}</span>
          <span className="ms-2 text-muted">{FormatCurrency(price)}</span>
        </Card.Title>
        <div className="mt-auto">
          {quantity === 0 ? (
            <Button className="w-100" onClick={() => increaseCartQuantity(_id)}>  {/* Changé à _id */}
              Add To Cart
            </Button>
          ) : (
            <div
              className="d-flex align-items-center flex-column"
              style={{ gap: "0.5rem" }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem" }}
              >
                <Button onClick={() => decreaseCartQuantity(_id)}>-</Button>  {/* Changé à _id */}
                <div>
                  <span className="fs-3">{quantity} in cart</span>
                </div>
                <Button onClick={() => increaseCartQuantity(_id)}>+</Button>  {/* Changé à _id */}
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeFromCart(_id)}  
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StoreItem;