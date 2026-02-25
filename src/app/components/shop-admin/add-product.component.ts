import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html'
})
export class ShopAddProductComponent {
  model: any = { name: '', categoryId: '', price: 0, variants: [], shippingFee: 0 };

  constructor(private productService: ProductService, private shopAdmin: ShopAdminService, private router: Router) {}

  addVariant() {
    this.model.variants.push({ sku: '', stock: 0, attributes: {} });
  }

  submit() {
    const shop = this.shopAdmin.getShop();
    if (shop) this.model.shopId = shop.id;
    this.productService.addProduct(this.model).subscribe(() => this.router.navigate(['/shop-admin/products']));
  }
}
