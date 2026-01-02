import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../store';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, validateUser, registerUser } = useApp();
  
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login'|'register'>(initialMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchMode = (newMode: 'login' | 'register') => {
      setMode(newMode);
      setError(null);
  };

  const handleReset = () => {
      if(confirm('Möchtest du wirklich alle lokalen Daten (Benutzer, Chats) löschen und die App zurücksetzen?')) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanEmail = email.trim();
    const cleanPassword = password; // Don't trim password

    // Realistic processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (mode === 'login') {
        const user = validateUser(cleanEmail, cleanPassword);
        if (user) {
            login(user);
            navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
        } else {
            setError('Ungültige E-Mail oder Passwort.');
            setIsLoading(false);
        }
    } else {
        // Register Flow
        if (!cleanEmail.includes('@') || cleanPassword.length < 6) {
             setError('Bitte gib eine gültige E-Mail und ein Passwort mit mind. 6 Zeichen ein.');
             setIsLoading(false);
             return;
        }

        const newUser = registerUser(cleanEmail, cleanPassword);
        
        if (newUser) {
            login(newUser);
            navigate('/dashboard');
        } else {
            setError('Diese E-Mail ist bereits registriert. Bitte logge dich ein.');
            setIsLoading(false);
        }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-swiss-surface border border-gray-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
          </h2>
          <p className="text-gray-400 text-sm">
            {mode === 'login' 
              ? 'Melde dich an, um auf dein Dashboard zuzugreifen.' 
              : 'Werde Teil der Premium Sport-Community.'}
          </p>
        </div>

        {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">E-Mail Adresse</label>
            <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0B1120] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-swiss-accent transition-colors"
            placeholder="name@example.com"
            />
        </div>

        <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Passwort</label>
            <input 
            type="password" 
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0B1120] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-swiss-accent transition-colors"
            placeholder="••••••••"
            />
        </div>

        {mode === 'register' && (
            <div className="flex items-start space-x-2">
                <input type="checkbox" required id="18plus" className="mt-1" />
                <label htmlFor="18plus" className="text-xs text-gray-500">
                    Ich bestätige, dass ich über 18 Jahre alt bin und akzeptiere das finanzielle Risiko von Sportwetten.
                </label>
            </div>
        )}

        <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-swiss-accent hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === 'login' ? 'Einloggen' : 'Konto erstellen')}
        </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-800 pt-4">
          {mode === 'login' ? (
            <p>
              Noch kein Konto?{' '}
              <button onClick={() => switchMode('register')} className="text-swiss-accent hover:underline">
                Registrieren
              </button>
            </p>
          ) : (
            <p>
              Bereits registriert?{' '}
              <button onClick={() => switchMode('login')} className="text-swiss-accent hover:underline">
                Einloggen
              </button>
            </p>
          )}
          
          <div className="mt-8 pt-4 border-t border-gray-800/50">
            <button onClick={handleReset} className="text-xs text-red-900/50 hover:text-red-500 flex items-center justify-center w-full gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" />
                <span>App zurücksetzen (Lokale Daten löschen)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;