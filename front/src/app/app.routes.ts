import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { EstoqueComponent } from './pages/admin/estoque/estoque.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { LoginComponent } from './pages/login/login.component';
import { OperadorGuard } from './core/guards/operador.guard';
import { CaixaComponent } from './pages/caixa/caixa.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CaixaCanDeactivateGuard } from './core/guards/caixa-can-deactivate.guard'; 
import { FormCanDeactivateGuard } from './core/guards/form-can-deactivate.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent // Protegida (AuthGuard), op e adm
            },
            {
                path: 'admin/usuarios',
                component: UsuariosComponent,
                canActivate: [AdminGuard], // Protegido (só ADMIN)
                canDeactivate: [FormCanDeactivateGuard]
            },
            {
                path: 'admin/estoque',
                component: EstoqueComponent,
                canActivate: [AdminGuard], // Protegido (só ADMIN)
                canDeactivate: [FormCanDeactivateGuard]
            },
            {
                path: 'caixa',
                component: CaixaComponent,
                canActivate: [OperadorGuard], // Protegida (só OPERADOR)
                canDeactivate: [CaixaCanDeactivateGuard]

            },
            {
                path: 'relatorios',
                component: RelatoriosComponent // Protegida (AuthGuard), op e adm
            },

        ]
    },

    { path: '**', redirectTo: 'login' }
];