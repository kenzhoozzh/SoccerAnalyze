import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../store';
import { UserRole } from '../types';
import { AlertCircle } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useApp();
  
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple Admin backdoor for demo
    if (email.includes('admin')) {
      login(email, UserRole.ADMIN);
      navigate('/admin');
    } else {
      login(email, UserRole.USER);
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-swiss-surface border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400 text-sm">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard.' 
              : 'Join the premier sports insight platform.'}
          </p>
        </div>

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
            className="w-full bg-swiss-accent hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => navigate('/auth?mode=register')} className="text-swiss-accent hover:underline">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => navigate('/auth?mode=login')} className="text-swiss-accent hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
           <div className="bg-blue-900/10 rounded p-3 text-xs text-blue-300 flex items-start space-x-2">
             <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
             <div>
                <span className="font-bold">Demo Hint:</span>
                <br/>
                User: <span className="font-mono text-white">user@demo.com</span>
                <br/>
                Admin: <span className="font-mono text-white">admin@demo.com</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;