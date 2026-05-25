import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Review {
  id: number;
  user_email: string;
  content: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/api/products/${id}`).then(res => setProduct(res.data)).catch(() => {});
    axios.get(`http://localhost:3000/api/products/${id}/reviews`).then(res => setReviews(res.data)).catch(() => {});
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify([...currentCart, product.id]));
    navigate('/cart');
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Musisz być zalogowany!');

    try {
      await axios.post(
        `http://localhost:3000/api/products/${id}/reviews`,
        { content: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewReview('');
      const res = await axios.get(`http://localhost:3000/api/products/${id}/reviews`);
      setReviews(res.data);
    } catch {
      alert('Błąd podczas dodawania opinii.');
    }
  };

  if (!product) return <div className="p-6 border border-zinc-800">Ładowanie...</div>;

  return (
    <div className="space-y-8">
      <div className="border border-zinc-800 p-8 bg-zinc-950 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 aspect-square bg-black border border-zinc-800 flex items-center justify-center text-zinc-700 font-bold">
          [ ZDJĘCIE ]
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold uppercase tracking-tighter">{product.name}</h1>
          <p className="text-zinc-400 text-lg">{product.description}</p>
          <div className="text-3xl font-bold">{product.price.toFixed(2)} PLN</div>
          <button 
            onClick={addToCart}
            className="w-full bg-zinc-100 text-black p-4 font-bold uppercase hover:bg-zinc-300 transition-colors"
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>

      <div className="border border-zinc-800 p-6">
        <h2 className="text-2xl font-bold uppercase mb-6 border-b border-zinc-800 pb-4">Opinie (Uwaga: XSS)</h2>
        
        <form onSubmit={submitReview} className="mb-8 space-y-4">
          <textarea 
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
            placeholder="Wpisz tag <script>..."
            className="w-full bg-black border border-zinc-700 p-4 focus:outline-none focus:border-zinc-300 min-h-[100px]"
          />
          <button type="submit" className="bg-zinc-800 text-zinc-100 px-6 py-2 uppercase font-bold hover:bg-zinc-700 transition-colors">
            Wyślij
          </button>
        </form>

        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border border-zinc-800 p-4 bg-zinc-950">
              <div className="text-sm text-zinc-500 mb-2">{review.user_email} napisał(a):</div>
              <div className="text-zinc-300" dangerouslySetInnerHTML={{ __html: review.content }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}