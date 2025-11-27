import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
} from '@angular/core';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from '../world-map/world-map.component';
@Component({
  selector: 'app-home-2',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-2.component.html',
  styleUrl: './home-2.component.css',
  imports: [NgApexchartsModule, BreadcrumbComponent, CommonModule, WorldMapComponent],
})
export class Home2Component implements AfterViewInit, OnInit {
  title = 'Home 2';

  newUserChart;
  activeUserChart;
  totalSalesChart;
  conversionUserChart;
  leadsChart;
  totalProfitChart;
  revenueChart;
  barChart;
  donutChart;
  paymentStatusChart;
  dashboardCards;
  constructor() {


  }
  ngOnInit(): void {
    this.newUserChart = this.createChart('#487fff');
    this.activeUserChart = this.createChart('#45b369');
    this.totalSalesChart = this.createChart('#f4941e');
    this.conversionUserChart = this.createChart('#8252e9');
    this.leadsChart = this.createChart('#de3ace');
    this.totalProfitChart = this.createChart('#00b8f2');

    this.revenueChart = this.createChartTwo('#487fff');
    this.updateBarChart();
    this.donutChart = {
      series: [500, 500, 500],
      colors: ['#45B369', '#FF9F29', '#487FFF'],
      labels: ['Active', 'New', 'Total'],
      legend: {
        show: false,
      },
      chart: {
        type: 'donut',
        height: 300,
        sparkline: {
          enabled: true, // Remove whitespace
        },
        margin: {
          top: -100,
          right: -100,
          bottom: -100,
          left: -100,
        },
        padding: {
          top: -100,
          right: -100,
          bottom: -100,
          left: -100,
        },
      },
      stroke: {
        width: 0,
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          customScale: 0.8,
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                label: 'Customer Report',
                // formatter: function (w) {
                //     return w.globals.seriesTotals.reduce((a, b) => {
                //         return a + b;
                //     }, 0);
                // }
              },
            },
          },
        },
      },
      tooltip: {
        custom: ({ seriesIndex, series, dataPointIndex, w }) => {
          const donutColor = w.globals.colors[seriesIndex];
          const label = w.config.labels[seriesIndex];
          return `
            <div style="font-size: 12px; padding:5px 10px; background-color: ${donutColor}; color: white; ">
              ${label}: ${series[seriesIndex]}
            </div>
          `;
        },
      },
    };

    this.paymentStatusChart = {
      series: [
        {
          name: 'Net Profit',
          data: [44, 100, 40, 56, 30, 58, 50],
        },
        {
          name: 'Revenue',
          data: [90, 140, 80, 125, 70, 140, 110],
        },
        {
          name: 'Free Cash',
          data: [60, 120, 60, 90, 50, 95, 90],
        },
      ],
      colors: ['#45B369', '#144bd6', '#FF9F29'],
      labels: ['Active', 'New', 'Total'],

      legend: {
        show: false,
      },
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
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
          columnWidth: 8,
        },
      },
      dataLabels: {
        enabled: false,
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
      },
      yaxis: {
        categories: [
          '0',
          '10,000',
          '20,000',
          '30,000',
          '50,000',
          '1,00,000',
          '1,00,000',
        ],
      },
      fill: {
        opacity: 1,
        width: 18,
      },
    };
    this.dashboardCards = [
      {
        title: 'New Users',
        value: '15,000',
        delta: '+200',
        deltaClass: 'bg-success-focus text-success-main',
        icon: 'mingcute:user-follow-fill',
        iconBg: 'bg-primary-600',
        bgClass: 'bg-gradient-end-1',
        chart: this.newUserChart,
      },
      {
        title: 'Active Users',
        value: '8,000',
        delta: '+200',
        deltaClass: 'bg-success-focus text-success-main',
        icon: 'mingcute:user-follow-fill',
        iconBg: 'bg-success-main',
        bgClass: 'bg-gradient-end-2',
        chart: this.activeUserChart,
      },
      {
        title: 'Total Sales',
        value: '$5,00,000',
        delta: '-$10k',
        deltaClass: 'bg-danger-focus text-danger-main',
        icon: 'iconamoon:discount-fill',
        iconBg: 'bg-yellow',
        bgClass: 'bg-gradient-end-3',
        chart: this.totalSalesChart,
      },
      {
        title: 'Conversion',
        value: '25%',
        delta: '+5%',
        deltaClass: 'bg-success-focus text-success-main',
        icon: 'mdi:message-text',
        iconBg: 'bg-purple',
        bgClass: 'bg-gradient-end-4',
        chart: this.conversionUserChart,
      },
      {
        title: 'Leads',
        value: '250',
        delta: '+20',
        deltaClass: 'bg-success-focus text-success-main',
        icon: 'mdi:leads',
        iconBg: 'bg-pink',
        bgClass: 'bg-gradient-end-5',
        chart: this.leadsChart,
      },
      {
        title: 'Total Profit',
        value: '$3,00,700',
        delta: '+$15k',
        deltaClass: 'bg-success-focus text-success-main',
        icon: 'streamline:bag-dollar-solid',
        iconBg: 'bg-cyan',
        bgClass: 'bg-gradient-end-6',
        chart: this.totalProfitChart,
      },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateBarChart();
    this.revenueChart = this.createChartTwo('#487fff');
  }

  updateBarChart() {
    const chartHeight = window.innerWidth >= 1400 ? 440 : 310;

    this.barChart = {
      series: [
        {
          name: 'Sales',
          data: [
            { x: 'Jan', y: 85000 },
            { x: 'Feb', y: 70000 },
            { x: 'Mar', y: 40000 },
            { x: 'Apr', y: 50000 },
            { x: 'May', y: 60000 },
            { x: 'Jun', y: 50000 },
            { x: 'Jul', y: 40000 },
            { x: 'Aug', y: 50000 },
            { x: 'Sep', y: 40000 },
            { x: 'Oct', y: 60000 },
            { x: 'Nov', y: 30000 },
            { x: 'Dec', y: 50000 },
          ],
        },
      ],
      chart: {
        type: 'bar',
        height: chartHeight, // Dynamically set height
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: '23%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
        colors: ['#487FFF'],
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#487FFF'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 4,
        position: 'back',
      },
      xaxis: {
        type: 'category',
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
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return (value / 1000).toFixed(0) + 'k';
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return value / 1000 + 'k';
          },
        },
      },
    };
  }

  createChart(chartColor) {
    let currentYear = new Date().getFullYear();

    return {
      series: [
        {
          name: 'series1',
          data: [35, 45, 38, 41, 36, 43, 37, 55, 40],
        },
      ],
      chart: {
        type: 'area',
        width: 80,
        height: 42,
        sparkline: {
          enabled: true, // Remove whitespace
        },

        toolbar: {
          show: false,
        },
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [chartColor],
        lineCap: 'round',
      },
      grid: {
        show: true,
        borderColor: 'transparent',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        row: {
          colors: undefined,
          opacity: 0.5,
        },
        column: {
          colors: undefined,
          opacity: 0.5,
        },
        padding: {
          top: -3,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      fill: {
        type: 'gradient',
        colors: [chartColor], // Set the starting color (top color) here
        gradient: {
          shade: 'light', // Gradient shading type
          type: 'vertical', // Gradient direction (vertical)
          shadeIntensity: 0.5, // Intensity of the gradient shading
          gradientToColors: [`${chartColor}00`], // Bottom gradient color (with transparency)
          inverseColors: false, // Do not invert colors
          opacityFrom: 0.75, // Starting opacity
          opacityTo: 0.3, // Ending opacity
          stops: [0, 100],
        },
      },
      // Customize the circle marker color on hover
      markers: {
        colors: [chartColor],
        strokeWidth: 2,
        size: 0,
        hover: {
          size: 8,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        categories: [
          `Jan ${currentYear}`,
          `Feb ${currentYear}`,
          `Mar ${currentYear}`,
          `Apr ${currentYear}`,
          `May ${currentYear}`,
          `Jun ${currentYear}`,
          `Jul ${currentYear}`,
          `Aug ${currentYear}`,
          `Sep ${currentYear}`,
          `Oct ${currentYear}`,
          `Nov ${currentYear}`,
          `Dec ${currentYear}`,
        ],
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }
  createChartTwo(chartColor) {
    const chartHeight = window.innerWidth >= 1400 ? 240 : 162;
    return {
      series: [
        {
          name: 'This Day',
          data: [4, 18, 13, 40, 30, 50, 30, 60, 40, 75, 45, 90],
        },
      ],
      chart: {
        type: 'area',
        width: '100%',
        height: chartHeight,
        sparkline: {
          enabled: false, // Remove whitespace
        },
        toolbar: {
          show: false,
        },
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [chartColor],
        lineCap: 'round',
      },
      grid: {
        show: true,
        borderColor: 'red',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        row: {
          colors: undefined,
          opacity: 0.5,
        },
        column: {
          colors: undefined,
          opacity: 0.5,
        },
        padding: {
          top: -30,
          right: 0,
          bottom: -10,
          left: 0,
        },
      },
      fill: {
        type: 'gradient',
        colors: [chartColor], // Set the starting color (top color) here
        gradient: {
          shade: 'light', // Gradient shading type
          type: 'vertical', // Gradient direction (vertical)
          shadeIntensity: 0.5, // Intensity of the gradient shading
          gradientToColors: [`${chartColor}00`], // Bottom gradient color (with transparency)
          inverseColors: false, // Do not invert colors
          opacityFrom: 0.6, // Starting opacity
          opacityTo: 0.3, // Ending opacity
          stops: [0, 100],
        },
      },
      // Customize the circle marker color on hover
      markers: {
        colors: [chartColor],
        strokeWidth: 3,
        size: 0,
        hover: {
          size: 10,
        },
      },
      xaxis: {
        categories: [
          `Jan`,
          `Feb`,
          `Mar`,
          `Apr`,
          `May`,
          `Jun`,
          `Jul`,
          `Aug`,
          `Sep`,
          `Oct`,
          `Nov`,
          `Dec`,
        ],
        tooltip: {
          enabled: false,
        },
        labels: {
          formatter: function (value) {
            return value;
          },
          style: {
            fontSize: '14px',
          },
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }

  ngAfterViewInit(): void {
  }
  tasks = [
    {
      name: 'Hotel Management System',
      id: 5632,
      assignedTo: 'Kathryn Murphy',
      dueDate: new Date('2024-03-27'),
      status: 'Active',
    },
    {
      name: 'Hotel Management System',
      id: 5632,
      assignedTo: 'Darlene Robertson',
      dueDate: new Date('2024-03-27'),
      status: 'Active',
    },
    {
      name: 'Hotel Management System',
      id: 5632,
      assignedTo: 'Courtney Henry',
      dueDate: new Date('2024-03-27'),
      status: 'Active',
    },
    {
      name: 'Hotel Management System',
      id: 5632,
      assignedTo: 'Jenny Wilson',
      dueDate: new Date('2024-03-27'),
      status: 'Active',
    },
    {
      name: 'Hotel Management System',
      id: 5632,
      assignedTo: 'Leslie Alexander',
      dueDate: new Date('2024-03-27'),
      status: 'Active',
    },
  ];
  transactions = [
    { id: '5986124445445', date: new Date('2024-03-27'), status: 'Pending', amount: 20000 },
    { id: '5986124445445', date: new Date('2024-03-27'), status: 'Rejected', amount: 20000 },
    { id: '5986124445445', date: new Date('2024-03-27'), status: 'Completed', amount: 20000 },
    { id: '5986124445445', date: new Date('2024-03-27'), status: 'Completed', amount: 20000 },
    { id: '5986124445445', date: new Date('2024-03-27'), status: 'Completed', amount: 20000 },
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
        return 'bg-neutral-200 text-neutral-800';
    }
  }
  agents = [
    {
      name: 'Dianne Russell',
      id: 36254,
      progress: '60/80',
      image: 'assets/images/users/user1.png',
    },
    {
      name: 'Wade Warren',
      id: 36254,
      progress: '50/70',
      image: 'assets/images/users/user2.png',
    },
    {
      name: 'Albert Flores',
      id: 36254,
      progress: '55/75',
      image: 'assets/images/users/user3.png',
    },
    {
      name: 'Bessie Cooper',
      id: 36254,
      progress: '60/80',
      image: 'assets/images/users/user4.png',
    },
    {
      name: 'Arlene McCoy',
      id: 36254,
      progress: '55/75',
      image: 'assets/images/users/user5.png',
    },
    {
      name: 'Arlene McCoy',
      id: 36254,
      progress: '50/70',
      image: 'assets/images/users/user1.png',
    },
  ];
}
