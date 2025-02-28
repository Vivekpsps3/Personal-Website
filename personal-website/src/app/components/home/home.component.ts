import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  imports: [RouterModule
          ,HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  navigateToAbout() {
    window.location.href = '/about';
  }

  navigateToBlog() {
    window.location.href = '/blog';
  }

}
