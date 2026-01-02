import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, TrendingUp, Smartphone, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-swiss-dark to-swiss-dark"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Brand Badge for Compliance */}
          <div className="inline-flex items-center space-x-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-3 py-1 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-200 text-xs font-medium uppercase tracking-wider">Powered by SystemBetLab</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Unlock High-Value <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Sports Insights</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing. Start investing. Purchase credits to unlock manually curated, high-confidence sports analysis delivered directly to your dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/auth?mode=register')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-swiss-dark font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl shadow-white/5 flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-swiss-surface border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition-all"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-swiss-surface border border-gray-800 hover:border-gray-700 transition-all">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Credit-Based System</h3>
              <p className="text-gray-400 leading-relaxed">
                No monthly subscriptions. You pay for what you get. 1 Credit = 1 Premium Insight. Total control over your spend.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-swiss-surface border border-gray-800 hover:border-gray-700 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Delivery</h3>
              <p className="text-gray-400 leading-relaxed">
                Insights are delivered to your secure dashboard in a Telegram-style card format, easy to read and act upon.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-swiss-surface border border-gray-800 hover:border-gray-700 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Manual Curation</h3>
              <p className="text-gray-400 leading-relaxed">
                We are not an algorithm. Every tip is analyzed, vetted, and written by expert handicappers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-1 p-[1px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 opacity-20"></div>
                <div className="relative bg-[#0F1629] rounded-[22px] p-8 md:p-16 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Simple Pricing</h2>
                    <p className="text-gray-400 mb-8">One tier. Maximum quality.</p>

                    <div className="flex items-center justify-center mb-8">
                        <span className="text-5xl font-bold text-white">500</span>
                        <span className="text-xl text-gray-400 ml-2">CHF / Credit</span>
                    </div>

                    <ul className="text-left max-w-xs mx-auto space-y-4 mb-10 text-gray-300">
                        <li className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>1 Premium Sports Insight</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Full Analysis & Reasoning</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>24h Support Priority</span>
                        </li>
                    </ul>

                    <button 
                        onClick={() => navigate('/auth?mode=register')}
                        className="w-full bg-swiss-accent hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
                    >
                        Buy Credits Now
                    </button>
                    
                    <p className="mt-6 text-xs text-gray-500">
                        By purchasing, you acknowledge that sports tips involve risk. Past performance does not guarantee future results.
                    </p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;