export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  category: string;
  location: string;
  seller: User;
  createdAt: string;
}