import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class ShopDashboardComponent {
  metrics: any = { bestSeller: null, revenueToday: 0, salesToday: 0, top10: [], monthly: [] };

  constructor(private shop: ShopAdminService) {
    const shopId = this.shop.getShop()?.id;
    const all = JSON.parse(localStorage.getItem('cc_purchases') || '[]');
    const shopOrders = all.filter((o: any) => (o.items || []).some((it: any) => it.shopId === shopId));

    // compute revenue and sales today
    const today = new Date().toISOString().slice(0,10);
    let revenueToday = 0, salesToday = 0;
    const productCount: Record<string, number> = {};

    shopOrders.forEach((o: any) => {
      const date = (new Date(o.date)).toISOString().slice(0,10);
      (o.items || []).forEach((it: any) => {
        if (it.shopId !== shopId) return;
        const amt = (it.price || 0) * (it.quantity || 1);
        if (date === today) { revenueToday += amt; salesToday += 1; }
        productCount[it.productId] = (productCount[it.productId] || 0) + (it.quantity || 1);
      });
    });

    const top = Object.entries(productCount).sort((a,b) => b[1]-a[1]).slice(0,10).map(([id,count]) => ({ id, count }));

    this.metrics.bestSeller = top[0] || null;
    this.metrics.revenueToday = revenueToday;
    this.metrics.salesToday = salesToday;
    this.metrics.top10 = top;

    // monthly mock: compute monthly revenue for past 6 months
    const monthly: any[] = [];
    for (let m = 5; m >= 0; m--) {
      monthly.push({ month: m, revenue: Math.round(Math.random()*5000) });
    }
    this.metrics.monthly = monthly;
  }
}
