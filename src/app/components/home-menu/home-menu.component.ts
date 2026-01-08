import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/models';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.css'],
})
export class HomeMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    // Fetch only the first 3 items
    this.menuService.getMenuItems().subscribe({
      next: async (response) => {
        const firstThree = response.data.slice(0, 3);

        // Fetch images for them
        this.menuItems = await Promise.all(
          firstThree.map(async (item) => {
            if (!item.imageUrl) {
              try {
                const pexels = await this.menuService
                  .fetchImageFromPexels(item.foodName)
                  .toPromise();
                item.imageUrl = pexels.photos[0]?.src?.medium;
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
}
