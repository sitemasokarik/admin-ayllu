import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  title = 'Blog';
  blogs = [
    {
      image: 'assets/images/blog/blog1.png',
      category: 'Workshop',
      date: 'Jan 17, 2024',
      title: 'Discover Endless Possibilities in Real Estate Live Your Best Life in a',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog2.png',
      category: 'Hiring',
      date: 'Jan 17, 2024',
      title: 'Turn Your Real Estate Dreams Into Reality Embrace the Real Estate',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog3.png',
      category: 'Workshop',
      date: 'Jan 17, 2024',
      title: 'Your satisfaction is our top the best priority',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog4.png',
      category: 'Workshop',
      date: 'Jan 17, 2024',
      title: 'Your journey to home ownership starts here',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog5.png',
      title: 'How to hire a right business executive for your company',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      authorName: 'John Doe',
      authorImage: 'assets/images/user-list/user-list1.png',
      timeAgo: '1 day ago'
    },
    {
      image: 'assets/images/blog/blog6.png',
      title: 'The Gig Economy: Adapting to a Flexible Workforce',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      authorName: 'Robiul Hasan',
      authorImage: 'assets/images/user-list/user-list2.png',
      timeAgo: '1 day ago'
    },
    {
      image: 'assets/images/blog/blog7.png',
      title: 'The Future of Remote Work: Strategies for Success',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      authorName: 'John Doe',
      authorImage: 'assets/images/user-list/user-list3.png',
      timeAgo: '1 day ago'
    },
    {
      image: 'assets/images/blog/blog6.png',
      title: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      authorName: 'John Doe',
      authorImage: 'assets/images/user-list/user-list5.png',
      timeAgo: '1 day ago'
    },
    {
      image: 'assets/images/blog/blog5.png',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      title: 'Discover Endless Possibilities in Real Estate Live Your Best Life in',
      authorName: 'John Doe',
      authorImage: 'assets/images/user-list/user-list5.png',
      timeAgo: '1 day ago'
    },
    {
      image: 'assets/images/blog/blog4.png',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      title: 'Turn Your Real Estate Dreams Into Reality Embrace the Real',
      authorName: 'John Doe',
      authorImage: 'assets/images/user-list/user-list5.png',
      timeAgo: '1 day ago'
    },
    {
      image: 'assets/images/blog/blog3.png',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      title: 'Your satisfaction is our top the best priority',
      authorName: 'John Doe',
      authorImage: 'assets/images/user-list/user-list5.png',
      timeAgo: '1 day ago'
    },
    {
      image: 'assets/images/blog/blog2.png',
      title: 'Your journey to home ownership starts here',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti...',
      authorName: 'John Doe',
      authorImage: 'assets/images/user-list/user-list5.png',
      timeAgo: '1 day ago'
    }
  ];
}
