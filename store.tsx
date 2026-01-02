import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, TipRequest, RequestStatus, Transaction } from './types';

// --- Mock Data & State Interface ---

interface AppState {
  currentUser: User | null;
  allUsers: User[]; // Admin needs to see all users to check credits
  requests: TipRequest[];
  transactions: Transaction[];
  // Auth Methods
  login: (user: User) => void; 
  logout: () => void;
  validateUser: (email: string, password: string) => User | null;
  registerUser: (email: string, password: string) => User | null; // Changed return type
  // Actions
  buyCredit: () => Promise<void>;
  handlePaymentSuccess: () => void;
  sendUserMessage: (message: string, isPaidRequest: boolean) => Promise<void>;
  sendSystemResponse: (message: string) => void; 
  // Admin Actions
  adminDeliverTip: (requestId: string, title: string, content: string) => void;
  adminReplyMessage: (userId: string, message: string) => void;
  adminRefundTip: (requestId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// --- Seed Data ---
// Real Users DB (starting with just Admin)
const INITIAL_USERS: User[] = [
  { id: 'admin-1', email: 'Kenan.akcay@yahoo.com', name: 'Admin', role: UserRole.ADMIN, credits: 999, password: 'naqhic-2jyzpy-wuntuQ' },
];

// Helper to load/save from localStorage
const loadFromStorage = <T,>(key: string, fallback: T): T => {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    return fallback;
};

// WICHTIG: Hier kommt der STRIPE PAYMENT LINK rein (nicht der pk_test Key).
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_3cI7sNcvxgT93zo1tLdEs00';

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  // Load initial state from local storage or use defaults
  const [allUsers, setAllUsers] = useState<User[]>(() => loadFromStorage('tipcredit_users', INITIAL_USERS));
  const [requests, setRequests] = useState<TipRequest[]>(() => loadFromStorage('tipcredit_requests', []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage('tipcredit_transactions', []));
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Persistence Effects: Save to localStorage whenever data changes
  useEffect(() => { localStorage.setItem('tipcredit_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('tipcredit_requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('tipcredit_transactions', JSON.stringify(transactions)); }, [transactions]);

  // Restore session
  useEffect(() => {
    const storedUser = localStorage.getItem('tipcredit_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Verify if user still exists in our memory "DB"
      const found = allUsers.find(u => u.id === parsed.id);
      if (found) {
          setCurrentUser(found);
      }
    }
  }, [allUsers]); // Re-run if allUsers loads

  // Update mock DB when current user changes (e.g. buys credits)
  useEffect(() => {
    if (currentUser) {
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
    }
  }, [currentUser]);

  const validateUser = (email: string, pass: string): User | null => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === pass) {
        return user;
    }
    return null;
  };

  const registerUser = (email: string, pass: string): User | null => {
      if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return null; // Email exists
      }
      const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: UserRole.USER,
          credits: 0,
          password: pass
      };
      setAllUsers(prev => [...prev, newUser]);
      
      // Send Welcome Message
      const welcomeMsg: TipRequest = {
        id: `welcome-${Date.now()}`,
        userId: newUser.id,
        userEmail: email,
        status: RequestStatus.CHAT,
        createdAt: new Date().toISOString(),
        userMessage: "Hallo! 👋 Danke für dein Interesse an TipCredit. Ich melde mich so schnell wie möglich bei dir. Wenn du Fragen hast oder direkt starten möchtest, schreib mir einfach hier.",
        isAdmin: true 
      };
      setRequests(prev => [...prev, welcomeMsg]);
      
      return newUser;
  };

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('tipcredit_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tipcredit_user');
  };

  const buyCredit = async () => {
    // Redirect to Stripe Payment Link
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  // Called when user returns with ?payment=success
  const handlePaymentSuccess = () => {
    if (!currentUser) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount: 500,
      credits: 1,
      date: new Date().toISOString(),
      type: 'PURCHASE'
    };

    const updatedUser = { ...currentUser, credits: currentUser.credits + 1 };
    
    // Update State (Persistence is handled by effects)
    setTransactions(prev => [newTx, ...prev]);
    setCurrentUser(updatedUser);
    localStorage.setItem('tipcredit_user', JSON.stringify(updatedUser)); // Update session immediately

    // Automatically add a System Message to the Chat
    const sysMsg: TipRequest = {
        id: `sys-pay-${Date.now()}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        status: RequestStatus.CHAT,
        createdAt: new Date().toISOString(),
        userMessage: "✅ Zahlung erfolgreich! 1 Credit wurde gutgeschrieben.",
        isAdmin: true 
    };
    setRequests(prev => [...prev, sysMsg]);
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
      validateUser,
      registerUser, 
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