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
  quantity: number = 1;
 

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
    
    // If no attributes are selected, return null to force user to select
    if (Object.keys(this.selectedAttributes).length === 0) return null;
    
    return this.product.variants.filter((v: any) =>
      Object.entries(this.selectedAttributes).every(
        ([key, value]) => v.attributes?.[key] === value
      )
    );
  }

  // Get the maximum available quantity based on selected variant stock
  get maxQuantity(): number {
    if (this.selectedVariants && this.selectedVariants.length > 0) {
      return this.selectedVariants[0]?.stock || 1;
    }
    return this.product?.stock || 99;
  }

  // Decrease quantity if possible
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Increase quantity if not exceeding stock
  increaseQuantity() {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
    }
  }

  // Validate quantity on manual input
  onQuantityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > this.maxQuantity) {
      value = this.maxQuantity;
    }
    this.quantity = value;
  }

  addToCart() {
    // Check if variant selection is required
    if (this.attributeGroups && this.attributeGroups.length > 0) {
      if (!this.selectedVariants || this.selectedVariants.length === 0) {
        alert('Veuillez sélectionner une variante');
        return;
      }
    }
    
    const variant = this.selectedVariants?.[0] || this.product?.variants?.[0];
    
    // Validate quantity against stock
    const availableStock = variant?.stock || this.product?.stock || 99;
    if (this.quantity > availableStock) {
      alert(`Stock insuffisant. Disponible: ${availableStock}`);
      return;
    }
    
    this.cart.add({
      productId: this.product._id,
      productName: this.product.name,
      variantSku: variant?.sku,
      price: variant?.price || this.product.basePrice || 0,
      quantity: this.quantity,
      shopId: this.product.shopId
    });
  }

  buyNow() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Check if variant selection is required
    if (this.attributeGroups && this.attributeGroups.length > 0) {
      if (!this.selectedVariants || this.selectedVariants.length === 0) {
        alert('Veuillez sélectionner une variante');
        return;
      }
    }
    
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

}
