import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const isEven = index % 2 === 0;
  const bgColor = isEven ? 'bg-yellow-400' : 'bg-orange-400';
  
  return (
    <Link 
      to={`/product/${product.id}`}
      className={`group block ${bgColor} rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
      aria-label={`View details for ${product.name}`}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        {product.featured && (
          <div className="absolute top-4 left-4 bg-purple-700 text-white px-4 py-1 rounded-full text-sm font-bold">
            מומלץ
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-purple-900">{product.name}</h3>
      </div>
    </Link>
  );
}

export default ProductCard;