// src/app/models/models.ts

export interface ApiResponse<T> {
  message: string;
  data: T;
  status?: string; // Sometimes your backend sends status in the body on error
}

export interface User {
  user_id?: number;
  username: string;
  password?: string; // Optional because we don't always get it back
  roles: 'ROLE_ADMIN' | 'ROLE_CUSTOMER';
}

export interface MenuItem {
  id: number;
  foodName: string;
  foodPrice: number;
  imageUrl?: string; // Frontend only property (fetched from Pexels)
}

// Matching CustomerOrderDTO from backend
export interface OrderRequest {
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;
  // Map<Long, Integer> in Java becomes { [key: number]: number } in TS
  orderItems: { [key: number]: number }; 
}

// Matching CustomerOrder Entity for viewing history
export interface CustomerOrder {
  id: number;
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;
  totalPrice: number;
  orderItems: MenuItem[]; // Backend returns a List<MenuItem> here for display
}