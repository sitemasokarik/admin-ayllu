import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-home-13',
  imports: [BreadcrumbComponent, CommonModule, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-13.component.html',
  styleUrl: './home-13.component.css'
})
export class Home13Component {
  statisticBarChart;
  enrollmentChart;
  multipleSeriesChart;
  pendingSolvedTicket;
  semiCircleGaugeTwo;


  @Input() chartId: string = 'chart';
  @Input() color1: string = '#487FFF';
  @Input() color2: string = '#FF9F29';

  @Input() color3: string = '#45B369';
  @Input() value: number = 75;

  constructor() {
    this.statisticBarChart = {
      series: [
        {
          name: 'Ticket',
          data: [6200, 5200, 4200, 3200]
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
          lines: { show: false }
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: ['High', 'Medium', 'Low', 'Urgent'],
        labels: {
          formatter: function (value: number) {
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
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ['#C98BFF', '#FFDC90', '#94FF9B', '#FFAC89'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      colors: ['#8501F8', '#FF9F29', '#00D40E', '#F84B01']
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
    this.multipleSeriesChart = {
      series: [20, 22, 28, 10],
      chart: {
        type: 'polarArea',
        height: 264,
      },
      labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
      colors: ['#487FFF', '#FF9F29', '#9935FE', '#EF4A00'],
      stroke: {
        colors: ['#487FFF', '#FF9F29', '#9935FE', '#EF4A00'],
      },
      fill: {
        opacity: 0.8
      },
      legend: {
        show: false,
        position: 'bottom',
        horizontalAlign: 'center'
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
    this.pendingSolvedTicket = {
      series: [
        {
          name: 'Pending',
          data: [480, 350, 550, 320, 480, 300, 550, 500, 570],
        },
        {
          name: 'Solved',
          data: [120, 200, 150, 260, 220, 600, 400, 480, 250],
        },
      ],
      chart: {
        type: 'area',
        height: 200,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: [this.color3, this.color2],
        lineCap: 'round',
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 1,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: {
          top: -20,
          right: 0,
          bottom: -10,
          left: 0,
        },
      },
      colors: [this.color3, this.color2],
      fill: {
        type: 'gradient',
        colors: [this.color3, this.color2],
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [undefined, `${this.color2}00`],
          inverseColors: false,
          opacityFrom: [0.4, 0.6],
          opacityTo: [0.3, 0.3],
          stops: [0, 100],
        },
      },
      markers: {
        colors: [this.color3, this.color2],
        strokeWidth: 3,
        size: 0,
        hover: {
          size: 10,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          show: false,
          formatter: (value: string) => value,
          style: {
            fontSize: '14px',
          },
        },
        tooltip: {
          enabled: false,
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

    this.semiCircleGaugeTwo = {
      series: [this.value],
      chart: {
        type: 'radialBar',
        width: 400,
        height: 300,
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
            background: '#E3E6E9',
            strokeWidth: '70%',
          },
          hollow: {
            size: '70%',
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
  }

  agents = [
    {
      name: 'Dianne Russell',
      avatar: 'assets/images/users/user1.png',
      id: '26531',
      totalTickets: 300,
      openTickets: 250,
      resolvedTickets: 50,
      satisfaction: 30,
      progressColor: 'bg-red',
    },
    {
      name: 'Wade Warren',
      avatar: 'assets/images/users/user2.png',
      id: '26531',
      totalTickets: 300,
      openTickets: 250,
      resolvedTickets: 50,
      satisfaction: 50,
      progressColor: 'bg-warning',
    },
    {
      name: 'Albert Flores',
      avatar: 'assets/images/users/user3.png',
      id: '26531',
      totalTickets: 300,
      openTickets: 250,
      resolvedTickets: 50,
      satisfaction: 60,
      progressColor: 'bg-info-main',
    },
    {
      name: 'Bessie Cooper',
      avatar: 'assets/images/users/user4.png',
      id: '26531',
      totalTickets: 300,
      openTickets: 250,
      resolvedTickets: 50,
      satisfaction: 80,
      progressColor: 'bg-success-main',
    },
    {
      name: 'Arlene McCoy',
      avatar: 'assets/images/users/user1.png',
      id: '26531',
      totalTickets: 300,
      openTickets: 250,
      resolvedTickets: 50,
      satisfaction: 75,
      progressColor: 'bg-red',
    },
  ];
  podcasters = [
    {
      image: 'assets/images/homeThirteen/podcaster-img1.png',
      title: 'Digital Assets',
      category: 'UI Design',
      rating: 5.0
    },
    {
      image: 'assets/images/homeThirteen/podcaster-img2.png',
      title: 'Side Project',
      category: 'Business',
      rating: 3.5
    },
    {
      image: 'assets/images/homeThirteen/podcaster-img3.png',
      title: 'Investment',
      category: 'Lifestyle',
      rating: 2.5
    },
    {
      image: 'assets/images/homeThirteen/podcaster-img4.png',
      title: 'Investment',
      category: 'Lifestyle',
      rating: 4.38
    },
    {
      image: 'assets/images/homeThirteen/podcaster-img5.png',
      title: 'Investment',
      category: 'Lifestyle',
      rating: 1.0
    }
  ];
  tasks = [
    {
      id: 26531,
      name: 'Mobile app Development',
      assignedImages: [
        'assets/images/homeThirteen/todo-list-img1.png',
        'assets/images/homeThirteen/todo-list-img2.png',
        'assets/images/homeThirteen/todo-list-img3.png',
        'assets/images/homeThirteen/todo-list-img4.png'
      ],
      dueDate: 'Feb 10, 2025',
      priority: 'High',
      status: 'Basic',
      selected: false
    },
    {
      id: 26531,
      name: 'Product design',
      assignedImages: [
        'assets/images/homeThirteen/todo-list-img1.png',
        'assets/images/homeThirteen/todo-list-img2.png',
        'assets/images/homeThirteen/todo-list-img3.png'
      ],
      dueDate: 'Feb 10, 2025',
      priority: 'Low',
      status: 'Standard',
      selected: false
    },
    {
      id: 26531,
      name: 'UI/UX Design',
      assignedImages: [
        'assets/images/homeThirteen/todo-list-img1.png',
        'assets/images/homeThirteen/todo-list-img2.png'
      ],
      dueDate: 'Feb 10, 2025',
      priority: 'Medium',
      status: 'Premium',
      selected: false
    },
    {
      id: 26531,
      name: 'Website ui design',
      assignedImages: [
        'assets/images/homeThirteen/todo-list-img1.png',
        'assets/images/homeThirteen/todo-list-img2.png',
        'assets/images/homeThirteen/todo-list-img3.png'
      ],
      dueDate: 'Feb 10, 2025',
      priority: 'High',
      status: 'Basic',
      selected: false
    },
    {
      id: 26531,
      name: 'PHP Project',
      assignedImages: [
        'assets/images/homeThirteen/todo-list-img1.png'
      ],
      dueDate: 'Feb 10, 2025',
      priority: 'Low',
      status: 'Standard',
      selected: false
    }
  ];

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.tasks.forEach(task => task.selected = checked);
  }

}
