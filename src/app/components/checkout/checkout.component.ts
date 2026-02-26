import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  address = '';
  items: any[] = [];

  constructor(private auth: AuthService, private cart: CartService, private router: Router) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.items = this.cart.getItems();
  }

  placeOrder() {
    const user = this.auth.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const purchases = JSON.parse(localStorage.getItem('cc_purchases') || '[]');
    purchases.push({ id: 'ord_' + Date.now(), userId: user.id, date: new Date().toISOString(), address: this.address, items: this.items, status: 'ordered' });
    localStorage.setItem('cc_purchases', JSON.stringify(purchases));
    this.cart.clear();
    this.router.navigate(['/history']);
  }
}
