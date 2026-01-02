import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, RequestStatus } from '../types';
import { Check, X, Send, User, Search, MoreVertical, CreditCard, MessageCircle } from 'lucide-react';
import TelegramCard from '../components/TelegramCard';

const Admin = () => {
  const { currentUser, allUsers, requests, adminDeliverTip, adminReplyMessage, adminRefundTip } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Editor State
  const [inputMode, setInputMode] = useState<'CHAT' | 'TIP'>('CHAT'); // Reply as chat or send tip
  const [chatInput, setChatInput] = useState('');
  
  const [tipTitle, setTipTitle] = useState('Premium Football Tip');
  const [tipContent, setTipContent] = useState('**Match:** \n**Pick:** \n**Odds:** \n\nAnalysis here...');

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  // Group requests by User
  const userIdsWithHistory = Array.from(new Set(requests.map(r => r.userId)));
  // Also include users who exist but maybe haven't messaged yet (from allUsers)
  // For this view, we focus on users who have engaged or have credits
  const relevantUsers = allUsers.filter(u => u.role !== UserRole.ADMIN);

  // Sort: Users with pending requests first, then by credit balance
  const sortedUsers = relevantUsers.sort((a, b) => {
    const aReqs = requests.filter(r => r.userId === a.id);
    const bReqs = requests.filter(r => r.userId === b.id);
    const aPending = aReqs.some(r => r.status === RequestStatus.PENDING);
    const bPending = bReqs.some(r => r.status === RequestStatus.PENDING);
    
    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;
    return b.credits - a.credits;
  });

  const selectedUser = allUsers.find(u => u.id === selectedUserId);
  const selectedUserRequests = requests
    .filter(r => r.userId === selectedUserId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Find pending request ID if any
  const pendingRequest = selectedUserRequests.find(r => r.status === RequestStatus.PENDING);

  const handleSend = () => {
    if (!selectedUserId) return;

    if (inputMode === 'CHAT') {
        if (!chatInput.trim()) return;
        adminReplyMessage(selectedUserId, chatInput);
        setChatInput('');
    } else {
        // Delivering a Tip
        // We need a target Request ID. Ideally we attach it to the 'pendingRequest'.
        // If no pending request, we can't technically "Deliver" a tip in this data model 
        // without creating a request first, but for now let's assume we reply to the last pending.
        if (pendingRequest) {
            if (confirm('Deliver this tip and mark request as completed?')) {
                adminDeliverTip(pendingRequest.id, tipTitle, tipContent);
                setInputMode('CHAT'); // Reset to chat after sending
            }
        } else {
            alert("No pending paid request to fulfill.");
        }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-full bg-swiss-surface border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        
        {/* LEFT SIDEBAR: User List */}
        <div className="col-span-1 border-r border-gray-800 flex flex-col bg-[#151F32]">
            <div className="p-4 border-b border-gray-800 bg-[#0F1623]">
                <h2 className="font-bold text-white">Clients</h2>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {sortedUsers.map(user => {
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
                                    {user.credits} Credits
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
                            const isMe = req.isAdmin; // In Admin view, "Me" is Admin
                            const isPaid = req.status === RequestStatus.PENDING || req.status === RequestStatus.DELIVERED;

                            return (
                                <div key={req.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-[80%]">
                                        {/* System/Paid Request Card style */}
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
                                            /* Normal Chat Bubble */
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
                                />
                                <textarea 
                                    className="w-full bg-transparent text-white px-3 py-2 text-sm font-mono focus:outline-none h-24 resize-none"
                                    value={tipContent}
                                    onChange={(e) => setTipContent(e.target.value)}
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
    </div>
  );
};

export default Admin;