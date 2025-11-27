import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { WorldMapComponent } from '../world-map/world-map.component';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';


@Component({
  selector: 'app-home-12',
  imports: [BreadcrumbComponent, CommonModule, NgApexchartsModule, WorldMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-12.component.html',
  styleUrl: './home-12.component.css'
})
export class Home12Component {
  chartOptions;
  statisticBarChart;
  enrollmentChart;
  @ViewChild('travelSwiper', { static: false }) travelSwiper!: ElementRef;
  // chart

  @Input() chartId: string = 'chart';
  @Input() color1: string = '#487FFF';
  @Input() color2: string = '#FF9F29';

  constructor() {
    this.chartOptions = {
      series: [75],
      chart: {
        width: 400,
        height: 300,
        type: 'radialBar',
        sparkline: {
          enabled: true,
        },
        toolbar: {
          show: false,
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
            strokeWidth: "70%",
          },
          hollow: {
            size: "70%",
          },
          dataLabels: {
            show: false,
            value: {
              fontSize: '22px',
              fontWeight: 600,
              color: '#487FFF',
              offsetY: 16,
            },
          },
        },
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
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'round',
      },
    };

    this.statisticBarChart = {
      series: [
        {
          name: 'Booking',
          data: [6200, 5200, 4200, 3200, 1200]
        }
      ],
      chart: {
        type: 'bar',
        height: 270,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          distributed: true,
          barHeight: '22px'
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true,
        borderColor: '#ddd',
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
        }
      },
      xaxis: {
        categories: ['Booking', 'Pending', 'Finished', 'Canceled', 'Refunded'],
        labels: {
          formatter: function (value) {
            return (value / 1000).toFixed(0) + 'k';
          }
        }
      },
      legend: {
        show: false
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#C98BFF', '#FFDC90', '#94FF9B', '#FFAC89', '#A3E2FE'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      colors: ['#8501F8', '#FF9F29', '#00D40E', '#F84B01', '#2FBCFC']
    };

    this.enrollmentChart = {
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
      legend: {
        show: false
      },
      chart: {
        type: 'area',
        width: '100%',
        height: 200,
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
        colors: [this.color1, this.color2],
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
        }
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
          opacityFrom: 0,
          opacityTo: 0,
          stops: [0, 100],
        },
      },
      markers: {
        colors: [this.color1, this.color2],
        strokeWidth: 3,
        size: 0,
        hover: {
          size: 10
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          show: true,
          formatter: (value) => value,
          style: {
            fontSize: "14px"
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => "$" + value + "k",
          style: {
            fontSize: "14px"
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    };
  }

  // Travel slider
  travelPackages = [
    {
      img: 'assets/images/home-twelve/travel-img1.png',
      title: 'Paris',
      duration: '5 Days, 6 Nights',
      price: '$12,000',
      users: 280
    },
    {
      img: 'assets/images/home-twelve/travel-img2.png',
      title: 'İstanbul',
      duration: '6 Days, 7 Nights',
      price: '$7,000',
      users: 280
    },
    {
      img: 'assets/images/home-twelve/travel-img3.png',
      title: 'London',
      duration: '4 Days, 5 Nights',
      price: '$15,000',
      users: 280
    },
    {
      img: 'assets/images/home-twelve/travel-img4.png',
      title: 'Bangkok',
      duration: '3 Days, 4 Nights',
      price: '$5,000',
      users: 220
    },
    {
      img: 'assets/images/home-twelve/travel-img2.png',
      title: 'İstanbul',
      duration: '6 Days, 7 Nights',
      price: '$7,000',
      users: 280
    },
  ];

  // slideConfig = {
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   autoplay: false,
  //   autoplaySpeed: 2000,
  //   speed: 900,
  //   dots: false,
  //   pauseOnHover: true,
  //   arrows: true,
  //   draggable: true,
  //   rtl: document.documentElement.dir === 'rtl',
  //   infinite: true,
  //   nextArrow: '#instructor-next',
  //   prevArrow: '#instructor-prev',
  //   responsive: [
  //     {
  //       breakpoint: 1299,
  //       settings: {
  //         slidesToShow: 3,
  //         arrows: false,
  //       }
  //     },
  //     {
  //       breakpoint: 992,
  //       settings: {
  //         slidesToShow: 2,
  //         arrows: false,
  //       }
  //     },
  //     {
  //       breakpoint: 767,
  //       settings: {
  //         slidesToShow: 2,
  //         arrows: false,
  //       }
  //     },
  //     {
  //       breakpoint: 575,
  //       settings: {
  //         slidesToShow: 1,
  //         arrows: false,
  //       }
  //     }
  //   ]
  // };

  ngAfterViewInit(): void {
    new Swiper(this.travelSwiper.nativeElement, {
      modules: [Navigation],
      slidesPerView: 4,
      spaceBetween: 20,
      speed: 900,
      loop: true,
      grabCursor: true,
      navigation: {
        nextEl: '#instructor-next',
        prevEl: '#instructor-prev',
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
          slidesPerView: 2,
          spaceBetween: 15
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 20
        }
      }
    });
  }



  // Transaction 
  transactions = [
    {
      place: 'Grand Palace',
      imgSrc: 'assets/images/home-twelve/transaction-img1.png',
      id: '#1250',
      duration: '5 Days, 6 Nights',
      amount: '$209.00',
      date: '21/09/2025',
      status: 'Completed'
    },
    {
      place: 'Paris France',
      imgSrc: 'assets/images/home-twelve/transaction-img2.png',
      id: '#6523',
      duration: '2 Days, 3 Nights',
      amount: '$570.00',
      date: '21/09/2025',
      status: 'Pending'
    },
    {
      place: 'Khaosan Road',
      imgSrc: 'assets/images/home-twelve/transaction-img3.png',
      id: '#1250',
      duration: '5 Days, 6 Nights',
      amount: '$870.00',
      date: '21/09/2025',
      status: 'Completed'
    },
    {
      place: 'Wat Phra Kaew',
      imgSrc: 'assets/images/home-twelve/transaction-img4.png',
      id: '#6523',
      duration: '2 Days, 3 Nights',
      amount: '$450.00',
      date: '21/09/2025',
      status: 'Pending'
    },
    {
      place: 'Wat Pho',
      imgSrc: 'assets/images/home-twelve/transaction-img5.png',
      id: '#1250',
      duration: '3 Days, 4 Nights',
      amount: '$120.00',
      date: '21/09/2025',
      status: 'Completed'
    }
  ];
}
