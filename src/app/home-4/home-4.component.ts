import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({

  selector: 'app-home-4',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-4.component.html',
  styleUrl: './home-4.component.css'
})
export class Home4Component implements AfterViewInit {
  title = 'Home 4';
  @ViewChild('cardSlider') cardSlider!: ElementRef;


  bitcoinAreaChart;
  ethereumAreaChart;
  solanaAreaChart;
  litecoinAreaChart;
  dogecoinAreaChart;
  candleStickChart;
  markerBitcoinChart: any;
  markerEthereumChart: any;
  markerSolanaChart: any;
  markerLitecoinChart: any;
  markerDogecoinChart: any;
  markerCryptoChart: any;
  statisticsDonutChart;
  cryptoCards;

  cards = [
    {
      title: 'Master Card',
      number: '2356 9854 3652 5612',
      name: 'Arlene McCoy',
      expiry: '05/26',
      logo: 'assets/images/card/card-logo.png'
    },
    {
      title: 'Master Card',
      number: '2356 9854 3652 5612',
      name: 'Arlene McCoy',
      expiry: '05/26',
      logo: 'assets/images/card/card-logo.png'
    },
    {
      title: 'Master Card',
      number: '2356 9854 3652 5612',
      name: 'Arlene McCoy',
      expiry: '05/26',
      logo: 'assets/images/card/card-logo.png'
    }
  ];

  rates = [
    { rate: '0.265415.00', amountEth: 29.4251512, pricePln: 2.154, positive: true },
    { rate: '0.265415.00', amountEth: 29.4251512, pricePln: 2.154, positive: true },
    { rate: '0.265415.00', amountEth: 29.4251512, pricePln: 2.154, positive: false },
    { rate: '0.265415.00', amountEth: 29.4251512, pricePln: 2.154, positive: true },
    { rate: '0.265415.00', amountEth: 29.4251512, pricePln: 2.154, positive: false },
    { rate: '0.265415.00', amountEth: 29.4251512, pricePln: 2.154, positive: false },
  ];

  removeRate(index: number) {
    this.rates.splice(index, 1);
  }
  transactions = [
    {
      type: 'Bitcoin',
      icon: 'tabler:arrow-up-right',
      iconClass: 'text-success-main bg-success-focus',
      time: '10:34 AM',
      date: '27 Mar 2024',
      amount: '+ 0.431 BTC',
      price: '$3,480.90',
      address: 'Abc.........np562',
      statusText: 'Completed',
      statusClass: 'bg-success-focus text-success-main',
    },
    {
      type: 'Bitcoin',
      icon: 'tabler:arrow-down-left',
      iconClass: 'text-danger-main bg-danger-focus',
      time: '10:34 AM',
      date: '27 Mar 2024',
      amount: '+ 0.431 BTC',
      price: '$3,480.90',
      address: 'Abc.........np562',
      statusText: 'Terminated',
      statusClass: 'bg-danger-focus text-danger-main',
    },
    {
      type: 'Bitcoin',
      icon: 'tabler:arrow-up-right',
      iconClass: 'text-success-main bg-success-focus',
      time: '10:34 AM',
      date: '27 Mar 2024',
      amount: '+ 0.431 BTC',
      price: '$3,480.90',
      address: 'Abc.........np562',
      statusText: 'Completed',
      statusClass: 'bg-success-focus text-success-main',
    },
    {
      type: 'Bitcoin',
      icon: 'tabler:arrow-down-left',
      iconClass: 'text-danger-main bg-danger-focus',
      time: '10:34 AM',
      date: '27 Mar 2024',
      amount: '+ 0.431 BTC',
      price: '$3,480.90',
      address: 'Abc.........np562',
      statusText: 'Terminated',
      statusClass: 'bg-danger-focus text-danger-main',
    },
    {
      type: 'Bitcoin',
      icon: 'tabler:arrow-up-right',
      iconClass: 'text-success-main bg-success-focus',
      time: '10:34 AM',
      date: '27 Mar 2024',
      amount: '+ 0.431 BTC',
      price: '$3,480.90',
      address: 'Abc.........np562',
      statusText: 'Completed',
      statusClass: 'bg-success-focus text-success-main',
    },
  ];


  constructor() {
    this.bitcoinAreaChart = this.createChart('bitcoinAreaChart', '#F98C08');
    this.ethereumAreaChart = this.createChart('ethereumAreaChart', '#5F80FF');
    this.solanaAreaChart = this.createChart('solanaAreaChart', '#C817F8');
    this.litecoinAreaChart = this.createChart('litecoinAreaChart', '#2171EA');
    this.dogecoinAreaChart = this.createChart('dogecoinAreaChart', '#C2A633');

    this.markerBitcoinChart = this.createChartTwo('#45B369');
    this.markerEthereumChart = this.createChartTwo('#EF4A00');
    this.markerSolanaChart = this.createChartTwo('#45B369');
    this.markerLitecoinChart = this.createChartTwo('#45B369');
    this.markerDogecoinChart = this.createChartTwo('#EF4A00');
    this.markerCryptoChart = this.createChartTwo('#EF4A00');


    this.candleStickChart = {
      series: [{
        data: [{
          x: new Date(1538778600000),
          y: [6629.81, 6650.5, 6623.04, 6633.33]
        },
        {
          x: new Date(1538780400000),
          y: [6632.01, 6643.59, 6620, 6630.11]
        },
        {
          x: new Date(1538782200000),
          y: [6630.71, 6648.95, 6623.34, 6635.65]
        },
        {
          x: new Date(1538784000000),
          y: [6635.65, 6651, 6629.67, 6638.24]
        },
        {
          x: new Date(1538785800000),
          y: [6638.24, 6640, 6620, 6624.47]
        },
        {
          x: new Date(1538787600000),
          y: [6624.53, 6636.03, 6621.68, 6624.31]
        },
        {
          x: new Date(1538789400000),
          y: [6624.61, 6632.2, 6617, 6626.02]
        },
        {
          x: new Date(1538791200000),
          y: [6627, 6627.62, 6584.22, 6603.02]
        },
        {
          x: new Date(1538793000000),
          y: [6605, 6608.03, 6598.95, 6604.01]
        },
        {
          x: new Date(1538794800000),
          y: [6604.5, 6614.4, 6602.26, 6608.02]
        },
        {
          x: new Date(1538796600000),
          y: [6608.02, 6610.68, 6601.99, 6608.91]
        },
        {
          x: new Date(1538798400000),
          y: [6608.91, 6618.99, 6608.01, 6612]
        },
        {
          x: new Date(1538800200000),
          y: [6612, 6615.13, 6605.09, 6612]
        },
        {
          x: new Date(1538802000000),
          y: [6612, 6624.12, 6608.43, 6622.95]
        },
        {
          x: new Date(1538803800000),
          y: [6623.91, 6623.91, 6615, 6615.67]
        },
        {
          x: new Date(1538805600000),
          y: [6618.69, 6618.74, 6610, 6610.4]
        },
        {
          x: new Date(1538807400000),
          y: [6611, 6622.78, 6610.4, 6614.9]
        },
        {
          x: new Date(1538809200000),
          y: [6614.9, 6626.2, 6613.33, 6623.45]
        },
        {
          x: new Date(1538811000000),
          y: [6623.48, 6627, 6618.38, 6620.35]
        },
        {
          x: new Date(1538812800000),
          y: [6619.43, 6620.35, 6610.05, 6615.53]
        },
        {
          x: new Date(1538814600000),
          y: [6615.53, 6617.93, 6610, 6615.19]
        },
        {
          x: new Date(1538816400000),
          y: [6615.19, 6621.6, 6608.2, 6620]
        },
        {
          x: new Date(1538818200000),
          y: [6619.54, 6625.17, 6614.15, 6620]
        },
        {
          x: new Date(1538820000000),
          y: [6620.33, 6634.15, 6617.24, 6624.61]
        },
        {
          x: new Date(1538821800000),
          y: [6625.95, 6626, 6611.66, 6617.58]
        },
        {
          x: new Date(1538823600000),
          y: [6619, 6625.97, 6595.27, 6598.86]
        },
        {
          x: new Date(1538825400000),
          y: [6598.86, 6598.88, 6570, 6587.16]
        },
        {
          x: new Date(1538827200000),
          y: [6588.86, 6600, 6580, 6593.4]
        },
        {
          x: new Date(1538829000000),
          y: [6593.99, 6598.89, 6585, 6587.81]
        },
        {
          x: new Date(1538830800000),
          y: [6587.81, 6592.73, 6567.14, 6578]
        },
        {
          x: new Date(1538832600000),
          y: [6578.35, 6581.72, 6567.39, 6579]
        },
        {
          x: new Date(1538834400000),
          y: [6579.38, 6580.92, 6566.77, 6575.96]
        },
        {
          x: new Date(1538836200000),
          y: [6575.96, 6589, 6571.77, 6588.92]
        },
        {
          x: new Date(1538838000000),
          y: [6588.92, 6594, 6577.55, 6589.22]
        },
        {
          x: new Date(1538839800000),
          y: [6589.3, 6598.89, 6589.1, 6596.08]
        },
        {
          x: new Date(1538841600000),
          y: [6597.5, 6600, 6588.39, 6596.25]
        },
        {
          x: new Date(1538843400000),
          y: [6598.03, 6600, 6588.73, 6595.97]
        },
        {
          x: new Date(1538845200000),
          y: [6595.97, 6602.01, 6588.17, 6602]
        },
        {
          x: new Date(1538847000000),
          y: [6602, 6607, 6596.51, 6599.95]
        },
        {
          x: new Date(1538848800000),
          y: [6600.63, 6601.21, 6590.39, 6591.02]
        },
        {
          x: new Date(1538850600000),
          y: [6591.02, 6603.08, 6591, 6591]
        },
        {
          x: new Date(1538852400000),
          y: [6591, 6601.32, 6585, 6592]
        },
        {
          x: new Date(1538854200000),
          y: [6593.13, 6596.01, 6590, 6593.34]
        },
        {
          x: new Date(1538856000000),
          y: [6593.34, 6604.76, 6582.63, 6593.86]
        },
        {
          x: new Date(1538857800000),
          y: [6593.86, 6604.28, 6586.57, 6600.01]
        },
        {
          x: new Date(1538859600000),
          y: [6601.81, 6603.21, 6592.78, 6596.25]
        },
        {
          x: new Date(1538861400000),
          y: [6596.25, 6604.2, 6590, 6602.99]
        },
        {
          x: new Date(1538863200000),
          y: [6602.99, 6606, 6584.99, 6587.81]
        },
        {
          x: new Date(1538865000000),
          y: [6587.81, 6595, 6583.27, 6591.96]
        },
        {
          x: new Date(1538866800000),
          y: [6591.97, 6596.07, 6585, 6588.39]
        },
        {
          x: new Date(1538868600000),
          y: [6587.6, 6598.21, 6587.6, 6594.27]
        },
        {
          x: new Date(1538870400000),
          y: [6596.44, 6601, 6590, 6596.55]
        },
        {
          x: new Date(1538872200000),
          y: [6598.91, 6605, 6596.61, 6600.02]
        },
        {
          x: new Date(1538874000000),
          y: [6600.55, 6605, 6589.14, 6593.01]
        },
        {
          x: new Date(1538875800000),
          y: [6593.15, 6605, 6592, 6603.06]
        },
        {
          x: new Date(1538877600000),
          y: [6603.07, 6604.5, 6599.09, 6603.89]
        },
        {
          x: new Date(1538879400000),
          y: [6604.44, 6604.44, 6600, 6603.5]
        },
        {
          x: new Date(1538881200000),
          y: [6603.5, 6603.99, 6597.5, 6603.86]
        },
        {
          x: new Date(1538883000000),
          y: [6603.85, 6605, 6600, 6604.07]
        },
        {
          x: new Date(1538884800000),
          y: [6604.98, 6606, 6604.07, 6606]
        },
        ]
      }],

      plotOptions: {
        candlestick: {
          colors: {
            upward: '#487FFF',  // Color for bullish candles (green)
            downward: '#FF9F29'  // Color for bearish candles (red)
          },
          wick: {
            useFillColor: true  // Use the same color as the candle body for the wick
          },
        }
      },

      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: {
          show: false
        }
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };

    this.statisticsDonutChart = {
      series: [30, 25],
      colors: ['#FF9F29', '#487FFF'],
      labels: ['Female', 'Male'],
      legend: {
        show: false
      },
      chart: {
        type: 'donut',
        height: 260,
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
    this.cryptoCards = [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        price: '$45,138',
        change: '+27%',
        changeClass: 'text-success-main',
        img: 'assets/images/currency/crypto-img1.png',
        bgClass: 'bg-gradient-end-3',
        chartId: 'bitcoinAreaChart',
        chartOptions: this.bitcoinAreaChart
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        price: '$45,138',
        change: '-27%',
        changeClass: 'text-danger-main',
        img: 'assets/images/currency/crypto-img2.png',
        bgClass: 'bg-gradient-end-1',
        chartId: 'ethereumAreaChart',
        chartOptions: this.ethereumAreaChart
      },
      {
        name: 'Solana',
        symbol: 'SOL',
        price: '$45,138',
        change: '+27%',
        changeClass: 'text-success-main',
        img: 'assets/images/currency/crypto-img3.png',
        bgClass: 'bg-gradient-end-5',
        chartId: 'solanaAreaChart',
        chartOptions: this.markerSolanaChart
      },
      {
        name: 'Litecoin',
        symbol: 'LTE',
        price: '$45,138',
        change: '+27%',
        changeClass: 'text-success-main',
        img: 'assets/images/currency/crypto-img4.png',
        bgClass: 'bg-gradient-end-6',
        chartId: 'litecoinAreaChart',
        chartOptions: this.markerLitecoinChart
      },
      {
        name: 'Dogecoin',
        symbol: 'DOGE',
        price: '$45,138',
        change: '+27%',
        changeClass: 'text-success-main',
        img: 'assets/images/currency/crypto-img5.png',
        bgClass: 'bg-gradient-end-3',
        chartId: 'dogecoinAreaChart',
        chartOptions: this.dogecoinAreaChart
      }
    ];
  }
  ngAfterViewInit(): void {
    new Swiper(this.cardSlider.nativeElement, {
      modules: [Pagination],
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  createChart(chartId, chartColor) {

    let currentYear = new Date().getFullYear();

    return {
      series: [
        {
          name: 'series1',
          data: [31, 24, 30, 25, 32, 28, 40, 32, 42, 38, 40, 32, 38, 35, 45],
        },
      ],
      chart: {
        type: 'area',
        width: 130,
        height: 50,

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
        },
        events: {
          mounted: (chartContext, config) => {
            // Apply CSS blur to markers
            document.querySelectorAll(`#${chartId} .apexcharts-marker`).forEach((marker: HTMLElement) => {
              marker.style.filter = 'blur(2px)';
            });
          },
          updated: (chartContext, config) => {
            // Apply CSS blur to markers
            document.querySelectorAll(`#${chartId} .apexcharts-marker`).forEach((marker: HTMLElement) => {
              marker.style.filter = 'blur(3px)';
            });
          }
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
          opacityFrom: .7, // Starting opacity
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
  createChartTwo(chartColor) {
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
        width: 100,
        height: 42,
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
          opacityFrom: .75, // Starting opacity
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
}
