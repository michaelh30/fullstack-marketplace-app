import { useState, useEffect } from 'react';
import type { Game, Product } from '../types';
import { gameAPI, productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gameAPI.getAll();
        setGames(response.data);
        if (response.data.length > 0) {
          setSelectedGame(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch games:', error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedGame) return;
      setLoading(true);
      try {
        let response;
        if (searchTerm) {
          response = await productAPI.searchByGame(selectedGame.id, searchTerm);
        } else {
          response = await productAPI.getByGame(selectedGame.id);
        }
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedGame, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="section-title">Gaming Marketplace</h1>
        
        {/* Game Selection */}
        <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                setSelectedGame(game);
                setSearchTerm('');
              }}
              className={`px-6 py-2 rounded font-semibold whitespace-nowrap transition ${
                selectedGame?.id === game.id
                  ? 'bg-gaming-red text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-800 text-white px-4 py-3 rounded border border-dark-600 focus:border-gaming-red mb-6"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gaming-red text-2xl">Loading...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">No products found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
