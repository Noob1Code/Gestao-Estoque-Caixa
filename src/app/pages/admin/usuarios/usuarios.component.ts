import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioRequestDTO, UsuarioResponseDTO } from '../../../core/models/usuario.dto';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule,
    ToolbarModule,
    CardModule,
    ConfirmDialogModule,
    TagModule,
    PasswordModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [ConfirmationService]
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioResponseDTO[] = [];
  usuarioDialog = false;
  usuarioForm!: FormGroup;
  isEditMode = false;
  selectedUsuarioId: number | null = null;

  perfis: { label: string, value: string }[] = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Operador', value: 'OPERADOR' }
  ];

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nomeCompleto: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      perfil: [null, [Validators.required]],
      ativo: [true, [Validators.required]]
    });

    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar usuários.' });
      }
    });
  }

  abrirDialogNovo(): void {
    this.isEditMode = false;
    this.selectedUsuarioId = null;
    this.usuarioForm.reset({ ativo: true });
    this.usuarioForm.markAsPristine();

    this.setSenhaValidators(true);

    this.usuarioDialog = true;
  }

  abrirDialogEditar(usuario: UsuarioResponseDTO): void {
    this.isEditMode = true;
    this.selectedUsuarioId = usuario.id;

    this.usuarioForm.patchValue({
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      senha: ''
    });
    this.usuarioForm.markAsPristine();

    this.setSenhaValidators(false);

    this.usuarioDialog = true;
  }

  salvarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    const formData = this.usuarioForm.value;
    const request: UsuarioRequestDTO = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      perfil: formData.perfil,
      ativo: formData.ativo,
    };

    if (formData.senha) {
      request.senha = formData.senha;
    }

    if (this.isEditMode && this.selectedUsuarioId) {
      this.usuarioService.atualizar(this.selectedUsuarioId, request).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Usuário ${response.nomeCompleto} atualizado.` });
          const loggedUserId = this.authService.getLoggedUser?.id;
          if (this.selectedUsuarioId === loggedUserId) {
            this.authService.updateLoggedUser(response);
          }
          this.usuarioForm.markAsPristine();
          this.fecharDialog();
          this.carregarUsuarios();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message || 'Falha ao atualizar usuário.' });
        }
      });

    } else {
      this.usuarioService.criar(request).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Usuário ${response.nomeCompleto} criado.` });
          this.usuarioForm.markAsPristine();
          this.fecharDialog();
          this.carregarUsuarios();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message || 'Falha ao criar usuário.' });
        }
      });
    }
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este usuário?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.usuarioService.deletar(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído.' });
            this.carregarUsuarios();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir usuário.' });
          }
        });
      }
    });
  }

  fecharDialog(): void {
    if (this.usuarioForm.dirty) {
      this.confirmationService.confirm({
        message: 'Você tem alterações não salvas. Deseja realmente sair e descartar as mudanças?',
        header: 'Atenção: Dados não Salvos',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, Descartar',
        rejectLabel: 'Não, Continuar Editando',
        accept: () => {
          this.usuarioForm.reset();
          this.usuarioDialog = false;
        }
      });
    } else {
      this.usuarioDialog = false;
    }
  }

  private setSenhaValidators(isRequired: boolean): void {
    const senhaControl = this.usuarioForm.get('senha');

    const strengthValidators = [
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*\\d).*$')
    ];

    if (isRequired) {
      senhaControl?.setValidators([Validators.required, ...strengthValidators]);
    } else {
      senhaControl?.setValidators(strengthValidators);
    }
    senhaControl?.updateValueAndValidity();
  }
}