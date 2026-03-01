import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard to protect centre-admin routes
 * Only allows access to users with 'admin' or 'centre_admin' role
 */
export const centreAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    // Not logged in - redirect to login
    router.navigate(['/login']);
    return false;
  }

  // Check if user has centre admin role
  if (authService.isCentreAdmin()) {
    return true;
  }

  // User is logged in but not a centre admin - redirect to home
  router.navigate(['/']);
  return false;
};
