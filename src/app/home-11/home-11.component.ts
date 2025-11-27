import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

Swiper.use([Autoplay]);

@Component({
  selector: 'app-home-11',
  imports: [BreadcrumbComponent, CommonModule, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-11.component.html',
  styleUrl: './home-11.component.css'
})
export class Home11Component {
  title = 'Finance & Banking';
  balanceStatisticsChart;
  expenseStatisticsChart;
  @ViewChild('officerSwiper') officerSwiper!: ElementRef;

  constructor() {

    // balance chart
    this.balanceStatisticsChart = {
      series: [
        {
          name: 'Net Profit',
          data: [20000, 16000, 14000, 25000, 45000, 18000, 28000, 11000, 26000, 48000, 18000, 22000]
        },
        {
          name: 'Revenue',
          data: [15000, 18000, 19000, 20000, 35000, 20000, 18000, 13000, 18000, 38000, 14000, 16000]
        }
      ],
      colors: ['#487FFF', '#FF9F29'],
      labels: ['Active', 'New', 'Total'],
      legend: {
        show: false
      },
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        }
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 4,
        position: 'back'
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '10px' // or '30%' if you prefer relative width
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return `$${val.toLocaleString()}`;
          }
        }
      },
      fill: {
        opacity: 1
      }
    };

    // Expense Pie chart
    this.expenseStatisticsChart = {
      series: [30, 30, 30, 30],
      chart: {
        height: 340,
        type: 'pie'
      },
      labels: ['Entertainment', 'Bill Expense', 'Others', 'Investment'],
      colors: ['#02BCAF', '#F0437D', '#1C52F6', '#43DCFF'],
      legend: {
        show: true
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

  }
  // payment history
  paymentHistories = [
    {
      title: 'Digital Assets',
      date: '18 Nov 2024',
      amount: 450,
      status: 'Paid'
    },
    {
      title: 'Electricity',
      date: '18 Nov 2024',
      amount: 150,
      status: 'Due'
    },
    {
      title: 'Internet Bill',
      date: '18 Nov 2024',
      amount: 450,
      status: 'Cancel'
    },
    {
      title: 'House rent',
      date: '18 Nov 2024',
      amount: 450,
      status: 'Paid'
    },
    {
      title: 'Office rent',
      date: '18 Nov 2024',
      amount: 450,
      status: 'Paid'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid': return 'text-success-600 bg-success-100';
      case 'Due': return 'text-warning-600 bg-warning-100';
      case 'Cancel': return 'text-danger-600 bg-danger-100';
      default: return '';
    }
  }

  // Expense 
  expenseItems = [
    { title: 'Healthcare', amount: '$1500', percentage: '40%', color: 'bg-orange' },
    { title: 'Education', amount: '$1500', percentage: '40%', color: 'bg-warning-600' },
    { title: 'Clothes', amount: '$1500', percentage: '40%', color: 'bg-warning-600' },
    { title: 'Food', amount: '$1500', percentage: '30%', color: 'bg-success-600' },
    { title: 'Transport', amount: '$1500', percentage: '20%', color: 'bg-success-600' },
    { title: 'Pets', amount: '$1500', percentage: '20%', color: 'bg-cyan-600' },
  ];

  // slider 
  officerList = [
    { name: 'Mr. Bin', img: 'assets/images/home-eleven/officer-img1.png' },
    { name: 'Mr. Robiul', img: 'assets/images/home-eleven/officer-img2.png' },
    { name: 'Mr. Deo', img: 'assets/images/home-eleven/officer-img3.png' },
    { name: 'Mr. Riad', img: 'assets/images/home-eleven/officer-img4.png' },
    { name: 'Mr. Alex', img: 'assets/images/home-eleven/officer-img5.png' },
    { name: 'Mr. John', img: 'assets/images/home-eleven/officer-img2.png' }
  ];


  ngAfterViewInit(): void {
    new Swiper(this.officerSwiper.nativeElement, {
      modules: [Autoplay],
      slidesPerView: 5,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      speed: 800,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 20
        }
      }
    });
  }

  summaryCards = [
    {
      icon: 'assets/images/home-eleven/icons/home-eleven-icon1.svg',
      bgColor: 'bg-cyan-600',
      title: 'Total Period Income',
      amount: '$50,000',
      change: '95%',
      changeIcon: 'ri-arrow-right-up-line',
      changeBg: 'bg-success-focus',
      changeText: 'text-success-main',
      lastMonth: 'Last month $24,000.00',
      gradient: 'gradient-deep-two-1'
    },
    {
      icon: 'assets/images/home-eleven/icons/home-eleven-icon2.svg',
      bgColor: 'bg-warning-600',
      title: 'Total Period Expenses',
      amount: '$35,000',
      change: '95%',
      changeIcon: 'ri-arrow-right-up-line',
      changeBg: 'bg-success-focus',
      changeText: 'text-success-main',
      lastMonth: 'Last month $1,600.00',
      gradient: 'gradient-deep-two-2'
    },
    {
      icon: 'assets/images/home-eleven/icons/home-eleven-icon3.svg',
      bgColor: 'bg-lilac-600',
      title: 'Net Profit',
      amount: '$50,000',
      change: '70%',
      changeIcon: 'ri-arrow-right-down-line',
      changeBg: 'bg-danger-focus',
      changeText: 'text-danger-main',
      lastMonth: 'Last month $24,000.00',
      gradient: 'gradient-deep-two-3'
    },
    {
      icon: 'assets/images/home-eleven/icons/home-eleven-icon4.svg',
      bgColor: 'bg-success-600',
      title: 'Total Saving',
      amount: '$50,000',
      change: '95%',
      changeIcon: 'ri-arrow-right-up-line',
      changeBg: 'bg-success-focus',
      changeText: 'text-success-main',
      lastMonth: 'Last month $2,500.00',
      gradient: 'gradient-deep-two-4'
    }
  ];

  paymentHistory = [
    {
      name: 'Dianne Russell',
      email: 'osgoodwy@gmail.com',
      transactionId: '9562415412263',
      amount: '$29.00',
      method: 'Bank',
      date: '24 Jun 2024',
      status: 'Active',
      image: 'assets/images/users/user1.png'
    },
    {
      name: 'Wade Warren',
      email: 'redanielgmail.com',
      transactionId: '9562415412263',
      amount: '$29.00',
      method: 'Bank',
      date: '24 Jun 2024',
      status: 'Active',
      image: 'assets/images/users/user2.png'
    },
    {
      name: 'Albert Flores',
      email: 'seemagmail.com',
      transactionId: '9562415412263',
      amount: '$29.00',
      method: 'Bank',
      date: '24 Jun 2024',
      status: 'Active',
      image: 'assets/images/users/user3.png'
    },
    {
      name: 'Bessie Cooper',
      email: 'hamligmail.com',
      transactionId: '9562415412263',
      amount: '$29.00',
      method: 'Bank',
      date: '24 Jun 2024',
      status: 'Active',
      image: 'assets/images/users/user4.png'
    },
    {
      name: 'Arlene McCoy',
      email: 'zitkamail.ru',
      transactionId: '9562415412263',
      amount: '$29.00',
      method: 'Bank',
      date: '24 Jun 2024',
      status: 'Active',
      image: 'assets/images/users/user5.png'
    }
  ];
}
