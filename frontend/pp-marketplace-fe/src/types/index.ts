export interface Game {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  gameId: number;
  gameName: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  gameId: number;
  gameName: string;
  subCategoryId: number;
  subCategoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  createdAt: string;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  totalPrice: number;
  status: string;
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  token: string;
}
