import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-shop-admin-layout',
  standalone: true,
  imports: [Navbar, Footer, RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgClass],
  templateUrl: './shop-admin-layout.html'
})
export class ShopAdminLayout {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
