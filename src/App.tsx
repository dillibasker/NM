import { useState } from 'react';
import { Loader } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScannerView from './components/ScannerView';
import ChatBot from './components/ChatBot';
import { ProductProvider } from './context/ProductContext';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'scanner'>('dashboard');

  return (
    <ProductProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
        <Header activeView={activeView} setActiveView={setActiveView} />
        
        <main className="flex-grow p-4 md:p-6 container mx-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <Loader className="animate-spin text-blue-500 w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Processing...</p>
              </div>
            </div>
          )}
          
          {activeView === 'dashboard' ? (
            <Dashboard setLoading={setLoading} />
          ) : (
            <ScannerView setLoading={setLoading} />
          )}
        </main>

        <footer className="py-4 text-center text-slate-400 text-sm">
          <p>© 2025 Quality Control System | All Rights Reserved</p>
        </footer>

        <ChatBot />
      </div>
    </ProductProvider>
  );
}

export default App;