import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MenuService } from '../../services/menu.service';
import { MenuItem, OrderRequest } from '../../models/models';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '../common/footer/footer.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatGridListModule,
    FooterComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  paginatedItems: MenuItem[] = [];

  // Cart: Map of ItemID -> Quantity
  cartItems: { [key: number]: number } = {};

  // Pagination
  pageSize = 6;
  pageIndex = 0;

  // Order Form Data
  customerName = '';
  customerPhoneNumber = '';
  customerAddress = '';

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  fetchMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: async (response) => {
        // Process images for each item (just like React code)
        const items = response.data;

        // We use Promise.all to fetch images in parallel
        this.menuItems = await Promise.all(
          items.map(async (item) => {
            // If the item doesn't have an image URL, fetch one from Pexels based on food name
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

        this.updatePaginatedItems();
      },
      error: (err) => console.error('Error fetching menu:', err),
    });
  }

  // --- PAGINATION ---
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePaginatedItems();
  }

  updatePaginatedItems() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedItems = this.menuItems.slice(startIndex, endIndex);
  }

  // --- CART MANAGEMENT ---
  addToCart(item: MenuItem) {
    if (!localStorage.getItem('username')) {
      this.toastr.error('Please login to order!');
      return;
    }
    const currentQty = this.cartItems[item.id] || 0;
    if (currentQty < 5) {
      this.cartItems[item.id] = currentQty + 1;
    }
  }

  removeFromCart(item: MenuItem) {
    const currentQty = this.cartItems[item.id] || 0;
    if (currentQty > 0) {
      this.cartItems[item.id] = currentQty - 1;
      if (this.cartItems[item.id] === 0) {
        delete this.cartItems[item.id];
      }
    }
  }

  getCartQuantity(itemId: number): number {
    return this.cartItems[itemId] || 0;
  }

  getCartTotal(): number {
    let total = 0;
    for (const [itemId, qty] of Object.entries(this.cartItems)) {
      const item = this.menuItems.find((i) => i.id === +itemId);
      if (item) {
        total += item.foodPrice * qty;
      }
    }
    return total;
  }

  // Helper to get cart items as a list for display
  getCartList() {
    return Object.entries(this.cartItems).map(([itemId, qty]) => {
      const item = this.menuItems.find((i) => i.id === +itemId);
      return { ...item, qty };
    });
  }

  // --- PLACE ORDER ---
  placeOrder() {
    if (!localStorage.getItem('username')) {
      this.toastr.error('Login into your account!');
      return;
    }

    if (Object.keys(this.cartItems).length === 0) {
      this.toastr.error('Cart cannot be empty!');
      return;
    }

    const orderRequest: OrderRequest = {
      customerName: this.customerName,
      customerPhoneNumber: this.customerPhoneNumber,
      customerAddress: this.customerAddress,
      orderItems: this.cartItems,
    };

    this.menuService.placeOrder(orderRequest).subscribe({
      next: (res) => {
        this.toastr.success('Order placed successfully!');
        // Reset Form
        this.cartItems = {};
        this.customerName = '';
        this.customerPhoneNumber = '';
        this.customerAddress = '';
      },
      error: (err) => {
        // Handle validation errors from backend
        if (err.error && err.error.data) {
          // If backend sends validation map
          this.toastr.error('Please fix validation errors');
        } else {
          this.toastr.error('Error placing order');
        }
      },
    });
  }
}
