import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Game, Product, SubCategory, PagedResponse } from '../types';
import { gameAPI, productAPI, subCategoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 20;

export default function GamesPage() {
  const { id } = useParams<{ id: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SubCategory | null>(null);
  const [pagedData, setPagedData] = useState<PagedResponse<Product> | null>(null);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0-based for API

  // Load game list
  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await gameAPI.getAll();
        setGames(response.data);
        if (!id && response.data.length > 0) {
          setSelectedGame(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoadingGames(false);
      }
    };
    loadGames();
  }, [id]);

  // Sync selectedGame from URL param
  useEffect(() => {
    if (!games.length) return;
    if (id) {
      const game = games.find((g) => String(g.id) === id);
      setSelectedGame(game || null);
    }
  }, [games, id]);

  // Load subcategories when game changes
  useEffect(() => {
    const loadCategories = async () => {
      if (!selectedGame) return;
      try {
        const response = await subCategoryAPI.getByGame(selectedGame.id);
        setSubCategories(response.data);
        setSelectedCategory(null);
        setCurrentPage(0);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, [selectedGame]);

  // Fetch ONE page of products from the server
  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedGame) return;
      setLoadingProducts(true);
      try {
        const params = { page: currentPage, size: ITEMS_PER_PAGE };

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
        console.error('Failed to load products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, [selectedGame, selectedCategory, currentPage]);

  const products = pagedData?.content ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h1 className="section-title">Games</h1>
          <p className="text-gray-400 max-w-2xl mt-2">
            Choose a game first, then browse subcategories and items available for that game.
          </p>
        </div>
        <Link to="/" className="btn-secondary w-fit">
          Back to Home
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="text-xl font-bold text-white mb-4">Available Games</h2>
            {loadingGames ? (
              <div className="text-gray-400">Loading games...</div>
            ) : (
              <div className="space-y-3">
                {games.map((game) => (
                  <Link
                    key={game.id}
                    to={`/games/${game.id}`}
                    className={`block rounded-xl border px-4 py-4 transition ${selectedGame?.id === game.id ? 'border-gaming-red bg-dark-800' : 'border-dark-700 bg-dark-900 hover:border-gaming-red'}`}
                  >
                    <div className="font-semibold text-white">{game.name}</div>
                    <p className="text-gray-400 text-sm mt-1">{game.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {selectedGame && (
            <div className="card p-4">
              <h2 className="text-xl font-bold text-white mb-4">{selectedGame.name}</h2>
              <img src={selectedGame.imageUrl || '/images/valorantLogo.png'} alt={selectedGame.name} className="w-full rounded-xl mb-4" />
              <p className="text-gray-300">{selectedGame.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {selectedGame ? (
            <>
              <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Subcategories</h2>
                  <button
                    onClick={() => { setSelectedCategory(null); setCurrentPage(0); }}
                    className="text-gaming-red text-sm"
                  >
                    Show all
                  </button>
                </div>
                {subCategories.length === 0 ? (
                  <div className="text-gray-400">No categories found for this game.</div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {subCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => { setSelectedCategory(category); setCurrentPage(0); }}
                        className={`px-4 py-2 rounded font-semibold text-left transition ${selectedCategory?.id === category.id ? 'bg-gaming-red text-white' : 'bg-dark-800 text-gray-300 hover:bg-dark-700'}`}
                      >
                        <div>{category.name}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Items</h2>
                    <p className="text-gray-400 text-sm">
                      {selectedCategory
                        ? `Showing ${selectedCategory.name} items`
                        : 'Showing all items for this game'}
                      {pagedData && ` — ${pagedData.totalElements.toLocaleString()} total`}
                    </p>
                  </div>
                  {loadingProducts && <span className="text-gray-400">Loading items...</span>}
                </div>
                {products.length === 0 ? (
                  <div className="card p-8 text-center text-gray-400">No items found.</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                    {pagedData && (
                      <Pagination
                        currentPage={currentPage + 1}
                        totalPages={pagedData.totalPages}
                        totalItems={pagedData.totalElements}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={(p) => setCurrentPage(p - 1)}
                      />
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="card p-8 text-center text-gray-400">
              Select a game to see its subcategories and items.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
