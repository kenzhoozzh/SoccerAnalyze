import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../store';
import { Plus, Loader2, Send, MessageCircle, Paperclip, Target, Command } from 'lucide-react';
import TelegramCard from '../components/TelegramCard';
import { RequestStatus } from '../types';

const Dashboard = () => {
  const { currentUser, buyCredit, handlePaymentSuccess, sendUserMessage, sendSystemResponse, requests } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Ref to prevent double processing in Strict Mode
  const paymentProcessed = useRef(false);

  const userRequests = requests.filter(r => r.userId === currentUser?.id);
  // Sort oldest to newest for Chat flow
  const sortedRequests = userRequests.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sortedRequests.length]);

  // Check for Payment Success from Stripe Redirect
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
        if (!paymentProcessed.current) {
            handlePaymentSuccess();
            paymentProcessed.current = true;
        }
        // Remove query param to prevent refresh-abuse
        setSearchParams({});
    }
  }, [searchParams, handlePaymentSuccess, setSearchParams]);

  const handleBuy = async () => {
    if(!confirm("Du wirst nun zu Stripe weitergeleitet, um 1 Credit (500 CHF) sicher zu kaufen.")) return;
    setIsProcessing(true);
    await buyCredit();
    // No setIsProcessing(false) because we navigate away
  };

  const processTipRequest = async (customMessage?: string) => {
    if (!currentUser) return;
    if (currentUser.credits < 1) {
        // Instead of alert, send chat message
        sendSystemResponse("⚠️ Du hast nicht genügend Credits für einen Premium Tipp. Bitte lade dein Konto auf (/buy).");
        return;
    }
    
    if(!confirm("Redeem 1 Credit for a Premium Tip Request?")) return;

    setIsProcessing(true);
    try {
        // We send a system-like message indicating a request
        // If customMessage (from command) is present use it, otherwise use input or default
        const msg = customMessage || messageInput || "I would like a premium football tip.";
        await sendUserMessage(msg, true); // True = Paid
        setMessageInput('');
    } catch (e) {
        alert("Error sending request");
    }
    setIsProcessing(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentUser || !messageInput.trim()) return;

    // --- Slash Commands Logic ---
    if (messageInput.startsWith('/')) {
        const parts = messageInput.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        if (command === '/buy') {
            setMessageInput('');
            await handleBuy();
            return;
        }

        if (command === '/tip' || command === '/request') {
            await processTipRequest(args);
            setMessageInput('');
            return;
        }

        if (command === '/help') {
            // Send help message into the chat stream instead of alert
            sendSystemResponse(
                "🤖 **Verfügbare Befehle:**\n\n" +
                "• **/buy** - Credits kaufen (500 CHF)\n" +
                "• **/tip [info]** - Premium Tipp anfordern (Kostet 1 Credit)\n" +
                "• **/help** - Diese Liste anzeigen"
            );
            setMessageInput('');
            return;
        }
        
        // If unknown command, we let it fall through to normal chat or we could return.
        // For now, let's treat unknown commands as chat messages but maybe user intended a command.
    }
    // -----------------------------

    setIsProcessing(true);
    try {
        await sendUserMessage(messageInput, false); // False = Free Chat
        setMessageInput('');
    } catch (e) {
        console.error(e);
    }
    setIsProcessing(false);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col">
      
      {/* Top Bar: User Info & Balance */}
      <div className="bg-[#151F32] border border-gray-800 rounded-t-2xl p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
             <div className="relative">
                 <div className="w-10 h-10 rounded-full bg-swiss-accent flex items-center justify-center text-white font-bold">
                     TC
                 </div>
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#151F32] rounded-full"></span>
             </div>
             <div>
                 <h2 className="font-bold text-white text-sm">TipCredit Official</h2>
                 <p className="text-xs text-emerald-400">Online | Average reply: 2h</p>
             </div>
        </div>

        <div className="flex items-center space-x-3">
             <div className="bg-[#0B1120] border border-gray-700 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                 <span className="text-gray-400 text-xs uppercase font-bold">Credits:</span>
                 <span className={`font-bold ${currentUser.credits > 0 ? 'text-white' : 'text-red-400'}`}>{currentUser.credits}</span>
             </div>
             <button 
                onClick={handleBuy}
                disabled={isProcessing}
                className="bg-swiss-accent hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                title="Buy Credit (/buy)"
             >
                <Plus className="w-4 h-4" />
             </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow bg-[#0B1120] border-x border-gray-800 overflow-y-auto p-4 sm:p-6 space-y-4 relative custom-scrollbar">
         
         {sortedRequests.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-30">
                 <MessageCircle className="w-16 h-16 text-gray-500 mb-4" />
                 <p className="text-gray-400 text-center text-sm">
                    This is your private line to our experts.<br/>
                    Chat is free. Tips cost 1 Credit.<br/><br/>
                    <span className="font-mono text-xs">Try commands: /buy, /tip, /help</span>
                 </p>
             </div>
         )}

         {sortedRequests.map(req => {
            const isMe = !req.isAdmin;
            const isSystem = req.status === RequestStatus.PENDING || req.status === RequestStatus.DELIVERED || req.status === RequestStatus.REFUNDED;
            
            return (
                <div key={req.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] space-y-1`}>
                        
                        {/* Special UI for Paid Requests/Tips */}
                        {isSystem ? (
                            <div className={isMe ? "flex justify-end" : ""}>
                                {req.status === RequestStatus.DELIVERED ? (
                                    <TelegramCard request={req} />
                                ) : (
                                    <div className="bg-[#1C2436] border border-swiss-accent/30 p-3 rounded-2xl rounded-tr-none text-white text-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-1">
                                            <div className="bg-swiss-accent text-[10px] font-bold px-2 py-0.5 rounded-bl-lg text-white">PAID REQUEST</div>
                                        </div>
                                        <p className="pr-16 font-medium text-blue-200 mb-1">Target: {req.preferences}</p>
                                        <p className="text-gray-300">{req.userMessage}</p>
                                        <div className="mt-2 flex items-center space-x-2 text-xs text-swiss-accent animate-pulse">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            <span>Analyzing market data...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Normal Chat Bubble (Free Chat & System Responses)
                            <div className={`p-3 rounded-2xl text-sm whitespace-pre-line ${
                                isMe 
                                ? 'bg-[#2AABEE] text-white rounded-tr-none' 
                                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                            }`}>
                                <p>{req.userMessage}</p>
                                <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {new Date(req.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
         })}
         
         <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#151F32] border border-gray-800 rounded-b-2xl p-4">
         <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
             {/* Command Hint Icon */}
             <div className="hidden sm:block" title="Available commands: /buy, /tip, /help">
                <Command className="w-5 h-5 text-gray-600" />
             </div>
             
             <div className="flex-grow relative">
                 <input 
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message or /buy, /tip..."
                    className="w-full bg-[#0B1120] border border-gray-700 text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-swiss-accent transition-colors font-sans"
                    disabled={isProcessing}
                 />
             </div>

             {/* Action Buttons */}
             <div className="flex items-center space-x-2">
                 {/* Paid Request Button */}
                 <button 
                    type="button"
                    onClick={() => processTipRequest()}
                    disabled={isProcessing || currentUser.credits < 1}
                    className={`p-3 rounded-full transition-transform hover:scale-105 shadow-lg flex items-center justify-center group relative ${
                        currentUser.credits > 0 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Request Premium Tip (Costs 1 Credit) or type /tip"
                 >
                    <Target className="w-5 h-5" />
                    {currentUser.credits > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#151F32]">
                            -1
                        </span>
                    )}
                 </button>

                 {/* Send Chat Button */}
                 <button 
                    type="submit"
                    disabled={isProcessing || !messageInput.trim()}
                    className="bg-swiss-accent hover:bg-blue-600 text-white p-3 rounded-full transition-transform hover:scale-105 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:scale-100"
                 >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 pl-0.5" />}
                 </button>
             </div>
         </form>
         
         <div className="text-center mt-2 flex justify-between px-2">
            <span className="text-[10px] text-gray-600">Free Chat • Premium Tips cost 1 Credit</span>
            <span className="text-[10px] text-gray-600 hidden sm:block">Commands: /buy, /tip, /help</span>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;