import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  items: any[] = [];
  customers: any = { name: '', email: '', phone: '' };
  isLoading = false;
  orderCreated = false;
  createdOrderId = '';

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = this.cart.getItems();
    if (this.items.length === 0) {
      this.router.navigate(['/products']);
      return;
    }
    
    // Pre-fill user info if logged in
    const user = this.auth.getUser();
    if (user) {
      this.customers.name = user.name || '';
      this.customers.email = user.email || '';
      this.customers.phone = user.phone || '';
    }
  }

  get totalAmount(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  placeOrder() {
    if (!this.customers.name || !this.customers.email || !this.customers.phone) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    if (this.items.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    // Get the shop ID from the first item (assuming all items are from same shop for now)
    const shopId = this.items[0]?.shopId;
    if (!shopId) {
      alert('Erreur: boutique non trouvée');
      return;
    }

    // Build order items from cart
    const orderItems = this.items.map(item => ({
      productId: item.productId,
      variantSku: item.variantSku || 'default',
      variantLabel: item.variantSku || 'Variante par défaut',
      unitPrice: item.price,
      quantity: item.quantity
    }));

    const order: Order = {
      shopId,
      channel: 'online',
      items: orderItems,
      totalAmount: this.totalAmount,
      customerInfo: {
        name: this.customers.name,
        email: this.customers.email,
        phone: this.customers.phone
      },
      notes: ''
    };

    // Add userId if user is logged in
    const user = this.auth.getUser();
    if (user && user.id) {
      order.userId = user.id;
    }
    order.userId = '69a075726d4a0982d0e8f264';
    this.isLoading = true;

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder: Order) => {
        this.isLoading = false;
        this.orderCreated = true;
        this.createdOrderId = createdOrder._id || '';
        this.cart.clear();

        // Navigate to confirmation after 2 seconds
        setTimeout(() => {
          if (user && user.id) {
            this.router.navigate(['/history']);
          } else {
            this.router.navigate(['/products']);
          }
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors de la création de la commande:', err);
        alert('Erreur lors de la création de la commande');
      }
    });
  }
}
