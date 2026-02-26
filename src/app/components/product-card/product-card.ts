import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
   imports: [CommonModule,RouterLink], 
  standalone: true,
  templateUrl: './product-card.html'
})
export class ProductCard {
  @Input() product!: any;

  constructor(private cart: CartService) {}

  get inStock(): boolean {
    return this.product?.variants?.some((v: any) => v.stock > 0);
  }

  addToCart() {
    if (!this.product) return;
    const variant = (this.product.variants || []).find((v: any) => v.stock > 0) || (this.product.variants || [])[0];
    const sku = variant?.sku;
    this.cart.add({
      productId: this.product._id,
      productName: this.product.name,
      variantSku: sku,
      price: this.product.price || 0,
      quantity: 1,
      shopId: this.product.shopId
    });
  }

  /**
   * Collect all variant attributes dynamically
   * Excludes sku & stock
   */
  get variantAttributes(): Record<string, string[]> {
    const result: Record<string, Set<string>> = {};

    (this.product?.variants || []).forEach((variant: any) => {
      Object.entries(variant).forEach(([key, value]) => {
        if (['sku', 'stock'].includes(key)) return;
        if (value == null) return;

        if (!result[key]) {
          result[key] = new Set();
        }
        result[key].add(String(value));
      });
    });

    // convert Set → array
    return Object.fromEntries(
      Object.entries(result).map(([k, v]) => [k, [...v]])
    );
  }
}
