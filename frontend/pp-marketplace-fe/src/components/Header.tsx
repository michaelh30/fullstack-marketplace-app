import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple to-gaming-cyan">
            🎮 GameHub
          </div>
        </Link>

        <nav className="flex-1 flex justify-center space-x-8 mx-8">
          <Link to="/" className="text-white hover:text-gaming-cyan transition">Home</Link>
          <input
            type="text"
            placeholder="Search products..."
            className="bg-dark-800 text-white px-4 py-2 rounded border border-dark-600 focus:border-gaming-cyan w-48"
          />
        </nav>

        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative">
            <span className="text-2xl">🛒</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gaming-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">{user?.fullName}</span>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="btn-secondary !px-3 !py-1 text-sm">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-1 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
