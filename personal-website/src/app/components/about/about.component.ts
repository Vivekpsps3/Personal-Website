import { Component, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.addFontAwesome();
  }
  
  ngAfterViewInit(): void {
    this.setCurrentYear();
  }

  // Add Font Awesome and Google Fonts to the document
  private addFontAwesome(): void {
    // Add Font Awesome
    const fontAwesomeLink = this.renderer.createElement('link');
    this.renderer.setAttribute(fontAwesomeLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(fontAwesomeLink, 'href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
    this.renderer.appendChild(this.document.head, fontAwesomeLink);
    
    // Add Google Fonts
    const googleFontsLink = this.renderer.createElement('link');
    this.renderer.setAttribute(googleFontsLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(googleFontsLink, 'href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    this.renderer.appendChild(this.document.head, googleFontsLink);
  }

  // Function to set the current year in the footer
  private setCurrentYear(): void {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear().toString();
    }
  }
}