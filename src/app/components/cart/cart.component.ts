import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  items = [] as any[];

  constructor(private cart: CartService, private router: Router) {
    this.items = this.cart.getItems();
    this.cart.items$.subscribe(v => this.items = v);
  }

  total() {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  remove(i: any) {
    this.cart.remove(i.productId, i.variantSku);
  }

  updateQty(i: any, qty: number) {
    this.cart.updateQuantity(i.productId, i.variantSku, qty);
  }
}
