import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface ShopProfile {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ShopAdminService {
  private shopKey = 'cc_shop_admin';
  private shopSubject = new BehaviorSubject<ShopProfile | null>(this.load());
  shop$ = this.shopSubject.asObservable();

  private load(): ShopProfile | null {
    const raw = localStorage.getItem(this.shopKey);
    return raw ? JSON.parse(raw) : null;
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
