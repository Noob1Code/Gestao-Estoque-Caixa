import { CanDeactivateFn, } from '@angular/router';
import { inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';

interface CrudComponent {
  [key: string]: any;
  produtoDialog?: boolean;
  usuarioDialog?: boolean;
  produtoForm?: { dirty: boolean };
  usuarioForm?: { dirty: boolean };
}

export const FormCanDeactivateGuard: CanDeactivateFn<CrudComponent> = (
  component: CrudComponent
) => {
  const formGroup = component.produtoForm || component.usuarioForm;
  const isDialogOpen = component.produtoDialog === true || component.usuarioDialog === true;

  if (isDialogOpen && formGroup && formGroup.dirty) {
    
    return new Observable<boolean>(observer => {
      const confirmationService = inject(ConfirmationService); 

      confirmationService.confirm({
        message: 'Você tem alterações não salvas. Deseja realmente sair e descartar as mudanças?',
        header: 'Atenção: Dados não Salvos',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, Descartar',
        rejectLabel: 'Não, Continuar Editando',
        accept: () => {
          observer.next(true); 
          observer.complete();
        },
        reject: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
  return true;
};