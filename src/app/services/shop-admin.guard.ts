import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard to protect shop-admin routes
 * Only allows access to users with 'shop' or 'shop_admin' role
 */
export const shopAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    // Not logged in - redirect to login
    router.navigate(['/login']);
    return false;
  }

  // Check if user has shop admin role
  if (authService.isShopAdmin()) {
    return true;
  }

  // User is logged in but not a shop admin - redirect to home
  router.navigate(['/']);
  return false;
};
