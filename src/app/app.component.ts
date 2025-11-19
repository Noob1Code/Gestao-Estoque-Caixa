import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule
  ],
  template: `
    <p-toast></p-toast> 
    <p-confirmDialog></p-confirmDialog> 
    <router-outlet></router-outlet>
  `,
  providers: [ConfirmationService]
})
export class AppComponent {
  title = 'gestao-frontend';
}