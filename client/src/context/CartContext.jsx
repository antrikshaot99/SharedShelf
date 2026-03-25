import { createContext, useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { AuthContext } from "./AuthContext";
import { GET_MY_CART } from "../graphql/queries";
import { ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from "../graphql/mutations";

export const CartContext = createContext();

function normalizeCartItem(item) {
  const book = item.book || item.Book || {};
  const unitPrice = item.mode === 'rent'
    ? (book.rent_price ?? item.rent_price ?? 0)
    : (book.price ?? item.price ?? 0);

  return {
    ...item,
    title: item.title ?? book.title ?? "",
    author: item.author ?? book.author ?? "",
    coverImage: item.coverImage ?? book.coverImage ?? "",
    price: unitPrice,
    rent_price: book.rent_price ?? item.rent_price ?? 0,
    book,
  };
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState("buy"); // 'buy' or 'rent'
  
  // Get reactive auth state from AuthContext
  const { isLoggedIn } = useContext(AuthContext);
  
  // Fetch cart from backend if logged in
  // This will re-run when isLoggedIn changes (reactive!)
  const { data, refetch } = useQuery(GET_MY_CART, {
    skip: !isLoggedIn,
    onCompleted: (data) => {
      if (data?.myCart) {
        setCart(data.myCart.map(normalizeCartItem));
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
  const addToCart = async (book, selectedMode = mode) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart");
      return;
    }
    
    try {
      await addToCartMutation({
        variables: {
          bookId: book.id,
          mode: selectedMode
        }
      });
      const updatedCart = await refetch();
      if (updatedCart?.data?.myCart) {
        setCart(updatedCart.data.myCart.map(normalizeCartItem));
      }
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
      const updatedCart = await refetch();
      if (updatedCart?.data?.myCart) {
        setCart(updatedCart.data.myCart.map(normalizeCartItem));
      }
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
      const updatedCart = await refetch();
      if (updatedCart?.data?.myCart) {
        setCart(updatedCart.data.myCart.map(normalizeCartItem));
      }
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
      const price = item.mode === 'rent' ? item.rent_price : item.price;
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