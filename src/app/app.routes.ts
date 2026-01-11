import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/common/login/login.component';
import { RegisterComponent } from './components/common/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { AdminComponent } from './components/admin/admin.component';
// Import the guards we just created
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menu', component: MenuComponent },

  // Protect "My Orders" -> User must be logged in
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    canActivate: [authGuard],
  },

  // Protect "All Orders" -> User must be ADMIN
  {
    path: 'all-orders',
    component: AllOrdersComponent,
    canActivate: [adminGuard],
  },

  // Protect "Admin Dashboard" -> User must be ADMIN
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
  },
];
