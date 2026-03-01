import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-centre-admin-layout',
  standalone: true,
  imports: [Navbar, Footer, RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgClass],
  templateUrl: './centre-admin-layout.html'
})
export class CentreAdminLayout {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
