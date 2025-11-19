import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class OperadorGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  canActivate(): boolean {
    const userRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && userRole === 'OPERADOR') {
      return true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Acesso Negado',
        detail: 'Você não tem permissão para acessar esta página.'
      });

      this.router.navigate(['/']);
      return false;
    }
  }
}