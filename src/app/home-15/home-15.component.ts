import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';

type KpiAccent = 'orange' | 'violet' | 'emerald' | 'rose';
type ChartPeriod = 'annual' | 'monthly' | 'weekly';
type CotizacionEstado = 'Activo' | 'Evento' | 'Anulado';

interface KpiCard {
  id: string;
  title: string;
  value: number;
  share: number;
  caption: string;
  icon: string;
  accent: KpiAccent;
}

interface StatusBreakdownItem {
  label: CotizacionEstado;
  value: number;
  color: string;
}

@Component({
  selector: 'app-home-15',
  imports: [CommonModule, NgApexchartsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-15.component.html',
  styleUrl: './home-15.component.css'
})
export class Home15Component implements OnInit {
  private readonly estados: CotizacionEstado[] = ['Activo', 'Evento', 'Anulado'];

  loading = true;
  adminName = '';
  todayLabel = '';
  showVoucherAlert = false;
  vouchersPendientesCount = 0;
  totalIngresos = 0;
  selectedPeriod: ChartPeriod = 'annual';
  averageEarningChart: any;
  statusChart: any;
  distributionChart: any;
  cotizaciones: any[] = [];
  recentCotizaciones: any[] = [];
  statusBreakdown: StatusBreakdownItem[] = [];

  chartPeriods = [
    { id: 'annual' as ChartPeriod, label: 'Anual' },
    { id: 'monthly' as ChartPeriod, label: 'Mensual' },
    { id: 'weekly' as ChartPeriod, label: 'Semanal' }
  ];

  kpiCards: KpiCard[] = [
    {
      id: 'activas',
      title: 'Activas',
      value: 0,
      share: 0,
      caption: 'Generadas desde el cotizador',
      icon: 'solar:document-text-bold',
      accent: 'emerald'
    },
    {
      id: 'eventos',
      title: 'Eventos',
      value: 0,
      share: 0,
      caption: 'Cliente aceptó o admin confirmó',
      icon: 'solar:calendar-mark-bold',
      accent: 'orange'
    },
    {
      id: 'anuladas',
      title: 'Anuladas',
      value: 0,
      share: 0,
      caption: 'Canceladas o descartadas',
      icon: 'solar:close-circle-bold',
      accent: 'rose'
    },
    {
      id: 'total',
      title: 'Total',
      value: 0,
      share: 0,
      caption: 'Todas las cotizaciones registradas',
      icon: 'solar:layers-minimalistic-bold',
      accent: 'violet'
    }
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.averageEarningChart = this.buildAreaChart([], 'annual');
    this.statusChart = this.buildStatusChart([]);
    this.distributionChart = this.buildDistributionChart([0, 0, 0]);
  }

  ngOnInit(): void {
    this.todayLabel = new Intl.DateTimeFormat('es-PE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

    const user = this.authService.getUser();
    this.adminName = user?.nombreCompleto || user?.userName || 'Administrador';
    this.showVoucherAlert = this.authService.isAdministradorGeneral();

    this.loadDashboard();
    if (this.showVoucherAlert) {
      this.loadVouchersPendientes();
    }
  }

  private loadVouchersPendientes(): void {
    this.userService.countPagoVouchersPendientes().subscribe({
      next: (res) => {
        this.vouchersPendientesCount = Number(res?.data?.count ?? 0);
      },
      error: () => {
        this.vouchersPendientesCount = 0;
      },
    });
  }

  selectPeriod(period: ChartPeriod): void {
    this.selectedPeriod = period;
    this.averageEarningChart = this.buildAreaChart(this.getCotizacionesConIngreso(), period);
  }

  getRowTotal(row: any): number {
    return this.getCotizacionTotal(row);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'is-success';
      case 'Evento':
        return 'is-warning';
      case 'Pendiente':
        return 'is-info';
      case 'Anulado':
        return 'is-danger';
      default:
        return 'is-neutral';
    }
  }

  private loadDashboard(): void {
    this.loading = true;

    this.userService.getAllCotizaciones().subscribe({
      next: (res) => {
        this.cotizaciones = res?.data || [];
        this.applyDashboardMetrics();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private applyDashboardMetrics(): void {
    const total = this.cotizaciones.length;
    const activas = this.countByEstado('Activo');
    const eventos = this.countByEstado('Evento');
    const anuladas = this.countByEstado('Anulado');

    this.setKpi('activas', activas, total);
    this.setKpi('eventos', eventos, total);
    this.setKpi('anuladas', anuladas, total);
    this.setKpi('total', total, total);

    this.totalIngresos = this.getCotizacionesConIngreso().reduce(
      (sum, item) => sum + this.getCotizacionTotal(item),
      0
    );

    this.recentCotizaciones = [...this.cotizaciones]
      .sort((a, b) => {
        const dateA = this.parseDate(a.fechaTentativa || a.fechaCreacion)?.getTime() || 0;
        const dateB = this.parseDate(b.fechaTentativa || b.fechaCreacion)?.getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    this.statusChart = this.buildStatusChart(this.cotizaciones);
    this.distributionChart = this.buildDistributionChart([activas, eventos, anuladas]);
    this.averageEarningChart = this.buildAreaChart(
      this.getCotizacionesConIngreso(),
      this.selectedPeriod
    );
  }

  private countByEstado(estado: CotizacionEstado): number {
    return this.cotizaciones.filter((item) => item.estadoCotizacion === estado).length;
  }

  private getCotizacionesConIngreso(): any[] {
    return this.cotizaciones.filter(
      (item) => item.estadoCotizacion === 'Activo' || item.estadoCotizacion === 'Evento'
    );
  }

  private setKpi(id: string, value: number, total: number): void {
    const card = this.kpiCards.find((item) => item.id === id);
    if (!card) return;

    card.value = value;
    card.share = total > 0 ? Math.round((value / total) * 100) : 0;
  }

  private getCotizacionTotal(item: any): number {
    const total = Number(item.totalCotizacion || 0);
    if (total > 0) return total;
    return Number(item.totalEvento || 0);
  }

  private buildStatusChart(cotizaciones: any[]) {
    const palette: Record<CotizacionEstado, string> = {
      Activo: '#1f9d6a',
      Evento: '#f47820',
      Anulado: '#ef4444'
    };

    this.statusBreakdown = this.estados.map((label) => ({
      label,
      value: this.countByEstadoFromList(cotizaciones, label),
      color: palette[label]
    }));

    return {
      series: this.statusBreakdown.map((item) => item.value),
      labels: this.statusBreakdown.map((item) => item.label),
      colors: this.statusBreakdown.map((item) => item.color),
      chart: {
        type: 'donut',
        height: 220,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      stroke: { width: 0 },
      dataLabels: { enabled: false },
      legend: { show: false },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6b7280',
                formatter: () => `${cotizaciones.length}`
              },
              value: {
                fontSize: '20px',
                fontWeight: 700,
                color: '#1a1719'
              }
            }
          }
        }
      },
      tooltip: {
        y: { formatter: (value: number) => `${value} cotizaciones` }
      }
    };
  }

  private countByEstadoFromList(list: any[], estado: CotizacionEstado): number {
    return list.filter((item) => item.estadoCotizacion === estado).length;
  }

  private buildDistributionChart(values: number[]) {
    return {
      series: [{ name: 'Cotizaciones', data: values }],
      chart: {
        type: 'bar',
        height: 260,
        toolbar: { show: false },
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      colors: ['#1f9d6a', '#f47820', '#ef4444'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 8,
          barHeight: '48%',
          distributed: true
        }
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: 'rgba(26, 23, 25, 0.06)',
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: ['Activas', 'Eventos', 'Anuladas'],
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#6b7280', fontSize: '12px', fontWeight: 600 }
        }
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (value: number) => `${value} cotizaciones` }
      }
    };
  }

  private buildAreaChart(cotizaciones: any[], period: ChartPeriod) {
    const { categories, data } = this.buildSeries(cotizaciones, period);

    return {
      series: [{ name: 'Ingresos', data }],
      chart: {
        type: 'area',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      colors: ['#f47820'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5, lineCap: 'round' },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.28,
          opacityTo: 0.02,
          stops: [0, 90, 100]
        }
      },
      grid: {
        show: true,
        borderColor: 'rgba(26, 23, 25, 0.06)',
        strokeDashArray: 4,
        padding: { top: 4, right: 8, bottom: 0, left: 4 }
      },
      markers: { size: 0, hover: { size: 5 } },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: '#8b9099', fontSize: '11px', fontWeight: 600 }
        }
      },
      yaxis: {
        labels: {
          formatter: (value: number) =>
            value >= 1000 ? `S/ ${Math.round(value / 1000)}k` : `S/ ${Math.round(value)}`,
          style: { colors: '#8b9099', fontSize: '11px', fontWeight: 600 }
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) =>
            `S/ ${value.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`
        }
      }
    };
  }

  private buildSeries(cotizaciones: any[], period: ChartPeriod) {
    if (period === 'weekly') {
      const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      const buckets = new Array(7).fill(0);
      cotizaciones.forEach((item) => {
        const date = this.parseDate(item.fechaTentativa || item.fechaCreacion);
        if (!date) return;
        buckets[(date.getDay() + 6) % 7] += this.getCotizacionTotal(item);
      });
      return { categories: labels, data: buckets };
    }

    if (period === 'monthly') {
      const now = new Date();
      const labels: string[] = [];
      const buckets: number[] = [];
      for (let i = 5; i >= 0; i -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(date.toLocaleDateString('es-PE', { month: 'short' }).replace('.', ''));
        buckets.push(0);
      }
      cotizaciones.forEach((item) => {
        const date = this.parseDate(item.fechaTentativa || item.fechaCreacion);
        if (!date) return;
        const diffMonths =
          (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        if (diffMonths >= 0 && diffMonths < 6) {
          buckets[5 - diffMonths] += this.getCotizacionTotal(item);
        }
      });
      return { categories: labels, data: buckets };
    }

    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    const buckets = new Array(12).fill(0);
    cotizaciones.forEach((item) => {
      const date = this.parseDate(item.fechaTentativa || item.fechaCreacion);
      if (!date) return;
      buckets[date.getMonth()] += this.getCotizacionTotal(item);
    });
    return { categories: labels, data: buckets };
  }

  private parseDate(value?: string): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
