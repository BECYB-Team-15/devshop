import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Definiujemy strukturę zamówienia na podstawie naszego pliku OAS
interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
}

export default function OrderDetails() {
  const { id } = useParams();
  
  // Zastępujemy 'any' konkretnym typem
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Brak tokenu autoryzacji.');
        return;
      }

      try {
        // Wysyłamy zapytanie po zamówienie. Backend sprawdzi czy token jest poprawny, 
        // ale "zapomni" sprawdzić czy zamówienie należy do właściciela tokenu.
        const res = await axios.get(`http://localhost:3000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
        setError(null);
      } catch {
        setError('Nie można pobrać zamówienia (lub nie istnieje).');
        setOrder(null);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border border-zinc-800 p-6 bg-zinc-950">
        <h1 className="text-3xl font-bold uppercase mb-2 tracking-tighter">
          Zamówienie #{id}
        </h1>
        <p className="text-zinc-500 mb-6 border-b border-zinc-800 pb-4">
          Zmień ID w pasku adresu (np. z /order/{id} na /order/1), aby przetestować IDOR.
        </p>

        {error && <div className="text-red-500 bg-red-950/30 p-4 border border-red-900">{error}</div>}

        {order && (
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-zinc-800 py-2">
              <span className="text-zinc-500">Status:</span>
              <span className="text-green-500">{order.status}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 py-2">
              <span className="text-zinc-500">ID Właściciela (Kluczowe dla IDOR):</span>
              <span className="text-zinc-100">{order.user_id}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 py-2">
              <span className="text-zinc-500">Kwota całkowita:</span>
              <span className="text-zinc-100 font-bold">{order.total?.toFixed(2)} PLN</span>
            </div>
            
            <div className="mt-8">
              <span className="text-zinc-500 block mb-2">Surowe dane (JSON z API):</span>
              <pre className="bg-black p-4 text-zinc-400 overflow-x-auto border border-zinc-800">
                {JSON.stringify(order, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}