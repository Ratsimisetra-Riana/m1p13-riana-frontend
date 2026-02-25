import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-sold-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sold-products.component.html'
})
export class ShopSoldProductsComponent {
  records: any[] = [];

  constructor(private shop: ShopAdminService) {
    const shopId = this.shop.getShop()?.id;
    const all = JSON.parse(localStorage.getItem('cc_purchases') || '[]');
    // Flatten items and filter by shopId
    const rows: any[] = [];
    all.forEach((ord: any) => {
      (ord.items || []).forEach((it: any) => {
        if (it.shopId === shopId) {
          rows.push({ orderId: ord.id, date: ord.date, status: ord.status, item: it, online: it.online ?? true, amount: it.price * it.quantity });
        }
      });
    });
    this.records = rows;
  }
}
