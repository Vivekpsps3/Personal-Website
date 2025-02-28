import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { AppRoutingModule } from './app.routes'; // Import the routing module
import { HeaderComponent } from './components/header/header.component'; // Import the header component

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    FooterComponent,
    BlogComponent,
    HeaderComponent // Declare the header component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Add this line
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
