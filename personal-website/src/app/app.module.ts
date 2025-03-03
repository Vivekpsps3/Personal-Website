import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { RouterModule } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { AppRoutingModule } from './app.routes'; // Import the routing module
import { HeaderComponent } from './components/header/header.component'; // Import the header component
import { SecretsComponent } from './components/secrets/secrets.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    BlogComponent,
    HeaderComponent, // Declare the header component
    SecretsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule, // Add this line
    RouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
