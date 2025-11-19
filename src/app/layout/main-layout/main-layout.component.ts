import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { inject } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    MenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  sidebarVisible = false;
  menuItems: MenuItem[] = [];
  nomeUsuario = '';

  private userSubscription: Subscription | undefined;
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(usuario => {
      if (usuario) {
        this.nomeUsuario = usuario.nomeCompleto || 'Usuário';
        const perfil = usuario.perfil;
        this.carregarMenu(perfil);
      } else {
        this.nomeUsuario = '';
        this.carregarMenu(null);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private carregarMenu(perfil: string | null): void {
    const menu: MenuItem[] = [];

    if (perfil === 'ADMIN') {
      menu.push({
        label: 'Administração',
        items: [
          {
            label: 'Gerenciar Usuários',
            icon: 'pi pi-users',
            routerLink: '/admin/usuarios'
          },
          {
            label: 'Gestão de Estoque',
            icon: 'pi pi-box',
            routerLink: '/admin/estoque'
          }
        ]
      });
    }

    if (perfil === 'OPERADOR') {
      menu.push({
        label: 'Operador',
        items: [
          {
            label: 'Caixa / Vendas',
            icon: 'pi pi-shopping-cart',
            routerLink: '/caixa'
          }
        ]
      });
    }

    if (perfil) {
      menu.push({
        label: 'Geral',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/dashboard'
          },
          {
            label: 'Relatórios',
            icon: 'pi pi-chart-bar',
            routerLink: '/relatorios'
          }
        ]
      });
    }

    this.menuItems = menu;
  }

  logout(): void {
    this.authService.logout();
  }
}