import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from '../world-map/world-map.component';

@Component({
  selector: 'app-home-9',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbComponent, CommonModule, WorldMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-9.component.html',
  styleUrl: './home-9.component.css'
})
export class Home9Component implements AfterViewInit {
  title = 'Analytics';
  userOverviewDonutChart;
  revenueChart;
  barChart;
  constructor() {

    this.revenueChart = this.createChartTwo('#CD20F9', '#6593FF');

    this.barChart = {
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
        height: 400,
        toolbar: {
          show: false
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: false,
          columnWidth: 24,
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
        categories: ['2hr', '4hr', '6hr', '8hr', '10hr', '12hr', '14hr']
      },
      yaxis: {
        show: false,
      },
    };

    this.userOverviewDonutChart = {
      series: [500, 500, 500],
      colors: ['#FF9F29', '#487FFF', '#45B369'],
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
      }
    };

  }
  ngAfterViewInit(): void {
  }

  createChartTwo(color1, color2) {
    return {
      series: [{
        name: 'series1',
        data: [6, 20, 15, 48, 28, 55, 28, 52, 25, 32, 15, 25]
      }, {
        name: 'series2',
        data: [0, 8, 4, 36, 16, 42, 16, 40, 12, 24, 4, 12]
      }],
      legend: {
        show: false
      },
      chart: {
        type: 'area',
        width: '100%',
        height: 150,
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
        width: 3,
        colors: [color1, color2], // Use two colors for the lines
        lineCap: 'round'
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 1,
        position: 'back',
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
        row: {
          colors: undefined,
          opacity: 0.5
        },
        column: {
          colors: undefined,
          opacity: 0.5
        },
        padding: {
          top: -20,
          right: 0,
          bottom: -10,
          left: 0
        },
      },
      fill: {
        type: 'gradient',
        colors: [color1, color2], // Use two colors for the gradient
        // gradient: {
        //     shade: 'light',
        //     type: 'vertical',
        //     shadeIntensity: 0.5,
        //     gradientToColors: [`${color1}`, `${color2}00`], // Bottom gradient colors with transparency
        //     inverseColors: false,
        //     opacityFrom: .6,
        //     opacityTo: 0.3,
        //     stops: [0, 100],
        // },
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [undefined, `${color2}00`], // Apply transparency to both colors
          inverseColors: false,
          opacityFrom: [0.4, 0.6], // Starting opacity for both colors
          opacityTo: [0.3, 0.3], // Ending opacity for both colors
          stops: [0, 100],
        },
      },
      // markers: {
      //     colors: [color1, color2], // Use two colors for the markers
      //     strokeWidth: 3,
      //     size: 0,
      //     hover: {
      //         size: 10
      //     }
      // },

      markers: {
        colors: [color1, color2],
        strokeWidth: 2,
        size: 0,
        hover: {
          size: 8
        }
      },

      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        }
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
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    };
  }
  stats = [
    {
      title: 'Total Sales',
      value: '$170,500.09',
      iconClass: 'ri-price-tag-3-fill',
      bgClass: 'bg-purple-light',
      iconBgClass: 'bg-lilac-200 border border-lilac-400 text-lilac-600',
    },
    {
      title: 'Total Orders',
      value: '1,500',
      iconClass: 'ri-shopping-cart-2-fill',
      bgClass: 'bg-success-100',
      iconBgClass: 'bg-success-200 border border-success-400 text-success-600',
    },
    {
      title: 'Visitor',
      value: '12,300',
      iconClass: 'ri-group-3-fill',
      bgClass: 'bg-info-focus',
      iconBgClass: 'bg-info-200 border border-info-400 text-info-600',
    },
    {
      title: 'Refunded',
      value: '2756',
      iconClass: 'ri-refund-2-line',
      bgClass: 'bg-danger-100',
      iconBgClass: 'bg-danger-200 border border-danger-400 text-danger-600',
    },
  ];
  payments = [
    {
      title: 'Wallet',
      subtitle: 'Payment',
      amount: '+$6200',
      iconSrc: 'assets/images/home-nine/payment1.png',
      bgClass: 'bg-success-200',
    },
    {
      title: 'PayPal',
      subtitle: 'Payment',
      amount: '+$6200',
      iconSrc: 'assets/images/home-nine/payment2.png',
      bgClass: 'bg-info-200',
    },
    {
      title: 'Credit Card',
      subtitle: 'Bill Payment',
      amount: '-$6200',
      iconSrc: 'assets/images/home-nine/payment3.png',
      bgClass: 'bg-warning-200',
    },
    {
      title: 'Bank',
      subtitle: 'Bill Payment',
      amount: '+$6200',
      iconSrc: 'assets/images/home-nine/payment4.png',
      bgClass: 'bg-lilac-200',
    },
  ];
  socialStats = [
    {
      title: 'Email',
      value: '6,200',
      percent: '0.3%',
      percentClass: 'text-success-600',
      iconSrc: 'assets/images/home-nine/socials1.png',
      bgClass: 'bg-lilac-100',
    },
    {
      title: 'Clicked',
      value: 'Clicked',
      percent: '1.3%',
      percentClass: 'text-danger-600',
      iconSrc: 'assets/images/home-nine/socials2.png',
      bgClass: 'bg-warning-100',
    },
    {
      title: 'Subscribe',
      value: '5,175',
      percent: '0.3%',
      percentClass: 'text-success-600',
      iconSrc: 'assets/images/home-nine/socials3.png',
      bgClass: 'bg-info-100',
    },
    {
      title: 'Complaints',
      value: '3,780',
      percent: '0.3%',
      percentClass: 'text-success-600',
      iconSrc: 'assets/images/home-nine/socials4.png',
      bgClass: 'bg-success-100',
    },
    {
      title: 'Unsubscribe',
      value: '4,120',
      percent: '0.3%',
      percentClass: 'text-success-600',
      iconSrc: 'assets/images/home-nine/socials5.png',
      bgClass: 'bg-danger-100',
    },
    {
      title: 'Subscribe',
      value: '5,175',
      percent: '0.3%',
      percentClass: 'text-success-600',
      iconSrc: 'assets/images/home-nine/socials3.png',
      bgClass: 'bg-info-100',
    },
  ];

  customers = [
    {
      name: 'Kristin Watson',
      email: 'ulfaha@mail.ru',
      img: 'assets/images/user-grid/user-grid-img1.png',
      id: '#63254',
      retained: '5 min ago',
      amount: '$12,408.12',
      status: 'Member',
      statusClasses: 'bg-success-focus text-success-main',
    },
    {
      name: 'Theresa Webb',
      email: 'joie@gmail.com',
      img: 'assets/images/user-grid/user-grid-img2.png',
      id: '#63254',
      retained: '12 min ago',
      amount: '$12,408.12',
      status: 'New Customer',
      statusClasses: 'bg-lilac-100 text-lilac-600',
    },
    {
      name: 'Brooklyn Simmons',
      email: 'warn@mail.ru',
      img: 'assets/images/user-grid/user-grid-img3.png',
      id: '#63254',
      retained: '15 min ago',
      amount: '$12,408.12',
      status: 'Signed Up',
      statusClasses: 'bg-warning-focus text-warning-main',
    },
    {
      name: 'Robert Fox',
      email: 'fellora@mail.ru',
      img: 'assets/images/user-grid/user-grid-img4.png',
      id: '#63254',
      retained: '17 min ago',
      amount: '$12,408.12',
      status: 'Member',
      statusClasses: 'bg-success-focus text-success-main',
    },
    {
      name: 'Jane Cooper',
      email: 'zitka@mail.ru',
      img: 'assets/images/user-grid/user-grid-img5.png',
      id: '#63254',
      retained: '25 min ago',
      amount: '$12,408.12',
      status: 'Signed Up',
      statusClasses: 'bg-warning-focus text-warning-main',
    },
  ];
}
