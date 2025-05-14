import React from 'react';
import { motion } from 'framer-motion';
import { formatDistance } from '../utils/dateUtils';
import { ChevronRight } from 'lucide-react';
import { Product } from '../context/ProductContext';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No products found matching the current filters
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <ProductItem key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductItemProps {
  product: Product;
  index: number;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-40 h-40 md:h-auto relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.model} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col md:flex-row md:items-center">
          <div className="flex-grow">
            <div className="flex items-center mb-2">
              <span 
                className={`status-badge ${product.status}`}
              >
                {product.status}
              </span>
              <span className="text-slate-400 text-sm ml-2">
                {formatDistance(new Date(product.timestamp))}
              </span>
            </div>
            <h4 className="text-lg font-semibold">{product.model}</h4>
            <div className="text-sm text-slate-400 mt-1">ID: {product.id}</div>
            
            {product.defects.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium text-slate-300">Defects:</span>
                <ul className="mt-1 text-sm text-red-400">
                  {product.defects.map((defect, i) => (
                    <li key={i} className="text-red-400">{defect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-3 md:mt-0">
            <div className="flex items-center text-sm font-medium text-slate-400 mb-2">
              <span>Confidence: </span>
              <span className="text-blue-400 ml-1">{(product.confidence * 100).toFixed(1)}%</span>
            </div>
            <button className="flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm w-full">
              <span>Details</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductList;