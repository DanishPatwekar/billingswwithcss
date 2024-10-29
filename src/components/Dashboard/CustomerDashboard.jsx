import { useState, useEffect } from 'react';
import ProductList from '../Product/ProductList';
import Cart from '../Product/Cart';
import { getProducts } from '../../services/api';
import './CustomerDashboard.css';

function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      const updatedCart = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        if (item.quantity === 1) {
          return null; // Remove item if quantity is 1
        }
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(Boolean); // Remove null items

    setCartItems(updatedCart);
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  return (
    <div className="customer-dashboard">
      <h1>Customer Dashboard</h1>
      <h2>Products</h2>
      <ProductList 
        role="customer" 
        products={products} 
        onAddToCart={handleAddToCart} 
      />
      <h2>Your Cart</h2>
      <Cart 
        cartItems={cartItems} 
        onDecreaseQuantity={handleDecreaseQuantity} 
        onIncreaseQuantity={handleIncreaseQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default CustomerDashboard;
