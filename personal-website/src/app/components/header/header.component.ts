import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  navigateToAbout() {
    window.location.href = '/about';
  }

  navigateToBlog() {
    window.location.href = '/blog';
  }
}
