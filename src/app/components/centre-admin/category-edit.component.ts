import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category, FilterDef } from '../../services/category.service';

@Component({
  selector: 'app-centre-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-edit.component.html'
})
export class CentreCategoryEditComponent implements OnInit {
  id: string | null = null;
  model: Category = { name: '', parent: null, filters: [] };

  constructor(private route: ActivatedRoute, private cs: CategoryService, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.cs.get(this.id).subscribe(c => { if (c) this.model = c; });
    }
  }
  ngAfterViewInit() {
    // ensure optionsString is populated for existing filters
    (this.model.filters || []).forEach(f => f.optionsString = (f.options || []).join(','));
  }

  addFilter() { this.model.filters = this.model.filters || []; this.model.filters.push({ key: '', type: 'select', options: [], optionsString: '' }); }

  removeFilter(i: number) { this.model.filters?.splice(i,1); }

  onOptionsChange(f: FilterDef, value: string | undefined) {
    const raw = value || '';
    f.options = raw.split(',').map(s => s.trim()).filter(Boolean as any);
    f.optionsString = raw;
  }

  save() {
    // ensure options arrays are synced from optionsString
    (this.model.filters || []).forEach(f => {
      if (typeof f.optionsString === 'string') {
        f.options = (f.optionsString || '').split(',').map(s => s.trim()).filter(Boolean as any);
      }
    });

    if (this.id && this.id !== 'new') {
      this.cs.update(this.id, this.model).subscribe(() => this.router.navigate(['/centre-admin/categories']));
    } else {
      this.cs.create(this.model).subscribe(() => this.router.navigate(['/centre-admin/categories']));
    }
  }
}
