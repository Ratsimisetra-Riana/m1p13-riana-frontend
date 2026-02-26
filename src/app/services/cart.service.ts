import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  productName: string;
  variantSku?: string;
  price: number;
  quantity: number;
  shopId?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'cc_cart_v1';
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.load());
  items$ = this.itemsSubject.asObservable();

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.cartKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(items: CartItem[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  add(item: CartItem) {
    const items = this.load();
    const existing = items.find(i => i.productId === item.productId && i.variantSku === item.variantSku);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }
    this.save(items);
  }

  updateQuantity(productId: string, variantSku: string | undefined, qty: number) {
    const items = this.load();
    const found = items.find(i => i.productId === productId && i.variantSku === variantSku);
    if (found) {
      found.quantity = qty;
      if (found.quantity <= 0) {
        this.remove(productId, variantSku);
        return;
      }
    }
    this.save(items);
  }

  remove(productId: string, variantSku: string | undefined) {
    const items = this.load().filter(i => !(i.productId === productId && i.variantSku === variantSku));
    this.save(items);
  }

  clear() {
    this.save([]);
  }
}
