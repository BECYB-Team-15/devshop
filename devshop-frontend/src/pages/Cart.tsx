import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  });

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Zaloguj się, aby złożyć zamówienie.');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/orders',
        { product_ids: cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('cart');
      setCartItems([]);
      navigate(`/order/${response.data.id}`);
    } catch {
      alert('Błąd składania zamówienia.');
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border border-zinc-800 p-6 bg-zinc-950">
        <h1 className="text-3xl font-bold uppercase mb-6 tracking-tighter">Twój Koszyk</h1>
        
        {cartItems.length === 0 ? (
          <p className="text-zinc-500">Koszyk jest pusty.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">Przedmioty w koszyku (ID): {cartItems.join(', ')}</p>
            <div className="flex gap-4">
              <button 
                onClick={placeOrder}
                className="flex-1 bg-zinc-100 text-black p-3 font-bold uppercase hover:bg-zinc-300 transition-colors"
              >
                Złóż zamówienie
              </button>
              <button 
                onClick={clearCart}
                className="bg-black border border-zinc-700 text-zinc-300 p-3 font-bold uppercase hover:bg-zinc-800 transition-colors"
              >
                Wyczyść
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}