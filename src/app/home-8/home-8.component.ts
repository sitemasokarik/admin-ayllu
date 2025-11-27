import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-8',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbComponent,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-8.component.html',
  styleUrl: './home-8.component.css'
})
export class Home8Component {
  title = 'Medical';

  enrollmentChart;
  radialMultipleBar;
  statisticsDonutChart;
  paymentStatusChart; 

  constructor() {
   this.enrollmentChart =  this.createChartTwo( '#487FFF', '#FF9F29');

   this.statisticsDonutChart =  { 
    series: [30, 25],
    colors: ['#FF9F29', '#45B369'],
    labels: ['Female', 'Male'] ,
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


 this.paymentStatusChart = {
    series: [{
      name: 'Net Profit',
      data: [44, 100, 40, 56, 30, 58, 50]
    }, {
      name: 'Free Cash',
      data: [60, 120, 60, 90, 50, 95, 90]
    }],
    colors: ['#45B369', '#FF9F29'],
    labels: ['Active', 'New', 'Total'] ,
    
    legend: {
        show: false 
    },
    chart: {
      type: 'bar',
      height: 260,
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


  this.radialMultipleBar = {
      series: [80, 40, 10],
      chart: {
          height: 300,
          type: 'radialBar',
      },
      colors: ['#3D7FF9', '#ff9f29', '#16a34a'], 
      stroke: {
          lineCap: 'round',
      },
      plotOptions: {
          radialBar: {
              hollow: {
                  size: '10%',  // Adjust this value to control the bar width
              },
              dataLabels: {
                  name: {
                      fontSize: '16px',
                  },
                  value: {
                      fontSize: '16px',
                  },
                  // total: {
                  //     show: true,
                  //     formatter: function (w) {
                  //         return '82%'
                  //     }
                  // }
              },
              track: {
                  margin: 20, // Space between the bars
              }
          }
      },
      labels: ['Cardiology', 'Psychiatry', 'Pediatrics'],
  };

 
  }

  createChartTwo( color1, color2) {
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
          opacityFrom: [0.4, 0.6], // Starting opacity for both colors
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
      bgClass: 'bg-cyan-100',
      textClass: 'text-cyan-600',
      number: '650',
      label: 'Doctors',
      infoNumber: '4',
      infoLabel: 'Doctors joined this week',
      gradientClass: 'bg-gradient-end-6',
    },
    {
      iconClass: 'ri-award-fill',
      bgClass: 'bg-lilac-100',
      textClass: 'text-lilac-600',
      number: '570',
      label: 'Staffs',
      infoNumber: '8',
      infoLabel: 'Staffs on vacation',
      gradientClass: 'bg-gradient-end-4',
    },
    {
      iconClass: 'ri-group-fill',
      bgClass: 'bg-primary-100',
      textClass: 'text-primary-600',
      number: '15,750',
      label: 'Patients',
      infoNumber: '170',
      infoLabel: 'New patients admitted',
      gradientClass: 'bg-gradient-end-1',
    },
    {
      iconClass: 'ri-wallet-3-fill',
      bgClass: 'bg-success-100',
      textClass: 'text-success-600',
      number: '$42,400',
      label: 'Pharmacies',
      infoNumber: '60,000',
      infoLabel: 'Medicine on reserve',
      gradientClass: 'bg-gradient-end-1',
    }
  ];
  treatments = [
    {
      icon: 'assets/images/home-eight/treatment-icon1.png',
      bgClass: 'bg-info-50',
      title: 'Psychiatry',
      doctorsCount: 57,
      time: '08:45 AM',
    },
    {
      icon: 'assets/images/home-eight/treatment-icon2.png',
      bgClass: 'bg-success-50',
      title: 'Orthopedic',
      doctorsCount: 85,
      time: '08:45 AM',
    },
    {
      icon: 'assets/images/home-eight/treatment-icon3.png',
      bgClass: 'bg-lilac-50',
      title: 'Cardiology',
      doctorsCount: 60,
      time: '08:45 AM',
    },
    {
      icon: 'assets/images/home-eight/treatment-icon4.png',
      bgClass: 'bg-warning-50',
      title: 'Pediatrics',
      doctorsCount: 120,
      time: '08:45 AM',
    },
    {
      icon: 'assets/images/home-eight/treatment-icon5.png',
      bgClass: 'bg-danger-50',
      title: 'Neurology',
      doctorsCount: 25,
      time: '08:45 AM',
    },
    {
      icon: 'assets/images/home-eight/treatment-icon6.png',
      bgClass: 'bg-primary-50',
      title: 'Gastroenterology',
      doctorsCount: 95,
      time: '08:45 AM',
    },
  ];
  doctors = [
    {
      img: 'assets/images/home-eight/doctor-img1.png',
      name: 'Dr. Davis',
      specialty: 'Cardiology',
      available: true,
    },
    {
      img: 'assets/images/home-eight/doctor-img2.png',
      name: 'Dr. Riead',
      specialty: 'Orthopedics',
      available: true,
    },
    {
      img: 'assets/images/home-eight/doctor-img3.png',
      name: 'Albert Flores',
      specialty: 'Ophthalmology',
      available: false,
    },
    {
      img: 'assets/images/home-eight/doctor-img4.png',
      name: 'Dr. Smith',
      specialty: 'Cardiology',
      available: true,
    },
    {
      img: 'assets/images/home-eight/doctor-img6.png',
      name: 'Dr. Johnson',
      specialty: 'Cardiology',
      available: false,
    },
    {
      img: 'assets/images/home-eight/doctor-img5.png',
      name: 'Dr. Martinez',
      specialty: 'Cardiology',
      available: true,
    },
  ];
  appointments = [
    {
      name: 'General Checkup',
      id: '#63254',
      date: '27 Mar 2024',
      status: 'Completed',
      statusClass: 'success',
    },
    {
      name: 'Blood test results',
      id: '3.053 ETH',
      date: '2h 5m 40s',
      status: 'Canceled',
      statusClass: 'danger',
    },
    {
      name: 'Heart Checkup',
      id: '3.053 ETH',
      date: '2h 5m 40s',
      status: 'Completed',
      statusClass: 'success',
    },
    {
      name: 'Vaccination',
      id: '3.053 ETH',
      date: '2h 5m 40s',
      status: 'Canceled',
      statusClass: 'danger',
    },
    {
      name: 'Dental Cleanup',
      id: '3.053 ETH',
      date: '2h 5m 40s',
      status: 'Completed',
      statusClass: 'success',
    },
    {
      name: 'Follow up Appointment',
      id: '3.053 ETH',
      date: '2h 5m 40s',
      status: 'Canceled',
      statusClass: 'danger',
    },
  ];
  files = [
    {
      name: 'Checkup Result.pdf',
      size: '2.5mb',
      icon: 'assets/images/home-eight/icon-pdf.png',
    },
    {
      name: 'Checkup Result.doc',
      size: '2mb',
      icon: 'assets/images/home-eight/icon-text.png',
    },
    {
      name: 'Prescription.pdf',
      size: '3mb',
      icon: 'assets/images/home-eight/icon-pdf.png',
    },
    {
      name: 'Xray Result.doc',
      size: '3mb',
      icon: 'assets/images/home-eight/icon-text.png',
    },
    {
      name: 'Glucose Level Report.pdf',
      size: '3mb',
      icon: 'assets/images/home-eight/icon-pdf.png',
    },
    {
      name: 'Checkup Result.doc',
      size: '2mb',
      icon: 'assets/images/home-eight/icon-text.png',
    },
  ];

  onDelete(fileName: string) {
    console.log('Delete clicked for:', fileName);
    // Implement delete logic here
  }

  onDownload(fileName: string) {
    console.log('Download clicked for:', fileName);
    // Implement download logic here
  }

}
