import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, RequestStatus } from '../types';
import { Check, X, Send, User, Search, MoreVertical, CreditCard, MessageCircle, LayoutDashboard, MessageSquare, DollarSign, Users, Activity } from 'lucide-react';
import TelegramCard from '../components/TelegramCard';

const Admin = () => {
  const { currentUser, allUsers, requests, transactions, adminDeliverTip, adminReplyMessage } = useApp();
  const [view, setView] = useState<'DASHBOARD' | 'CHAT'>('DASHBOARD');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Editor State
  const [inputMode, setInputMode] = useState<'CHAT' | 'TIP'>('CHAT'); 
  const [chatInput, setChatInput] = useState('');
  
  const [tipTitle, setTipTitle] = useState('Premium Football Tip');
  const [tipContent, setTipContent] = useState('**Match:** \n**Pick:** \n**Odds:** \n\nAnalysis here...');

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  // --- Data Preparation ---

  // Filter out Admin from lists
  const clients = allUsers.filter(u => u.role !== UserRole.ADMIN);
  
  // Stats
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = requests.filter(r => r.status === RequestStatus.PENDING).length;

  // Recent Transactions
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Chat Logic
  const sortedUsersForChat = clients.sort((a, b) => {
    const aReqs = requests.filter(r => r.userId === a.id);
    const bReqs = requests.filter(r => r.userId === b.id);
    const aPending = aReqs.some(r => r.status === RequestStatus.PENDING);
    const bPending = bReqs.some(r => r.status === RequestStatus.PENDING);
    const aLast = aReqs.length > 0 ? new Date(aReqs[aReqs.length-1].createdAt).getTime() : 0;
    const bLast = bReqs.length > 0 ? new Date(bReqs[bReqs.length-1].createdAt).getTime() : 0;
    
    // Priority: Pending Requests -> Recent Activity
    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;
    return bLast - aLast;
  });

  const selectedUser = allUsers.find(u => u.id === selectedUserId);
  const selectedUserRequests = requests
    .filter(r => r.userId === selectedUserId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const pendingRequest = selectedUserRequests.find(r => r.status === RequestStatus.PENDING);

  const handleSend = () => {
    if (!selectedUserId) return;

    if (inputMode === 'CHAT') {
        if (!chatInput.trim()) return;
        adminReplyMessage(selectedUserId, chatInput);
        setChatInput('');
    } else {
        if (pendingRequest) {
            if (confirm('Deliver this tip and mark request as completed?')) {
                adminDeliverTip(pendingRequest.id, tipTitle, tipContent);
                setInputMode('CHAT'); 
            }
        } else {
            alert("No pending paid request to fulfill.");
        }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      {/* Top Navigation */}
      <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-1">
         <div className="flex space-x-2">
            <button 
                onClick={() => setView('DASHBOARD')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${view === 'DASHBOARD' ? 'bg-swiss-surface text-swiss-accent border-b-2 border-swiss-accent' : 'text-gray-400 hover:text-white'}`}
            >
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-bold text-sm">Dashboard</span>
            </button>
            <button 
                onClick={() => setView('CHAT')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${view === 'CHAT' ? 'bg-swiss-surface text-swiss-accent border-b-2 border-swiss-accent' : 'text-gray-400 hover:text-white'}`}
            >
                <MessageSquare className="w-4 h-4" />
                <span className="font-bold text-sm">Messenger</span>
                {totalPending > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{totalPending}</span>
                )}
            </button>
         </div>
      </div>

      {view === 'DASHBOARD' ? (
        <div className="flex-grow overflow-y-auto space-y-8 pb-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-swiss-surface border border-gray-800 p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{totalRevenue} CHF</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
                <div className="bg-swiss-surface border border-gray-800 p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Total Clients</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{clients.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <div className="bg-swiss-surface border border-gray-800 p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Pending Tips</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{totalPending}</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-swiss-surface border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white">Recent Payments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#0B1120] text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Credits</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {sortedTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No transactions found.</td>
                                </tr>
                            )}
                            {sortedTransactions.map(tx => {
                                const user = allUsers.find(u => u.id === tx.userId);
                                return (
                                    <tr key={tx.id} className="hover:bg-gray-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                            {user?.email || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-emerald-400 font-bold">
                                            {tx.amount} CHF
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            +{tx.credits}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User List */}
            <div className="bg-swiss-surface border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white">Registered Clients</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#0B1120] text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Current Credits</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No clients yet.</td>
                                </tr>
                            )}
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-white">
                                        {client.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                        {client.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-swiss-accent font-bold">
                                        {client.credits}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => { setSelectedUserId(client.id); setView('CHAT'); }}
                                            className="text-swiss-accent hover:underline flex items-center space-x-1"
                                        >
                                            <MessageCircle className="w-3 h-3" />
                                            <span>Open Chat</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      ) : (
        // --- CHAT VIEW (Original Layout) ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-grow bg-swiss-surface border border-gray-800 rounded-xl overflow-hidden shadow-2xl h-0 min-h-0">
            {/* LEFT SIDEBAR: User List */}
            <div className="col-span-1 border-r border-gray-800 flex flex-col bg-[#151F32]">
                <div className="p-4 border-b border-gray-800 bg-[#0F1623]">
                    <h2 className="font-bold text-white">Inbox</h2>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {sortedUsersForChat.map(user => {
                        const userReqs = requests.filter(r => r.userId === user.id);
                        const hasPending = userReqs.some(r => r.status === RequestStatus.PENDING);
                        const lastMsg = userReqs.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                        return (
                            <div 
                                key={user.id} 
                                onClick={() => setSelectedUserId(user.id)}
                                className={`p-4 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/50 transition-colors ${selectedUserId === user.id ? 'bg-[#1C2841] border-l-4 border-swiss-accent' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-white text-sm truncate w-32">{user.email}</span>
                                    {hasPending && (
                                        <span className="w-2 h-2 rounded-full bg-swiss-accent animate-pulse"></span>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-end mt-2">
                                    <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                        {lastMsg ? lastMsg.userMessage : 'No messages'}
                                    </div>
                                    <div className={`text-xs px-2 py-0.5 rounded ${user.credits > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-500'}`}>
                                        {user.credits} CR
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT PANEL: Chat Room */}
            <div className="col-span-1 md:col-span-2 flex flex-col bg-[#0B1120] relative">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="h-16 border-b border-gray-800 flex justify-between items-center px-6 bg-[#151F32]">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{selectedUser.email}</h3>
                                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                                    <CreditCard className="w-3 h-3 text-emerald-500" />
                                    <span className={selectedUser.credits > 0 ? "text-emerald-400 font-bold" : ""}>
                                        Balance: {selectedUser.credits}
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#0B1120]">
                            {selectedUserRequests.length === 0 && (
                                <p className="text-center text-gray-600 text-sm mt-10">No history with this user.</p>
                            )}
                            
                            {selectedUserRequests.map(req => {
                                const isMe = req.isAdmin; 
                                const isPaid = req.status === RequestStatus.PENDING || req.status === RequestStatus.DELIVERED;

                                return (
                                    <div key={req.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className="max-w-[80%]">
                                            {isPaid && !isMe ? (
                                                <div className="bg-[#1C2436] border border-swiss-accent/50 p-4 rounded-2xl rounded-tl-none relative">
                                                    <div className="absolute -top-3 -right-2">
                                                        <span className="bg-swiss-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">PAID REQ</span>
                                                    </div>
                                                    <p className="text-sm text-white font-medium mb-1">Target: {req.preferences}</p>
                                                    <p className="text-sm text-gray-300 italic">"{req.userMessage}"</p>
                                                </div>
                                            ) : req.status === RequestStatus.DELIVERED ? (
                                                <TelegramCard request={req} />
                                            ) : (
                                                <div className={`p-3 rounded-2xl text-sm ${
                                                    isMe 
                                                    ? 'bg-[#2AABEE] text-white rounded-tr-none' 
                                                    : 'bg-gray-800 text-gray-200 rounded-tl-none'
                                                }`}>
                                                    <p>{req.userMessage}</p>
                                                    <span className="text-[10px] opacity-70 block text-right mt-1">
                                                        {new Date(req.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#151F32] border-t border-gray-800">
                            {/* Toggle Mode */}
                            <div className="flex space-x-4 mb-3 border-b border-gray-700 pb-2">
                                <button 
                                    onClick={() => setInputMode('CHAT')}
                                    className={`text-xs font-bold uppercase tracking-wider pb-1 ${inputMode === 'CHAT' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
                                >
                                    Free Chat
                                </button>
                                <button 
                                    onClick={() => setInputMode('TIP')}
                                    disabled={!pendingRequest}
                                    className={`text-xs font-bold uppercase tracking-wider pb-1 ${inputMode === 'TIP' ? 'text-swiss-accent border-b-2 border-swiss-accent' : 'text-gray-600'}`}
                                >
                                    Send Tip (Fulfill Request)
                                </button>
                            </div>

                            {inputMode === 'CHAT' ? (
                                <div className="flex items-center space-x-2">
                                    <input 
                                        className="flex-grow bg-[#0B1120] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-swiss-accent"
                                        placeholder="Reply to user..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button onClick={handleSend} className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-[#0B1120] border border-gray-700 rounded-xl p-2">
                                    <input 
                                        className="w-full bg-transparent text-white px-3 py-2 text-sm font-bold border-b border-gray-800 mb-2 focus:outline-none"
                                        value={tipTitle}
                                        onChange={(e) => setTipTitle(e.target.value)}
                                        placeholder="Tip Title"
                                    />
                                    <textarea 
                                        className="w-full bg-transparent text-white px-3 py-2 text-sm font-mono focus:outline-none h-24 resize-none"
                                        value={tipContent}
                                        onChange={(e) => setTipContent(e.target.value)}
                                        placeholder="Tip content in markdown..."
                                    />
                                    <div className="flex justify-end pt-2">
                                        <button onClick={handleSend} className="bg-swiss-accent text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2">
                                            <span>Send Tip & Close Request</span>
                                            <Send className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <User className="w-12 h-12 mb-2 opacity-50" />
                        <p>Select a client to view conversation</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;