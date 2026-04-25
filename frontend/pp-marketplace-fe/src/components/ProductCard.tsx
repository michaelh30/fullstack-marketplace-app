import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="product-card group">
        <div className="w-full h-48 bg-dark-800 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gaming-purple text-4xl">
              🎮
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-gaming-cyan mb-2">{product.subCategoryName}</div>
          <h3 className="font-semibold text-white truncate mb-2">{product.name}</h3>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-lg font-bold text-gaming-orange">${product.price.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Stock: {product.quantity}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1">
                <span className="text-gaming-cyan">⭐</span>
                <span className="text-sm text-white">{product.rating.toFixed(1)}</span>
              </div>
              <div className="text-xs text-gray-400">({product.reviewCount})</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
