import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Import the necessary components
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';


@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    HomeComponent,
    AboutComponent,
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
