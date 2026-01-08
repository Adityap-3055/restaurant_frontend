import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { CustomerOrder, MenuItem } from '../../models/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders: CustomerOrder[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    const username = this.authService.getUsername();
    if (!username) {
      this.errorMsg = 'User not logged in.';
      this.loading = false;
      return;
    }

    // Call the service method we created earlier matching React
    this.menuService.getOrdersByUsername(username).subscribe({
      next: (response) => {
        // Sort by ID descending (newest first)
        this.orders = response.data.sort((a, b) => b.id - a.id);
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error fetching orders.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteOrder(orderId: number): void {
    if (!confirm('Are you sure you want to delete this order?')) return;

    this.menuService.deleteOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Order deleted successfully!');
        // Remove from list immediately
        this.orders = this.orders.filter((o) => o.id !== orderId);
      },
      error: (err) => {
        this.toastr.error('Failed to delete order');
      },
    });
  }

  // Helper to group identical items just like React
  getGroupedItems(
    items: MenuItem[]
  ): { name: string; qty: number; price: number }[] {
    const grouped = new Map<
      string,
      { name: string; qty: number; price: number }
    >();

    items.forEach((item) => {
      if (grouped.has(item.foodName)) {
        grouped.get(item.foodName)!.qty += 1;
      } else {
        grouped.set(item.foodName, {
          name: item.foodName,
          qty: 1,
          price: item.foodPrice,
        });
      }
    });

    return Array.from(grouped.values());
  }
}
