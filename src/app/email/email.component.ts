import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-email',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent {
  title = 'Emails';
  emails =  [
    {
      name: 'Jerome Bell',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Kristin Watson',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Cody Fisher',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Jerome Bell',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Kristin Watson',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Cody Fisher',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Jerome Bell',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Kristin Watson',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Cody Fisher',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Jerome Bell',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Kristin Watson',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
    {
      name: 'Cody Fisher',
      message: 'Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.',
      time: '6:07 AM'
    },
  ];
}
