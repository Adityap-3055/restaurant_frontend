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

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.toastr.success('Registration successful! Please login.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        // Handle backend validation errors (400) or conflict (409)
        if (err.status === 409) {
          this.errorMsg = 'Username already exists';
        } else {
          this.errorMsg = 'Registration failed. Check details.';
        }
      },
    });
  }
}
