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
  login(user: User): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/login`, user)
      .pipe(
        tap((response) => {
          if (response && response.data) {
            // Store credentials just like the React app did
            // Note: Storing plain passwords is risky, but we are replicating your exact current logic.
            localStorage.setItem('username', user.username);
            if (user.password) localStorage.setItem('password', user.password);
            localStorage.setItem('role', response.data); // data contains the role string
          }
        })
      );
  }

  // 3. LOGOUT
  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
    // Optional: Redirect to login is usually handled by the component
  }

  // 4. HELPER METHODS
  // Used to check if user is logged in for Navbar logic
  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
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
}
