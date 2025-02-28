import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-blog',
  imports: [RouterModule,
          HeaderComponent
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  testContent = 'This is a test blog content to ensure the blog component works correctly.';
}
