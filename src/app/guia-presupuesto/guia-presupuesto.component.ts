import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ProductoEjemplo {
  nombre: string;
  precio: number;
}

interface GrupoMenu {
  categoria: string;
  limite?: string;
  productos: ProductoEjemplo[];
}

interface PasoFormula {
  orden: number;
  titulo: string;
  formula: string;
  detalle: string;
}

@Component({
  selector: 'app-guia-presupuesto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './guia-presupuesto.component.html',
  styleUrl: './guia-presupuesto.component.css',
})
export class GuiaPresupuestoComponent {
  readonly garantia = 500;
  readonly personalServicio = 100;

  readonly pasos: PasoFormula[] = [
    {
      orden: 1,
      titulo: 'Costo por invitado (solo menú)',
      formula: 'Σ precios productos seleccionados',
      detalle:
        'Se suman los precios de venta de coctel, entrada, fondo, entremeses y otras subcategorías del menú. El personal de servicio no entra aquí.',
    },
    {
      orden: 2,
      titulo: 'Subtotal menú (menú × invitados)',
      formula: 'N° invitados × costo por invitado',
      detalle: 'Solo platos y bebidas del menú multiplicados por la cantidad de invitados.',
    },
    {
      orden: 3,
      titulo: 'Cargos fijos del evento',
      formula: 'Alquiler + garantía (S/ 500) + personal (S/ 100) + adicionales',
      detalle:
        'Montos que no dependen del menú por persona: local, garantía, personal de servicio y servicios adicionales.',
    },
    {
      orden: 4,
      titulo: 'Total estimado',
      formula: 'Subtotal menú + alquiler + garantía + personal + adicionales',
      detalle: 'Es el monto que ves en el panel derecho del cotizador.',
    },
    {
      orden: 5,
      titulo: 'Precio por cubierto (al guardar cotización)',
      formula: 'Total estimado ÷ N° invitados',
      detalle:
        'Cuánto cuesta, en promedio, cada invitado incluyendo local, garantía y extras.',
    },
  ];

  readonly ejemplo = {
    invitados: 100,
    localNombre: 'Salón Gran Canevaro',
    localDireccion: 'Jirón de la Unión 364',
    localCapacidad: 180,
    alquiler: 7000,
    adicionalesTotal: 3500,
    adicionalesNota: 'Suma de servicios adicionales seleccionados (decoración, música, etc.)',
  };

  readonly gruposMenu: GrupoMenu[] = [
    {
      categoria: 'Coctel',
      limite: 'Máx. 2',
      productos: [
        { nombre: 'Pisco Sour', precio: 2 },
        { nombre: 'Algarrobina', precio: 2 },
      ],
    },
    {
      categoria: 'Entremeses',
      limite: 'Máx. 5',
      productos: [
        { nombre: 'Causitas al olivo', precio: 2 },
        { nombre: 'Spring roll de lomo', precio: 2 },
        { nombre: 'Brochetas de pollo con aroma parrillero', precio: 100 },
        { nombre: 'Fingers de pollo', precio: 100 },
        { nombre: 'Triple de durazno, queso y pollo', precio: 100 },
      ],
    },
    {
      categoria: 'Entrada',
      limite: 'Máx. 2',
      productos: [
        { nombre: 'Soufflé de brócoli con tocino', precio: 100 },
        { nombre: 'Quiche de poro y tomates deshidratados', precio: 100 },
      ],
    },
    {
      categoria: 'Fondo',
      limite: 'Máx. 2',
      productos: [
        {
          nombre: 'Medallón de cerdo en su jugo con arroz a la florentina y papitas al romero',
          precio: 100,
        },
        {
          nombre: 'Medallón de pavo relleno de guindones con arroz árabe y puré de manzana',
          precio: 100,
        },
      ],
    },
  ];

  subtotalGrupo(grupo: GrupoMenu): number {
    return grupo.productos.reduce((s, p) => s + p.precio, 0);
  }

  get subtotalMenuPorInvitado(): number {
    return this.gruposMenu.reduce((s, g) => s + this.subtotalGrupo(g), 0);
  }

  get subtotalMenuTotal(): number {
    return this.subtotalMenuPorInvitado * this.ejemplo.invitados;
  }

  get totalEstimado(): number {
    return (
      this.subtotalMenuTotal +
      this.ejemplo.alquiler +
      this.garantia +
      this.personalServicio +
      this.ejemplo.adicionalesTotal
    );
  }

  get precioPorCubierto(): number {
    return this.totalEstimado / this.ejemplo.invitados;
  }

  formatSoles(value: number): string {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
