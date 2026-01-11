import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MenuItem,
  ApiResponse,
  OrderRequest,
  CustomerOrder,
} from '../models/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuUrl = 'http://localhost:8082/menu';
  private orderUrl = 'http://localhost:8082/customer';

  // Pexels API Key
  private PEXELS_API_KEY =
    'FdMFbn8GyN0ud5DoVrGCbgc79osckWiESupQuC7ipZmFfDS301HCBO2V';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // --- MENU OPERATIONS ---

  // Get all menu items
  getMenuItems(): Observable<ApiResponse<MenuItem[]>> {
    return this.http.get<ApiResponse<MenuItem[]>>(`${this.menuUrl}/view`);
  }

  // Helper to fetch image from Pexels
  fetchImageFromPexels(query: string): Observable<any> {
    return this.http.get(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
      {
        headers: { Authorization: this.PEXELS_API_KEY },
      }
    );
  }

  // --- ORDER OPERATIONS ---

  // Place a new order
  placeOrder(order: OrderRequest): Observable<ApiResponse<string>> {
    // const headers = this.authService.getAuthHeaders();
    return this.http.post<ApiResponse<string>>(this.orderUrl, order);
  }

  // Get orders by username (for My Orders page)
  getOrdersByUsername(
    username: string
  ): Observable<ApiResponse<CustomerOrder[]>> {
    // const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<CustomerOrder[]>>(
      `http://localhost:8082/byUsername/${username}`
    );
  }

  // Get ALL orders (for Admin page)
  getAllOrders(): Observable<ApiResponse<CustomerOrder[]>> {
    // const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<CustomerOrder[]>>(this.orderUrl);
  }

  // Delete an order
  deleteOrder(id: number): Observable<ApiResponse<string>> {
    // const headers = this.authService.getAuthHeaders();
    return this.http.delete<ApiResponse<string>>(`${this.orderUrl}/${id}`);
  }

  // --- ADMIN OPERATIONS ---

  // Add a new menu item
  addMenuItem(item: any): Observable<ApiResponse<MenuItem>> {
    // const headers = this.authService.getAuthHeaders();
    return this.http.post<ApiResponse<MenuItem>>(`${this.menuUrl}/add`, item);
  }

  // Update a menu item
  updateMenuItem(id: number, item: any): Observable<ApiResponse<MenuItem>> {
    // const headers = this.authService.getAuthHeaders();
    return this.http.put<ApiResponse<MenuItem>>(
      `${this.menuUrl}/update/${id}`,
      item
    );
  }

  // Delete a menu item
  deleteMenuItem(id: number): Observable<ApiResponse<string>> {
    // const headers = this.authService.getAuthHeaders();
    return this.http.delete<ApiResponse<string>>(
      `${this.menuUrl}/delete/${id}`
    );
  }
}
