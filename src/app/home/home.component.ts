import { AfterViewInit } from '@angular/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from '../world-map/world-map.component';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NgApexchartsModule, BreadcrumbComponent, CommonModule, WorldMapComponent]
})
export class HomeComponent implements AfterViewInit {
  title = 'Home';

  @ViewChild("chart") chart: ChartComponent;
  chartOptions;
  barChartOptions;
  donutChartOptions;
  paymentStatusChartOptions;
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'This month',
          data: [10, 20, 12, 30, 14, 35, 16, 32, 14, 25, 13, 28],
        },
      ],
      chart: {
        height: 264,
        type: 'line',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        dropShadow: {
          enabled: true,
          top: 6,
          left: 0,
          blur: 4,
          color: '#000',
          opacity: 0.1,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        colors: ['#487FFF'],
        width: 3,
      },
      markers: {
        size: 0,
        strokeWidth: 3,
        hover: {
          size: 8,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
        },
        y: {
          show: false,
        },
        z: {
          show: false,
        },
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.5,
        },
        borderColor: '#D1D5DB',
        strokeDashArray: 3,
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return '$' + value + 'k';
          },
          style: {
            fontSize: '14px',
          },
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        tooltip: {
          enabled: false,
        },
        labels: {
          formatter: function (value: string) {
            return value;
          },
          style: {
            fontSize: '14px',
          },
        },
        axisBorder: {
          show: false,
        },
        crosshairs: {
          show: true,
          width: 20,
          stroke: {
            width: 0,
          },
          fill: {
            type: 'solid',
            color: '#487FFF40',
          },
        },
      },
    };

    // bar chart 
    this.barChartOptions = {
      series: [{
        name: "Sales",
        data: [{
          x: 'Sun',
          y: 15,
        }, {
          x: 'Mon',
          y: 12,
        }, {
          x: 'Tue',
          y: 18,
        }, {
          x: 'Wed',
          y: 20,
        }, {
          x: 'Thu',
          y: 13,
        }, {
          x: 'Fri',
          y: 16,
        }, {
          x: 'Sat',
          y: 6,
        }]
      }],

      chart: {
        type: 'bar',
        height: 235,
        toolbar: {
          show: false
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: false,
          columnWidth: '52%',
          endingShape: 'rounded',
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'gradient',
        colors: ['#dae5ff'], // Set the starting color (top color) here
        gradient: {
          shade: 'light', // Gradient shading type
          type: 'vertical',  // Gradient direction (vertical)
          shadeIntensity: 0.5, // Intensity of the gradient shading
          gradientToColors: ['#dae5ff'], // Bottom gradient color (with transparency)
          inverseColors: false, // Do not invert colors
          opacityFrom: 1, // Starting opacity
          opacityTo: 1,  // Ending opacity
          stops: [0, 100],
        },
      },
      grid: {
        show: false,
        borderColor: '#D1D5DB',
        strokeDashArray: 4, // Use a number for dashed style
        position: 'back',
        padding: {
          top: -10,
          right: -10,
          bottom: -10,
          left: -10
        }
      },
      xaxis: {
        type: 'category',
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      yaxis: {
        show: false,
      },
    };

    this.donutChartOptions = {
      series: [500, 500, 500],
      colors: ['#FF9F29', '#487FFF', '#E4F1FF'],
      labels: ['Active', 'New', 'Total'],
      legend: {
        show: false
      },
      chart: {
        type: 'donut',
        height: 270,
        sparkline: {
          enabled: true // Remove whitespace
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      stroke: {
        width: 0,
      },
      dataLabels: {
        enabled: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        custom: ({ seriesIndex, series, dataPointIndex, w }) => {
          const donutColor = w.globals.colors[seriesIndex];
          const label = w.config.labels[seriesIndex];
          return `
              <div style="font-size: 12px; padding:5px 10px; background-color: ${donutColor}; color: white; ">
                ${label}: ${series[seriesIndex]} 
              </div>
            `;
        }
      },
    };
    this.paymentStatusChartOptions = {
      series: [{
        name: 'Net Profit',
        data: [20000, 16000, 14000, 25000, 45000, 18000, 28000, 11000, 26000, 48000, 18000, 22000]
      }, {
        name: 'Revenue',
        data: [15000, 18000, 19000, 20000, 35000, 20000, 18000, 13000, 18000, 38000, 14000, 16000]
      }],
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
        },
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 4, // Use a number for dashed style
        position: 'back',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: 10,
        },
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yaxis: {
        categories: ['0', '5000', '10,000', '20,000', '30,000', '50,000', '60,000', '60,000', '70,000', '80,000', '90,000', '100,000'],
      },
      fill: {
        opacity: 1,
        width: 18,
      },
    };


  }
  ngAfterViewInit(): void {

  }

  users = [
    {
      name: 'Dianne Russell',
      email: 'redaniel@gmail.com',
      image: 'assets/images/users/user1.png',
      registered: '27 Mar 2024',
      plan: 'Free',
      status: 'Active'
    },
    {
      name: 'Wade Warren',
      email: 'xterris@gmail.com',
      image: 'assets/images/users/user2.png',
      registered: '27 Mar 2024',
      plan: 'Basic',
      status: 'Active'
    },
    {
      name: 'Albert Flores',
      email: 'seannand@mail.ru',
      image: 'assets/images/users/user3.png',
      registered: '27 Mar 2024',
      plan: 'Standard',
      status: 'Active'
    },
    {
      name: 'Bessie Cooper',
      email: 'igerrin@gmail.com',
      image: 'assets/images/users/user4.png',
      registered: '27 Mar 2024',
      plan: 'Business',
      status: 'Active'
    },
    {
      name: 'Arlene McCoy',
      email: 'fellora@mail.ru',
      image: 'assets/images/users/user5.png',
      registered: '27 Mar 2024',
      plan: 'Enterprise',
      status: 'Active'
    }
  ];
  agents = [
    {
      name: 'Dianne Russell',
      agentId: 36254,
      image: 'assets/images/users/user1.png',
      payment: 20,
    },
    {
      name: 'Wade Warren',
      agentId: 36254,
      image: 'assets/images/users/user2.png',
      payment: 20,
    },
    {
      name: 'Albert Flores',
      agentId: 36254,
      image: 'assets/images/users/user3.png',
      payment: 30,
    },
    {
      name: 'Bessie Cooper',
      agentId: 36254,
      image: 'assets/images/users/user4.png',
      payment: 40,
    },
    {
      name: 'Arlene McCoy',
      agentId: 36254,
      image: 'assets/images/users/user5.png',
      payment: 10,
    },
    {
      name: 'Arlene McCoy',
      agentId: 36254,
      image: 'assets/images/users/user1.png',
      payment: 10,
    },
  ];

  summaryCards = [
    {
      title: 'Total Users',
      value: '20,000',
      delta: '+5000',
      deltaClass: 'text-success-main',
      icon: 'gridicons:multiple-users',
      iconBg: 'bg-cyan',
      bgClass: 'bg-gradient-start-1',
      subtitle: 'Last 30 days users',
      arrowIcon: 'bxs:up-arrow',
    },
    {
      title: 'Total Subscription',
      value: '15,000',
      delta: '-800',
      deltaClass: 'text-danger-main',
      icon: 'fa-solid:award',
      iconBg: 'bg-purple',
      bgClass: 'bg-gradient-start-2',
      subtitle: 'Last 30 days subscription',
      arrowIcon: 'bxs:down-arrow',
    },
    {
      title: 'Total Free Users',
      value: '5,000',
      delta: '+200',
      deltaClass: 'text-success-main',
      icon: 'fluent:people-20-filled',
      iconBg: 'bg-info',
      bgClass: 'bg-gradient-start-3',
      subtitle: 'Last 30 days users',
      arrowIcon: 'bxs:up-arrow',
    },
    {
      title: 'Total Income',
      value: '$42,000',
      delta: '+$20,000',
      deltaClass: 'text-success-main',
      icon: 'solar:wallet-bold',
      iconBg: 'bg-success-main',
      bgClass: 'bg-gradient-start-4',
      subtitle: 'Last 30 days income',
      arrowIcon: 'bxs:up-arrow',
    },
    {
      title: 'Total Expense',
      value: '$30,000',
      delta: '+$5,000',
      deltaClass: 'text-success-main',
      icon: 'fa6-solid:file-invoice-dollar',
      iconBg: 'bg-red',
      bgClass: 'bg-gradient-start-5',
      subtitle: 'Last 30 days expense',
      arrowIcon: 'bxs:up-arrow',
    },
  ];
}
