import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ImageUploadField from '../components/ImageUploadField';
import { gameAPI, productAPI, subCategoryAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Game, Product, SubCategory } from '../types';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  quantity: '1',
  imageUrl: '',
  gameId: '',
  subCategoryId: '',
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [gameForm, setGameForm] = useState({ name: '', description: '', imageUrl: '' });
  const [editingGameId, setEditingGameId] = useState<number | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', gameId: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const loadGames = async () => {
    const response = await gameAPI.getAll();
    setGames(response.data);
    if (!selectedGameId && response.data.length > 0) {
      setSelectedGameId(response.data[0].id);
    }
  };

  const loadCategories = async (gameId: number | null) => {
    if (!gameId) {
      setCategories([]);
      return;
    }
    const response = await subCategoryAPI.getByGame(gameId);
    setCategories(response.data);
  };

  const loadProducts = async (gameId: number | null) => {
    if (!gameId) {
      setProducts([]);
      return;
    }
    const response = await productAPI.getByGame(gameId);
    setProducts(response.data);
  };

  const refreshSelectedGameData = async () => {
    await Promise.all([loadCategories(selectedGameId), loadProducts(selectedGameId)]);
  };

  useEffect(() => {
    loadGames().catch((error) => console.error('Failed to load games:', error));
  }, []);

  useEffect(() => {
    refreshSelectedGameData().catch((error) => console.error('Failed to load admin data:', error));
    setCategoryForm((current) => ({ ...current, gameId: selectedGameId ? String(selectedGameId) : '' }));
    setProductForm((current) => ({ ...current, gameId: selectedGameId ? String(selectedGameId) : '', subCategoryId: '' }));
  }, [selectedGameId]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const resetGameForm = () => {
    setGameForm({ name: '', description: '', imageUrl: '' });
    setEditingGameId(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', gameId: selectedGameId ? String(selectedGameId) : '' });
    setEditingCategoryId(null);
  };

  const resetProductForm = () => {
    setProductForm({ ...emptyProduct, gameId: selectedGameId ? String(selectedGameId) : '' });
    setEditingProductId(null);
  };

  const handleSaveGame = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!gameForm.name.trim()) return;

    setLoading(true);
    try {
      const payload = {
        name: gameForm.name.trim(),
        description: gameForm.description,
        imageUrl: gameForm.imageUrl || '/images/redPanda.png',
      };
      if (editingGameId) {
        await gameAPI.update(editingGameId, payload);
      } else {
        await gameAPI.create(payload);
      }
      resetGameForm();
      await loadGames();
      alert(editingGameId ? 'Game updated successfully!' : 'Game added successfully!');
    } catch (error) {
      console.error('Failed to save game:', error);
      alert('Failed to save game');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGameId(game.id);
    setGameForm({
      name: game.name,
      description: game.description || '',
      imageUrl: game.imageUrl || '',
    });
  };

  const handleDeleteGame = async (gameId: number) => {
    if (!window.confirm('Delete this game, its categories, and all linked items?')) return;
    setLoading(true);
    try {
      await gameAPI.delete(gameId);
      if (selectedGameId === gameId) {
        setSelectedGameId(null);
      }
      await loadGames();
      alert('Game deleted successfully!');
    } catch (error) {
      console.error('Failed to delete game:', error);
      alert('Failed to delete game');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    const gameId = Number(categoryForm.gameId);
    if (!gameId || !categoryForm.name.trim()) return;

    setLoading(true);
    try {
      const payload = {
        name: categoryForm.name.trim(),
        description: categoryForm.description,
        gameId,
      };
      if (editingCategoryId) {
        await subCategoryAPI.update(editingCategoryId, payload);
      } else {
        await subCategoryAPI.create(payload);
      }
      resetCategoryForm();
      await loadCategories(selectedGameId);
      alert(editingCategoryId ? 'Category updated successfully!' : 'Category added successfully!');
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: SubCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      gameId: String(category.gameId),
    });
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('Delete this category and all linked items?')) return;
    setLoading(true);
    try {
      await subCategoryAPI.delete(categoryId);
      await refreshSelectedGameData();
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    const gameId = Number(productForm.gameId);
    const subCategoryId = Number(productForm.subCategoryId);
    if (!gameId || !subCategoryId || !productForm.name.trim()) return;

    setLoading(true);
    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description,
        price: parseFloat(productForm.price) || 0,
        quantity: parseInt(productForm.quantity, 10) || 1,
        imageUrl: productForm.imageUrl || '/images/redPanda.png',
        gameId,
        subCategoryId,
      };
      if (editingProductId) {
        await productAPI.update(editingProductId, payload);
      } else {
        await productAPI.create(payload);
      }
      resetProductForm();
      await loadProducts(selectedGameId);
      alert(editingProductId ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      quantity: String(product.quantity),
      imageUrl: product.imageUrl || '',
      gameId: String(product.gameId),
      subCategoryId: String(product.subCategoryId),
    });
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Delete this item?')) return;
    setLoading(true);
    try {
      await productAPI.delete(productId);
      await loadProducts(selectedGameId);
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const selectedGameCategories = categories.filter((category) => category.gameId === Number(productForm.gameId || selectedGameId));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Full marketplace management for games, categories, and items.</p>
        </div>
        <select
          value={selectedGameId ?? ''}
          onChange={(event) => setSelectedGameId(Number(event.target.value))}
          className="w-full sm:w-72"
        >
          {games.map((game) => (
            <option key={game.id} value={game.id}>{game.name}</option>
          ))}
        </select>
      </div>

      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">{editingGameId ? 'Update Game' : 'Add New Game'}</h2>
        <form onSubmit={handleSaveGame} className="space-y-4">
          <input
            type="text"
            value={gameForm.name}
            onChange={(event) => setGameForm({ ...gameForm, name: event.target.value })}
            required
            placeholder="Game name"
            className="w-full"
          />
          <textarea
            value={gameForm.description}
            onChange={(event) => setGameForm({ ...gameForm, description: event.target.value })}
            placeholder="Game description"
            className="w-full"
            rows={3}
          />
          <ImageUploadField
            label="Game Image"
            value={gameForm.imageUrl}
            onChange={(imageUrl) => setGameForm({ ...gameForm, imageUrl })}
          />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {editingGameId ? 'Save Game' : 'Add Game'}
            </button>
            {editingGameId && (
              <button type="button" onClick={resetGameForm} className="btn-secondary">Cancel</button>
            )}
          </div>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {games.map((game) => (
            <div key={game.id} className="rounded-lg border border-dark-700 bg-dark-900 p-4">
              <div className="flex gap-4">
                <img src={game.imageUrl || '/images/redPanda.png'} alt={game.name} className="h-20 w-24 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-white">{game.name}</div>
                  <p className="text-sm text-gray-400">{game.description || 'No description'}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => handleEditGame(game)} className="btn-secondary">Edit</button>
                <button type="button" onClick={() => handleDeleteGame(game.id)} className="btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">{editingCategoryId ? 'Update Subcategory' : 'Add Subcategory'}</h2>
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={categoryForm.gameId}
              onChange={(event) => {
                setCategoryForm({ ...categoryForm, gameId: event.target.value });
                setSelectedGameId(Number(event.target.value));
              }}
              required
              className="w-full"
            >
              <option value="">Choose game</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
              required
              placeholder="Category name"
              className="w-full"
            />
          </div>
          <textarea
            value={categoryForm.description}
            onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })}
            placeholder="Category description"
            className="w-full"
            rows={3}
          />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {editingCategoryId ? 'Save Category' : 'Add Category'}
            </button>
            {editingCategoryId && (
              <button type="button" onClick={resetCategoryForm} className="btn-secondary">Cancel</button>
            )}
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {categories.length === 0 ? (
            <p className="text-gray-400">No categories for the selected game.</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex flex-col gap-3 rounded-lg border border-dark-700 bg-dark-900 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-white">{category.name}</div>
                  <p className="text-sm text-gray-400">{category.description || 'No description'}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => handleEditCategory(category)} className="btn-secondary">Edit</button>
                  <button type="button" onClick={() => handleDeleteCategory(category.id)} className="btn-danger">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">{editingProductId ? 'Update Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={productForm.gameId}
              onChange={(event) => {
                setProductForm({ ...productForm, gameId: event.target.value, subCategoryId: '' });
                setSelectedGameId(Number(event.target.value));
              }}
              required
              className="w-full"
            >
              <option value="">Choose game</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
            <select
              value={productForm.subCategoryId}
              onChange={(event) => setProductForm({ ...productForm, subCategoryId: event.target.value })}
              required
              className="w-full"
            >
              <option value="">Choose category</option>
              {selectedGameCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={productForm.name}
            onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
            required
            placeholder="Item name"
            className="w-full"
          />
          <textarea
            value={productForm.description}
            onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
            placeholder="Item description"
            className="w-full"
            rows={3}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
              placeholder="Price"
              className="w-full"
            />
            <input
              type="number"
              min="1"
              value={productForm.quantity}
              onChange={(event) => setProductForm({ ...productForm, quantity: event.target.value })}
              placeholder="Quantity"
              className="w-full"
            />
          </div>
          <ImageUploadField
            label="Item Image"
            value={productForm.imageUrl}
            onChange={(imageUrl) => setProductForm({ ...productForm, imageUrl })}
          />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {editingProductId ? 'Save Item' : 'Add Item'}
            </button>
            {editingProductId && (
              <button type="button" onClick={resetProductForm} className="btn-secondary">Cancel</button>
            )}
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {products.length === 0 ? (
            <p className="text-gray-400">No items for the selected game.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex flex-col gap-3 rounded-lg border border-dark-700 bg-dark-900 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <img src={product.imageUrl || '/images/redPanda.png'} alt={product.name} className="h-20 w-24 rounded object-cover" />
                  <div>
                    <div className="font-semibold text-white">{product.name}</div>
                    <p className="text-sm text-gray-400">{product.subCategoryName} - Stock {product.quantity}</p>
                    <div className="text-gaming-orange font-bold">${product.price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => handleEditProduct(product)} className="btn-secondary">Edit</button>
                  <button type="button" onClick={() => handleDeleteProduct(product.id)} className="btn-danger">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
