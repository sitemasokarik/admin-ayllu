import { Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { adminGeneralGuard } from '../guard/admin-general.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'guia-presupuesto',
    loadComponent: () =>
      import('./guia-presupuesto/guia-presupuesto.component').then((m) => m.GuiaPresupuestoComponent),
  },
  {
    path: '',
    component: SideNavComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home-15/home-15.component').then((m) => m.Home15Component),
      },
      {
        path: 'inicio',
        loadComponent: () => import('./home-15/home-15.component').then((m) => m.Home15Component),
      },
      {
        path: 'add-blog',
        loadComponent: () => import('./add-blog/add-blog.component').then((m) => m.AddBlogComponent),
      },
      {
        path: 'add-user',
        loadComponent: () => import('./add-user/add-user.component').then((m) => m.AddUserComponent),
      },
      {
        path: 'add-local',
        loadComponent: () => import('./add-local/add-local.component').then((m) => m.AddLocalComponent),
      },
      {
        path: 'add-product',
        loadComponent: () => import('./add-product/add-product.component').then((m) => m.AddProductComponent),
      },
      {
        path: 'add-categorys',
        loadComponent: () => import('./add-categorys/add-categorys.component').then((m) => m.AddCategorysComponent),
      },
      {
        path: 'add-services',
        loadComponent: () => import('./add-services/add-services.component').then((m) => m.AddServicesComponent),
      },
      {
        path: 'add-rol',
        loadComponent: () => import('./add-rol/add-rol.component').then((m) => m.AddRolComponent),
      },
      {
        path: 'alert',
        loadComponent: () => import('./alert/alert.component').then((m) => m.AlertComponent),
      },
      {
        path: 'assign-role',
        loadComponent: () => import('./assign-role/assign-role.component').then((m) => m.AssignRoleComponent),
      },
      {
        path: 'company',
        loadComponent: () => import('./company/company.component').then((m) => m.CompanyComponent),
      },
      {
        path: 'landing-page',
        loadComponent: () => import('./landing-page/landing-page.component').then((m) => m.LandingPageComponent),
      },
      {
        path: 'pagos-vouchers',
        loadComponent: () => import('./pagos-vouchers/pagos-vouchers.component').then((m) => m.PagosVouchersComponent),
      },
      {
        path: 'form-layout',
        loadComponent: () => import('./form-layout/form-layout.component').then((m) => m.FormLayoutComponent),
      },
      {
        path: 'form-validation',
        loadComponent: () => import('./form-validation/form-validation.component').then((m) => m.FormValidationComponent),
      },
      {
        path: 'form',
        loadComponent: () => import('./form/form.component').then((m) => m.FormComponent),
      },
      {
        path: 'list',
        loadComponent: () => import('./list/list.component').then((m) => m.ListComponent),
      },
      {
        path: 'pagination',
        loadComponent: () => import('./pagination/pagination.component').then((m) => m.PaginationComponent),
      },
      {
        path: 'role-access',
        loadComponent: () => import('./role-access/role-access.component').then((m) => m.RoleAccessComponent),
      },
      {
        path: 'table-basic',
        loadComponent: () => import('./table-basic/table-basic.component').then((m) => m.TableBasicComponent),
      },
      {
        path: 'table-data',
        loadComponent: () => import('./table-data/table-data.component').then((m) => m.TableDataComponent),
      },
      {
        path: 'user-role-permission',
        loadComponent: () =>
          import('./user-role-permission/user-role-permission.component').then((m) => m.UserRolePermissionComponent),
      },
      {
        path: 'error',
        loadComponent: () => import('./error/error.component').then((m) => m.ErrorComponent),
      },
      {
        path: 'presupuestador',
        loadComponent: () => import('./presupuestador/presupuestador.component').then((m) => m.PresupuestadorComponent),
      },
      {
        path: 'locales',
        loadComponent: () => import('./locales/locales.component').then((m) => m.LocalesComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'table-forms',
        loadComponent: () => import('./forms/forms.component').then((m) => m.FormsComponent),
      },
      {
        path: 'table-cotizaciones',
        loadComponent: () => import('./cotizacion/cotizacion.component').then((m) => m.CotizacionComponent),
        data: { listMode: 'operaciones', title: 'Cotizaciones' },
      },
      {
        path: 'cotizaciones-evento',
        loadComponent: () => import('./cotizacion/cotizacion.component').then((m) => m.CotizacionComponent),
        data: { listMode: 'evento', title: 'Cotizaciones en evento' },
      },
      {
        path: 'categorys',
        loadComponent: () => import('./category/category.component').then((m) => m.CategoryComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./product/product.component').then((m) => m.ProductComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./clients/clients.component').then((m) => m.ClientsComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('./services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'roles',
        loadComponent: () => import('./roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'events',
        loadComponent: () => import('./events/events.component').then((m) => m.EventsComponent),
      },
      {
        path: 'pages',
        loadComponent: () => import('./pages/pages.component').then((m) => m.PagesComponent),
      },
      {
        path: 'permisos',
        loadComponent: () => import('./permisos/permisos.component').then((m) => m.PermisosComponent),
      },
      {
        path: 'add-permiso-rol',
        loadComponent: () => import('./add-permiso-rol/add-permiso-rol.component').then((m) => m.AddPermisoRolComponent),
      },
      {
        path: 'add-events',
        loadComponent: () => import('./add-events/add-events.component').then((m) => m.AddEventsComponent),
      },
      {
        path: 'facturacion/emitir-boleta',
        canActivate: [adminGeneralGuard],
        loadComponent: () =>
          import('./facturacion/emitir-comprobante/emitir-comprobante.component').then(
            (m) => m.EmitirComprobanteComponent
          ),
        data: { tipo: 'boleta' },
      },
      {
        path: 'facturacion/emitir-factura',
        canActivate: [adminGeneralGuard],
        loadComponent: () =>
          import('./facturacion/emitir-comprobante/emitir-comprobante.component').then(
            (m) => m.EmitirComprobanteComponent
          ),
        data: { tipo: 'factura' },
      },
      {
        path: 'facturacion/comprobantes',
        canActivate: [adminGeneralGuard],
        loadComponent: () =>
          import('./facturacion/comprobantes/comprobantes.component').then((m) => m.ComprobantesComponent),
      },
      {
        path: 'tickets',
        loadComponent: () => import('./tickets/tickets.component').then((m) => m.TicketsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];
