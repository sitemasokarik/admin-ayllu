import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from '../world-map/world-map.component';

@Component({
  selector: 'app-home-5',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbComponent, CommonModule, WorldMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-5.component.html',
  styleUrl: './home-5.component.css'
})
export class Home5Component implements AfterViewInit {

  title = 'Home 5';

  upDownBarchart;
  semiCircleGauge;
  areaChart;
  dailyIconBarChart;
  statisticsDonutChart;
  transactionLineChart;


  constructor() {
    this.upDownBarchart = {
      series: [
        {
          name: "Income",
          data: [44, 42, 57, 86, 58, 55, 70, 44, 42, 57, 86, 58, 55, 70],
        },
        {
          name: "Expenses",
          data: [-34, -22, -37, -56, -21, -35, -60, -34, -22, -37, -56, -21, -35, -60],
        },
      ],
      chart: {
        stacked: true,
        type: "bar",
        height: 263,
        fontFamily: "Poppins, sans-serif",
        toolbar: {
          show: false,
        },
      },
      colors: ["#487FFF", "#EF4A00"],
      plotOptions: {
        bar: {
          columnWidth: "8",
          borderRadius: [2],
          borderRadiusWhenStacked: "all",
        },
      },
      stroke: {
        width: [5, 5]
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: "top",
      },
      yaxis: {
        show: false,
        title: {
          text: undefined,
        },
        labels: {
          formatter: function (y) {
            return y.toFixed(0) + "";
          },
        },
      },
      xaxis: {
        show: false,
        categories: [
          "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
          "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          style: {
            colors: "#d4d7d9",
            fontSize: "10px",
            fontWeight: 500,
          },
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        theme: "dark",
        x: {
          show: false,
        },
      },
    };

    this.semiCircleGauge = {
      series: [75],
      chart: {
        width: 200,
        type: 'radialBar',
        sparkline: {
          enabled: true // Remove whitespace
        },
        toolbar: {
          show: false
        },
      },
      plotOptions: {
        radialBar: {
          offsetY: -24,
          offsetX: -14,
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#E3E6E9",
            // strokeWidth: 32,
            dropShadow: {
              enabled: false,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            show: false,
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        colors: ['#9DBAFF'],
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#487FFF'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round',
      },
      labels: ['Percent'],
    };

    this.areaChart = this.createChart('#FF9F29');
    this.dailyIconBarChart = {
      series: [{
        name: "Sales",
        data: [{
          x: 'Mon',
          y: 20,
        }, {
          x: 'Tue',
          y: 40,
        }, {
          x: 'Wed',
          y: 20,
        }, {
          x: 'Thur',
          y: 30,
        }, {
          x: 'Fri',
          y: 40,
        }, {
          x: 'Sat',
          y: 35,
        }]
      }],
      chart: {
        type: 'bar',
        width: 164,
        height: 80,
        sparkline: {
          enabled: true // Remove whitespace
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: false,
          columnWidth: 14,
        }
      },
      dataLabels: {
        enabled: false
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        }
      },
      fill: {
        type: 'gradient',
        colors: ['#E3E6E9'], // Set the starting color (top color) here
        gradient: {
          shade: 'light', // Gradient shading type
          type: 'vertical',  // Gradient direction (vertical)
          shadeIntensity: 0.5, // Intensity of the gradient shading
          gradientToColors: ['#E3E6E9'], // Bottom gradient color (with transparency)
          inverseColors: false, // Do not invert colors
          opacityFrom: 1, // Starting opacity
          opacityTo: 1,  // Ending opacity
          stops: [0, 100],
        },
      },
      grid: {
        show: false,
        borderColor: '#D1D5DB',
        strokeDashArray: 1, // Use a number for dashed style
        position: 'back',
      },
      xaxis: {
        labels: {
          show: false // Hide y-axis labels
        },
        type: 'category',
        categories: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
      },
      yaxis: {
        labels: {
          show: false,
          formatter: function (value) {
            return (value / 1000).toFixed(0) + 'k';
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return value / 1000 + 'k';
          }
        }
      }
    };
    this.statisticsDonutChart = {
      series: [70, 30],
      colors: ['#FF9F29', '#487FFF'],
      labels: ['Female', 'Male'],
      legend: {
        show: false
      },
      chart: {
        type: 'donut',
        height: 230,
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
      }
    };

    this.transactionLineChart = {
      series: [{
        name: "This month",
        data: [4, 16, 12, 28, 22, 38, 23]
      }],
      chart: {
        height: 290,
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: true,
          top: 6,
          left: 0,
          blur: 4,
          color: "#000",
          opacity: 0.1,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 0,
        strokeWidth: 3,
        hover: {
          size: 8
        }
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
        }
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        borderColor: '#D1D5DB',
        strokeDashArray: 3,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "$" + value + "k";
          },
          style: {
            fontSize: "14px"
          }
        },
      },
      xaxis: {
        categories: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
        tooltip: {
          enabled: false
        },
        labels: {
          formatter: function (value) {
            return value;
          },
          style: {
            fontSize: "14px"
          }
        },
        axisBorder: {
          show: false
        },
        crosshairs: {
          show: true,
          width: 20,
          stroke: {
            width: 0
          },
          fill: {
            type: 'solid',
            color: '#B1B9C4',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          }
        }
      }
    };
  }


  ngAfterViewInit(): void {
  }

  createChart(chartColor) {

    let currentYear = new Date().getFullYear();

    return {
      series: [
        {
          name: 'series1',
          data: [0, 10, 8, 25, 15, 26, 13, 35, 15, 39, 16, 46, 42],
        },
      ],
      chart: {
        type: 'area',
        width: 164,
        height: 72,

        sparkline: {
          enabled: true // Remove whitespace
        },

        toolbar: {
          show: false
        },
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [chartColor],
        lineCap: 'round'
      },
      grid: {
        show: true,
        borderColor: 'transparent',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        row: {
          colors: undefined,
          opacity: 0.5
        },
        column: {
          colors: undefined,
          opacity: 0.5
        },
        padding: {
          top: -3,
          right: 0,
          bottom: 0,
          left: 0
        },
      },
      fill: {
        type: 'gradient',
        colors: [chartColor], // Set the starting color (top color) here
        gradient: {
          shade: 'light', // Gradient shading type
          type: 'vertical',  // Gradient direction (vertical)
          shadeIntensity: 0.5, // Intensity of the gradient shading
          gradientToColors: [`${chartColor}00`], // Bottom gradient color (with transparency)
          inverseColors: false, // Do not invert colors
          opacityFrom: .8, // Starting opacity
          opacityTo: 0.3,  // Ending opacity
          stops: [0, 100],
        },
      },
      // Customize the circle marker color on hover
      markers: {
        colors: [chartColor],
        strokeWidth: 2,
        size: 0,
        hover: {
          size: 8
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        categories: [`Jan ${currentYear}`, `Feb ${currentYear}`, `Mar ${currentYear}`, `Apr ${currentYear}`, `May ${currentYear}`, `Jun ${currentYear}`, `Jul ${currentYear}`, `Aug ${currentYear}`, `Sep ${currentYear}`, `Oct ${currentYear}`, `Nov ${currentYear}`, `Dec ${currentYear}`],
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    };
  }
  widgets = [
    {
      title: 'New Users',
      value: '5000',
      increase: '+200',
      increaseClass: 'bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm',
      description: 'Increase by',
      icon: 'flowbite:users-group-solid',
      iconBgClass: 'bg-primary-600',
      iconWrapperClass: 'w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20',
      cardBgClass: 'bg-gradient-start-3',
    },
    {
      title: 'Total Deposit',
      value: '15,000',
      increase: '-200',
      increaseClass: 'bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm',
      description: 'Increase by',
      icon: 'solar:wallet-bold',
      iconBgClass: 'bg-purple',
      iconWrapperClass: 'w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20',
      cardBgClass: 'bg-gradient-start-2',
    },
    {
      title: 'Total Expense',
      value: '15,000',
      increase: '+200',
      increaseClass: 'bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm',
      description: 'Increase by',
      icon: 'fa6-solid:file-invoice-dollar',
      iconBgClass: 'bg-red',
      iconWrapperClass: 'w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20',
      cardBgClass: 'bg-gradient-start-5',
    },
    {
      title: 'Total Earning',
      value: '15,000',
      increase: '+200',
      increaseClass: 'bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm',
      description: 'Increase by',
      icon: 'streamline:bag-dollar-solid',
      iconBgClass: 'bg-success-main',
      iconWrapperClass: 'w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20',
      cardBgClass: 'bg-gradient-start-4',
    },
  ];
  investments = [
    {
      assetName: 'Gold',
      assetType: 'Main Asset',
      quantity: '7500',
      quantityUnit: 'Ounces',
      price: '$7,500.00',
      date: '25 May 2024',
      status: 'Completed',
      statusClass: 'bg-success-focus text-success-main px-16 py-4 radius-8 fw-medium text-sm',
      imgSrc: 'assets/images/asset/asset-img1.png',
    },
    {
      assetName: 'Dollars',
      assetType: 'Currency',
      quantity: '5,40,000',
      quantityUnit: 'Dollars',
      price: '$5,40,000.00',
      date: '25 May 2024',
      status: 'In Progress',
      statusClass: 'bg-warning-focus text-warning-main px-16 py-4 radius-8 fw-medium text-sm',
      imgSrc: 'assets/images/asset/asset-img2.png',
    },
    {
      assetName: 'Stock Market',
      assetType: 'Product',
      quantity: '1500',
      quantityUnit: 'Products',
      price: '$50,000.00',
      date: '25 May 2024',
      status: 'Completed',
      statusClass: 'bg-success-focus text-success-main px-16 py-4 radius-8 fw-medium text-sm',
      imgSrc: 'assets/images/asset/asset-img3.png',
    },
    {
      assetName: 'Dimond',
      assetType: 'Asset',
      quantity: '350',
      quantityUnit: 'Ounces',
      price: '$30,000.00',
      date: '25 May 2024',
      status: 'In Progress',
      statusClass: 'bg-warning-focus text-warning-main px-16 py-4 radius-8 fw-medium text-sm',
      imgSrc: 'assets/images/asset/asset-img4.png',
    },
    {
      assetName: 'S&P 500',
      assetType: 'Index',
      quantity: '24,000',
      quantityUnit: 'Shares',
      price: '$63,000.00',
      date: '25 May 2024',
      status: 'Completed',
      statusClass: 'bg-success-focus text-success-main px-16 py-4 radius-8 fw-medium text-sm',
      imgSrc: 'assets/images/asset/asset-img5.png',
    },
  ];
  notices = [
    {
      name: 'Admin',
      imgSrc: 'assets/images/notice/board-img1.png',
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy.',
      date: '25 Jan 2024',
    },
    {
      name: 'Kathryn Murphy',
      imgSrc: 'assets/images/notice/board-img2.png',
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '25 Jan 2024',
    },
    {
      name: 'Cameron Williamson',
      imgSrc: 'assets/images/notice/board-img3.png',
      message: 'Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '25 Jan 2024',
    },
  ];
  projectStatus = [
    { name: 'Gold', duration: '2 Months', progress: 30, progressBarClass: 'bg-red' },
    { name: 'Dollars', duration: '3 Months', progress: 50, progressBarClass: 'bg-warning-main' },
    { name: 'Stock Market', duration: '1 Months', progress: 60, progressBarClass: 'bg-info-main' },
    { name: 'Dimond', duration: '5 Months', progress: 80, progressBarClass: 'bg-success-main' },
    { name: 'S&P 500', duration: '4 Months', progress: 70, progressBarClass: 'bg-red' },
  ];

}
