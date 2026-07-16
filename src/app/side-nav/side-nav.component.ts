import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { TicketService } from '../../service/ticket.service';
import { filter, Subscription } from 'rxjs';
import {
  DEFAULT_MENU_BY_PAGE,
  HIDDEN_MENU_PAGE_IDS,
  MENU_GROUP_META,
  resolveMenuDisplayName,
} from '../config/menu.config';
import {
  getCotizacionesVistoDesde,
  isCotizacionesListUrl,
  markCotizacionesVistas,
} from '../config/header-alerts.util';

interface MenuItem {
  paginaID: number;
  nombre: string;
  ruta: string;
  icono: string;
  grupoMenu?: string | null;
  ordenMenu: number;
}

interface MenuGroup {
  name: string;
  icon: string;
  order: number;
  items: MenuItem[];
  open: boolean;
}

type MenuSection =
  | { kind: 'item'; order: number; item: MenuItem }
  | { kind: 'group'; order: number; group: MenuGroup };

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SideNavComponent implements OnInit, OnDestroy {
  userName = '';
  userRole = '';

  currentYear = new Date().getFullYear();
  @ViewChild('themeButton') themeButton!: ElementRef<HTMLElement>;

  currentThemeSetting = 'light';
  isSidebarOpen = true;
  menuStandalone: MenuItem[] = [];
  menuGroups: MenuGroup[] = [];
  menuSections: MenuSection[] = [];
  permisos: any[] = [];
  alertVouchers = 0;
  alertTickets = 0;
  alertCotizaciones = 0;
  showHeaderAlerts = false;

  private ticketsVistosHandler = () => this.loadHeaderAlerts();
  private cotizacionesVistasHandler = (): void => {
    this.alertCotizaciones = 0;
    this.loadHeaderAlerts();
  };
  private routerSub?: Subscription;

  constructor(
    private themeService: ThemeService,
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService,
    private userService: UserService,
    private ticketService: TicketService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user?.nombre ?? '';
    this.userRole = user?.rolNombre ?? '';

    this.loadPermisosAndBuildMenu(user?.rolID);
    this.showHeaderAlerts = this.authService.isAdministradorGeneral();
    if (this.showHeaderAlerts) {
      this.loadHeaderAlerts();
    }
    window.addEventListener('ayllu:tickets-vistos', this.ticketsVistosHandler);
    window.addEventListener('ayllu:cotizaciones-vistas', this.cotizacionesVistasHandler);

    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.syncGroupOpenState();
        if (this.showHeaderAlerts && isCotizacionesListUrl(event.urlAfterRedirects)) {
          markCotizacionesVistas(this.authService.getUser()?.usuarioID);
        }
      });

    const localStorageTheme = localStorage.getItem('theme');
    this.currentThemeSetting = this.themeService.calculateSettingAsThemeString(localStorageTheme);

    setTimeout(() => {
      if (this.themeButton) {
        this.themeService.updateButton(this.themeButton.nativeElement, this.currentThemeSetting === 'dark');
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    window.removeEventListener('ayllu:tickets-vistos', this.ticketsVistosHandler);
    window.removeEventListener('ayllu:cotizaciones-vistas', this.cotizacionesVistasHandler);
    this.renderer.removeClass(document.body, 'overlay-active');
  }

  private loadPermisosAndBuildMenu(rolId?: number): void {
    const cached = JSON.parse(localStorage.getItem('permisos') || '[]');
    this.permisos = cached;
    this.buildMenu();

    if (!rolId) return;

    this.authService.getRolById(rolId).subscribe({
      next: (rolResp: any) => {
        const fresh = rolResp?.data?.permisos;
        if (Array.isArray(fresh) && fresh.length) {
          this.permisos = fresh;
          localStorage.setItem('permisos', JSON.stringify(fresh));
          this.buildMenu();
        }
      },
    });
  }

  private resolveMenuMeta(p: any): { grupo: string | null; orden: number } {
    const paginaId = Number(p.paginaID);
    const defaults = DEFAULT_MENU_BY_PAGE[paginaId];
    const grupoRaw = p.grupoMenu ?? defaults?.grupo ?? null;
    const grupo = grupoRaw?.trim() || null;
    const orden = p.ordenMenu ?? defaults?.orden ?? 999;
    return { grupo, orden };
  }

  private buildMenu(): void {
    const currentPath = this.currentPath();

    const items: MenuItem[] = this.permisos
      .filter((p) => p.puedeVer && !HIDDEN_MENU_PAGE_IDS.has(Number(p.paginaID)))
      .map((p) => {
        const meta = this.resolveMenuMeta(p);
        return {
          paginaID: p.paginaID,
          nombre: resolveMenuDisplayName(p.url, p.paginaNombre),
          ruta: p.url,
          icono: p.icono || 'circle-line',
          grupoMenu: meta.grupo,
          ordenMenu: meta.orden,
        };
      });

    const grouped = new Map<string, MenuItem[]>();
    const standalone: MenuItem[] = [];

    for (const item of items) {
      if (item.grupoMenu) {
        if (!grouped.has(item.grupoMenu)) grouped.set(item.grupoMenu, []);
        grouped.get(item.grupoMenu)!.push(item);
      } else {
        standalone.push(item);
      }
    }

    // Grupos con un solo ítem → enlace directo (evita dropdowns de 1 opción)
    for (const [name, groupItems] of [...grouped.entries()]) {
      if (groupItems.length === 1) {
        standalone.push(groupItems[0]);
        grouped.delete(name);
      }
    }

    this.menuStandalone = standalone.sort((a, b) => a.ordenMenu - b.ordenMenu);

    this.injectExtraMenuItems(grouped, items);

    this.menuGroups = Array.from(grouped.entries())
      .map(([name, groupItems]) => {
        const meta = MENU_GROUP_META[name] ?? { icon: groupItems[0]?.icono || 'folder-line', order: 500 };
        const sortedItems = groupItems.sort((a, b) => a.ordenMenu - b.ordenMenu);
        const isActiveGroup = sortedItems.some((i) => this.routeMatches(i.ruta, currentPath));
        return {
          name,
          icon: meta.icon,
          order: meta.order,
          items: sortedItems,
          open: isActiveGroup,
        };
      })
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'es'));

    const sections: MenuSection[] = [
      ...this.menuStandalone.map((item) => ({ kind: 'item' as const, order: item.ordenMenu, item })),
      ...this.menuGroups.map((group) => ({ kind: 'group' as const, order: group.order, group })),
    ];
    this.menuSections = sections.sort((a, b) => a.order - b.order);
    this.syncGroupOpenState();
  }

  private currentPath(): string {
    return this.router.url.replace(/^\//, '').split('?')[0];
  }

  /** Solo el grupo de la ruta actual queda abierto (evita varios headers naranja). */
  private syncGroupOpenState(): void {
    const currentPath = this.currentPath();
    for (const group of this.menuGroups) {
      group.open = group.items.some((item) => this.routeMatches(item.ruta, currentPath));
    }
  }

  private routeMatches(menuRoute: string, currentPath: string): boolean {
    const r = (menuRoute || '').replace(/^\//, '');
    return currentPath === r || currentPath.startsWith(`${r}/`);
  }

  /** Rutas extra visibles si el rol tiene acceso a cotizaciones. */
  private injectExtraMenuItems(grouped: Map<string, MenuItem[]>, items: MenuItem[]): void {
    const canCotizaciones = items.some((i) => i.ruta === 'table-cotizaciones');
    if (!canCotizaciones) return;

    const groupName = 'Ventas y cotizaciones';
    if (!grouped.has(groupName)) grouped.set(groupName, []);

    const exists = grouped.get(groupName)!.some((i) => i.ruta === 'cotizaciones-evento');
    if (!exists) {
      grouped.get(groupName)!.push({
        paginaID: 903,
        nombre: 'Cotizaciones evento',
        ruta: 'cotizaciones-evento',
        icono: 'calendar-event-line',
        grupoMenu: groupName,
        ordenMenu: DEFAULT_MENU_BY_PAGE[903]?.orden ?? 3,
      });
    }
  }

  toggleGroupMenu(group: MenuGroup, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const opening = !group.open;
    if (opening) {
      for (const other of this.menuGroups) {
        if (other !== group) {
          other.open = false;
        }
      }
    }
    group.open = opening;
  }

  toggleSidebar(event: Event) {
    const toggleButton = event.currentTarget as HTMLElement;

    if (toggleButton.classList.contains('active')) {
      this.renderer.removeClass(toggleButton, 'active');
    } else {
      this.renderer.addClass(toggleButton, 'active');
    }

    const sidebar = this.el.nativeElement.querySelector('.sidebar');
    if (sidebar.classList.contains('active')) {
      this.renderer.removeClass(sidebar, 'active');
    } else {
      this.renderer.addClass(sidebar, 'active');
    }

    const dashboardMain = this.el.nativeElement.querySelector('.dashboard-main');
    if (dashboardMain.classList.contains('active')) {
      this.renderer.removeClass(dashboardMain, 'active');
    } else {
      this.renderer.addClass(dashboardMain, 'active');
    }
  }

  openSidebar() {
    this.isSidebarOpen = true;
    this.renderer.addClass(document.body, 'overlay-active');
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.renderer.removeClass(document.body, 'overlay-active');
  }

  toggleTheme(): void {
    const newTheme = this.currentThemeSetting === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);

    if (this.themeButton) {
      this.themeService.updateButton(this.themeButton.nativeElement, newTheme === 'dark');
      this.themeService.updateThemeOnHtmlEl(newTheme);
    }

    this.currentThemeSetting = newTheme;
  }

  private loadHeaderAlerts(): void {
    const usuarioId = this.authService.getUser()?.usuarioID;
    const vistoDesde = getCotizacionesVistoDesde(usuarioId);
    this.userService.countPagoVouchersPendientes().subscribe({
      next: (res) => (this.alertVouchers = Number(res?.data?.count ?? 0)),
    });
    this.ticketService.countAlertas(usuarioId).subscribe({
      next: (res) => (this.alertTickets = Number(res?.data?.count ?? 0)),
    });
    this.userService.countCotizacionesRecientes(vistoDesde).subscribe({
      next: (res) => (this.alertCotizaciones = Number(res?.data?.count ?? 0)),
    });
  }
}
