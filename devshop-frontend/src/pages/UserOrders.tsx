import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface Order {
  id: number;
  total: string | number;
  status: string;
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError('Błąd podczas pobierania zamówień.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <div className="p-6 border border-zinc-800 text-zinc-500 max-w-4xl mx-auto mt-8">Wczytywanie historii zamówień...</div>;
  if (error) return <div className="p-6 border border-red-900 bg-red-950/20 text-red-500 max-w-4xl mx-auto mt-8">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold uppercase tracking-tighter border-b border-zinc-800 pb-4">
        Moje Zamówienia
      </h1>

      {orders.length === 0 ? (
        <div className="border border-zinc-800 p-8 bg-zinc-950 text-center text-zinc-500">
          Nie złożyłeś jeszcze żadnych zamówień.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col md:flex-row items-center justify-between border border-zinc-800 bg-black p-6 hover:border-zinc-500 transition-colors">
              <div className="flex flex-col mb-4 md:mb-0">
                <span className="text-zinc-500 text-sm font-bold uppercase">Zamówienie #{order.id}</span>
                <span className="text-xl font-mono text-white font-bold mt-1">
                  {Number(order.total).toFixed(2)} PLN
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 font-mono text-sm text-zinc-300 uppercase tracking-widest">
                  {order.status}
                </div>
                {/* Ten przycisk prowadzi do widoku podatnego na IDOR */}
                <Link 
                  to={`/order/${order.id}`}
                  className="bg-zinc-100 text-black px-6 py-2 uppercase font-bold hover:bg-zinc-300 transition-colors text-center"
                >
                  Szczegóły &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}