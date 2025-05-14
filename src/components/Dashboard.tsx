import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import DashboardStats from './DashboardStats';
import ProductList from './ProductList';
import { Search } from 'lucide-react';

interface DashboardProps {
  setLoading: (loading: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setLoading }) => {
  const { products } = useProducts();
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products
    .filter(product => {
      if (filter === 'all') return true;
      return product.status === filter;
    })
    .filter(product => {
      if (!searchTerm) return true;
      return (
        product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.includes(searchTerm)
      );
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-6">Quality Control Dashboard</h2>
        <DashboardStats />
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold">Recent Inspections</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <FilterButton 
                label="All" 
                active={filter === 'all'} 
                onClick={() => setFilter('all')} 
              />
              <FilterButton 
                label="Approved" 
                active={filter === 'approved'} 
                onClick={() => setFilter('approved')} 
                color="bg-green-500/10 text-green-500 border-green-500/30"
                activeColor="bg-green-500 text-white"
              />
              <FilterButton 
                label="Rejected" 
                active={filter === 'rejected'} 
                onClick={() => setFilter('rejected')} 
                color="bg-red-500/10 text-red-500 border-red-500/30"
                activeColor="bg-red-500 text-white"
              />
            </div>
          </div>
        </div>
        
        <ProductList products={filteredProducts} />
      </div>
    </motion.div>
  );
};

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
  activeColor?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  active, 
  onClick, 
  color = "bg-slate-700/50 text-slate-300 border-slate-600", 
  activeColor = "bg-blue-500 text-white"
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg border transition-all ${
        active ? activeColor : color
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Dashboard;