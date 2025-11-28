import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-locales',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './locales.component.html',
  styleUrl: './locales.component.css'
})
export class LocalesComponent {
  title = 'Locales';

  users= [
    {
      id: 1,
      date: '25 Jan 2024',
      imgSrc: 'assets/images/user-list/user-list1.png',
      name: 'Kathryn Murphy',
      email: 'osgoodwy@gmail.com',
      department: 'HR',
      position: 'Manager',
      status: 'Active'
    },
  ]; 
}
