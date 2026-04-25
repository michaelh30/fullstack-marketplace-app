import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product, Review } from '../types';
import { productAPI, reviewAPI, cartAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await productAPI.getById(Number(id));
        setProduct(productResponse.data);

        const reviewsResponse = await reviewAPI.getByProduct(Number(id));
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user || !product) return;

    try {
      const response = await cartAPI.addItem(user.id, product.id, quantity);
      addItem(response.data);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 gap-12">
        <div className="bg-dark-800 rounded-lg p-8 h-96 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-h-full" />
          ) : (
            <div className="text-6xl">🎮</div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-gray-400 mb-6">{product.description}</p>

          <div className="bg-dark-900 p-6 rounded-lg mb-6">
            <div className="text-3xl font-bold text-gaming-orange mb-2">${product.price.toFixed(2)}</div>
            <div className="text-sm text-gray-400">⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)</div>
            <div className="text-sm text-gray-400">Stock: {product.quantity}</div>
          </div>

          <div className="flex space-x-4 mb-6">
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20"
            />
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="section-title">Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="font-semibold text-white">{review.userName}</div>
                <div className="text-gaming-red">{'⭐'.repeat(review.rating)}</div>
                <p className="text-gray-300 mt-2">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
