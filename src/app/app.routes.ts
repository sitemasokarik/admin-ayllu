import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AlertComponent } from './alert/alert.component';
import { AssignRoleComponent } from './assign-role/assign-role.component';
import { CompanyComponent } from './company/company.component';
import { ErrorComponent } from './error/error.component';
import { PresupuestadorComponent } from './presupuestador/presupuestador.component';
import { FormLayoutComponent } from './form-layout/form-layout.component';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { PaginationComponent } from './pagination/pagination.component';
import { RoleAccessComponent } from './role-access/role-access.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { TableBasicComponent } from './table-basic/table-basic.component';
import { TableDataComponent } from './table-data/table-data.component';
import { LocalesComponent } from './locales/locales.component';
import { UsersComponent } from './users/users.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { CategoryComponent } from './category/category.component';
import { FormsComponent } from './forms/forms.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { Home15Component } from './home-15/home-15.component';
import { UserRolePermissionComponent } from './user-role-permission/user-role-permission.component';
import { AuthGuard } from '../guard/auth.guard';
import { ProductComponent } from './product/product.component';
import { ClientsComponent } from './clients/clients.component';
import { AddCategorysComponent } from './add-categorys/add-categorys.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddLocalComponent } from './add-local/add-local.component';
import { ServicesComponent } from './services/services.component';
import { AddServicesComponent } from './add-services/add-services.component';
import { RolesComponent } from './roles/roles.component';
import { EventsComponent } from './events/events.component';
import { PagesComponent } from './pages/pages.component';
import { AddRolComponent } from './add-rol/add-rol.component';
import { PermisosComponent } from './permisos/permisos.component';
import { AddPermisoRolComponent } from './add-permiso-rol/add-permiso-rol.component';
import { AddEventsComponent } from './add-events/add-events.component';

export const routes: Routes = [
    {
        path: '',
        component: SideNavComponent,
        // canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
            //{ path: 'home', component: HomeComponent },
            { path: 'home', component: Home15Component },
            { path: 'inicio', component: Home15Component },
            { path: 'add-blog', component: AddBlogComponent },
            { path: 'add-user', component: AddUserComponent },
            { path: 'add-local', component: AddLocalComponent },
            { path: 'add-product', component: AddProductComponent },
            { path: 'add-categorys', component: AddCategorysComponent },
            { path: 'add-services', component: AddServicesComponent },
            { path: 'add-rol', component: AddRolComponent },
            { path: 'alert', component: AlertComponent },
            { path: 'assign-role', component: AssignRoleComponent },
            { path: 'company', component: CompanyComponent },

            { path: 'form-layout', component: FormLayoutComponent },
            { path: 'form-validation', component: FormValidationComponent },
            { path: 'form', component: FormComponent },
            { path: 'list', component: ListComponent },
            { path: 'pagination', component: PaginationComponent },
            { path: 'role-access', component: RoleAccessComponent },
            { path: 'table-data', component: TableDataComponent },

            { path: 'table-basic', component: TableBasicComponent },
            { path: 'table-data', component: TableDataComponent },
            { path: 'user-role-permission', component: UserRolePermissionComponent },
            { path: 'error', component: ErrorComponent },
            { path: 'presupuestador', component: PresupuestadorComponent },
            { path: 'locales', component: LocalesComponent },
            { path: 'users', component: UsersComponent },
            { path: 'table-forms', component: FormsComponent },
            { path: 'table-cotizaciones', component: CotizacionComponent },
            { path: 'categorys', component: CategoryComponent },
            { path: 'products', component: ProductComponent },
            { path: 'clients', component: ClientsComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'roles', component: RolesComponent },
            { path: 'events', component: EventsComponent },
            { path: 'pages', component: PagesComponent },
            { path: 'permisos', component: PermisosComponent },
            { path: 'add-permiso-rol', component: AddPermisoRolComponent },
            { path: 'add-events', component: AddEventsComponent },
        ]
    },
    { path: 'sign-in', component: SignInComponent },

    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    { path: '**', redirectTo : 'error', pathMatch: 'full'}
];

