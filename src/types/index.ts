export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isVeg: boolean;
  isRecommended?: boolean;
  calories?: string;
  preparationTime?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'ready' | 'completed';

export interface OrderItemSummary {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isVeg: boolean;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName?: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItemSummary[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending';
}

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  section: string;
  status: 'available' | 'occupied' | 'reserved';
  activeOrderId?: string;
  currentGuests?: number;
  lastUpdated?: string;
}

export interface CustomerFeedback {
  id: string;
  orderId: string;
  tableNumber: string;
  customerName: string;
  rating: number;
  foodQualityRating: number;
  serviceRating: number;
  ambianceRating?: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
}
