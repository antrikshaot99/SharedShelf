import { createContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_CART } from "../graphql/queries";
import { ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from "../graphql/mutations";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState("buy"); // 'buy' or 'rent'
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  // Fetch cart from backend if logged in
  const { data, refetch } = useQuery(GET_MY_CART, {
    skip: !isLoggedIn,
    onCompleted: (data) => {
      if (data?.myCart) {
        setCart(data.myCart);
      }
    }
  });
  
  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
  const [clearCartMutation] = useMutation(CLEAR_CART);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = async (book) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart");
      return;
    }
    
    try {
      await addToCartMutation({
        variables: {
          bookId: book.id,
          mode: mode
        }
      });
      await refetch();
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart: " + err.message);
    }
  };

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!isLoggedIn) return;
    
    try {
      if (newQuantity <= 0) {
        await removeFromCartMutation({
          variables: { id: cartItemId }
        });
      } else {
        await updateCartItemMutation({
          variables: {
            id: cartItemId,
            quantity: newQuantity
          }
        });
      }
      await refetch();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  /* =========================
     REMOVE ONE ITEM
  ========================= */
  const removeFromCart = async (cartItemId) => {
    if (!isLoggedIn) return;
    
    const item = cart.find(item => item.id === cartItemId);
    if (!item) return;
    
    await updateQuantity(cartItemId, item.quantity - 1);
  };

  /* =========================
     DELETE ITEM COMPLETELY
  ========================= */
  const deleteFromCart = async (cartItemId) => {
    if (!isLoggedIn) return;
    
    try {
      await removeFromCartMutation({
        variables: { id: cartItemId }
      });
      await refetch();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  /* =========================
     CLEAR ENTIRE CART
  ========================= */
  const clearCart = async () => {
    if (!isLoggedIn) return;
    
    try {
      await clearCartMutation();
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  /* =========================
     CALCULATE TOTAL
  ========================= */
  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.mode === 'rent' ? item.book.rent_price : item.book.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        mode,
        setMode,
        addToCart,
        updateQuantity,
        removeFromCart,
        deleteFromCart,
        clearCart,
        calculateTotal,
        refetchCart: refetch
      }}
    >
      {children}
    </CartContext.Provider>
  );
}