import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent {
  title = 'Blog Details';
  latestPost = [
    {
      title: 'How to hire a right business executive for your company',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      image: 'assets/images/blog/blog5.png',
      link: '/blog-details'
    },
    {
      title: 'The Gig Economy: Adapting to a Flexible Workforce',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      image: 'assets/images/blog/blog6.png',
      link: '/blog-details'
    },
    {
      title: 'The Future of Remote Work: Strategies for Success',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      image: 'assets/images/blog/blog7.png',
      link: '/blog-details'
    },
    {
      title: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      image: 'assets/images/blog/blog6.png',
      link: '/blog-details'
    }
  ];
  categories = [
    'Development',
    'Design',
    'Technology',
    'Popular',
    'Codignator',
    'Javascript',
    'Bootstrap',
    'PHP'
  ];
  tags = [
    { name: 'Technology', count: 1 },
    { name: 'Business', count: 1 },
    { name: 'Consulting', count: 1 },
    { name: 'Course', count: 1 },
    { name: 'Real Estate', count: 1 }
  ];
}
