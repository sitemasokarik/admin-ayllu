import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-home-15',
  imports: [BreadcrumbComponent, CommonModule, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-15.component.html',
  styleUrl: './home-15.component.css'
})
export class Home15Component {
  averageEarningChart;
  projectAnalysisChart;
  taskOverviewChart;
  constructor() {
    this.createChart('#487FFF', '#FF9F29');
    this.projectAnalysisChart = {
      series: [
        {
          name: 'Net Profit',
          data: [44, 100, 40, 56, 30, 58, 50]
        },
        {
          name: 'Revenue',
          data: [90, 140, 80, 125, 70, 140, 110]
        },
        {
          name: 'Free Cash',
          data: [60, 120, 60, 90, 50, 95, 90]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      colors: ['#45B369', '#FF9F29', '#9935FE'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '8%'
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 4,
        position: 'back'
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return value.toLocaleString();
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        show: false
      }
    };
    this.taskOverviewChart = {
      series: [40, 87, 87, 30],
      chart: {
        type: 'donut',
        height: 270,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#dc3545', '#ff9f29', '#8252e9', '#144bd6'],
      labels: ['Health', 'Business', 'Lifestyle', 'Entertainment'],
      stroke: {
        width: 2
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
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
  createChart(color1: string, color2: string): void {
    this.averageEarningChart = {
      series: [
        {
          name: 'Income',
          data: [48, 35, 55, 32, 48, 30, 55, 50, 57]
        },
        {
          name: 'Expense',
          data: [12, 20, 15, 26, 22, 60, 40, 48, 25]
        }
      ],
      chart: {
        type: 'line',
        height: 270,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: [color1, color2],
        lineCap: 'round'
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 1,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: -20,
          bottom: -10
        }
      },
      markers: {
        colors: [color1, color2],
        strokeWidth: 3,
        size: 0,
        hover: {
          size: 10
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          style: {
            fontSize: '14px'
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return "$" + value + "k";
          },
          style: {
            fontSize: '14px'
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      },
      legend: {
        show: false
      },
      colors: [color1, color2]
    };
  }

  dashboardItems = [
    {
      title: 'Total Projects',
      value: 320,
      icon: 'ri-file-text-fill',
      bgColor: 'bg-danger-600',
      blurClass: 'blur-gradient blur-gradient-1'
    },
    {
      title: 'Total Clients',
      value: 547,
      icon: 'ri-user-2-fill',
      bgColor: 'bg-success-600',
      blurClass: 'blur-gradient blur-gradient-2'
    },
    {
      title: 'Team Members',
      value: 356,
      icon: 'ri-group-fill',
      bgColor: 'bg-warning-600',
      blurClass: 'blur-gradient blur-gradient-3'
    },
    {
      title: 'Finished Projects',
      value: 435,
      icon: 'ri-file-list-3-fill',
      bgColor: 'bg-info-600',
      blurClass: 'blur-gradient blur-gradient-4'
    }
  ];
  users = [
    {
      name: 'Kristin Watson',
      email: 'ulfaha@mail.ru',
      task: 15,
      progress: 80,
      image: 'assets/images/user-grid/user-grid-img5.png',
      progressBarClass: 'bg-purple'
    },
    {
      name: 'Theresa Webb',
      email: 'joie@gmail.com',
      task: 20,
      progress: 50,
      image: 'assets/images/user-grid/user-grid-img4.png',
      progressBarClass: 'bg-warning-main'
    },
    {
      name: 'Brooklyn Simmons',
      email: 'warn@mail.ru',
      task: 24,
      progress: 60,
      image: 'assets/images/user-grid/user-grid-img3.png',
      progressBarClass: 'bg-info-main'
    },
    {
      name: 'Robert Fox',
      email: 'fellora@mail.ru',
      task: 26,
      progress: 92,
      image: 'assets/images/user-grid/user-grid-img2.png',
      progressBarClass: 'bg-success-main'
    },
    {
      name: 'Jane Cooper',
      email: 'zitka@mail.ru',
      task: 25,
      progress: 25,
      image: 'assets/images/user-grid/user-grid-img1.png',
      progressBarClass: 'bg-red'
    }
  ];
  projects = [
    {
      name: 'Web Development',
      deadline: '10 Jan 2025',
      status: 'Pending',
      statusClass: 'bg-warning-focus text-warning-main'
    },
    {
      name: 'UX/UI Design',
      deadline: '10 Jan 2025',
      status: 'Completed',
      statusClass: 'bg-success-focus text-success-main'
    },
    {
      name: 'React Development',
      deadline: '10 Jan 2025',
      status: 'InProgress',
      statusClass: 'bg-purple-light text-purple'
    },
    {
      name: 'Django Development',
      deadline: '10 Jan 2025',
      status: 'Pending',
      statusClass: 'bg-warning-focus text-warning-main'
    },
    {
      name: 'Web Development',
      deadline: '10 Jan 2025',
      status: 'Cancelled',
      statusClass: 'bg-danger-focus text-danger-main'
    },
    {
      name: 'Web Design',
      deadline: '10 Jan 2025',
      status: 'InProgress',
      statusClass: 'bg-purple-light text-purple'
    }
  ];
  projectsStatus = [
    {
      name: 'UX/UI Design',
      client: 'Robert Fox',
      budget: '$24,000',
      duration: '24 Days',
      progress: 95,
      trend: 'up',
      status: 'Pending'
    },
    {
      name: 'HTML Developer',
      client: 'Leslie Alexander',
      budget: '$32,700',
      duration: '16 Days',
      progress: 95,
      trend: 'down',
      status: 'Completed'
    },
    {
      name: 'React Development',
      client: 'Devon Lane',
      budget: '$7,250',
      duration: '7 Days',
      progress: 95,
      trend: 'up',
      status: 'InProgress'
    },
    {
      name: 'Python Research',
      client: 'Savannah Nguyen',
      budget: '$24,500',
      duration: '3 Days',
      progress: 95,
      trend: 'up',
      status: 'Pending'
    },
    {
      name: 'Laravel Project',
      client: 'Esther Howard',
      budget: '$30,000',
      duration: '5 Days',
      progress: 95,
      trend: 'up',
      status: 'Cancelled'
    }
  ];

  getStatusClasses(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning-focus text-warning-main';
      case 'Completed': return 'bg-success-focus text-success-main';
      case 'InProgress': return 'bg-purple-light text-purple';
      case 'Cancelled': return 'bg-danger-focus text-danger-main';
      default: return '';
    }
  }

  getTrendIcon(trend: string): string {
    return trend === 'up' ? 'ri-arrow-right-up-line' : 'ri-arrow-left-down-line';
  }

  getTrendClass(trend: string): string {
    return trend === 'up' ? 'bg-success-focus text-success-main' : 'bg-danger-focus text-danger-main';
  }
}
