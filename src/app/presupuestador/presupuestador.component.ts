import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserService } from '../../service/user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';
import { generarPDF } from './pdf-generator';

@Component({
  selector: 'app-presupuestador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './presupuestador.component.html',
  styleUrl: './presupuestador.component.css'
})
export class PresupuestadorComponent {

  title = 'Presupuestador';

  loading: boolean = true;

  locales: any[] = [];
  serviciosAdicionales: any[] = [];
  paquetePersonal: any[] = [];
  categories: any[] = [];
  products: any[] = [];
  modalImage: string | null = null;
  personal: [];

  // =========================================================
  // 🔥 OBJETO PRESUPUESTO COMPLETO Y CORRECTO
  // =========================================================
  presupuesto: any = {
    cliente: {
      nombre: "",
      apellido: "",
      telefono1: "",
      telefono2: "",
      correo: "",
      tipoDocumento: "",
      documento: ""
    },
    
    evento: {
      tipo: "",
      invitados: 0,
      fecha1: "",
      fecha2: ""
    },

    local: null,

    categorias: {
      coctel: null,        // 1
      entrada: null,       // 3
      fondo: null,         // 4
      entremeses: [],      // 2 (máx 5)
      
      mesasSillas: [],     // 5
      menajeria: [],       // 6
      fuentes: []          // 7
    },

    adicionales: [],
    costoPorInvitado: 0,
    totales: {}
  };


  resumen = {
    local: null,
    coctel: null,
    entrada: null,
    fondo: null,
    entremeses: [],
    adicionales: [],
    total: 0
  };

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
pendingLoads = 4; // locales, categories, products, servicios
  onSubmit() {
    console.log("Formulario enviado");
    // más lógica luego
  }
  // =========================================================
  // 🟦 CARGA DE DATOS
  // =========================================================
  ngOnInit(): void {
    localStorage.removeItem("presupuesto");
    this.presupuesto.categorias = {
      coctel: null,
      entrada: null,
      fondo: null,
      entremeses: [],
      mesasSillas: [],
      menajeria: [],
      fuentes: []
    };    
    this.loadLocales();
    this.loadCategories();
    this.loadProducts();
    this.loadServiciosAdicionales();
  }

  private finishLoad() {
    this.pendingLoads--;
    if (this.pendingLoads === 0) {
      this.loading = false;
    }
  }
  selectedCategory: any = null;
  selectedSubcategory: any = null;

  selectCategory(cat: any) {
    this.selectedCategory = cat;
    this.selectedSubcategory = null; // resetear subcategoría
  }

  selectSubcategory(sub: any, cat: any) {
    this.selectedSubcategory = { ...sub, categoriaPadreID: cat.categoriaID };
  }

  isProductoSeleccionado(producto: any, subcategoria: any) {
    if (!subcategoria || !subcategoria.nombre) return false; // evita errores

    const categoriaKey = subcategoria.nombre.toLowerCase();

    if (categoriaKey === 'entremeses') {
      return this.presupuesto.categorias.entremeses.some(p => p.productoID === producto.productoID);
    } else {
      return this.presupuesto.categorias[categoriaKey]?.productoID === producto.productoID;
    }
  }




  localesFiltrados: any[] = []; // <- Nuevo array para mostrar en HTML

  filtrarLocalesPorInvitados() {
    const invitados = this.presupuesto.evento.invitados || 0;

    if (invitados <= 0) {
      // Si no hay invitados, mostrar todos
      this.localesFiltrados = [...this.locales];
      return;
    }

    this.localesFiltrados = this.locales.filter(local => local.capacidad >= invitados);
  }  

loadLocales(): void {
  this.userService.getAllLocales().subscribe({
    next: res => {
      // Filtramos solo los locales activos
      this.locales = (res.data || []).filter(local => local.estado === true);

      // Inicializamos locales filtrados
      this.localesFiltrados = [...this.locales];

      this.finishLoad();
    },
    error: () => this.finishLoad()
  });
}

  loadServiciosAdicionales(): void {
    this.userService.getAllServicios().subscribe({
      next: res => {
        this.serviciosAdicionales = res.data || [];
        this.finishLoad();
      },
      error: () => this.finishLoad()
    });
  }

  getLeafCategories(categories: any[]): any[] {
    let leaves: any[] = [];

    categories.forEach(cat => {
      if (cat.esHoja) {
        leaves.push(cat);
      }
      if (cat.subcategorias && cat.subcategorias.length > 0) {
        leaves = leaves.concat(this.getLeafCategories(cat.subcategorias));
      }
    });

    return leaves;
  }

  loadCategories(): void {
    this.userService.getAllHierarchy().subscribe({
      next: res => {
         console.log("Categori:", res);
        this.categories = res.data || [];
        this.finishLoad();
      },
      error: () => this.finishLoad()
    });
  }
 

  loadProducts(): void {
    this.userService.getAllProducts().subscribe({
      
      next: res => {
        console.log("products loaded:", res);
        this.products = res.data || [];
        this.finishLoad();
      },
      error: () => this.finishLoad()
    });
  }

getProductsByLeafCategory(cat: any) {
  // Aquí cat es un objeto subcategoría
  if (!cat || !cat.categoriaID) return [];
  return this.products.filter(p => p.categoriaID === cat.categoriaID && p.estado === true);
}
 
  // =========================================================
  // 🔥 MÉTODOS DE SELECCIÓN
  // =========================================================
addProducto(subcategoria: any, producto: any) {
  if (!this.presupuesto.categorias) {
    this.presupuesto.categorias = {
      coctel: null,
      entrada: null,
      fondo: null,
      entremeses: [],
      mesasSillas: [],
      menajeria: [],
      fuentes: []
    };
  }

  const categoriaKey = subcategoria.nombre.toLowerCase(); // ejemplo: 'entrada', 'coctel'

  if (categoriaKey === 'entremeses') {
    // Entremeses permite varios productos
    const index = this.presupuesto.categorias.entremeses.findIndex(p => p.productoID === producto.productoID);
    if (index > -1) {
      this.presupuesto.categorias.entremeses.splice(index, 1); // quitar si ya está
    } else if (this.presupuesto.categorias.entremeses.length < 5) {
      this.presupuesto.categorias.entremeses.push(producto); // agregar
    } else {
      alert('Máximo 5 entremeses');
    }
  } else {
    // Categorías que permiten solo 1 producto
    if (this.presupuesto.categorias[categoriaKey] && this.presupuesto.categorias[categoriaKey].productoID === producto.productoID) {
      this.presupuesto.categorias[categoriaKey] = null; // deseleccionar
    } else {
      this.presupuesto.categorias[categoriaKey] = producto; // seleccionar
    }
  }

  this.actualizarResumen(); // actualizar resumen si tienes función
  this.save(); // <-- GUARDO EN LOCALSTORAGE AQUÍ
}



  removeProduct(catId: number, index: number) {
    const c = this.presupuesto.categorias;

    switch (catId) {
      case 2: c.entremeses.splice(index, 1); break;
      case 5: c.mesasSillas.splice(index, 1); break;
      case 6: c.menajeria.splice(index, 1); break;
      case 7: c.fuentes.splice(index, 1); break;
    }

    this.save();
    this.calcularTotales();
    this.actualizarResumen();
    
    Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
  }


  selectLocal(local) {
    this.presupuesto.local = local;
    this.save();
    this.actualizarResumen();
    this.calcularTotales();    
  }

 

  addAdicional(item: any) {
    this.presupuesto.adicionales.push(item);
    this.save();
    this.calcularTotales(); // <-- AGREGAR ESTO
    this.actualizarResumen();
  }

  addPersonal(per) {
    this.presupuesto.personal.push(per);
    this.save();
    this.calcularTotales();
    this.actualizarResumen();
  }

  // =========================================================
  // 🧮 CALCULAR COSTO POR INVITADO
  // =========================================================
  calcularCostoPorInvitado() {
    let total = 0;
    const c = this.presupuesto.categorias;

    // PLATOS PRINCIPALES
    if (c.coctel) total += c.coctel.precio;
    if (c.entrada) total += c.entrada.precio;
    if (c.fondo) total += c.fondo.precio;

    // ENTREMESES
    total += c.entremeses.reduce((a, b) => a + b.precio, 0);

    // MESAS Y SILLAS
    total += c.mesasSillas.reduce((a, b) => a + b.precio, 0);

    // MENAJERIA
    total += c.menajeria.reduce((a, b) => a + b.precio, 0);

    // FUENTES
    total += c.fuentes.reduce((a, b) => a + b.precio, 0);

    // PERSONAL (si existe)
    if (this.presupuesto.personal) {
      total += this.presupuesto.personal.reduce((a, b) => a + b.precio, 0);
    }

    this.presupuesto.costoPorInvitado = total;
    return total;
  }


  // =========================================================
  // 🧮 CALCULAR TOTALES FINALES
  // =========================================================

  calcularTotales() {
    const invitados = this.presupuesto.evento.invitados || 0;
    const costoInv = this.calcularCostoPorInvitado();

    const totalEvento = invitados * costoInv;

    const local = this.presupuesto.local
      ? this.presupuesto.local.precioAlquiler
      : 0;

    const garantia = 500;

    const adicionales = (this.presupuesto.adicionales || [])
      .reduce((a, b) => a + (b.precio || 0), 0);

    const totalFinal = totalEvento + local + garantia + adicionales;

    this.presupuesto.totales = {
      costoPorInvitado: costoInv,
      totalEvento,
      local,
      garantia,
      adicionales,
      totalFinal
    };

    this.save();
  }

  actualizarResumen() {
    const c = this.presupuesto.categorias;

    this.resumen.local = this.presupuesto.local;
    this.resumen.coctel = c.coctel;
    this.resumen.entrada = c.entrada;
    this.resumen.fondo = c.fondo;
    this.resumen.entremeses = c.entremeses;
    this.resumen.adicionales = this.presupuesto.adicionales;
    this.resumen.total = this.presupuesto.totales?.totalFinal || 0;
  }



openImageModal(img: string) {
  this.modalImage = img;
}

closeImageModal() {
  this.modalImage = null;
}

get resumenCompleto(): boolean {
  const r = this.resumen;
  
  return !!(
    r.local &&
    r.coctel &&
    r.entrada &&
    r.fondo &&
    r.entremeses.length > 0
  );
}

  async descargarPDF() {
    const presupuesto = JSON.parse(localStorage.getItem('presupuesto') || '{}');

    // Genera los bytes del PDF
    const pdfBytes = await generarPDF(presupuesto);

    // Crea el BLOB
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Crea el enlace y dispara la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = 'presupuesto.pdf';
    link.click();

    // Limpieza
    URL.revokeObjectURL(url);
  }

  // =========================================================
  // 💾 GUARDAR EN LOCALSTORAGE
  // =========================================================
  save() {
    localStorage.setItem("presupuesto", JSON.stringify(this.presupuesto));
  }

}
