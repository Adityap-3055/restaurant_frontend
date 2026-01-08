import { Component } from '@angular/core';
import { HomeBodyComponent } from '../home-body/home-body.component';
import { HomeMenuComponent } from '../home-menu/home-menu.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { FooterComponent } from '../common/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeBodyComponent,
    HomeMenuComponent,
    AboutUsComponent,
    FooterComponent,
  ],
  template: `
    <app-home-body></app-home-body>
    <app-home-menu></app-home-menu>
    <app-about-us></app-about-us>
    <app-footer></app-footer>
  `,
})
export class HomeComponent {}
