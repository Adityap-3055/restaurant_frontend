import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styles: [
    `
      .login-container {
        background-color: #2c3e50;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .login-card {
        width: 350px;
        padding: 20px;
        border: 1px solid #ab3434;
        text-align: center;
      }
      .btn-custom {
        background-color: #ab3434;
        color: white;
        width: 100%;
        margin-top: 15px;
      }
    `,
  ],
})
export class LoginComponent {
  user: User = { username: '', password: '', roles: 'ROLE_CUSTOMER' }; // Default role, overwritten by backend response usually
  errorMsg: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onLogin() {
    this.authService.login(this.user).subscribe({
      next: (response) => {
        this.toastr.success('Login Successful!', 'Welcome');
        setTimeout(() => {
          this.router.navigate(['/']); // Redirect to home
        }, 1000);
      },
      error: (err) => {
        this.errorMsg = 'Invalid username or password';
        this.toastr.error('Login Failed');
      },
    });
  }
}
