import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

// 1. Guard to check if user is simply logged in (for My Orders)
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    toastr.error('Please login to access this page.');
    router.navigate(['/login']);
    return false;
  }
};

// 2. Guard to check if user is specifically an ADMIN
export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Check login first, then check Role
  if (authService.isLoggedIn() && authService.getRole() === 'ROLE_ADMIN') {
    return true;
  } else {
    toastr.error('Access Denied. Admins only.');
    router.navigate(['/']); 
    return false;
  }
};
