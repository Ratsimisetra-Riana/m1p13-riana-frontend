import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ShopProfileComponent {
  profile: any = {};

  constructor(private shopAdmin: ShopAdminService) {
    this.profile = this.shopAdmin.getShop() || {};
  }

  save() {
    this.shopAdmin.updateProfile(this.profile).subscribe();
  }
}
