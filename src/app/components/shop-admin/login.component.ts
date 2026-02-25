import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class ShopAdminLoginComponent {
  shopId = '';
  password = '';

  constructor(private shopAdmin: ShopAdminService, private router: Router) {}

  submit() {
    this.shopAdmin.login(this.shopId, this.password).subscribe(() => {
      this.router.navigate(['/shop-admin/dashboard']);
    });
  }
}
