import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private shopAdmin: ShopAdminService) {}

  submit() {
    this.error = '';
    this.loading = true;
    
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        // Sync shop profile with token if user is shop admin
        if (this.auth.isShopAdmin()) {
          this.shopAdmin.syncWithToken();
          this.router.navigate(['/shop-admin']);
        } else if (this.auth.isCentreAdmin()) {
          this.router.navigate(['/centre-admin']);
        } else {
          this.router.navigate(['/']);
        }

      },
      error: (err) => {
        this.loading = false;
        // Handle error response from backend
        if (err.status === 401) {
          this.error = 'Email ou mot de passe invalide';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Une erreur est survenue lors de la connexion';
        }
      }
    });
  }
}
