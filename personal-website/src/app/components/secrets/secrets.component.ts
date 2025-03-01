import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-secrets',
  imports: [
  ],
  templateUrl: './secrets.component.html',
  styleUrl: './secrets.component.css'
})
export class SecretsComponent {
  constructor(private router: Router) { }
  navigateToHome() {
    this.router.navigate(['/']);
  }


}

