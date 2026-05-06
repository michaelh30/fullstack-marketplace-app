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

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [games, setGames] = useState<Game[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadGames = async () => {
    const response = await gameAPI.getAll();
    setGames(response.data);
    if (!selectedGameId && response.data.length > 0) {
      setSelectedGameId(response.data[0].id);
    }
  };

  const loadCategories = async (gameId: number | null) => {
    if (!gameId) {
      setSubCategories([]);
      return;
    }
    const response = await subCategoryAPI.getByGame(gameId);
    setSubCategories(response.data);
  };

  const loadProducts = async (gameId: number | null) => {
    if (!gameId) {
      setProducts([]);
      return;
    }
    const response = await productAPI.getByGame(gameId);
    setProducts(response.data);
  };

  useEffect(() => {
    loadGames().catch((error) => console.error('Failed to load games:', error));
  }, []);

  useEffect(() => {
    loadCategories(selectedGameId).catch((error) => console.error('Failed to load categories:', error));
    loadProducts(selectedGameId).catch((error) => console.error('Failed to load items:', error));
    setProductForm((current) => ({
      ...current,
      gameId: selectedGameId ? String(selectedGameId) : '',
      subCategoryId: '',
    }));
    setEditingProductId(null);
  }, [selectedGameId]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'SELLER') {
    return <Navigate to="/" />;
  }

  const resetProductForm = () => {
    setProductForm({ ...emptyProduct, gameId: selectedGameId ? String(selectedGameId) : '' });
    setEditingProductId(null);
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
      alert(editingProductId ? 'Item updated successfully!' : 'Item posted successfully!');
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="section-title mb-2">Seller Dashboard</h1>
          <p className="text-gray-400">Manage items under games and categories created by admin.</p>
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
        <h2 className="text-2xl font-bold text-white mb-6">{editingProductId ? 'Update Item' : 'Post New Item'}</h2>

        {subCategories.length === 0 ? (
          <p className="text-gray-400">This game has no subcategories yet. Ask admin to create one before posting items.</p>
        ) : (
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
                {subCategories.map((category) => (
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
              rows={4}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={productForm.price}
                onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                className="w-full"
              />
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={productForm.quantity}
                onChange={(event) => setProductForm({ ...productForm, quantity: event.target.value })}
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
                {editingProductId ? 'Save Item' : 'Post Item'}
              </button>
              {editingProductId && (
                <button type="button" onClick={resetProductForm} className="btn-secondary">Cancel</button>
              )}
            </div>
          </form>
        )}
      </section>

      <section className="card mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Items In Selected Game</h2>
        {products.length === 0 ? (
          <p className="text-gray-400">No items have been posted for this game yet.</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col gap-3 rounded-lg border border-dark-700 bg-dark-900 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <img src={product.imageUrl || '/images/redPanda.png'} alt={product.name} className="h-20 w-24 rounded object-cover" />
                  <div>
                    <div className="font-semibold text-white">{product.name}</div>
                    <div className="text-sm text-gray-400">{product.subCategoryName} - Stock {product.quantity}</div>
                    <div className="text-gaming-orange font-bold">${product.price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => handleEditProduct(product)} className="btn-secondary">Edit</button>
                  <button type="button" onClick={() => handleDeleteProduct(product.id)} className="btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
