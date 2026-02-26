import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl+'/products';

  products = [
  {
    _id: 'prod_1001',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Women Sweatshirt',
    price: 45,
    images: [
      "products/sweatshirt-woman.jpg",
      "/assets/products/sweat-2.jpg"
    ],
    variants: [
      {
        sku: 'SWT-M-F',
        size: 'M',
        gender: 'female',
        stock: 6
      }
    ]
  },
  {
    _id: 'prod_1001',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Women Sweatshirt',
    price: 45,
    images: [
      "products/sweatshirt-woman.jpg",
      "/assets/products/sweat-2.jpg"
    ],
    variants: [
      {
        sku: 'SWT-M-F',
        size: 'M',
        gender: 'female',
        stock: 6
      }
    ]
  },
  {
    _id: 'prod_1001',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Women Sweatshirt',
    price: 45,
    images: [
      "products/sweatshirt-woman.jpg",
      "/assets/products/sweat-2.jpg"
    ],
    variants: [
      {
        sku: 'SWT-M-F',
        size: 'M',
        gender: 'female',
        stock: 6
      }
    ]
  },
  {
    _id: 'prod_1001',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Women Sweatshirt',
    price: 45,
    images: [
      "products/sweatshirt-woman.jpg",
      "/assets/products/sweat-2.jpg"
    ],
    variants: [
      {
        sku: 'SWT-M-F',
        size: 'M',
        gender: 'female',
        stock: 6
      }
    ]
  },
  {
    _id: 'prod_1002',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Unisex Hoodie',
    price: 55,
    images: [
      "products/hoodie-unisex.webp",
      "/assets/products/sweat-2.jpg"
    ],
    variants: [
      { sku: 'HD-S-U', size: 'S', gender: 'unisex', stock: 3 },
      { sku: 'HD-M-U', size: 'M', gender: 'unisex', stock: 0 }
    ]
  }
];

  getProducts(): Observable<any> {
    console.log(this.http.get(this.apiUrl));
    return this.http.get(this.apiUrl);
  }

  getProductsById(id): Observable<any> {
    console.log(this.http.get(this.apiUrl + "/" + id));
    return this.http.get(this.apiUrl + "/" + id);
  }

  // Local convenience: get products for a single shop (fallback to mock list)
  getProductsByShop(shopId: string): Observable<any> {
    // prefer backend if available
    try {
      return this.http.get(this.apiUrl + '?shopId=' + shopId).pipe(
        map((res: any) => res)
      );
    } catch {
      return of(this.products.filter(p => p.shopId === shopId));
    }
  }

  // Add product (client-side fallback)
  addProduct(product: any): Observable<any> {
    // if backend exists, post
    if (this.http) {
      try {
        return this.http.post(this.apiUrl, product);
      } catch {
        // fallthrough
      }
    }
    // fallback: push to local mock list and return observable
    const created = { ...product, _id: 'prod_' + Date.now() };
    this.products.push(created);
    return of(created);
  }

}
