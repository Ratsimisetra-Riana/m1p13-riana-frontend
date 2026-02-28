import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-history.component.html'
})
export class PurchaseHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user || !user.id) {
      this.router.navigate(['/login']);
      return;
    }

    // Fetch user's orders from backend
    this.orderService.getUserOrders(user.id).subscribe({
      next: (orders: Order[]) => {
        this.orders = orders || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes:', err);
        this.errorMessage = 'Impossible de charger vos commandes';
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status?: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'En attente',
      'paid': 'Payée',
      'processing': 'En cours de traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'canceled': 'Annulée'
    };
    return statusMap[status || 'pending'] || status || 'Inconnue';
  }

  getStatusColor(status?: string): string {
    const colorMap: Record<string, string> = {
      'pending': 'yellow',
      'paid': 'blue',
      'processing': 'blue',
      'shipped': 'blue',
      'delivered': 'green',
      'canceled': 'red'
    };
    return colorMap[status || 'pending'] || 'gray';
  }
}
