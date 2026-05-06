import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'CUSTOMER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.signup(formData.email, formData.password, formData.fullName, formData.role);

      setSuccess('Account created successfully! Redirecting to login...');
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', role: 'CUSTOMER' });

      window.setTimeout(() => {
        navigate('/login', {
          state: { successMessage: 'Account created successfully. Please log in.' },
        });
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="card">
        <h1 className="text-3xl font-bold text-white mb-6">Sign Up</h1>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-700 text-green-300 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            className="w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className="w-full"
          />

          <div className="bg-dark-900 rounded p-4 border border-dark-700">
            <p className="text-white font-semibold mb-2">Register as</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="radio"
                  name="role"
                  value="CUSTOMER"
                  checked={formData.role === 'CUSTOMER'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Customer
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="radio"
                  name="role"
                  value="SELLER"
                  checked={formData.role === 'SELLER'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Seller
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-gray-400 mt-4">
          Already have an account? <Link to="/login" className="text-gaming-red">Login</Link>
        </p>
      </div>
    </div>
  );
}
