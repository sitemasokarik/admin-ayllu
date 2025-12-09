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
import { PresupuestadorConfig } from './presupuestador.config';
import { lastValueFrom } from 'rxjs';

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
  personal: any[] = [];

  eventos: any[] = [];
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
      documento: "",
      personal: []
    },
    eventoID: null,
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
      entremeses: []
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
    this.loadEventos();
  }
  onEventoChange() {
    const ev = this.eventos.find(e => e.eventoID === this.presupuesto.eventoID);

    if (ev) {
      this.presupuesto.evento.tipo = ev.nombre;   // <-- Aquí sí se guarda
      localStorage.setItem("tipoEvento", ev.nombre); // <-- Guardas en localStorage
    } else {
      this.presupuesto.evento.tipo = "";
      localStorage.removeItem("tipoEvento");
    }

    this.save();
  }

  loadEventos(): void {
    this.userService.getAllEventos().subscribe({
      next: (res: any) => {
        this.eventos = res.data || [];
      },
      error: err => {
        console.error("Error cargando Eventos:", err);
        Swal.fire("Error", "No se pudieron cargar las Eventos", "error");
      }
    });
  }

private async crearNuevoCliente(data: any) {
  const resCliente: any = await lastValueFrom(
    this.userService.createCliente({
      tipoDocumento: data.cliente.tipoDocumento,
      numeroDocumento: data.cliente.documento,
      nombreCompleto: `${data.cliente.nombre} ${data.cliente.apellido}`.trim(),
      email: data.cliente.correo,
      telefono: data.cliente.telefono1,
      telefonoSecundario: data.cliente.telefono2,
      direccion: data.cliente.direccion ?? "",
      ciudad: "Lima",
      pais: "Peru",
      tipoCliente: "Natural",
      observaciones: "",
      esVIP: false,
      fechaNacimiento: null,
      usuarioCreacion: "Cesar"
    })
  );

  data.cliente.clienteID = resCliente.data.clienteID;
  this.save();
}


  async generarCotizacionSiNoExiste(): Promise<void> {

    const data = this.presupuesto;

    if (!data.cliente.clienteID) {

      const doc = data.cliente.documento;

      try {
        const resp: any = await lastValueFrom(
          this.userService.getByDocument(doc)
        );

        const idExistente = resp?.data?.clienteID ?? null;

        if (idExistente) {
          // Cliente ya existe
          data.cliente.clienteID = idExistente;
          this.save();
        } else {
          // Respuesta sin cliente → se crea
          await this.crearNuevoCliente(data);
        }

      } catch (error: any) {
        // Si el error viene con 404 → no existe → crear
        if (error?.status === 404) {
          await this.crearNuevoCliente(data);
        } else {
          console.error("❌ Error verificando cliente:", error);
          Swal.fire("Error", "No se pudo comprobar el cliente", "error");
          this.loading = false;
          return;
        }
      }

    }

    // Si ya existe cotización → no crear otra
    if (data.cotizacionID) return;

    // ============================================================
    // 2️⃣ Armado de productos del menú
    // ============================================================
    const c = data.categorias;
    const productos: any[] = [];

    const agregar = (p: any) => {
      if (!p) return;
      productos.push({
        productoID: p.productoID,
        cantidad: 1,
        precio: p.precio,
        usuarioCreacion: "Cesar"
      });
    };

    ["coctel", "entrada", "fondo"].forEach(key => {
      const arr = c[key];
      if (Array.isArray(arr)) arr.forEach(p => agregar(p));
    });

    ["entremeses", "menajeria", "mesassillas", "fuentes", "mesas", "sillas"].forEach(key => {
      const arr = c[key];
      if (Array.isArray(arr)) arr.forEach(p => agregar(p));
    });

    // ============================================================
    // 3️⃣ Servicios adicionales
    // ============================================================
    const servicios = (data.adicionales || []).map(s => ({
      servicioID: s.servicioID,
      cantidad: 1,
      precio: s.precio,
      usuarioCreacion: "Cesar"
    }));

    // ============================================================
    // 4️⃣ Body de Cotización
    // ============================================================
    const t = data.totales;

    const subtotalMenu = t.totalEvento || 0;
    const precioLocal = t.local || 0;
    const garantia = t.garantia || 0;
    const adicionales = t.adicionales || 0;

    const totalEvento = subtotalMenu + precioLocal + garantia + adicionales;
    const tarifaPorInvitado = t.costoPorInvitado || 0;
    const precioPorCubierto =
      data.evento.invitados > 0 ? totalEvento / data.evento.invitados : 0;

    const bodyCotizacion = {
      clienteID: data.cliente.clienteID,
      localID: data.local?.localID ?? 0,
      eventoID: data.eventoID,
      localCapacidad: data.local?.capacidad ?? 0,

      fechaTentativa: data.evento.fecha1,
      fechaTentativaOpcional: data.evento.fecha2,
      numeroInvitados: data.evento.invitados || 0,

      costoDePersonal: PresupuestadorConfig.personal, 

      garantia: garantia,
      subtotalMenu: subtotalMenu,
      totalEvento: totalEvento,
      tarifaMenuPorInvitado: tarifaPorInvitado,
      precioPorCubierto: precioPorCubierto,
      precioPorCubiertoConDescuento: 0,

      totalCotizacion: 0, // Como lo pediste

      observacion: data.observacion ?? "",
      usuarioCreacion: "Admin",
      estadoCotizacion: "Activo",
      estado: true,

      cotizacionProducto: productos,
      cotizacionServicio: servicios
    };

    // ============================================================
    // 5️⃣ Crear Cotización
    // ============================================================
    const resCot: any = await lastValueFrom(
      this.userService.createCotizaciones(bodyCotizacion)
    );

    data.cotizacionID = resCot.data.cotizacionID;
    this.save();
  }




  private normalizeKey(nombre: string): string {
    return nombre
      .toLowerCase()
      .replace(/\s+/g, '')           // elimina espacios
      .replace(/[^a-z0-9]/g, '');    // elimina caracteres raros
  }
  private finishLoad() {
    this.pendingLoads--;
    if (this.pendingLoads === 0) {
      this.loading = false;
    }
  }
  selectedCategory: any = null;
  selectedSubcategory: any = null;
 
  seleccionarProducto(subcat: any, producto: any) {
    const key = this.normalizeKey(subcat.nombre);
    const categorias = this.presupuesto.categorias;

    // Inicializar estructura dinámica
    if (!categorias[key]) {
      categorias[key] = subcat.limite === 1 ? null : [];
    }

    const limite = subcat.limite ?? Infinity;

    // 🔹 Selección única
    if (!Array.isArray(categorias[key])) {
      if (categorias[key]?.productoID === producto.productoID) {
        categorias[key] = null; // deselecciona
      } else {
        categorias[key] = producto; // selecciona
      }
    }

    // 🔹 Multi-selección
    else {
      const existe = categorias[key].some(p => p.productoID === producto.productoID);

      if (existe) {
        categorias[key] = categorias[key].filter(p => p.productoID !== producto.productoID);
      } else {

        // 🔥 Validar límite desde la BD
        if (categorias[key].length >= limite) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: `Máximo ${limite} ${subcat.nombre}`,
            showConfirmButton: false,
            timer: 2000
          });
          return;
        }

        categorias[key].push(producto);
      }
    }

    this.save();
    this.calcularTotales();
    this.actualizarResumen();

  }


  selectCategory(cat: any) {
    this.selectedCategory = cat;
    this.selectedSubcategory = null; // resetear subcategoría
  }

  selectSubcategory(sub: any, cat: any) {
    this.selectedSubcategory = { ...sub, categoriaPadreID: cat.categoriaID };
  }

  isProductoSeleccionado(producto: any, subcat: any): boolean {
    const key = this.normalizeKey(subcat.nombre);
    const val = this.presupuesto.categorias[key];

    if (!val) return false;

    if (Array.isArray(val)) {
      return val.some(p => p.productoID === producto.productoID);
    }

    return val.productoID === producto.productoID;
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
      this.serviciosAdicionales = (res.data || []).map(s => ({
        ...s,
        id: s.servicioID  // ahora cada servicio tendrá la propiedad 'id'
      }));
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
        console.log(leaves);
      }
    });

    return leaves;
  }

loadCategories(): void {
  this.userService.getAllHierarchy().subscribe({
    next: res => {
      console.log(res);
      this.categories = res.data || [];

      // Crea un mapa dinámico de categorías
      this.presupuesto.categorias = {};

      const leaves = this.getLeafCategories(this.categories);

      leaves.forEach(sub => {
        const key = this.normalizeKey(sub.nombre);

        if (sub.limite === 1) {
          this.presupuesto.categorias[key] = null;
        } else {
          this.presupuesto.categorias[key] = [];  // Multi selección
        }
      });

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
  const index = this.presupuesto.adicionales.findIndex(a => a.id === item.id);
  if (index > -1) {
    this.presupuesto.adicionales.splice(index, 1);
  } else {
    this.presupuesto.adicionales.push(item);
  }
  this.save();
  this.calcularTotales();
  this.actualizarResumen();
}

isAdicionalSeleccionado(servicio: any): boolean {
  return this.presupuesto.adicionales.some(a => a.id === servicio.id);
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

  // 1) Platos principales
  ['coctel', 'entrada', 'fondo'].forEach(cat => {
    if (c[cat]) total += c[cat].precio || 0;
  });

  // 2) Entremeses
  total += (c.entremeses || []).reduce((s, p) => s + (p.precio || 0), 0);

  // 3) Otras categorías múltiples (EXCLUYENDO entremeses)
  Object.keys(c).forEach(key => {
    if (key === 'entremeses') return; // 👈 evitar doble suma

    const val = c[key];
    if (Array.isArray(val)) {
      total += val.reduce((s, p) => s + (p.precio || 0), 0);
    }
  });

  // 4) Personal fijo
  total += PresupuestadorConfig.personal;

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

  const local = this.presupuesto.local?.precioAlquiler || 0;
  const garantia = PresupuestadorConfig.garantia; // uso de la configuración

  // Asegurar array
  const adicionales = Array.isArray(this.presupuesto.adicionales)
    ? this.presupuesto.adicionales.reduce((s, p) => s + (p.precio || 0), 0)
    : 0;

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
    r?.local &&
    r?.coctel &&
    r?.entrada &&
    r?.fondo &&
    (r?.entremeses?.length ?? 0) > 0
  );
}

async descargarPDF() {
  try {
    this.loading = true;

    // 1. Generar cotización si aún no existe
    await this.generarCotizacionSiNoExiste();

    // 2. Guardar datos antes del PDF
    this.save();

    const presupuesto = this.presupuesto;
    const pdfBytes = await generarPDF(presupuesto);

    // 3. Descargar PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Presupuesto - ${presupuesto.cliente.nombre} ${presupuesto.cliente.apellido}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // ============================
    // 4. MOSTRAR MODAL DE ÉXITO
    // ============================
    await Swal.fire({
      title: "¡Cotización Realizada!",
      text: "El PDF ha sido generado correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar"
    });

    // ============================
    // 5. BORRAR LOCALSTORAGE
    // ============================
    localStorage.removeItem("presupuesto");

    // ============================
    // 6. REINICIAR TODO EL FORMULARIO
    // ============================
    this.presupuesto = {
      cliente: {
        nombre: "",
        apellido: "",
        telefono1: "",
        telefono2: "",
        correo: "",
        tipoDocumento: "",
        documento: "",
        personal: []
      },

      eventoID: null,

      evento: {
        tipo: "",
        invitados: 0,
        fecha1: "",
        fecha2: ""
      },

      local: null,

      categorias: {
        coctel: null,
        entrada: null,
        fondo: null,
        entremeses: []
      },

      adicionales: [],
      costoPorInvitado: 0,
      totales: {}
    };

  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Error",
      text: "Ocurrió un problema al generar la cotización.",
      icon: "error"
    });

  } finally {
    this.loading = false;
  }
}




  // =========================================================
  // 💾 GUARDAR EN LOCALSTORAGE
  // =========================================================
  save() {
    localStorage.setItem("presupuesto", JSON.stringify(this.presupuesto));
  }

}
