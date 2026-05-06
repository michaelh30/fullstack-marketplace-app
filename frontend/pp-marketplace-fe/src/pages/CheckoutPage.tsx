import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderAPI } from '../services/api';

export default function CheckoutPage() {
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const checkoutItems = useMemo(() => items.map((item) => ({ ...item })), [items]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accountName.trim() || checkoutItems.length === 0) return;

    setLoading(true);
    try {
      const orderTotal = getTotalPrice();
      const response = await orderAPI.create(user.id, accountName.trim());
      await new Promise((resolve) => setTimeout(resolve, 5000));
      clearCart();
      navigate('/chat', {
        state: {
          accountName: accountName.trim(),
          orderId: response.data.id,
          items: checkoutItems,
          totalPrice: orderTotal,
        },
      });
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 mb-4">Please log in before checkout.</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (user.role !== 'CUSTOMER') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 mb-4">Only customer accounts can checkout.</p>
        <Link to="/" className="btn-primary">Back Home</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="section-title">Checkout</h1>
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
        <Link to="/" className="btn-primary">Find Items</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title">Checkout</h1>

      {loading && (
        <div className="card mb-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-dark-700 border-t-gaming-red animate-spin" />
          <p className="text-white font-semibold">Processing your order...</p>
          <p className="text-gray-400 text-sm mt-1">Connecting you to the seller after payment confirmation.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">Account Name / ID</h2>
              <textarea
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter your in-game account name, UID, server, or delivery note"
                className="w-full"
                rows={5}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !accountName.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="card h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
          <div className="space-y-3 border-b border-dark-600 pb-4 mb-4">
            <div className="flex justify-between text-gray-300">
              <span>Items ({getTotalItems()})</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold text-gaming-orange">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
