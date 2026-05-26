import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 mt-8">
      
      {/* HERO SECTION */}
      <div className="border border-zinc-800 bg-zinc-950 p-12 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">
          DEV_SHOP
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-10">
          Zestaw przetrwania dla inżynierów. Od odzieży z ciężkiej bawełny o luźnych krojach typu boxy fit, idealnych na długie sesje przed ekranem, po sprzęt, który zniesie najcięższe wdrożenia.
        </p>
        <Link 
          to="/catalog" 
          className="bg-zinc-100 text-black px-10 py-4 text-lg font-bold uppercase hover:bg-zinc-300 transition-colors"
        >
          Przejdź do katalogu
        </Link>
      </div>

      {/* INFORMACJA O PROJEKCIE (Dla celów edukacyjnych) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-red-900/50 bg-red-950/20 p-6">
          <h3 className="text-red-500 font-bold uppercase mb-2">01. Brak sanityzacji</h3>
          <p className="text-zinc-500 text-sm">
            Nasz system wyszukiwania ufa użytkownikom. Za bardzo. Spróbuj wstrzyknąć własny kod SQL.
          </p>
        </div>
        <div className="border border-red-900/50 bg-red-950/20 p-6">
          <h3 className="text-red-500 font-bold uppercase mb-2">02. Niezabezpieczone API</h3>
          <p className="text-zinc-500 text-sm">
            Endpointy nie weryfikują właściciela zasobu. Odkryj podatność IDOR w module zamówień.
          </p>
        </div>
        <div className="border border-red-900/50 bg-red-950/20 p-6">
          <h3 className="text-red-500 font-bold uppercase mb-2">03. Zaufany HTML</h3>
          <p className="text-zinc-500 text-sm">
            Moduł opinii pozwala na renderowanie czystego kodu. Idealne miejsce na przetestowanie ataków typu XSS.
          </p>
        </div>
      </div>

    </div>
  );
}