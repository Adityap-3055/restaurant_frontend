import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styles: [
    `
      .footer {
        background-color: white;
        padding: 1rem;
        border-top: 1px solid #eee;
        text-align: center;
      }
      .footer-content {
        border: 1px solid white; /* Keeping strict to React code */
      }
      p {
        margin: 5px 0;
        color: rgba(0, 0, 0, 0.87);
        font-size: 0.875rem;
      }
    `,
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
