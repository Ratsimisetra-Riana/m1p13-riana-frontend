import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category, FilterDef } from '../../services/category.service';
import { CategoryDTO } from '../../dtos/category-dto';

@Component({
  selector: 'app-centre-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-edit.component.html'
})
export class CentreCategoryEditComponent implements OnInit {
  id: string | null = null;
  model: Category = { name: '', parent: null, filters: [] };
  categories: Category[] = [];

  constructor(private route: ActivatedRoute, private cs: CategoryService, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.route.snapshot.paramMap.get('id'));
    // load all categories for parent selection
    this.cs.list().subscribe(cats => { this.categories = cats || []; });

    if (this.id && this.id !== 'new') {
      this.cs.get(this.id).subscribe(c => { if (c) this.model = c; });
      console.log("subscirbed to category with id", this.model);
    }
  }
  ngAfterViewInit() {
    // ensure options arrays exist for existing filters
    (this.model.filters || []).forEach(f => f.options = f.options || []);
  }

  addFilter() { this.model.filters = this.model.filters || []; this.model.filters.push({ key: '', type: 'select', options: [] }); }

  removeFilter(i: number) { this.model.filters?.splice(i,1); }

  addOption(f: FilterDef) {
    f.options = f.options || [];
    f.options.push('');
  }

  removeOption(f: FilterDef, i: number) {
    f.options?.splice(i, 1);
  }

  compareCategories(c1: Category | null, c2: Category | null): boolean {
    return c1?._id === c2?._id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  save() {
    // ensure options arrays exist
    (this.model.filters || []).forEach(f => { f.options = f.options || []; });

    const dto: CategoryDTO = {
      ...this.model,
      parent: this.model.parent?._id || null,
      filters: this.model.filters?.map(f => ({ key: f.key, type: f.type, options: f.options || [] }))
    };

    if (this.id && this.id !== 'new') {
      this.cs.update(this.id, dto).subscribe(() => this.router.navigate(['/centre-admin/categories']));
    } else {
      this.cs.create(dto).subscribe(() => this.router.navigate(['/centre-admin/categories']));
    }
  }
}
