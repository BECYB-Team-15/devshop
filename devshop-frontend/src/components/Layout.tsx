import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col font-mono">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter hover:text-zinc-400 transition-colors">
            [ DEV_SHOP ]
          </Link>
          
          <nav className="flex gap-6 items-center">
            <Link to="/catalog" className="hover:text-zinc-400">Katalog</Link>
            <Link to="/cart" className="hover:text-zinc-400">Koszyk</Link>
            
            {token ? (
              <div className="flex items-center gap-6">
                <Link to="/orders" className="hover:text-zinc-400">Zamówienia</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-zinc-100 text-black px-6 py-2 uppercase font-bold hover:bg-zinc-300 transition-colors"
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-zinc-100 text-black px-6 py-2 uppercase font-bold hover:bg-zinc-300 transition-colors"
              >
                Zaloguj
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 mt-8">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800 mt-auto py-6 text-center text-zinc-600 text-sm">
        <p>Vulnerable E-Commerce Project // {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}