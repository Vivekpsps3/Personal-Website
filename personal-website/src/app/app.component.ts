import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Import the necessary components


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<h1>Welcome to {{ title }}!</h1>`,
  standalone: true
})
export class AppComponent {
  title = 'Vivek\'s Personal Website';
}
