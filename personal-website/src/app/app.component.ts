import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Import the necessary components
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<h1>Welcome to {{ title }}!</h1>`,
  standalone: true
})
export class AppComponent {
  title = 'Vivek\'s Personal Website';
}
