import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Typy danych dopasowane do API
interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string; // Obsługujemy stringa z Postgresa
}

// Interfejs do wyświetlania zgrupowanych produktów
interface CartDisplayItem extends Product {
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  
  // Stan przechowuje płaską tablicę ID (np. [1, 1, 2]) - idealne dla naszego payloadu POST
  const [cartItems, setCartItems] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Pobranie katalogu produktów do zbudowania widoku
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Błąd pobierania produktów", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Synchronizacja z localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Dodaje +1 sztukę danego produktu
  const addToCart = (id: number) => {
    setCartItems(prev => [...prev, id]);
  };

  // Odejmuje -1 sztukę. Jeśli znikną wszystkie ID danego typu, produkt znika z listy
  const removeFromCart = (id: number) => {
    setCartItems(prev => {
      const index = prev.indexOf(id);
      if (index > -1) {
        const newCart = [...prev];
        newCart.splice(index, 1);
        return newCart;
      }
      return prev;
    });
  };

  // Czyści całkowicie koszyk
  const clearCart = () => {
    setCartItems([]);
  };

  // Składanie zamówienia - używamy naszej "podatnej" ścieżki
  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Zaloguj się, aby złożyć zamówienie.');

    try {
      const response = await axios.post(
        '/api/orders',
        { product_ids: cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems([]);
      navigate(`/order/${response.data.id}`);
    } catch {
      alert('Błąd składania zamówienia.');
    }
  };

  // Grupowanie płaskiej tablicy [1, 1, 2] do obiektów z ilością
  const displayItems: CartDisplayItem[] = [];
  const idCounts = cartItems.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  Object.entries(idCounts).forEach(([idStr, quantity]) => {
    const id = parseInt(idStr);
    const product = products.find(p => p.id === id);
    if (product) {
      displayItems.push({ ...product, quantity });
    }
  });

  // Obliczenia podsumowania
  const totalQuantity = displayItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = displayItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  if (loading) return <div className="p-6 border border-zinc-800 text-zinc-500 max-w-4xl mx-auto mt-8">Ładowanie koszyka...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold uppercase tracking-tighter">Twój Koszyk</h1>
      
      {displayItems.length === 0 ? (
        <div className="border border-zinc-800 p-8 bg-zinc-950 text-center text-zinc-500">
          Twój koszyk jest obecnie pusty. Wróć do katalogu i dodaj coś do koszyka.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTA PRODUKTÓW */}
          <div className="lg:col-span-2 space-y-4">
            {displayItems.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 border border-zinc-800 p-4 bg-zinc-950">
                {/* ZDJĘCIE ZASTĘPCZE */}
                <div className="w-24 h-24 bg-black border border-zinc-800 flex items-center justify-center text-zinc-700 font-bold text-xs shrink-0">
                  IMG_0{item.id}
                </div>
                
                {/* DANE PRODUKTU */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold uppercase">{item.name}</h2>
                  <div className="text-zinc-500 font-mono mt-1">{Number(item.price).toFixed(2)} PLN / szt.</div>
                </div>
                
                {/* KONTROLKI ILOŚCI */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="w-10 h-10 bg-black border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-xl transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-mono text-xl w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item.id)}
                    className="w-10 h-10 bg-black border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-xl transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* SUMA CZĄSTKOWA */}
                <div className="text-xl font-bold font-mono w-28 text-right text-zinc-300">
                  {(Number(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* PODSUMOWANIE (STICKY PANEL) */}
          <div className="border border-zinc-800 p-6 bg-zinc-950 h-fit sticky top-24">
            <h2 className="text-2xl font-bold uppercase border-b border-zinc-800 pb-4 mb-4">Podsumowanie</h2>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-zinc-400">
                <span>Ilość produktów:</span>
                <span className="font-mono">{totalQuantity} szt.</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Dostawa:</span>
                <span className="font-mono text-green-500">DARMOWA</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-zinc-800">
                <span>SUMA:</span>
                <span className="font-mono text-white">{totalPrice.toFixed(2)} PLN</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={placeOrder}
                className="w-full bg-zinc-100 text-black py-4 font-bold uppercase hover:bg-zinc-300 transition-colors"
              >
                Złóż zamówienie
              </button>
              <button 
                onClick={clearCart}
                className="w-full border border-zinc-800 text-zinc-500 py-3 font-bold uppercase hover:bg-zinc-900 transition-colors"
              >
                Wyczyść koszyk
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}