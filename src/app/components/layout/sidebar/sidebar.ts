import { Component } from '@angular/core';
import { CategoryList } from '../../category-list/category-list';
import { CategorySpecs } from '../../category-specs/category-specs';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FilterService } from '../../../services/filter-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  imports: [CategoryList, CategorySpecs, CommonModule, NgClass, RouterLink, RouterLinkActive]
})
export class Sidebar {

  constructor(private filterService: FilterService) {}

  selectedCategory!: any;

  onCategorySelected(category: any) {
    this.selectedCategory = category;
  }

  onFiltersChanged(filters: Record<string, any>) {
  this.filterService.updateFilters(filters);
}

}
