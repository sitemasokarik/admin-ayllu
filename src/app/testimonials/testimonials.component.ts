import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [BreadcrumbComponent,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  title = 'Testimonials';
  users = [
    {
      name: 'Robert Fox',
      role: 'Prime Investments',
      img: 'assets/images/user-list/user-list1.png',
      rating: 5,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'Robiul Hasan',
      role: 'Front End Developer',
      img: 'assets/images/user-list/user-list2.png',
      rating: 4,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'John Doe',
      role: 'Designer',
      img: 'assets/images/user-list/user-list3.png',
      rating: 3,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'Annette Black',
      role: 'UX/UI Designer',
      img: 'assets/images/user-list/user-list4.png',
      rating: 3,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'Kathryn Murphy',
      role: 'Business Man',
      img: 'assets/images/user-list/user-list5.png',
      rating: 5,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'Ronald Richards',
      role: 'Back End Developer',
      img: 'assets/images/user-list/user-list7.png',
      rating: 4,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'Eleanor Pena',
      role: 'Business Consultant',
      img: 'assets/images/user-list/user-list8.png',
      rating: 5,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'Leslie Alexander',
      role: 'Doctor',
      img: 'assets/images/user-list/user-list9.png',
      rating: 2,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    },
    {
      name: 'Eleanor Pena',
      role: 'Back End Developer',
      img: 'assets/images/user-list/user-list10.png',
      rating: 3,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas laborum sit sint laudantium fuga. Vitae hic, facilis asperiores reiciendis quis qui reprehenderit.'
    }
  ];
}
