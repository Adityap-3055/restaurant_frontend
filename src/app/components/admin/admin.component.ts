import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { MenuItem, User } from '../../models/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  menuItems: MenuItem[] = [];

  // Form Models
  newAdmin: User = { username: '', password: '', roles: 'ROLE_ADMIN' };
  newItem: any = { foodName: '', foodPrice: '', imageUrl: '' };
  selectedItem: any = {};

  // Validation Errors
  adminErrors: any = {};
  addItemErrors: any = {};
  updateItemErrors: any = {};

  @ViewChild('addAdminDialog') addAdminDialog!: TemplateRef<any>;
  @ViewChild('addItemDialog') addItemDialog!: TemplateRef<any>;
  @ViewChild('updateItemDialog') updateItemDialog!: TemplateRef<any>;
  // Removed deleteConfirmDialog ViewChild

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  fetchMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: async (response) => {
        const items = response.data;
        this.menuItems = await Promise.all(
          items.map(async (item) => {
            if (!item.imageUrl) {
              try {
                const pexelsData = await this.menuService
                  .fetchImageFromPexels(item.foodName)
                  .toPromise();
                item.imageUrl =
                  pexelsData.photos[0]?.src?.medium ||
                  'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
              } catch {
                item.imageUrl =
                  'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
              }
            }
            return item;
          })
        );
      },
    });
  }

  // --- ACTIONS ---

  openAddAdmin() {
    this.newAdmin = { username: '', password: '', roles: 'ROLE_ADMIN' };
    this.adminErrors = {};
    this.dialog.open(this.addAdminDialog);
  }

  submitAddAdmin() {
    this.adminErrors = {};
    this.authService.createAdmin(this.newAdmin).subscribe({
      next: () => {
        this.toastr.success('Admin added successfully!');
        this.dialog.closeAll();
      },
      error: (err) => {
        if (err.status === 400 && err.error && err.error.data) {
          this.adminErrors = err.error.data;
          this.toastr.error('Please fix the errors.');
        } else if (err.status === 409) {
          this.toastr.error(err.error.status || 'Username already exists');
        } else {
          this.toastr.error('Failed to add admin');
        }
      },
    });
  }

  openAddItem() {
    this.newItem = { foodName: '', foodPrice: '' };
    this.addItemErrors = {};
    this.dialog.open(this.addItemDialog);
  }

  async submitAddItem() {
    this.addItemErrors = {};
    try {
      const pexelsData = await this.menuService
        .fetchImageFromPexels(this.newItem.foodName)
        .toPromise();
      this.newItem.imageUrl =
        pexelsData.photos[0]?.src?.medium ||
        'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
    } catch {
      this.newItem.imageUrl =
        'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
    }

    this.menuService.addMenuItem(this.newItem).subscribe({
      next: () => {
        this.toastr.success('Menu item added!');
        this.fetchMenuItems();
        this.dialog.closeAll();
      },
      error: (err) => {
        if (err.status === 400 && err.error && err.error.data) {
          this.addItemErrors = err.error.data;
          this.toastr.error('Please fix the errors.');
        } else {
          this.toastr.error('Failed to add item');
        }
      },
    });
  }

  openUpdateItem(item: MenuItem) {
    this.selectedItem = { ...item };
    this.updateItemErrors = {};
    this.dialog.open(this.updateItemDialog);
  }

  submitUpdateItem() {
    this.updateItemErrors = {};
    this.menuService
      .updateMenuItem(this.selectedItem.id, this.selectedItem)
      .subscribe({
        next: () => {
          this.toastr.success('Item updated!');
          this.fetchMenuItems();
          this.dialog.closeAll();
        },
        error: (err) => {
          if (err.status === 400 && err.error && err.error.data) {
            this.updateItemErrors = err.error.data;
            this.toastr.error('Please fix the errors.');
          } else {
            this.toastr.error('Failed to update item');
          }
        },
      });
  }

  // --- REVERTED DELETE LOGIC ---
  deleteItem(id: number) {
    // Original Browser Popup
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.menuService.deleteMenuItem(id).subscribe({
      next: () => {
        this.toastr.success('Item deleted!');
        this.fetchMenuItems();
      },
      error: (err) => {
        const msg = err.error?.message || err.statusText || 'Unknown Error';
        this.toastr.error(`Failed to delete item: ${msg}`);
      },
    });
  }
}
