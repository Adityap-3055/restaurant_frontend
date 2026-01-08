import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/common/login/login.component';
import { RegisterComponent } from './components/common/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';

export const routes: Routes = [
  // When path is empty (http://localhost:4200/), show HomeComponent
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'my-orders', component: MyOrdersComponent },
];
