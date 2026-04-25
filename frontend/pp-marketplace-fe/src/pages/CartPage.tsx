import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { cartAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, setItems, removeItem, updateQuantity } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const response = await cartAPI.getCart(user.id);
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, setItems]);

  const handleRemove = async (cartItemId: number) => {
    try {
      await cartAPI.removeItem(cartItemId);
      removeItem(cartItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemove(cartItemId);
      return;
    }
    try {
      await cartAPI.updateItem(cartItemId, newQuantity);
      updateQuantity(cartItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 mb-4">Please log in to view your cart</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="section-title">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Your cart is empty</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-white">{item.productName}</div>
                  <div className="text-gaming-orange">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-dark-800 hover:bg-dark-700 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-dark-800 hover:bg-dark-700 rounded"
                  >
                    +
                  </button>
                </div>
                <div className="text-right ml-6 min-w-24">
                  <div className="font-semibold text-gaming-cyan">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="ml-4 text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="card h-fit sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 border-b border-dark-600 pb-4 mb-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-gaming-orange mb-6">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
