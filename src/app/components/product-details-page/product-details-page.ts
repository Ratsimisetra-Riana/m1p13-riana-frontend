import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [CommonModule],
  templateUrl: './product-details-page.html'
})
export class ProductDetailsPage {

  product: any;
  attributeGroups : any;
  selectedAttributes: Record<string, string> = {};
 

  constructor(private route: ActivatedRoute, private productService: ProductService, private cart: CartService, private auth: AuthService, private router: Router) {
    const productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct(productId);
  }

  loadProduct(id: string | null) {
    this.productService.getProductsById(id).subscribe(data => {
      this.product = data;
      this.attributeGroups = this.getAttributeGroups();
      console.log(this.attributeGroups);
    });
  }

  getAttributeGroups() {
    const groups: Record<string, Set<string>> = {};
    this.product.variants.forEach(v => {
      Object.entries(v.attributes || {}).forEach(([key, value]) => {
        if (!groups[key]) {
          groups[key] = new Set();
        }
        groups[key].add(value as string);
      });
    });

    return Object.entries(groups).map(([key, values]) => ({
      key,
      options: Array.from(values)
    }));
  }

  
   get selectedVariants() {
    if (!this.product?.variants?.length) return null;
    return this.product.variants.filter((v: any) =>
      Object.entries(this.selectedAttributes).every(
        ([key, value]) => v.attributes?.[key] === value
      )
    );
  }

  addToCart() {
    const variant = this.selectedVariants?.[0] || this.product?.variants?.[0];
    this.cart.add({
      productId: this.product._id,
      productName: this.product.name,
      variantSku: variant?.sku,
      price: variant?.price || this.product.basePrice || 0,
      quantity: 1,
      shopId: this.product.shopId
    });
  }

  buyNow() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

}
