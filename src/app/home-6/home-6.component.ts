import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, QueryList, ViewChildren,HostListener } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-6',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-6.component.html',
  styleUrl: './home-6.component.css'
})
export class Home6Component implements AfterViewInit {
  title = 'Home 6';
  @ViewChildren('radialProgress') radialProgress!: QueryList<ElementRef>;

  progressItems = [1, 2, 3];
  @ViewChildren('radialProgress') radialProgressElements!: QueryList<ElementRef>;

  progressItem = [
    { percentage: 75, radius: 60 },
    { percentage: 50, radius: 50 },
    { percentage: 30, radius: 40 }
  ];

  enrollmentChart;
  userOverviewDonutChart;
  paymentStatusChart;
  constructor() {
    this.enrollmentChart = this.createChartTwo('#45B369', '#487fff');
    this.userOverviewDonutChart = {
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
      }
    };
    this.paymentStatusChart = {
      series: [{
        name: 'Net Profit',
        data: [44, 100, 40, 56, 30, 58, 50]
      }, {
        name: 'Free Cash',
        data: [60, 120, 60, 90, 50, 95, 90]
      }],
      colors: ['#45B369', '#FF9F29'],
      labels: ['Active', 'New', 'Total'],

      legend: {
        show: false
      },
      chart: {
        type: 'bar',
        height: 420,
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
          columnWidth: 8,
        },
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
        width: 0,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
      },
      fill: {
        opacity: 1,
        width: 18,
      },
    };

  }
  ngAfterViewInit(): void {
    // $('svg.radial-progress').each(function (index, value) {
    //   $(this).find($('circle.complete')).removeAttr('style');
    // });
    this.radialProgress.forEach((svgEl: ElementRef) => {
      const completeCircle = svgEl.nativeElement.querySelector('circle.complete');
      if (completeCircle) {
        completeCircle.removeAttribute('style');
      }
    });
    // Run once on load
    this.onScroll();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.radialProgressElements.forEach((elRef: ElementRef) => {
      const el = elRef.nativeElement;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isInView =
        rect.top < windowHeight * 0.75 &&
        rect.bottom > windowHeight * 0.25;

      if (isInView) {
        const percent = parseFloat(el.getAttribute('data-percentage'));
        const circle = el.querySelector('circle.complete');
        const radius = parseFloat(circle.getAttribute('r'));
        const circumference = 2 * Math.PI * radius;
        const strokeDashOffset = circumference - (percent / 100) * circumference;

        circle.style.transition = 'stroke-dashoffset 1.25s ease-in-out';
        circle.style.strokeDashoffset = strokeDashOffset.toString();
      }
    });
}

createChartTwo(color1, color2) {
  return {
    series: [{
      name: 'series1',
      data: [48, 35, 55, 32, 48, 30, 55, 50, 57]
    }, {
      name: 'series2',
      data: [12, 20, 15, 26, 22, 60, 40, 48, 25]
    }],
    legend: {
      show: false
    },
    chart: {
      type: 'area',
      width: '100%',
      height: 270,
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
        opacityFrom: [0.4, 0.4], // Starting opacity for both colors
        opacityTo: [0.3, 0.3], // Ending opacity for both colors
        stops: [0, 100],
      },
    },
    markers: {
      colors: [color1, color2], // Use two colors for the markers
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
    iconClass: 'ri-group-fill',
    bgGradientClass: 'bg-gradient-dark-start-1',
    iconBgClass: 'bg-base text-pink',
    title: 'Total Students',
    value: '15,000',
    change: '+2.5k',
    changeBgClass: 'bg-success-main',
    changeText: 'This Month',
  },
  {
    iconClass: 'ri-youtube-fill',
    bgGradientClass: 'bg-gradient-dark-start-2',
    iconBgClass: 'bg-base text-purple',
    title: 'Total Courses',
    value: '420',
    change: '+30',
    changeBgClass: 'bg-success-main',
    changeText: 'This Month',
  },
  {
    iconClass: 'ri-money-dollar-circle-fill',
    bgGradientClass: 'bg-gradient-dark-start-3',
    iconBgClass: 'bg-base text-info',
    title: 'Overall Revenue',
    value: '$50,000',
    change: '+1.5k',
    changeBgClass: 'bg-success-main',
    changeText: 'This Month',
  },
];
categories = [
  {
    iconSrc: 'assets/images/home-six/category-icon1.png',
    iconBgClass: 'bg-info-50',
    title: 'Web Development',
    subtitle: '40+ Courses',
    link: '#'
  },
  {
    iconSrc: 'assets/images/home-six/category-icon2.png',
    iconBgClass: 'bg-success-50',
    title: 'Graphic Design',
    subtitle: '40+ Courses',
    link: '#'
  },
  {
    iconSrc: 'assets/images/home-six/category-icon3.png',
    iconBgClass: 'bg-lilac-50',
    title: 'UI/UX Design',
    subtitle: '40+ Courses',
    link: '#'
  },
  {
    iconSrc: 'assets/images/home-six/category-icon4.png',
    iconBgClass: 'bg-warning-50',
    title: 'Digital Marketing',
    subtitle: '40+ Courses',
    link: '#'
  },
  {
    iconSrc: 'assets/images/home-six/category-icon5.png',
    iconBgClass: 'bg-danger-50',
    title: '3d Illustration & Art Design',
    subtitle: '40+ Courses',
    link: '#'
  },
  {
    iconSrc: 'assets/images/home-six/category-icon6.png',
    iconBgClass: 'bg-primary-50',
    title: 'Logo Design',
    subtitle: '40+ Courses',
    link: '#'
  }
];
instructors = [
  {
    imgSrc: 'assets/images/users/user1.png',
    name: 'Dianne Russell',
    agentId: '36254',
    reviews: 25,
    stars: 5
  },
  {
    imgSrc: 'assets/images/users/user2.png',
    name: 'Wade Warren',
    agentId: '36254',
    reviews: 25,
    stars: 5
  },
  {
    imgSrc: 'assets/images/users/user3.png',
    name: 'Albert Flores',
    agentId: '36254',
    reviews: 25,
    stars: 5
  },
  {
    imgSrc: 'assets/images/users/user4.png',
    name: 'Bessie Cooper',
    agentId: '36254',
    reviews: 25,
    stars: 5
  },
  {
    imgSrc: 'assets/images/users/user5.png',
    name: 'Arlene McCoy',
    agentId: '36254',
    reviews: 25,
    stars: 5
  },
  {
    imgSrc: 'assets/images/users/user1.png',
    name: 'Arlene McCoy',
    agentId: '36254',
    reviews: 25,
    stars: 5
  }
];
students = [
  {
    imgSrc: 'assets/images/home-six/student-img1.png',
    name: 'Theresa Webb',
    course: 'UI/UX Design Course',
    progress: 33
  },
  {
    imgSrc: 'assets/images/home-six/student-img2.png',
    name: 'Robert Fox',
    course: 'Graphic Design Course',
    progress: 70
  },
  {
    imgSrc: 'assets/images/home-six/student-img3.png',
    name: 'Guy Hawkins',
    course: 'Web developer Course',
    progress: 80
  },
  {
    imgSrc: 'assets/images/home-six/student-img4.png',
    name: 'Cody Fisher',
    course: 'UI/UX Design Course',
    progress: 20
  },
  {
    imgSrc: 'assets/images/home-six/student-img5.png',
    name: 'Jacob Jones',
    course: 'UI/UX Design Course',
    progress: 40
  },
  {
    imgSrc: 'assets/images/home-six/student-img6.png',
    name: 'Darlene Robertson',
    course: 'UI/UX Design Course',
    progress: 24
  }
];

getStrokeDashOffset(progress: number): number {
  // Circumference = 2 * π * r (r=35)
  const circumference = 2 * Math.PI * 35;
  return circumference * (1 - progress / 100);
}
courses = [
  {
    registeredOn: '24 Jun 2024',
    instructor: 'Ronald Richards',
    title: '3d Illustration & Art Design',
    lessons: 34,
    enrolled: 257,
    price: '$29.00'
  },
  {
    registeredOn: '24 Jun 2024',
    instructor: 'Jerome Bell',
    title: 'Advanced JavaScript Development',
    lessons: 20,
    enrolled: 375,
    price: '$29.00'
  },
  {
    registeredOn: '24 Jun 2024',
    instructor: 'Cody Fisher',
    title: 'Portrait Drawing Fundamentals',
    lessons: 16,
    enrolled: 220,
    price: '$29.00'
  },
  {
    registeredOn: '24 Jun 2024',
    instructor: 'Floyd Miles',
    title: 'Advanced App Development',
    lessons: 25,
    enrolled: 57,
    price: '$29.00'
  },
  {
    registeredOn: '24 Jun 2024',
    instructor: 'Ralph Edwards',
    title: 'HTML Fundamental Course',
    lessons: 17,
    enrolled: 27,
    price: '$29.00'
  }
];


}
