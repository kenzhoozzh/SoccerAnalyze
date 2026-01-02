import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../store';
import { Loader2, AlertCircle } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Realistic processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (mode === 'login') {
        const user = validateUser(email, password);
        if (user) {
            login(user);
            navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
        } else {
            setError('Invalid email or password. Please try again.');
            setIsLoading(false);
        }
    } else {
        // Register Flow - Direct Access
        if (!email.includes('@') || password.length < 6) {
             setError('Please enter a valid email and a password with at least 6 characters.');
             setIsLoading(false);
             return;
        }

        // Fix: registerUser now returns the user object directly.
        // We use this object to login immediately without waiting for React State updates.
        const newUser = registerUser(email, password);
        
        if (newUser) {
            login(newUser);
            navigate('/dashboard');
        } else {
            setError('This email is already registered. Please log in.');
            setIsLoading(false);
        }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-swiss-surface border border-gray-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400 text-sm">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard.' 
              : 'Join the premier sports insight platform.'}
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
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Email Address</label>
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
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Password</label>
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
                    I confirm I am over 18 years of age and acknowledge that sports tipping involves financial risk.
                </label>
            </div>
        )}

        <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-swiss-accent hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === 'login' ? 'Log In' : 'Create Account')}
        </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-800 pt-4">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => switchMode('register')} className="text-swiss-accent hover:underline">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="text-swiss-accent hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;