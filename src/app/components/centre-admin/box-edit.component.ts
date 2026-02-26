import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Box, BoxService } from '../../services/box.service';

@Component({
  selector: 'app-centre-box-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './box-edit.component.html'
})
export class CentreBoxEditComponent implements OnInit {
  id: string | null = null;
  model: Box = { code: '', floor: 1, zone: '' };

  constructor(private route: ActivatedRoute, private boxService: BoxService, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.boxService.get(this.id).subscribe(b => { if (b) this.model = b; });
    }
  }

  save() {
    if (this.id && this.id !== 'new') {
      this.boxService.update(this.id, this.model).subscribe(() => this.router.navigate(['/centre-admin/boxes']));
    } else {
      this.boxService.create(this.model).subscribe(() => this.router.navigate(['/centre-admin/boxes']));
    }
  }

  cancel() {
    this.router.navigate(['/centre-admin/boxes']);
  }
}
