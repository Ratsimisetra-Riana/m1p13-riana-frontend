import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  productId: string;
  variantSku: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  _id?: string;
  userId?: string;
  shopId: string;
  channel: 'in_store' | 'online' | 'phone' | 'other';
  status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  items: OrderItem[];
  totalAmount: number;
  customerInfo: CustomerInfo;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient) {}

  // Create a new order
  createOrder(order: Order): Observable<Order> {
    console.log('Creating order:', order);
    try {
      return this.http.post<Order>(this.apiUrl, order);
    } catch {
      // fallback: mock order creation
      const created: Order = { ...order, _id: 'ord_' + Date.now() };
      return of(created);
    }
  }

  // Get order by ID
  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  // Get user orders
  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get shop orders
  getShopOrders(shopId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}?shopId=${shopId}`);
  }

  // Update order status
  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}`, { status });
  }
}
