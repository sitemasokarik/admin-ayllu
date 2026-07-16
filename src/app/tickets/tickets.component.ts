import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { TicketService } from '../../service/ticket.service';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent implements OnInit {
  title = 'Tickets internos';
  loading = true;
  detalleLoading = false;
  tickets: any[] = [];
  administradores: any[] = [];
  search = '';

  nuevoTitulo = '';
  nuevoDescripcion = '';
  nuevaPrioridad = 'Media';
  nuevoCotizacionID: number | null = null;
  asignadoUsuarioID: number | null = null;
  saving = false;

  selectedTicket: any = null;
  ticketDetalle: any = null;
  nuevoMensaje = '';
  esInterno = false;
  nuevoEstado = 'Abierto';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadAdministradores();
    this.loadTickets();
  }

  private get usuarioId(): number | undefined {
    return this.authService.getUser()?.usuarioID;
  }

  get filteredTickets(): any[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.tickets;
    return this.tickets.filter(
      (t) =>
        String(t.ticketID).includes(q) ||
        (t.titulo || '').toLowerCase().includes(q) ||
        (t.estadoTicket || '').toLowerCase().includes(q) ||
        (t.clienteNombre || '').toLowerCase().includes(q) ||
        (t.asignadoUsuarioNombre || '').toLowerCase().includes(q),
    );
  }

  loadAdministradores(): void {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        this.administradores = (res.data || []).filter((u: any) => u.estado !== false);
      },
    });
  }

  adminDisplayName(user: { nombre?: string; email?: string; userName?: string; rolNombre?: string }): string {
    const nombre = (user.nombre || '').trim() || 'Sin nombre';
    const extra = (user.email || user.userName || user.rolNombre || '').trim();
    return extra ? `${nombre} · ${extra}` : nombre;
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getAll().subscribe({
      next: (res: any) => {
        this.tickets = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los tickets', 'error');
      },
    });
  }

  openCreateModal(): void {
    this.nuevoTitulo = '';
    this.nuevoDescripcion = '';
    this.nuevaPrioridad = 'Media';
    this.nuevoCotizacionID = null;
    this.asignadoUsuarioID = null;
    const modalEl = document.getElementById('ticketCreateModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  crearTicket(): void {
    if (!this.nuevoTitulo.trim() || !this.nuevoDescripcion.trim()) {
      Swal.fire('Datos incompletos', 'Título y descripción son obligatorios', 'warning');
      return;
    }

    if (!this.asignadoUsuarioID) {
      Swal.fire('Destinatario requerido', 'Selecciona a qué administrador se enviará el ticket', 'warning');
      return;
    }

    const user = this.authService.getUser();
    this.saving = true;

    this.ticketService
      .create({
        titulo: this.nuevoTitulo.trim(),
        descripcion: this.nuevoDescripcion.trim(),
        prioridad: this.nuevaPrioridad,
        creadoPorUsuarioID: user?.usuarioID,
        asignadoUsuarioID: this.asignadoUsuarioID,
        cotizacionID: this.nuevoCotizacionID ?? undefined,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          document.getElementById('ticketCreateModalClose')?.click();
          Swal.fire('Ticket creado', 'El ticket fue registrado y asignado correctamente', 'success');
          this.loadTickets();
        },
        error: () => {
          this.saving = false;
          Swal.fire('Error', 'No se pudo crear el ticket', 'error');
        },
      });
  }

  openDetailModal(ticket: any): void {
    this.selectedTicket = ticket;
    this.ticketDetalle = null;
    this.nuevoMensaje = '';
    this.esInterno = false;
    this.nuevoEstado = ticket.estadoTicket || 'Abierto';
    this.loadDetalle(ticket.ticketID);
    const modalEl = document.getElementById('ticketDetailModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  loadDetalle(ticketId: number): void {
    this.detalleLoading = true;
    this.ticketService.getDetalle(ticketId, this.usuarioId).subscribe({
      next: (res) => {
        this.ticketDetalle = res?.data || null;
        this.detalleLoading = false;
        window.dispatchEvent(new CustomEvent('ayllu:tickets-vistos'));
      },
      error: () => {
        this.detalleLoading = false;
        Swal.fire('Error', 'No se pudo cargar la conversación del ticket', 'error');
      },
    });
  }

  enviarMensaje(): void {
    if (!this.selectedTicket || !this.nuevoMensaje.trim()) return;

    const user = this.authService.getUser();
    this.ticketService
      .addMensaje({
        ticketID: this.selectedTicket.ticketID,
        mensaje: this.nuevoMensaje.trim(),
        usuarioID: user?.usuarioID,
        autorNombre: user?.nombre || 'Admin',
        esInterno: this.esInterno,
      })
      .subscribe({
        next: () => {
          this.nuevoMensaje = '';
          this.loadDetalle(this.selectedTicket.ticketID);
          this.loadTickets();
        },
        error: () => Swal.fire('Error', 'No se pudo enviar el mensaje', 'error'),
      });
  }

  actualizarEstado(): void {
    if (!this.selectedTicket) return;

    this.ticketService
      .updateEstado({
        ticketID: this.selectedTicket.ticketID,
        estadoTicket: this.nuevoEstado,
      })
      .subscribe({
        next: () => {
          this.selectedTicket.estadoTicket = this.nuevoEstado;
          if (this.ticketDetalle) this.ticketDetalle.estadoTicket = this.nuevoEstado;
          Swal.fire('Estado actualizado', '', 'success');
          this.loadTickets();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el estado', 'error'),
      });
  }

  estadoClass(estado: string): string {
    if (estado === 'Cerrado') return 'bg-success-focus text-success-600 border border-success-main';
    if (estado === 'En progreso') return 'bg-info-focus text-info-600 border border-info-main';
    return 'bg-warning-focus text-warning-600 border border-warning-main';
  }
}
