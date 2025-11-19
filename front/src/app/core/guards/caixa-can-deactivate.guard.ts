import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { CaixaComponent } from '../../pages/caixa/caixa.component'; 
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';

export const CaixaCanDeactivateGuard: CanDeactivateFn<CaixaComponent> = (
  component: CaixaComponent
) => {

  const confirmationService = inject(ConfirmationService); 
  if (component.itensVenda.length === 0) {
    return true;
  }
  
  return new Observable<boolean>(observer => {
    confirmationService.confirm({
      message: 'Você tem itens no carrinho. Deseja realmente sair e perder esta venda?',
      header: 'Atenção: Venda em Andamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Sair',
      rejectLabel: 'Não, Continuar Editando',
      accept: () => {
        component.cancelarVenda(); 
        observer.next(true); 
        observer.complete();
      },
      reject: () => {
        observer.next(false);
        observer.complete();
      }
    });
  });
};