import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-shop-products',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './shop-products.component.html'
})
export class ShopProductsComponent {
  shopId: string | null = null;
  products: any[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) {
    this.shopId = this.route.snapshot.paramMap.get('id');
    this.productService.getProducts().subscribe((data: any) => {
      this.products = (data || []).filter((p: any) => p.shopId === this.shopId);
    });
  }
}
