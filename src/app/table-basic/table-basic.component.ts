import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-basic',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './table-basic.component.html',
  styleUrl: './table-basic.component.css'
})
export class TableBasicComponent {
  title = 'Basic Table';
  default = [
    { sl: '01', number: '#526534', name: 'Kathryn Murphy', date: '25 Jan 2024', amount: 200.00 },
    { sl: '02', number: '#696589', name: 'Annette Black', date: '25 Jan 2024', amount: 200.00 },
    { sl: '03', number: '#256584', name: 'Ronald Richards', date: '10 Feb 2024', amount: 200.00 },
    { sl: '04', number: '#526587', name: 'Eleanor Pena', date: '10 Feb 2024', amount: 150.00 },
    { sl: '05', number: '#105986', name: 'Leslie Alexander', date: '15 Mar 2024', amount: 150.00 }
  ];
  borderTable = [
    { number: '#526534', name: 'Kathryn Murphy', date: '25 Jan 2024', amount: 200.00 },
    { number: '#696589', name: 'Annette Black', date: '25 Jan 2024', amount: 200.00 },
    { number: '#256584', name: '256584', date: '10 Feb 2024', amount: 200.00 },
    { number: '#526587', name: 'Eleanor Pena', date: '10 Feb 2024', amount: 150.00 },
    { number: '#105986', name: 'Leslie Alexander', date: '15 Mar 2024', amount: 150.00 }
  ];
  products = [
    {
      name: 'Blue t-shirt',
      category: 'Fashion',
      price: 500.0,
      discount: '15%',
      sold: 300,
      orders: 70,
      image: 'assets/images/product/product-img1.png'
    },
    {
      name: 'Nike Air Shoe',
      category: 'Fashion',
      price: 150.0,
      discount: 'N/A',
      sold: 200,
      orders: 70,
      image: 'assets/images/product/product-img2.png'
    },
    {
      name: 'Woman Dresses',
      category: 'Fashion',
      price: 300.0,
      discount: '$50.00',
      sold: 1500,
      orders: 70,
      image: 'assets/images/product/product-img3.png'
    },
    {
      name: 'Smart Watch',
      category: 'Fashion',
      price: 400.0,
      discount: '$50.00',
      sold: 700,
      orders: 70,
      image: 'assets/images/product/product-img4.png'
    },
    {
      name: 'Hoodie Rose',
      category: 'Fashion',
      price: 300.0,
      discount: '25%',
      sold: 500,
      orders: 70,
      image: 'assets/images/product/product-img5.png'
    }
  ];
  items = [
    {
      name: 'Blue t-shirt',
      category: 'Fashion',
      price: 500.0,
      discount: '15%',
      sold: 300,
      orders: 70
    },
    {
      name: 'Blue t-shirt',
      category: 'Fashion',
      price: 150.0,
      discount: 'N/A',
      sold: 200,
      orders: 70
    },
    {
      name: 'Blue t-shirt',
      category: 'Fashion',
      price: 300.0,
      discount: '$50.00',
      sold: 1500,
      orders: 70
    },
    {
      name: 'Blue t-shirt',
      category: 'Fashion',
      price: 400.0,
      discount: '$50.00',
      sold: 700,
      orders: 70
    },
    {
      name: 'Blue t-shirt',
      category: 'Fashion',
      price: 300.0,
      discount: '25%',
      sold: 500,
      orders: 70
    }
  ];
  transactions = [
    { sl: '01', transactionId: '5986124445445', date: '27 Mar 2024', status: 'Pending', amount: '$20,000.00' },
    { sl: '02', transactionId: '5986124445445', date: '27 Mar 2024', status: 'Rejected', amount: '$20,000.00' },
    { sl: '03', transactionId: '5986124445445', date: '27 Mar 2024', status: 'Completed', amount: '$20,000.00' },
    { sl: '04', transactionId: '5986124445445', date: '27 Mar 2024', status: 'Completed', amount: '$20,000.00' },
    { sl: '05', transactionId: '5986124445445', date: '27 Mar 2024', status: 'Completed', amount: '$20,000.00' }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-warning-focus text-warning-main';
      case 'Rejected':
        return 'bg-danger-focus text-danger-main';
      case 'Completed':
        return 'bg-success-focus text-success-main';
      default:
        return '';
    }
  }
  users = [
    {
      date: '27 Mar 2024',
      name: 'Dianne Russell',
      email: 'random@gmail.com',
      plan: 'Free',
      avatar: 'assets/images/users/user1.png',
      rowClass: 'bg-primary-light'
    },
    {
      date: '27 Mar 2024',
      name: 'Wade Warren',
      email: 'random@gmail.com',
      plan: 'Basic',
      avatar: 'assets/images/users/user2.png',
      rowClass: 'bg-success-focus'
    },
    {
      date: '27 Mar 2024',
      name: 'Albert Flores',
      email: 'random@gmail.com',
      plan: 'Standard',
      avatar: 'assets/images/users/user3.png',
      rowClass: 'bg-info-focus'
    },
    {
      date: '27 Mar 2024',
      name: 'Bessie Cooper',
      email: 'random@gmail.com',
      plan: 'Business',
      avatar: 'assets/images/users/user4.png',
      rowClass: 'bg-warning-focus'
    },
    {
      date: '27 Mar 2024',
      name: 'Arlene McCoy',
      email: 'random@gmail.com',
      plan: 'Enterprise',
      avatar: 'assets/images/users/user5.png',
      rowClass: 'bg-danger-focus'
    }
  ];
  orders = [
    {
      user: 'Dianne Russell',
      avatar: 'assets/images/users/user1.png',
      invoice: '#6352148',
      item: 'iPhone 14 max',
      qty: 2,
      amount: '$5,000.00',
      status: 'Paid',
      statusClass: 'bg-success-focus text-success-main'
    },
    {
      user: 'Wade Warren',
      avatar: 'assets/images/users/user2.png',
      invoice: '#6352148',
      item: 'Laptop HPH',
      qty: 3,
      amount: '$1,000.00',
      status: 'Pending',
      statusClass: 'bg-warning-focus text-warning-main'
    },
    {
      user: 'Albert Flores',
      avatar: 'assets/images/users/user3.png',
      invoice: '#6352148',
      item: 'Smart Watch',
      qty: 7,
      amount: '$1,000.00',
      status: 'Shipped',
      statusClass: 'bg-info-focus text-info-main'
    },
    {
      user: 'Bessie Cooper',
      avatar: 'assets/images/users/user4.png',
      invoice: '#6352148',
      item: 'Nike Air Shoe',
      qty: 1,
      amount: '$3,000.00',
      status: 'Canceled',
      statusClass: 'bg-danger-focus text-danger-main'
    },
    {
      user: 'Arlene McCoy',
      avatar: 'assets/images/users/user5.png',
      invoice: '#6352148',
      item: 'New Headphone',
      qty: 5,
      amount: '$4,000.00',
      status: 'Canceled',
      statusClass: 'bg-danger-focus text-danger-main'
    }
  ];
}
