import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { gameAPI } from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [gameName, setGameName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    setLoading(true);
    try {
      await gameAPI.create({
        name: gameName,
        description: gameDescription,
        imageUrl: '',
      });
      alert('Game added successfully!');
      setGameName('');
      setGameDescription('');
    } catch (error) {
      console.error('Failed to add game:', error);
      alert('Failed to add game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="section-title">Admin Dashboard</h1>

      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Game</h2>
        <form onSubmit={handleAddGame} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Game Name</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
              placeholder="e.g., Valorant"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
              placeholder="Game description..."
              className="w-full"
              rows={4}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Adding...' : 'Add Game'}
          </button>
        </form>
      </div>

      <div className="mt-8 p-4 bg-dark-900 rounded border border-dark-700">
        <p className="text-gray-400">
          More admin features coming soon: Add SubCategories, Manage Products, View Orders, User Management
        </p>
      </div>
    </div>
  );
}
