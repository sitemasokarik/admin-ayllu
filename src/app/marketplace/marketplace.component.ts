import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [NgApexchartsModule, BreadcrumbComponent, RouterLink, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css'
})
export class MarketplaceComponent {
  title = 'Marketplace';

  dates = [
    [1327359600000, 30.95],
    [1327446000000, 31.34],
    [1327532400000, 31.18],
    [1327618800000, 31.05],
    [1327878000000, 31.00],
    [1327964400000, 30.95],
    [1328050800000, 31.24],
    [1328137200000, 31.29],
    [1328223600000, 31.85],
    [1328482800000, 31.86],
    [1328569200000, 32.28],
    [1328655600000, 32.10],
    [1328742000000, 32.65],
    [1328828400000, 32.21],
    [1329087600000, 32.35],
    [1329174000000, 32.44],
    [1329260400000, 32.46],
    [1329346800000, 32.86],
    [1329433200000, 32.75],
    [1329778800000, 32.54],
    [1329865200000, 32.33],
    [1329951600000, 32.97],
    [1330038000000, 33.41],
    [1330297200000, 33.27],
    [1330383600000, 33.27],
    [1330470000000, 32.89],
    [1330556400000, 33.10],
    [1330642800000, 33.73],
  ];
  timeSeriesChart1;
  timeSeriesChart2;
  timeSeriesChart3;
  timeSeriesChart4;
  timeSeriesChart5;
  timeSeriesChart6;
  timeSeriesChart7;
  timeSeriesChart8;
  timeSeriesChart9;
  timeSeriesChart10;
  cryptoItems;
  constructor() {

    this.timeSeriesChart1 = this.renderChart("#45B369", "#45B369");
    this.timeSeriesChart2 = this.renderChart("#45B369", "#45B369");
    this.timeSeriesChart3 = this.renderChart("#45B369", "#45B369");
    this.timeSeriesChart4 = this.renderChart("#45B369", "#45B369");
    this.timeSeriesChart5 = this.renderChart("#EF4A00", "#EF4A00");
    this.timeSeriesChart6 = this.renderChart("#45B369", "#45B369");
    this.timeSeriesChart7 = this.renderChart("#EF4A00", "#EF4A00");
    this.timeSeriesChart8 = this.renderChart("#45B369", "#45B369");
    this.timeSeriesChart9 = this.renderChart("#EF4A00", "#EF4A00");
    this.timeSeriesChart10 = this.renderChart("#45B369", "#45B369");

    this.cryptoItems = [
      {
        id: '01',
        rank: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: '0.3464 BTC',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart1 // your ApexChart config object
      },
      {
        id: '02',
        rank: 2,
        name: 'Ethereum',
        symbol: 'ETH',
        amount: '0.5464 ETH',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart2
      },
      {
        id: '03',
        rank: 3,
        name: 'Litecoin',
        symbol: 'LTC',
        amount: '0.5464 LTC',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart3
      },
      {
        id: '04',
        rank: 4,
        name: 'Binance',
        symbol: 'BNB',
        amount: '0.5464 BNB',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart4
      },
      {
        id: '05',
        rank: 5,
        name: 'Polygon',
        symbol: 'MATIC',
        amount: '0.5464 MATIC',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'down',
        chartData: this.timeSeriesChart5
      },
      {
        id: '06',
        rank: 6,
        name: 'Polygon',
        symbol: 'MATIC',
        amount: '0.5464 MATIC',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart6
      },
      {
        id: '07',
        rank: 2,
        name: 'Binance',
        symbol: 'BNB',
        amount: '0.5464 BNB',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart7
      },
      {
        id: '08',
        rank: 1,
        name: 'Polygon',
        symbol: 'MATIC',
        amount: '0.5464 MATIC',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart8
      },
      {
        id: '09',
        rank: 3,
        name: 'Litecoin',
        symbol: 'LTC',
        amount: '0.5464 LTC',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'down',
        chartData: this.timeSeriesChart9
      },
      {
        id: '10',
        rank: 3,
        name: 'Litecoin',
        symbol: 'LTC',
        amount: '0.5464 LTC',
        price: '$2,753.00',
        marketCap: '$361.32B',
        changePercent: 1.37,
        changeDirection: 'up',
        chartData: this.timeSeriesChart10
      },
    ];
  }

  renderChart(strokeColor, gradientToColor) {
    return {
      series: [{
        name: 'Bitcoin',
        data: this.dates
      }],
      chart: {
        type: 'area',
        stacked: false,
        width: 76,
        height: 40,
        sparkline: {
          enabled: true // Remove whitespace
        },
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: false
        },
      },
      stroke: {
        curve: 'straight',
        width: 2,
        colors: [strokeColor],
        lineCap: 'round',
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
        colors: [strokeColor],
        strokeWidth: 2,
      },
      grid: {
        borderColor: '#D1D5DB',
        strokeDashArray: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          type: 'vertical',  // Gradient direction (vertical)
          shadeIntensity: 1, // Intensity of the gradient shading
          gradientToColors: [gradientToColor], // Bottom gradient color (with transparency)
          inverseColors: false, // Do not invert colors
          opacityFrom: .4, // Starting opacity
          opacityTo: .1,  // Ending opacity
          stops: [0, 100],
        },
      },
      yaxis: {
        labels: {
          show: false,
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          show: false
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          }
        }
      }
    };
  }
  isStarred = false;
  toggleStar() {
    this.isStarred = !this.isStarred;
  }




}
