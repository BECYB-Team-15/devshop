import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Celowy brak sprawdzania siły hasła na frontendzie (zakładamy, że backend też tego nie robi)
      await axios.post('http://localhost:3000/api/auth/register', { email, password });
      alert('Konto utworzone! Możesz się teraz zalogować.');
      navigate('/login');
    } catch {
      alert('Błąd rejestracji. Być może taki email już istnieje?');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 border border-zinc-800 p-8 bg-zinc-950">
      <h1 className="text-2xl font-bold uppercase mb-6 text-center tracking-tighter">Rejestracja</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-zinc-500 text-sm mb-1 uppercase">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-black border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300"
            required
          />
        </div>
        <div>
          <label className="block text-zinc-500 text-sm mb-1 uppercase">Hasło</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nawet '123' przejdzie..."
            className="w-full bg-black border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300"
            required
          />
        </div>
        <button type="submit" className="w-full bg-zinc-100 text-black p-3 uppercase font-bold mt-4 hover:bg-zinc-300 transition-colors">
          Załóż konto
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-zinc-500">
        Masz już konto? <Link to="/login" className="text-zinc-300 hover:underline">Zaloguj się</Link>
      </div>
    </div>
  );
}