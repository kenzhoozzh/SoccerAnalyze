export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum RequestStatus {
  PENDING = 'PENDING',   // Paid request waiting for tip
  DELIVERED = 'DELIVERED', // Tip sent
  REFUNDED = 'REFUNDED',
  CHAT = 'CHAT'         // Free text message
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Added for mock auth validation
  role: UserRole;
  credits: number;
}

export interface TipRequest {
  id: string;
  userId: string;
  userEmail: string;
  status: RequestStatus;
  createdAt: string; // ISO Date string
  deliveredAt?: string;
  preferences?: string;
  userMessage?: string; // The text content
  content?: string; // The markdown content of the tip (if DELIVERED)
  title?: string;
  isAdmin?: boolean; // True if sent by admin
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number; // CHF
  credits: number;
  date: string;
  type: 'PURCHASE' | 'REFUND';
}