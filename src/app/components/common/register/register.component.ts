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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styles: [
    `
      .register-container {
        background-color: #2c3e50;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .register-card {
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
export class RegisterComponent {
  user: User = { username: '', password: '', roles: 'ROLE_CUSTOMER' };
  errorMsg: string = '';
  validationErrors: any = {}; // <--- Object to hold field-specific errors

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onRegister() {
    // Reset errors before request
    this.validationErrors = {};
    this.errorMsg = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        this.toastr.success('Registration successful! Please login.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        // Handle Validation Errors (400)
        if (err.status === 400 && err.error && err.error.data) {
          this.validationErrors = err.error.data; // Capture the Map { username: "...", password: "..." }
          this.toastr.error('Please fix the validation errors.');
        }
        // Handle Conflict (409) - e.g., Username exists
        else if (err.status === 409) {
          this.errorMsg = err.error.status; // "Username already exists!"
        } else {
          this.errorMsg = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
