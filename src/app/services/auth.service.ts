import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  private loadUser(): User | null {
    const raw = localStorage.getItem('cc_user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // Minimal stub: accept any credentials and persist a simple user
    const user: User = { id: 'user_' + Date.now(), name: email.split('@')[0], email };
    localStorage.setItem('cc_user', JSON.stringify(user));
    this.userSubject.next(user);
    return of(user);
  }

  register(name: string, email: string, password: string): Observable<User> {
    const user: User = { id: 'user_' + Date.now(), name, email };
    localStorage.setItem('cc_user', JSON.stringify(user));
    this.userSubject.next(user);
    return of(user);
  }

  logout() {
    localStorage.removeItem('cc_user');
    this.userSubject.next(null);
  }
}
