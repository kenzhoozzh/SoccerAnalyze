import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, TipRequest, RequestStatus, Transaction } from './types';

// --- Mock Data & State Interface ---

interface AppState {
  currentUser: User | null;
  allUsers: User[]; // Admin needs to see all users to check credits
  requests: TipRequest[];
  transactions: Transaction[];
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  buyCredit: () => Promise<void>;
  handlePaymentSuccess: () => void; // New function to verify payment
  sendUserMessage: (message: string, isPaidRequest: boolean) => Promise<void>;
  sendSystemResponse: (message: string) => void; 
  // Admin Actions
  adminDeliverTip: (requestId: string, title: string, content: string) => void;
  adminReplyMessage: (userId: string, message: string) => void;
  adminRefundTip: (requestId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// --- Seed Data ---

// Mock Users DB for Admin visibility
const INITIAL_USERS: User[] = [
  { id: 'user-1', email: 'client@example.com', name: 'client', role: UserRole.USER, credits: 0 },
  { id: 'user-2', email: 'vip@example.com', name: 'vip', role: UserRole.USER, credits: 5 },
];

const INITIAL_REQUESTS: TipRequest[] = [];

// YOUR STRIPE LINK
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_3cI7sNcvxgT93zo1tLdEs00';

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [requests, setRequests] = useState<TipRequest[]>(INITIAL_REQUESTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Simulate persistent login for demo
  useEffect(() => {
    const storedUser = localStorage.getItem('tipcredit_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser(parsed);
      // Ensure this user exists in our "DB"
      setAllUsers(prev => {
        if (!prev.find(u => u.id === parsed.id)) return [...prev, parsed];
        return prev;
      });
    }
  }, []);

  // Update mock DB when current user changes (e.g. buys credits)
  useEffect(() => {
    if (currentUser) {
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
    }
  }, [currentUser]);

  const login = (email: string, role: UserRole = UserRole.USER) => {
    // Check if user exists in mock DB
    let user = allUsers.find(u => u.email === email);
    let userId = user ? user.id : (role === UserRole.ADMIN ? 'admin-1' : `user-${Date.now()}`);
    
    if (!user) {
        user = {
            id: userId,
            email,
            name: email.split('@')[0],
            role,
            credits: role === UserRole.ADMIN ? 999 : 0,
        };
        setAllUsers(prev => [...prev, user!]);
    }

    // --- AUTOMATIC WELCOME MESSAGE LOGIC ---
    const hasHistory = requests.some(r => r.userId === userId);
    
    if (!hasHistory && role === UserRole.USER) {
        const welcomeMsg: TipRequest = {
            id: `welcome-${Date.now()}`,
            userId: userId,
            userEmail: email,
            status: RequestStatus.CHAT,
            createdAt: new Date().toISOString(),
            userMessage: "Hallo! 👋 Danke für dein Interesse an TipCredit. Ich melde mich so schnell wie möglich bei dir. Wenn du Fragen hast oder direkt starten möchtest, schreib mir einfach hier.",
            isAdmin: true 
        };
        setRequests(prev => [...prev, welcomeMsg]);
    }

    setCurrentUser(user);
    localStorage.setItem('tipcredit_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tipcredit_user');
  };

  const buyCredit = async () => {
    // Redirect to Stripe
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  // Called when user returns with ?payment=success
  const handlePaymentSuccess = () => {
    if (!currentUser) return;

    // Prevent duplicate transaction spam in this session (simple check)
    // In production, backend validates the stripe session_id
    
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount: 500,
      credits: 1,
      date: new Date().toISOString(),
      type: 'PURCHASE'
    };

    const updatedUser = { ...currentUser, credits: currentUser.credits + 1 };
    setCurrentUser(updatedUser);
    localStorage.setItem('tipcredit_user', JSON.stringify(updatedUser));
    setTransactions(prev => [newTx, ...prev]);
  };

  const sendUserMessage = async (message: string, isPaidRequest: boolean) => {
    if (!currentUser) return;
    
    if (isPaidRequest) {
        if (currentUser.credits < 1) throw new Error("Insufficient credits");
        // Deduct Credit
        const updatedUser = { ...currentUser, credits: currentUser.credits - 1 };
        setCurrentUser(updatedUser);
        localStorage.setItem('tipcredit_user', JSON.stringify(updatedUser));
    }

    // Mock API Delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const newReq: TipRequest = {
      id: `req-${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      status: isPaidRequest ? RequestStatus.PENDING : RequestStatus.CHAT,
      createdAt: new Date().toISOString(),
      preferences: 'Football',
      userMessage: message,
      isAdmin: false
    };

    setRequests(prev => [...prev, newReq]);
  };

  const sendSystemResponse = (message: string) => {
      if (!currentUser) return;
      const newReq: TipRequest = {
          id: `sys-${Date.now()}`,
          userId: currentUser.id,
          userEmail: currentUser.email,
          status: RequestStatus.CHAT,
          createdAt: new Date().toISOString(),
          userMessage: message,
          isAdmin: true
      };
      setRequests(prev => [...prev, newReq]);
  };

  const adminReplyMessage = (userId: string, message: string) => {
      const targetUser = allUsers.find(u => u.id === userId);
      const newReq: TipRequest = {
          id: `msg-${Date.now()}`,
          userId: userId,
          userEmail: targetUser?.email || 'unknown',
          status: RequestStatus.CHAT,
          createdAt: new Date().toISOString(),
          userMessage: message,
          isAdmin: true
      };
      setRequests(prev => [...prev, newReq]);
  };

  const adminDeliverTip = (requestId: string, title: string, content: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: RequestStatus.DELIVERED,
          deliveredAt: new Date().toISOString(),
          title,
          content
        };
      }
      return req;
    }));
  };

  const adminRefundTip = (requestId: string) => {
     setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: RequestStatus.REFUNDED };
      }
      return req;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      allUsers,
      requests, 
      transactions, 
      login, 
      logout, 
      buyCredit, 
      handlePaymentSuccess,
      sendUserMessage,
      sendSystemResponse,
      adminReplyMessage,
      adminDeliverTip,
      adminRefundTip
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};