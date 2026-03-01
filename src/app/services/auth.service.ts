import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  shopId?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private userSubject = new BehaviorSubject<User | null>(this.loadUserFromToken());
  user$ = this.userSubject.asObservable();

  // Token key constant
  private readonly TOKEN_KEY = 'cc_token';

  constructor(private http: HttpClient) {}

  /**
   * Load user from JWT token (only in memory, not localStorage)
   */
  private loadUserFromToken(): User | null {
    const token = this.getToken();
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value && !!this.getToken();
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Get the JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Decode JWT token to get user info
   * The token payload contains: userId, name, email, shopId, role
   */
  decodeToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        shopId: payload.shopId || null
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  /**
   * Save token to localStorage and decode user info to memory only
   */
  private saveAuth(token: string): void {
    // Store only the JWT token in localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    
    // Decode token to get user info and store in memory only (not localStorage)
    const user = this.decodeToken(token);
    if (user) {
      this.userSubject.next(user);
    }
  }

  /**
   * Login with email and password
   * Backend returns only { token }, so we decode it to get user info
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        this.saveAuth(response.token);
      })
    );
  }

  /**
   * Register a new user (client)
   * Backend returns only { token }, so we decode it to get user info
   */
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}`, { name, email, password }).pipe(
      tap((response) => {
        // Registration returns token with encoded user info
        this.saveAuth(response.token);
      })
    );
  }

  /**
   * Logout - remove token from localStorage and clear user from memory
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userSubject.next(null);
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  /**
   * Check if user is a shop admin
   */
  isShopAdmin(): boolean {
    return this.hasRole('shop_admin') || this.hasRole('shop');
  }

  /**
   * Check if user is a centre admin
   */
  isCentreAdmin(): boolean {
    return this.hasRole('centre_admin') || this.hasRole('admin');
  }
}
