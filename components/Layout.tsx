import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { LogOut, User as UserIcon, Shield, Menu, X, MessageCircle } from 'lucide-react';
import { UserRole } from '../types';

const Layout = ({ children }: React.PropsWithChildren) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-swiss-dark text-white font-sans selection:bg-swiss-accent selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-swiss-dark/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-swiss-accent to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                <span className="font-bold text-white text-lg">T</span>
              </div>
              <span className="font-bold text-xl tracking-tight">TipCredit</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {!currentUser && (
                <>
                  <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How it works</Link>
                  <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</Link>
                </>
              )}
              
              {currentUser ? (
                <div className="flex items-center space-x-6">
                  {currentUser.role === UserRole.ADMIN ? (
                     <Link to="/admin" className={`text-sm font-medium transition-colors ${location.pathname === '/admin' ? 'text-swiss-accent' : 'text-gray-300 hover:text-white'}`}>
                        Admin Panel
                     </Link>
                  ) : (
                    <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-swiss-accent' : 'text-gray-300 hover:text-white'}`}>
                        Dashboard
                    </Link>
                  )}
                  
                  <div className="flex items-center space-x-4 pl-6 border-l border-gray-800">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{currentUser.name}</p>
                      <p className="text-xs text-gray-400">
                        {currentUser.role === UserRole.ADMIN ? 'Administrator' : `${currentUser.credits} Credits`}
                      </p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/auth?mode=login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</Link>
                  <Link to="/auth?mode=register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-swiss-surface border-b border-gray-800 p-4 space-y-4 animate-in slide-in-from-top-2">
             {!currentUser ? (
                <>
                  <Link to="/auth?mode=login" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                  <Link to="/auth?mode=register" className="block text-swiss-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </>
             ) : (
                <>
                  <Link to="/dashboard" className="block text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block text-red-400">Logout</button>
                </>
             )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#050911] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <span className="font-bold text-white text-xs">T</span>
                  </div>
                  <span className="font-bold text-lg tracking-tight">TipCredit</span>
                </div>
                <p className="text-gray-500 text-sm max-w-xs mb-6">
                  TipCredit is a product by <strong>SystemBetLab</strong>. We provide data analysis tools and software solutions for sports performance and event evaluation.
                </p>
                <a href="https://t.me/SystemBetLab" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-[#2AABEE] hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Chat with Support</span>
                </a>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/legal" className="hover:text-swiss-accent">Imprint & Contact</Link></li>
                <li><Link to="/legal" className="hover:text-swiss-accent">Terms of Service</Link></li>
                <li><Link to="/legal" className="hover:text-swiss-accent">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Compliance</h4>
              <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2">
                 <Shield className="w-4 h-4" />
                 <span>18+ Only</span>
              </div>
              <p className="text-xs text-gray-600">
                All tips are for informational purposes only. Buying a credit does not guarantee a winning result. Play responsibly.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
            © {new Date().getFullYear()} SystemBetLab. All rights reserved. Zurich, Switzerland.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;