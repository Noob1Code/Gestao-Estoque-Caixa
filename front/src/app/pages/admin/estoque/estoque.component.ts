import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProdutoService } from '../../../core/services/produto.service';
import { ProdutoRequestDTO, ProdutoResponseDTO, MovimentoEstoqueRequestDTO } from '../../../core/models/produto.dto';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToolbarModule,
    CardModule,
    ConfirmDialogModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    TagModule,
    InputSwitchModule
  ],
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css'],
  providers: [ConfirmationService]
})
export class EstoqueComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private produtoService = inject(ProdutoService);

  produtos: ProdutoResponseDTO[] = [];
  produtoDialog = false;
  produtoForm!: FormGroup;
  isEditMode = false;
  selectedProdutoId: number | null = null;

  movimentoDialog = false;
  movimentoForm!: FormGroup;
  produtoSelecionado: ProdutoResponseDTO | null = null;

  tiposMovimento: { label: string, value: string }[] = [
    { label: 'Entrada (Compra)', value: 'ENTRADA' },
    { label: 'Ajuste (Perda/Acerto)', value: 'AJUSTE' }
  ];

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      codigo: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      quantidadeEstoque: [0, [Validators.required, Validators.min(0)]],
      precoUnitario: [0, [Validators.required, Validators.min(0)]],
      ativo: [true, [Validators.required]]
    });

    this.movimentoForm = this.fb.group({
      tipo: [null, [Validators.required]],
      quantidade: [null, [Validators.required, Validators.pattern(/^-?[0-9]\d*$/)]],
      motivo: ['']
    });

    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (data) => {
        this.produtos = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar produtos.' });
      }
    });
  }

  abrirDialogNovo(): void {
    this.isEditMode = false;
    this.selectedProdutoId = null;
    this.produtoForm.reset({ quantidadeEstoque: 0, precoUnitario: 0, ativo: true });
    this.produtoForm.markAsPristine();
    this.produtoDialog = true;
  }

  abrirDialogMovimento(produto: ProdutoResponseDTO): void {
    this.produtoSelecionado = produto;
    this.movimentoForm.reset();
    this.movimentoDialog = true;
  }

  fecharDialogMovimento(): void {
    this.movimentoDialog = false;
    this.produtoSelecionado = null;
  }

  abrirDialogEditar(produto: ProdutoResponseDTO): void {
    this.isEditMode = true;
    this.selectedProdutoId = produto.id;
    this.produtoForm.patchValue(produto);
    this.produtoForm.markAsPristine();
    this.produtoDialog = true;
  }

  salvarProduto(): void {
    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    const request: ProdutoRequestDTO = this.produtoForm.value;

    if (this.isEditMode && this.selectedProdutoId) {
      this.produtoService.atualizar(this.selectedProdutoId, request).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Produto ${response.nome} atualizado.` });
          this.produtoForm.markAsPristine();
          this.fecharDialog();
          this.carregarProdutos();
        },
        error: (err) => { 
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message || 'Falha ao atualizar produto.' });
        }
      });

    } else {
      this.produtoService.criar(request).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Produto ${response.nome} criado.` });
          this.produtoForm.markAsPristine();
          this.fecharDialog();
          this.carregarProdutos();
        },
        error: (err) => { 
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message || 'Falha ao criar produto.' });
        }
      });
    }
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este produto?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.produtoService.deletar(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído.' });
            this.carregarProdutos();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir produto.' });
          }
        });
      }
    });
  }

  fecharDialog(): void {
    if (this.produtoForm.dirty) {
      this.confirmationService.confirm({
        message: 'Você tem alterações não salvas. Deseja realmente sair e descartar as mudanças?',
        header: 'Atenção: Dados não Salvos',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, Descartar',
        rejectLabel: 'Não, Continuar Editando',
        accept: () => {
          this.produtoForm.reset();
          this.produtoDialog = false;
        }
      });
    } else {
      this.produtoDialog = false;
    }
  }

  salvarMovimento(): void {
    if (this.movimentoForm.invalid || !this.produtoSelecionado) {
      this.movimentoForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha o Tipo e a Quantidade.' });
      return;
    }

    const formData = this.movimentoForm.value;

    if (formData.tipo === 'ENTRADA' && formData.quantidade <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Para ENTRADA, a quantidade deve ser positiva.' });
      return;
    }

    const usuarioLogado = this.authService.getLoggedUser;
    if (!usuarioLogado || !usuarioLogado.id) {
      this.messageService.add({ severity: 'error', summary: 'Erro Fatal', detail: 'Sessão expirada. Faça login novamente.' });
      this.authService.logout();
      return;
    }

    const request: MovimentoEstoqueRequestDTO = {
      tipo: formData.tipo,
      quantidade: Number(formData.quantidade),
      motivo: formData.motivo,
      usuarioId: usuarioLogado.id
    };

    this.produtoService.movimentarEstoque(this.produtoSelecionado.id, request).subscribe({
      next: (produtoAtualizado) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Estoque de ${produtoAtualizado.nome} atualizado para ${produtoAtualizado.quantidadeEstoque}.`
        });
        this.fecharDialogMovimento();
        this.carregarProdutos();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message || 'Falha ao movimentar estoque.' });
      }
    });
  }
}