import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-home-15',
  imports: [BreadcrumbComponent, CommonModule, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-15.component.html',
  styleUrl: './home-15.component.css'
})
export class Home15Component {
  averageEarningChart;
  projectAnalysisChart;
  taskOverviewChart;
  constructor() {
    this.createChart('#487FFF', '#FF9F29');
    this.projectAnalysisChart = {
      series: [
        {
          name: 'Utilidad Neta',
          data: [44, 100, 40, 56, 30, 58, 50]
        },
        {
          name: 'Ingresos',
          data: [90, 140, 80, 125, 70, 140, 110]
        },
        {
          name: 'Caja Disponible',
          data: [60, 120, 60, 90, 50, 95, 90]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      colors: ['#45B369', '#FF9F29', '#9935FE'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '8%'
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 4,
        position: 'back'
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return value.toLocaleString();
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        show: false
      }
    };
    this.taskOverviewChart = {
      series: [40, 87, 87, 30],
      chart: {
        type: 'donut',
        height: 270,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#dc3545', '#ff9f29', '#8252e9', '#144bd6'],
      labels: ['Salud', 'Negocios', 'Estilo de vida', 'Entretenimiento'],
      stroke: {
        width: 2
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
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
  }
  createChart(color1: string, color2: string): void {
    this.averageEarningChart = {
      series: [
        {
          name: 'Ingresos',
          data: [48, 35, 55, 32, 48, 30, 55, 50, 57]
        },
        {
          name: 'Gastos',
          data: [12, 20, 15, 26, 22, 60, 40, 48, 25]
        }
      ],
      chart: {
        type: 'line',
        height: 270,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: [color1, color2],
        lineCap: 'round'
      },
      grid: {
        show: true,
        borderColor: '#D1D5DB',
        strokeDashArray: 1,
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
        padding: {
          top: -20,
          bottom: -10
        }
      },
      markers: {
        colors: [color1, color2],
        strokeWidth: 3,
        size: 0,
        hover: {
          size: 10
        }
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set'],
        labels: {
          style: {
            fontSize: '14px'
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return "S/ " + value + "k";
          },
          style: {
            fontSize: '14px'
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      },
      legend: {
        show: false
      },
      colors: [color1, color2]
    };
  }

  dashboardItems = [
    {
      title: 'Total Eventos',
      value: 320,
      icon: 'ri-calendar-event-fill',
      bgColor: 'bg-danger-600',
      blurClass: 'blur-gradient blur-gradient-1'
    },
    {
      title: 'Clientes',
      value: 547,
      icon: 'ri-user-2-fill',
      bgColor: 'bg-success-600',
      blurClass: 'blur-gradient blur-gradient-2'
    },
    {
      title: 'Colaboradores',
      value: 356,
      icon: 'ri-group-fill',
      bgColor: 'bg-warning-600',
      blurClass: 'blur-gradient blur-gradient-3'
    },
    {
      title: 'Eventos Realizados',
      value: 435,
      icon: 'ri-checkbox-circle-fill',
      bgColor: 'bg-info-600',
      blurClass: 'blur-gradient blur-gradient-4'
    }
  ];
  users = [
    {
      name: 'Kristin Watson',
      email: 'ulfaha@mail.ru',
      task: 15,
      progress: 80,
      image: 'assets/images/user-grid/user-grid-img5.png',
      progressBarClass: 'bg-purple'
    },
    {
      name: 'Theresa Webb',
      email: 'joie@gmail.com',
      task: 20,
      progress: 50,
      image: 'assets/images/user-grid/user-grid-img4.png',
      progressBarClass: 'bg-warning-main'
    },
    {
      name: 'Brooklyn Simmons',
      email: 'warn@mail.ru',
      task: 24,
      progress: 60,
      image: 'assets/images/user-grid/user-grid-img3.png',
      progressBarClass: 'bg-info-main'
    },
    {
      name: 'Robert Fox',
      email: 'fellora@mail.ru',
      task: 26,
      progress: 92,
      image: 'assets/images/user-grid/user-grid-img2.png',
      progressBarClass: 'bg-success-main'
    },
    {
      name: 'Jane Cooper',
      email: 'zitka@mail.ru',
      task: 25,
      progress: 25,
      image: 'assets/images/user-grid/user-grid-img1.png',
      progressBarClass: 'bg-red'
    }
  ];
  projects = [
    {
      name: 'Boda - Pérez / García',
      deadline: '10 Ene 2025',
      status: 'Pendiente',
      statusClass: 'bg-warning-focus text-warning-main'
    },
    {
      name: 'Cumpleaños - Ana Torres',
      deadline: '15 Ene 2025',
      status: 'Completado',
      statusClass: 'bg-success-focus text-success-main'
    },
    {
      name: 'Quinceaños - López',
      deadline: '20 Ene 2025',
      status: 'En Progreso',
      statusClass: 'bg-purple-light text-purple'
    },
    {
      name: 'Aniversario - Ramos',
      deadline: '22 Ene 2025',
      status: 'Pendiente',
      statusClass: 'bg-warning-focus text-warning-main'
    },
    {
      name: 'Graduación - Universidad X',
      deadline: '30 Ene 2025',
      status: 'Cancelado',
      statusClass: 'bg-danger-focus text-danger-main'
    },
    {
      name: 'Cóctel Corporativo - Empresa Y',
      deadline: '05 Feb 2025',
      status: 'En Progreso',
      statusClass: 'bg-purple-light text-purple'
    }
  ];
  projectsStatus = [
    {
      name: 'Boda - Pérez / García',
      client: 'Familia Pérez',
      budget: 'S/ 24,000',
      duration: '24 Días',
      progress: 95,
      trend: 'up',
      status: 'Pendiente'
    },
    {
      name: 'Cumpleaños - Ana Torres',
      client: 'Ana Torres',
      budget: 'S/ 32,700',
      duration: '16 Días',
      progress: 95,
      trend: 'down',
      status: 'Completado'
    },
    {
      name: 'Quinceaños - López',
      client: 'Familia López',
      budget: 'S/ 7,250',
      duration: '7 Días',
      progress: 95,
      trend: 'up',
      status: 'En Progreso'
    },
    {
      name: 'Aniversario - Ramos',
      client: 'Familia Ramos',
      budget: 'S/ 24,500',
      duration: '3 Días',
      progress: 95,
      trend: 'up',
      status: 'Pendiente'
    },
    {
      name: 'Graduación - Universidad X',
      client: 'Universidad X',
      budget: 'S/ 30,000',
      duration: '5 Días',
      progress: 95,
      trend: 'up',
      status: 'Cancelado'
    }
  ];

  getStatusClasses(status: string): string {
    switch (status) {
      case 'Pendiente': return 'bg-warning-focus text-warning-main';
      case 'Completado': return 'bg-success-focus text-success-main';
      case 'En Progreso': return 'bg-purple-light text-purple';
      case 'Cancelado': return 'bg-danger-focus text-danger-main';
      default: return '';
    }
  }

  getTrendIcon(trend: string): string {
    return trend === 'up' ? 'ri-arrow-right-up-line' : 'ri-arrow-left-down-line';
  }

  getTrendClass(trend: string): string {
    return trend === 'up' ? 'bg-success-focus text-success-main' : 'bg-danger-focus text-danger-main';
  }
}
