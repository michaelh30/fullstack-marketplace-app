import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderAPI } from '../services/api';

export default function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shippingAddress.trim()) return;

    setLoading(true);
    try {
      const response = await orderAPI.create(user.id, shippingAddress);
      clearCart();
      alert('Order placed successfully!');
      navigate(`/`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="section-title">Checkout</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your shipping address"
                required
                className="w-full"
                rows={5}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !shippingAddress.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
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
