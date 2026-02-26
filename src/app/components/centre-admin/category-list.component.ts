import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-centre-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html'
})
export class CentreCategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private cs: CategoryService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() { this.cs.list().subscribe(c => this.categories = c || []); }

  edit(id?: string) { this.router.navigate(['/centre-admin/categories', id || 'new']); }
  remove(id?: string) { if (!id) return; if (confirm('Supprimer cette catégorie ?')) { this.cs.delete(id).subscribe(() => this.load()); } }
}
