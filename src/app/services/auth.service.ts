import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, ApiResponse } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base URL matching your Spring Boot Controller
  private baseUrl = 'http://localhost:8082/user';

  constructor(private http: HttpClient) {}

  // 1. REGISTER
  // Matches React: axios.post('http://localhost:8082/user/adduser', { ... })
  register(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/adduser`, user);
  }

  // 2. LOGIN
  // Matches React: axios.post('http://localhost:8082/user/login', { ... })
  login(user: User): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/login`, user).pipe(
      tap((response) => {
        if (response && response.data) {
          // Store Token instead of password!
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.role);
        }
      })
    );
  }

  // 3. LOGOUT
  logout(): void {
    localStorage.clear(); // Clears token and user data
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 4. HELPER METHODS
  // Used to check if user is logged in for Navbar logic
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  // 5. AUTH HEADER GENERATOR
  // This helps other services (like MenuService) attach the Basic Auth header
  getAuthHeaders(): HttpHeaders {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
      // Creates the "Basic <base64>" header
      return new HttpHeaders({
        Authorization: 'Basic ' + btoa(username + ':' + password),
      });
    }
    return new HttpHeaders();
  }

  // Create a new Admin user
  createAdmin(user: User): Observable<ApiResponse<User>> {
    const headers = this.getAuthHeaders();
    // Reuses the same endpoint but sends Auth headers + ROLE_ADMIN
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/adduser`, user, {
      headers,
    });
  }
}
