import { createContext, useContext, useEffect, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";

const ShoppingCartContext = createContext({});

const initialCart = localStorage.getItem("shopping-cart")
  ? JSON.parse(localStorage.getItem("shopping-cart"))
  : [];

const ShoppingCartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialCart);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:8000/api/products');
        if (!res.ok) throw new Error("Erreur récupération produits");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Enrichir cartItems avec infos produit (nom, prix, imgUrl, etc)
  const cartItemsWithDetails = cartItems.map(cartItem => {
    const product = products.find(p => p._id === cartItem.id);
    return {
      ...cartItem,
      ...(product ? { ...product } : {}),
    };
  });

  const getItemQuantity = (id) => cartItems.find(item => item.id === id)?.quantity || 0;
  const increaseCartQuantity = (id) => {
    setCartItems(currItems => {
      if (!currItems.find(item => item.id === id)) return [...currItems, { id, quantity: 1 }];
      return currItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
    });
  };
  const decreaseCartQuantity = (id) => {
    setCartItems(currItems => {
      const item = currItems.find(item => item.id === id);
      if (!item) return currItems;
      if (item.quantity === 1) return currItems.filter(i => i.id !== id);
      return currItems.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };
  const removeFromCart = (id) => {
    setCartItems(currItems => currItems.filter(item => item.id !== id));
  };

  // Fonction pour vider entièrement le panier
  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        clearCart,         // <-- ici on expose clearCart
        openCart,
        closeCart,
        cartQuantity,
        cartItems: cartItemsWithDetails,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} closeCart={closeCart} />
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;
export const useShoppingCart = () => useContext(ShoppingCartContext);
