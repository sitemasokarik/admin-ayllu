import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  title = 'Usuarios';

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
