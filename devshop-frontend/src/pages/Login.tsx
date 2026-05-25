import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/'; 
    } catch {
      alert('Błąd logowania. Spróbuj admin/admin (jeśli backend na to pozwala).');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 border border-zinc-800 p-8 bg-zinc-950">
      <h1 className="text-2xl font-bold uppercase mb-6 text-center tracking-tighter">Autoryzacja</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full bg-black border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300"
            required
          />
        </div>
        <button type="submit" className="w-full bg-zinc-100 text-black p-3 uppercase font-bold mt-4 hover:bg-zinc-300 transition-colors">
          Zaloguj
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-500">
        Nie masz konta? <a href="/register" className="text-zinc-300 hover:underline">Zarejestruj się</a>
      </div>
    </div>
  );
}