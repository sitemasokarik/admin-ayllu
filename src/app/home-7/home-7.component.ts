import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-7',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-7.component.html',
  styleUrl: './home-7.component.css'
})
export class Home7Component {
  title = 'Home 7';

  enrollmentChart;
  areaChart;
  dailyIconBarChart;
  constructor() {
    this.enrollmentChart = this.createChartTwo('#487FFF', "");
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

  }

  createChartTwo(color1, color2) {
    return {
      series: [{
        name: 'series2',
        data: [20000, 45000, 30000, 50000, 32000, 40000, 30000, 42000, 28000, 34000, 38000, 26000]
      }],
      legend: {
        show: false
      },
      chart: {
        type: 'area',
        width: '100%',
        height: 240,
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
        curve: 'straight',
        width: 3,
        colors: [color1], // Use two colors for the lines
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
          bottom: 0,
          left: 0
        },
      },
      fill: {
        type: 'gradient',
        colors: [color1], // Use two colors for the gradient
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
          opacityFrom: [0.4, 0.4], // Starting opacity for both colors
          opacityTo: [0.1, 0.1], // Ending opacity for both colors
          stops: [0, 100],
        },
      },
      markers: {
        colors: [color1], // Use two colors for the markers
        strokeWidth: 3,
        size: 0,
        hover: {
          size: 10
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
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        labels: {
          // formatter: function (value) {
          //     return "$" + value + "k";
          // },
          style: {
            fontSize: "12px"
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
      count: '24,000',
      label: 'Artworks',
      bgGradientClass: 'bg-gradient-start-3',
      icon: 'flowbite:users-group-solid',
      iconBgClass: 'bg-primary-600',
      percentage: '+168.001%',
      percentageBgClass: 'bg-success-focus',
      percentageTextClass: 'text-success-main',
      arrowIconClass: 'ri-arrow-up-line',
      period: 'This week',
    },
    {
      count: '82,000',
      label: 'Auction',
      bgGradientClass: 'bg-gradient-start-5',
      icon: 'flowbite:users-group-solid',
      iconBgClass: 'bg-primary-600',
      percentage: '+168.001%',
      percentageBgClass: 'bg-danger-focus',
      percentageTextClass: 'text-danger-main',
      arrowIconClass: 'ri-arrow-down-line',
      period: 'This week',
    },
    {
      count: '800',
      label: 'Creators',
      bgGradientClass: 'bg-gradient-start-2',
      icon: 'flowbite:users-group-solid',
      iconBgClass: 'bg-primary-600',
      percentage: '+168.001%',
      percentageBgClass: 'bg-success-focus',
      percentageTextClass: 'text-success-main',
      arrowIconClass: 'ri-arrow-up-line',
      period: 'This week',
    },
  ];
  nfts = [
    {
      img: 'assets/images/nft/nft-img1.png',
      title: 'Fantastic Alien',
      userImg: 'assets/images/nft/nft-user-img1.png',
      userName: 'Watson Kristin',
      priceEth: '1.44 ETH',
      priceUsd: '$4,224.96'
    },
    {
      img: 'assets/images/nft/nft-img2.png',
      title: 'New Figures',
      userImg: 'assets/images/nft/nft-user-img2.png',
      userName: 'Watson Kristin',
      priceEth: '1.44 ETH',
      priceUsd: '$4,224.96'
    },
    {
      img: 'assets/images/nft/nft-img3.png',
      title: 'New Figures',
      userImg: 'assets/images/nft/nft-user-img3.png',
      userName: 'Watson Kristin',
      priceEth: '1.44 ETH',
      priceUsd: '$4,224.96'
    },
    {
      img: 'assets/images/nft/nft-img4.png',
      title: 'New Figures',
      userImg: 'assets/images/nft/nft-user-img4.png',
      userName: 'Watson Kristin',
      priceEth: '1.44 ETH',
      priceUsd: '$4,224.96'
    }
  ];
  nftItems = [
    {
      img: 'assets/images/nft/nft-items-img1.png',
      title: 'Spanky & Friends',
      owner: 'ABC',
      price: '1.44 ETH',
      highestBid: '3.053 ETH',
      offerImg: 'assets/images/nft/nft-offer-img1.png',
      offerPrice: '1.44.00 ETH',
      timeLeft: '2h 5m 40s'
    },
    {
      img: 'assets/images/nft/nft-items-img2.png',
      title: 'Nike Air Shoe',
      owner: 'ABC',
      price: '1.44 ETH',
      highestBid: '3.053 ETH',
      offerImg: 'assets/images/nft/nft-offer-img2.png',
      offerPrice: '1.44.00 ETH',
      timeLeft: '2h 5m 40s'
    },
    {
      img: 'assets/images/nft/nft-items-img3.png',
      title: 'Woman Dresses',
      owner: 'ABC',
      price: '1.44 ETH',
      highestBid: '3.053 ETH',
      offerImg: 'assets/images/nft/nft-offer-img3.png',
      offerPrice: '1.44.00 ETH',
      timeLeft: '2h 5m 40s'
    },
    {
      img: 'assets/images/nft/nft-items-img4.png',
      title: 'Smart Watch',
      owner: 'ABC',
      price: '1.44 ETH',
      highestBid: '3.053 ETH',
      offerImg: 'assets/images/nft/nft-offer-img4.png',
      offerPrice: '1.44.00 ETH',
      timeLeft: '2h 5m 40s'
    },
    {
      img: 'assets/images/nft/nft-items-img5.png',
      title: 'Hoodie Rose',
      owner: 'ABC',
      price: '1.44 ETH',
      highestBid: '3.053 ETH',
      offerImg: 'assets/images/nft/nft-offer-img5.png',
      offerPrice: '1.44.00 ETH',
      timeLeft: '2h 5m 40s'
    },
    {
      img: 'assets/images/nft/nft-items-img6.png',
      title: 'Hoodie Rose',
      owner: 'ABC',
      price: '1.44 ETH',
      highestBid: '3.053 ETH',
      offerImg: 'assets/images/nft/nft-offer-img6.png',
      offerPrice: '1.44.00 ETH',
      timeLeft: '2h 5m 40s'
    },
    {
      img: 'assets/images/nft/nft-items-img2.png',
      title: 'Hoodie Rose',
      owner: 'ABC',
      price: '1.44 ETH',
      highestBid: '3.053 ETH',
      offerImg: 'assets/images/nft/nft-offer-img7.png',
      offerPrice: '1.44.00 ETH',
      timeLeft: '2h 5m 40s'
    }
  ];
  creators = [
    {
      img: 'assets/images/nft/creator-img1.png',
      name: 'Theresa Webb',
      username: '@wishon'
    },
    {
      img: 'assets/images/nft/creator-img2.png',
      name: 'Arlene McCoy',
      username: '@nemccoy'
    },
    {
      img: 'assets/images/nft/creator-img3.png',
      name: 'Kathryn Murphy',
      username: '@kathrynmur'
    },
    {
      img: 'assets/images/nft/creator-img4.png',
      name: 'Marvin McKinney',
      username: '@marvinckin'
    },
    {
      img: 'assets/images/nft/creator-img5.png',
      name: 'Dianne Russell',
      username: '@dinne_r'
    }
  ];
  
}
