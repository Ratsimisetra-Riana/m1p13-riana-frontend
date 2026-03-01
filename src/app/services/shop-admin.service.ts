import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface ShopProfile {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ShopAdminService {
  private shopKey = 'cc_shop_admin';
  private shopSubject: BehaviorSubject<ShopProfile | null>;
  shop$: Observable<ShopProfile | null>;

  constructor(private auth: AuthService) {
    // Initialize in constructor after auth is injected
    const initialValue = this.load();
    this.shopSubject = new BehaviorSubject<ShopProfile | null>(initialValue);
    this.shop$ = this.shopSubject.asObservable();
  }

  private load(): ShopProfile | null {
    // First try to get shopId from JWT token
    try {
      const user = this.auth.getUser();
      if (user?.shopId) {
        return { id: user.shopId, name: `Boutique ${user.shopId}`, logo: '', description: '' };
      }
    } catch (e) {
      // AuthService might not be ready yet
    }
    
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(this.shopKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Sync shop profile with token info
   * Call this after login to ensure shopId is set from token
   */
  syncWithToken(): void {
    try {
      const user = this.auth.getUser();
      if (user?.shopId) {
        const profile: ShopProfile = { 
          id: user.shopId, 
          name: `Boutique ${user.shopId}`, 
          logo: '', 
          description: '' 
        };
        localStorage.setItem(this.shopKey, JSON.stringify(profile));
        this.shopSubject.next(profile);
      }
    } catch (e) {
      console.error('Error syncing with token:', e);
    }
  }

  login(shopId: string, password: string): Observable<ShopProfile> {
    // Minimal stub: accept any credentials and create profile if missing
    const p: ShopProfile = { id: shopId, name: `Boutique ${shopId}`, logo: '', description: '' };
    localStorage.setItem(this.shopKey, JSON.stringify(p));
    this.shopSubject.next(p);
    return of(p);
  }

  logout() {
    localStorage.removeItem(this.shopKey);
    this.shopSubject.next(null);
  }

  getShop(): ShopProfile | null {
    return this.shopSubject.value;
  }

  updateProfile(profile: Partial<ShopProfile>) {
    const cur = this.getShop() || { id: 'unknown', name: 'Boutique' } as ShopProfile;
    const updated = { ...cur, ...profile };
    localStorage.setItem(this.shopKey, JSON.stringify(updated));
    this.shopSubject.next(updated);
    return of(updated);
  }
}
