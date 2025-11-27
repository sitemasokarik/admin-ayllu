import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { WorldMapComponent } from '../world-map/world-map.component';

@Component({
  selector: 'app-home-3',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbComponent, WorldMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-3.component.html',
  styleUrl: './home-3.component.css'
})
export class Home3Component implements AfterViewInit {
  title = 'eCommerce';

  recentOrdersChart;
  statisticsDonutChart;
  paymentStatusChart;

  constructor() {
    this.recentOrdersChart = this.createChartTwo('#487fff');

    this.statisticsDonutChart = {
      series: [30, 25],
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

    this.paymentStatusChart = {
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

  createChartTwo(chartColor) {

    return {
      series: [
        {
          name: 'This Day',
          data: [18, 25, 20, 35, 25, 55, 45, 50, 40],
        },
      ],
      chart: {
        type: 'area',
        width: '100%',
        height: 360,
        sparkline: {
          enabled: false // Remove whitespace
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
        width: 4,
        colors: [chartColor],
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
          top: -30,
          right: 0,
          bottom: -10,
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
          opacityFrom: .6, // Starting opacity
          opacityTo: 0.3,  // Ending opacity
          stops: [0, 100],
        },
      },
      // Customize the circle marker color on hover
      markers: {
        colors: [chartColor],
        strokeWidth: 3,
        size: 0,
        hover: {
          size: 10
        }
      },
      xaxis: {
        categories: [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],

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
      },
      yaxis: {
        labels: {
          show: false
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    };
  }
  ngAfterViewInit(): void {

  }

}
