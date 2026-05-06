import { useState, useEffect } from 'react';
import type { Game, Product, SubCategory, PagedResponse } from '../types';
import { gameAPI, productAPI, subCategoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SubCategory | null>(null);
  const [pagedData, setPagedData] = useState<PagedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<'recommended' | 'cheapest' | 'top-rated'>('recommended');
  const [currentPage, setCurrentPage] = useState(0); // 0-based for API

  // Fetch game list once
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

  // Fetch subcategories when game changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedGame) return;
      try {
        const response = await subCategoryAPI.getByGame(selectedGame.id);
        setSubCategories(response.data);
        setSelectedCategory(null);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [selectedGame]);

  // Fetch ONE page of products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedGame) return;
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: ITEMS_PER_PAGE,
          sort: sortMode,
          search: searchTerm.trim() || undefined,
        };

        let response;
        if (selectedCategory) {
          response = await productAPI.getByGameAndSubCategory(
            selectedGame.id,
            selectedCategory.id,
            params
          );
        } else {
          response = await productAPI.getByGame(selectedGame.id, params);
        }

        setPagedData(response.data as PagedResponse<Product>);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedGame, selectedCategory, searchTerm, sortMode, currentPage]);

  // Reset to page 0 whenever filters change (but NOT when currentPage changes)
  const resetPage = () => setCurrentPage(0);

  const products = pagedData?.content ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="section-title">Gaming Marketplace</h1>

        {/* Game Banner */}
        {selectedGame && (
          <div className="relative w-full h-64 bg-dark-800 rounded-xl overflow-hidden mb-8 border border-dark-700">
            <img
              src={selectedGame.imageUrl}
              alt={selectedGame.name}
              className="w-full h-full object-cover"
            />
            {selectedGame.imageUrl?.includes('redPanda.png') && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/60 text-white px-8 py-3 rounded-full font-bold tracking-widest text-2xl uppercase">
                  Game
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-3xl font-bold text-white">{selectedGame.name}</h2>
              <p className="text-gray-300 mt-2">{selectedGame.description}</p>
            </div>
          </div>
        )}

        {/* Game Selection */}
        <div id="games" className="flex flex-col gap-4 mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedGame(game);
                  setSelectedCategory(null);
                  setSearchTerm('');
                  resetPage();
                }}
                className={`px-6 py-2 rounded font-semibold whitespace-nowrap transition ${selectedGame?.id === game.id
                  ? 'bg-gaming-red text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }`}
              >
                {game.name}
              </button>
            ))}
          </div>

          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setSelectedCategory(null); resetPage(); }}
                className={`px-4 py-2 rounded font-semibold ${selectedCategory === null ? 'bg-gaming-red text-white' : 'bg-dark-800 text-gray-300 hover:bg-dark-700'}`}
              >
                All Items
              </button>
              {subCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchTerm('');
                    resetPage();
                  }}
                  className={`px-4 py-2 rounded font-semibold ${selectedCategory?.id === category.id ? 'bg-gaming-red text-white' : 'bg-dark-800 text-gray-300 hover:bg-dark-700'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            placeholder={`Search ${selectedGame?.name || 'game'} items...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
            className="w-full bg-dark-800 text-white px-4 py-3 rounded border border-dark-600 focus:border-gaming-red"
          />
          <select
            value={sortMode}
            onChange={(e) => { setSortMode(e.target.value as typeof sortMode); resetPage(); }}
            className="w-full md:w-48"
          >
            <option value="recommended">Recommended</option>
            <option value="cheapest">Cheapest</option>
            <option value="top-rated">Top Rated</option>
          </select>
        </div>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {pagedData && (
            <Pagination
              currentPage={currentPage + 1}         // Pagination UI is 1-based
              totalPages={pagedData.totalPages}
              totalItems={pagedData.totalElements}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(p) => setCurrentPage(p - 1)} // convert back to 0-based
            />
          )}
        </>
      )}
    </div>
  );
}
