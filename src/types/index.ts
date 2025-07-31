// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'principal' | 'benfek' | 'wholesaler';
  isAuthenticated: boolean;
}

// Medication Types
export interface Medication {
  id: string;
  name: string;
  brand: string;
  price: number;
  expiry: string;
  category: string;
  image: string;
  stock: number;
}

export interface MedicationForm {
  name: string;
  brand: string;
  price: string;
  expiry: string;
  category: string;
  image: string;
  stock: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  type: 'Credit' | 'Debit';
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

// Earnings Types
export interface Earnings {
  id: string;
  receiptNumber: string;
  date: string;
  totalPurchase: number;
  status: 'Completed' | 'Pending';
}

// Benfek Types
export interface Benfek {
  id: string;
  name: string;
  phone: string;
  allergies: string[];
  scares: string[];
  familyCondition: string;
  medications: string[];
  hasCurrentCondition: 'yes' | 'no';
}

export interface BenfekForm {
  name: string;
  phone: string;
  allergies: string;
  scares: string;
  familyCondition: string;
  medications: string;
  hasCurrentCondition: 'yes' | 'no';
}

// Purchase Types
export interface Purchase {
  id: string;
  reference: string;
  pack: string;
  detail: string;
  approved: boolean;
}

// Podcast Types
export interface Podcast {
  id: string;
  title: string;
  host: string;
  date: string;
  description: string;
}

export interface PodcastForm {
  title: string;
  host: string;
  date: string;
  description: string;
}

// Withdrawal Types
export interface Withdrawal {
  id: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  date: string;
  withdrawalsLeft: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string;
}

// Modal Types
export interface ModalState {
  open: boolean;
  medIdx: number | null;
  isAdd?: boolean;
} 