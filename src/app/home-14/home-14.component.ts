import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { WorldMapComponent } from '../world-map/world-map.component';



@Component({
  selector: 'app-home-14',
  imports: [BreadcrumbComponent, CommonModule, NgApexchartsModule, WorldMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-14.component.html',
  styleUrl: './home-14.component.css'
})
export class Home14Component {
  paymentStatusChart;
  revenueChart;
  userOverviewDonutChart;

  followStates: boolean[] = [];

  @Input() color1: string = '#98B6FF';
  @Input() color2: string = '#6593FF';
  constructor() {
    this.paymentStatusChart = {
      series: [
        {
          name: 'Net Profit',
          data: [44, 100, 40, 56, 30, 58, 50, 44, 100, 40, 56, 30]
        },
        {
          name: 'Revenue',
          data: [90, 140, 80, 125, 70, 140, 110, 90, 140, 80, 125, 70]
        },
        {
          name: 'Free Cash',
          data: [60, 120, 60, 90, 50, 95, 90, 60, 120, 60, 90, 50]
        }
      ],
      colors: ['#E4F1FF', '#E4F1FF', '#E4F1FF'],
      labels: ['Active', 'New', 'Total'],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 2,
          columnWidth: '70%',
          borderRadiusApplication: 'end'
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
      stroke: {
        show: true,
        width: 4,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return "$" + value + "k";
          },
          style: {
            fontSize: "14px"
          }
        }
      },
      fill: {
        opacity: 1
      },
      grid: {
        show: true,
        borderColor: '#00000000',
        strokeDashArray: 4,
        position: 'back',
      },
      legend: {
        show: false
      }
    };
    this.revenueChart = {
      series: [
        {
          name: 'series1',
          data: [6, 20, 15, 48, 28, 55, 28, 52, 25, 32, 15, 25],
        },
      ],
      chart: {
        type: 'area',
        height: 200,
        width: '100%',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 0,
        colors: [this.color1, this.color2],
        lineCap: 'round',
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 1,
        position: 'back',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: -20,
          right: 0,
          bottom: -10,
          left: 0,
        },
      },
      colors: [this.color1, this.color2],
      fill: {
        type: 'gradient',
        colors: [this.color1, this.color2],
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [undefined, `${this.color2}00`],
          inverseColors: false,
          opacityFrom: [1, 0.6],
          opacityTo: [0.5, 0.4],
          stops: [0, 100],
        },
      },
      markers: {
        colors: [this.color1, this.color2],
        strokeWidth: 2,
        size: 0,
        hover: {
          size: 8,
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
          show: false,
          formatter: (value: any) => value,
          style: {
            fontSize: '14px',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return '$' + value + 'k';
          },
          style: {
            fontSize: '14px',
          },
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
      legend: {
        show: false,
      },
    };
    this.userOverviewDonutChart = {
      series: [40, 87, 87, 30, 50],
      colors: ['#FF9F29', '#487FFF', '#EF4A00', '#9935FE', '#45B369'],
      labels: ['Health', 'Business', 'Lifestyle', 'Entertainment', 'UI/UX Design'],
      legend: {
        show: false
      },
      chart: {
        type: 'donut',
        height: 270,
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        width: 0
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
      }]
    };

    this.followStates = [false, false];
  }

  ngAfterViewInit(): void {
  }
  toggleFollow(index: number) {
    this.followStates[index] = !this.followStates[index];
  }
}
