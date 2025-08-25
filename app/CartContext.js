// app/CartContext.js (updated)
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback menu items in case API fails
  const fallbackMenuItems = [
    { _id: '1', name: 'Margherita Pizza', price: 299, category: 'pizza', image: '/pngegg.png' },
    { _id: '2', name: 'Pepperoni Pizza', price: 349, category: 'pizza', image: '/pngegg.png' },
    { _id: '3', name: 'French Fries', price: 99, category: 'fries', image: '/pngegg.png' },
    { _id: '4', name: 'Cheese Burger', price: 179, category: 'burger', image: '/pngegg.png' },
    { _id: '5', name: 'Veg Maggie', price: 79, category: 'maggie', image: '/pngegg.png' },
    { _id: '6', name: 'White Pasta', price: 199, category: 'pasta', image: '/pngegg.png' },
    { _id: '7', name: 'Caesar Salad', price: 229, category: 'salad', image: '/pngegg.png' },
    { _id: '8', name: 'Club Sandwich', price: 159, category: 'sandwich', image: '/pngegg.png' },
  ];

  // Fetch menu items from backend ONCE here
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://dini-next-kvwx.vercel.app/api/menu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Menu items fetched successfully:', data);
          setMenuItems(data);
        } else {
          console.warn('Failed to fetch menu items from backend, using fallback data');
          setMenuItems(fallbackMenuItems);
          setError('Using fallback menu data');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems(fallbackMenuItems);
        setError('Network error: Using fallback menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();

    // Also try to load from localStorage if available
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing saved cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart functions
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item._id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // FIXED: Count unique items instead of total quantities
  const getCartItemsCount = () => cartItems.length;

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const createOrder = async (orderData) => {
    try {
      console.log('Creating order with data:', orderData);
      
      const response = await fetch('https://dini-next-kvwx.vercel.app/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber: orderData.tableNumber,
          items: orderData.items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category || 'unknown'
          })),
          totalAmount: orderData.totalAmount,
          paymentMethod: orderData.paymentMethod,
          status: 'pending' // Add status field
        }),
      });

      if (response.ok) {
        const order = await response.json();
        console.log('Order created successfully:', order);
        return order;
      } else {
        const errorText = await response.text();
        console.error('Failed to create order. Server response:', errorText);
        throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getMenuItemById = (id) => menuItems.find(item => item._id === id);

  // Function to manually refresh menu items
  const refreshMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://dini-next-kvwx.vercel.app/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
        console.log('Menu items refreshed successfully');
      } else {
        console.warn('Failed to refresh menu items');
      }
    } catch (error) {
      console.error('Error refreshing menu items:', error);
      setError('Failed to refresh menu items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      menuItems,
      setMenuItems,
      loading,
      error,
      addToCart,
      updateQuantity,
      getCartTotal,
      getCartItemsCount,
      clearCart,
      createOrder,
      getMenuItemById,
      refreshMenuItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};