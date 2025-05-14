import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
  id: string;
  timestamp: string;
  status: 'approved' | 'rejected' | 'pending';
  image: string;
  model: string;
  certificationPresent: boolean;
  defects: string[];
  confidence: number;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  clearProducts: () => void;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Sample data with mouse-specific images
const initialProducts: Product[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    status: 'approved',
    image: 'https://images.pexels.com/photos/399160/pexels-photo-399160.jpeg',
    model: 'Gaming Mouse X1',
    certificationPresent: true,
    defects: [],
    confidence: 0.98,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    status: 'rejected',
    image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
    model: 'Gaming Mouse X1',
    certificationPresent: true,
    defects: ['Scratched surface', 'Button damage'],
    confidence: 0.89,
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    status: 'approved',
    image: 'https://images.pexels.com/photos/5412270/pexels-photo-5412270.jpeg',
    model: 'Wireless Mouse W3',
    certificationPresent: true,
    defects: [],
    confidence: 0.96,
  },
];

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [product, ...prevProducts]);
  };

  const clearProducts = () => {
    setProducts([]);
  };

  const approvedCount = products.filter(p => p.status === 'approved').length;
  const rejectedCount = products.filter(p => p.status === 'rejected').length;
  const pendingCount = products.filter(p => p.status === 'pending').length;

  return (
    <ProductContext.Provider value={{ 
      products, 
      addProduct, 
      clearProducts,
      approvedCount,
      rejectedCount,
      pendingCount
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};