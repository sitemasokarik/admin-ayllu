import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { FacturacionService } from '../../../service/facturacion.service';
import { openTicketPreview, TicketEmisorInfo } from '../facturacion-ticket.util';
import { ComprobanteElectronico, TipoComprobante } from '../models/comprobante.model';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './comprobantes.component.html',
  styleUrl: './comprobantes.component.css',
})
export class ComprobantesComponent implements OnInit {
  title = 'Comprobantes electrónicos';
  activeTab: TipoComprobante = 'boleta';
  search = '';
  pageSize = 10;
  loading = true;
  comprobantes: ComprobanteElectronico[] = [];
  filtered: ComprobanteElectronico[] = [];
  emisorConfig: TicketEmisorInfo | null = null;

  constructor(private facturacionService: FacturacionService) {}

  ngOnInit(): void {
    this.facturacionService.getFacturacionConfig().subscribe({
      next: (cfg) => {
        this.emisorConfig = {
          razonSocial: cfg.razonSocial,
          ruc: cfg.ruc,
          direccion: cfg.direccion,
          nombreComercial: cfg.nombreComercial,
        };
      },
    });
    this.loadComprobantes();
  }

  setTab(tab: TipoComprobante): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  loadComprobantes(): void {
    this.loading = true;
    this.facturacionService.getComprobantes().subscribe({
      next: (data) => {
        this.comprobantes = data;
        this.loading = false;
        this.applyFilter();
      },
      error: () => {
        this.loading = false;
        this.comprobantes = [];
        this.applyFilter();
      },
    });
  }

  applyFilter(): void {
    const q = this.search.trim().toLowerCase();
    this.filtered = this.comprobantes
      .filter((c) => c.tipo === this.activeTab)
      .filter((c) => {
        if (!q) return true;
        return (
          c.numeroCompleto.toLowerCase().includes(q) ||
          c.clienteNombre.toLowerCase().includes(q) ||
          String(c.cotizacionID).includes(q)
        );
      });
  }

  imprimirTicket(comprobante: ComprobanteElectronico): void {
    const win = openTicketPreview(
      { ...comprobante, modoEmision: comprobante.modoEmision ?? 'solo_venta' },
      this.emisorConfig ?? undefined
    );
    if (!win) {
      alert('Permite ventanas emergentes para imprimir el ticket.');
    }
  }

  reenviarSunat(comprobante: ComprobanteElectronico): void {
    this.facturacionService.reenviarSunat(comprobante.id).subscribe({
      next: () => {
        this.loadComprobantes();
      },
      error: (err) => {
        alert(err?.error?.message || 'No se pudo reenviar a SUNAT');
      },
    });
  }

  descargarXml(comprobante: ComprobanteElectronico): void {
    this.facturacionService.descargarArchivo(comprobante.id, 'xml');
  }

  descargarCdr(comprobante: ComprobanteElectronico): void {
    this.facturacionService.descargarArchivo(comprobante.id, 'cdr');
  }

  estadoClass(estado: string): string {
    if (estado === 'Aceptado' || estado === 'Enviado SUNAT') return 'bg-success-focus text-success-600 border border-success-main';
    if (estado === 'Pendiente SUNAT') return 'bg-info-focus text-info-600 border border-info-main';
    if (estado === 'Anulado') return 'bg-danger-200 text-danger-600 border border-danger-main';
    return 'bg-warning-focus text-warning-600 border border-warning-main';
  }
}
