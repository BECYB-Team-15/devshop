import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await axios.get(`/api/products?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      // Bezpieczne sprawdzenie typu błędu (zadowala surowego TypeScripta)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Wystąpił błąd serwera. Być może to wina składni SQL?');
      } else {
        setError('Wystąpił nieznany błąd.');
      }
      setProducts([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="space-y-8">
      <div className="border border-zinc-800 p-6 bg-zinc-950">
        <h1 className="text-3xl font-bold uppercase mb-4 tracking-tighter">Katalog Sprzętu</h1>
        
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Szukaj (np. ' OR 1=1 --)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-black border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300 transition-colors"
          />
          <button type="submit" className="bg-zinc-100 text-black px-8 font-bold uppercase hover:bg-zinc-300 transition-colors">
            Szukaj
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 border border-red-900 bg-red-950 text-red-500 font-mono text-sm break-all">
            [BŁĄD] {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => (
          <Link 
            to={`/product/${product.id}`} 
            key={product.id} 
            className="border border-zinc-800 p-6 hover:border-zinc-500 transition-colors group bg-zinc-950 flex flex-col"
          >
            <h2 className="text-xl font-bold uppercase group-hover:text-zinc-300">{product.name}</h2>
            <p className="text-zinc-500 mt-2 flex-1">{product.description}</p>
            <div className="mt-6 text-2xl font-bold border-t border-zinc-800 pt-4">
              {Number(product.price).toFixed(2)} PLN
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}