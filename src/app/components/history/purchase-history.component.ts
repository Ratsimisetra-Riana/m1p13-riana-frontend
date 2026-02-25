import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-history.component.html'
})
export class PurchaseHistoryComponent {
  purchases: any[] = [];

  constructor(private auth: AuthService) {
    const user = this.auth.getUser();
    const all = JSON.parse(localStorage.getItem('cc_purchases') || '[]');
    this.purchases = user ? all.filter((p: any) => p.userId === user.id) : [];
  }
}
