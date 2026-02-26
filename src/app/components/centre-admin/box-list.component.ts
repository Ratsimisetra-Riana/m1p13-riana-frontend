import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Box, BoxService } from '../../services/box.service';

@Component({
  selector: 'app-centre-box-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './box-list.component.html'
})
export class CentreBoxListComponent implements OnInit {
  boxes: Box[] = [];
  loading = true;

  constructor(private boxService: BoxService) {}

  ngOnInit() {
    this.loadBoxes();
  }

  loadBoxes() {
    this.loading = true;
    this.boxService.list().subscribe(boxes => {
      this.boxes = boxes || [];
      this.loading = false;
    });
  }

  delete(id: string | undefined) {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette boîte ?')) {
      this.boxService.delete(id).subscribe(() => this.loadBoxes());
    }
  }
}
