import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-list.component.html'
})
export class ShopListComponent {
  shops = [
    { id: 'shopA', name: 'Boutique A' },
    { id: 'shopB', name: 'Boutique B' },
    { id: 'shopC', name: 'Boutique C' }
  ];
}
