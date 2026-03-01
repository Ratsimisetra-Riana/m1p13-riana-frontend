import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../services/order.service';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html'
})
export class ShopOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';
  selectedOrder: Order | null = null;
  availableStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled'];

  constructor(
    private orderService: OrderService,
    private shopAdminService: ShopAdminService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const shop = this.shopAdminService.getShop();
    if (!shop) {
      this.error = 'Aucune boutique connectée';
      return;
    }

    this.loading = true;
    this.error = '';

    this.orderService.getShopOrders(shop.id).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des commandes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
  }

  updateStatus(order: Order, newStatus: string) {
    if (!order._id) return;

    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o._id === order._id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.selectedOrder = null;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        this.error = 'Erreur lors de la mise à jour du statut';
      }
    });
  }

  getStatusClass(status?: string): string {
    const classes: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800'
    };
    return classes[status || ''] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      paid: 'Payée',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      canceled: 'Annulée'
    };
    return labels[status || ''] || status || 'Inconnu';
  }

  getChannelLabel(channel?: string): string {
    const labels: Record<string, string> = {
      in_store: 'En magasin',
      online: 'En ligne',
      phone: 'Téléphone',
      other: 'Autre'
    };
    return labels[channel || ''] || channel || 'Inconnu';
  }

  closeModal() {
    this.selectedOrder = null;
  }
}
