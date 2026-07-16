import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos-vouchers',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pagos-vouchers.component.html',
  styleUrl: './pagos-vouchers.component.css',
})
export class PagosVouchersComponent implements OnInit, OnDestroy {
  title = 'Vouchers de pago';
  tab: 'pendientes' | 'historial' = 'pendientes';
  loading = true;
  vouchers: any[] = [];
  historial: any[] = [];
  filtroEstado = '';
  selected: any = null;
  observacionAdmin = '';
  reviewing = false;
  fechaReservadaAdmin = '';

  previewLoading = false;
  previewError = '';
  previewUrl: string | null = null;
  previewSafeUrl: SafeResourceUrl | null = null;
  previewIsPdf = false;
  previewBlob: Blob | null = null;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  setTab(tab: 'pendientes' | 'historial'): void {
    this.tab = tab;
    this.cerrar();
    this.load();
  }

  load(): void {
    this.loading = true;
    if (this.tab === 'pendientes') {
      this.userService.getPagoVouchersPendientes().subscribe({
        next: (res) => {
          this.vouchers = res?.data || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
      return;
    }

    this.userService.getPagoVouchersHistorial(this.filtroEstado || undefined).subscribe({
      next: (res) => {
        this.historial = res?.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  ver(v: any, soloLectura = false): void {
    this.selected = { ...v, soloLectura };
    this.observacionAdmin = v.observacionAdmin || '';
    this.fechaReservadaAdmin = this.toDateKey(v.fechaReservadaElegida)
      || (this.tieneUnaSolaFecha(v) ? this.toDateKey(v.fechaTentativa) : '');
    this.previewError = '';
    this.loadPreview(v.pagoVoucherID);
  }

  cerrar(): void {
    this.selected = null;
    this.revokePreview();
  }

  private loadPreview(pagoVoucherId: number): void {
    this.revokePreview();
    this.previewLoading = true;
    this.userService.getPagoVoucherArchivo(pagoVoucherId, true).subscribe({
      next: (blob) => {
        this.previewBlob = blob;
        this.previewIsPdf = blob.type === 'application/pdf' || /\.pdf$/i.test(this.selected?.nombreArchivo || '');
        this.previewUrl = URL.createObjectURL(blob);
        this.previewSafeUrl = this.previewIsPdf
          ? this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl)
          : null;
        this.previewLoading = false;
      },
      error: () => {
        this.previewLoading = false;
        this.previewError = 'No se pudo cargar el comprobante. Usa descargar si el archivo existe en el servidor.';
      },
    });
  }

  descargarVoucher(): void {
    if (!this.selected) return;

    const download = (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.selected.nombreArchivo || `voucher-${this.selected.pagoVoucherID}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    if (this.previewBlob) {
      download(this.previewBlob);
      return;
    }

    this.userService.getPagoVoucherArchivo(this.selected.pagoVoucherID, false).subscribe({
      next: (blob) => download(blob),
      error: () => Swal.fire('Error', 'No se pudo descargar el voucher.', 'error'),
    });
  }

  private revokePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.previewSafeUrl = null;
    this.previewBlob = null;
    this.previewIsPdf = false;
  }

  revisar(aprobado: boolean): void {
    if (!this.selected || this.selected.soloLectura) return;
    if (aprobado && this.tieneDosFechas(this.selected) && !this.fechaReservadaAdmin) {
      Swal.fire('Falta la fecha', 'Indica qué fecha tentativa confirma el cliente con este adelanto.', 'warning');
      return;
    }

    this.reviewing = true;
    this.userService.reviewPagoVoucher({
      pagoVoucherID: this.selected.pagoVoucherID,
      aprobado,
      observacionAdmin: this.observacionAdmin,
      fechaReservadaElegida: this.fechaReservadaAdmin || undefined,
    }).subscribe({
      next: () => {
        this.reviewing = false;
        Swal.fire('Listo', aprobado ? 'Pago aprobado. Cotización confirmada como Evento.' : 'Pago rechazado.', 'success');
        this.cerrar();
        this.load();
      },
      error: (err) => {
        this.reviewing = false;
        Swal.fire('Error', err?.error?.message || 'No se pudo procesar la revisión.', 'error');
      },
    });
  }

  estadoClass(estado: string): string {
    if (estado === 'Aprobado') return 'bg-success-focus text-success-600 border border-success-main';
    if (estado === 'Rechazado') return 'bg-danger-200 text-danger-600 border border-danger-main';
    return 'bg-warning-focus text-warning-600 border border-warning-main';
  }

  tieneDosFechas(v: any): boolean {
    return !!(v?.fechaTentativa && v?.fechaTentativaOpcional);
  }

  tieneUnaSolaFecha(v: any): boolean {
    return !!v?.fechaTentativa && !v?.fechaTentativaOpcional;
  }

  getFechasTentativas(v: any): string[] {
    const fechas: string[] = [];
    const f1 = this.toDateKey(v?.fechaTentativa);
    const f2 = this.toDateKey(v?.fechaTentativaOpcional);
    if (f1) fechas.push(f1);
    if (f2 && f2 !== f1) fechas.push(f2);
    return fechas;
  }

  formatFechaLabel(dateKey: string): string {
    const [year, month, day] = (dateKey || '').split('-');
    if (!year || !month || !day) return dateKey;
    return `${day}/${month}/${year}`;
  }

  private toDateKey(value: string | Date | null | undefined): string {
    if (!value) return '';
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString().slice(0, 10);
  }
}
