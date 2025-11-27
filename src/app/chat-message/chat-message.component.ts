import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {
  title = 'Chat Message';
  chatUsers = [
    {
      image: 'assets/images/chat/2.png',
      name: 'Kathryn Murphy',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: true
    },
    {
      image: 'assets/images/chat/3.png',
      name: 'James Michael',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: true
    },
    {
      image: 'assets/images/chat/4.png',
      name: 'Russell Lucas',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/5.png',
      name: 'Caleb Bradley',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/6.png',
      name: 'Bobby Roy',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/7.png',
      name: 'Vincent Liam',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/8.png',
      name: 'Randy Mason',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/9.png',
      name: 'Albert Wayne',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/10.png',
      name: 'Elijah Willie',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/2.png',
      name: 'Kathryn Murphy',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: true
    },
    {
      image: 'assets/images/chat/3.png',
      name: 'James Michael',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: true
    },
    {
      image: 'assets/images/chat/4.png',
      name: 'Russell Lucas',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/5.png',
      name: 'Caleb Bradley',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/6.png',
      name: 'Bobby Roy',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/7.png',
      name: 'Vincent Liam',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/8.png',
      name: 'Randy Mason',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/9.png',
      name: 'Albert Wayne',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
    {
      image: 'assets/images/chat/10.png',
      name: 'Elijah Willie',
      message: "hey! there i'm...",
      time: '12:30 PM',
      unreadCount: 8,
      active: false
    },
  ]
}
