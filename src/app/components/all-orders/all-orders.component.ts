import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuService } from '../../services/menu.service';
import { CustomerOrder, MenuItem } from '../../models/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
})
export class AllOrdersComponent implements OnInit {
  orders: CustomerOrder[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchAllOrders();
  }

  fetchAllOrders(): void {
    this.menuService.getAllOrders().subscribe({
      next: (response) => {
        // Sort by ID descending (newest first)
        this.orders = response.data.sort((a, b) => b.id - a.id);
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error fetching orders.';
        this.loading = false;
      },
    });
  }

  deleteOrder(orderId: number): void {
    if (!confirm('Delete this customer order?')) return;

    this.menuService.deleteOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Order deleted successfully!');
        this.orders = this.orders.filter((o) => o.id !== orderId);
      },
      error: () => this.toastr.error('Failed to delete order'),
    });
  }

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
