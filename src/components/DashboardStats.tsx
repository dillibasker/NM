import React from 'react';
import { Check, X, AlertCircle, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';

const DashboardStats: React.FC = () => {
  const { approvedCount, rejectedCount, pendingCount, products } = useProducts();
  const totalScanned = products.length;
  
  // Calculate approval rate
  const approvalRate = totalScanned > 0 
    ? Math.round((approvedCount / totalScanned) * 100) 
    : 0;

  const statsItems = [
    {
      title: 'Approved',
      value: approvedCount,
      icon: <Check className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-700',
      delay: 0.1
    },
    {
      title: 'Rejected',
      value: rejectedCount,
      icon: <X className="w-5 h-5" />,
      color: 'from-red-500 to-rose-700',
      delay: 0.2
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-700',
      delay: 0.3
    },
    {
      title: 'Approval Rate',
      value: `${approvalRate}%`,
      icon: <Gauge className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-700',
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: item.delay }}
          className="bg-gradient-to-br border border-slate-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mr-3`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-slate-400 text-sm font-medium">{item.title}</h3>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;