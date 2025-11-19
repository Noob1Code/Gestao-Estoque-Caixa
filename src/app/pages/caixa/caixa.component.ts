import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api'; 
import { ProdutoService } from '../../core/services/produto.service';
import { VendaService } from '../../core/services/venda.service';
import { AuthService } from '../../core/services/auth.service';
import { ProdutoResponseDTO } from '../../core/models/produto.dto';
import { ItemVenda, VendaRequestDTO, ItemVendaRequestDTO } from '../../core/models/venda.dto';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 

@Component({
  selector: 'app-caixa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    FormsModule,
    InputNumberModule,
    AutoCompleteModule,
    InputTextModule,
    ConfirmDialogModule
  ],
  templateUrl: './caixa.component.html',
  styleUrls: ['./caixa.component.css'],
  providers: [ConfirmationService]
})
export class CaixaComponent implements OnInit {

  itemForm!: FormGroup;
  itensVenda: ItemVenda[] = []; 

  produtosSugeridos: ProdutoResponseDTO[] = [];

  totalVenda = 0;
  valorRecebido: number | null = null;
  troco = 0;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private vendaService = inject(VendaService);
  private messageService = inject(MessageService);
  private produtoService = inject(ProdutoService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      produto: [null, [Validators.required]],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
  }

  buscarProdutos(event: AutoCompleteCompleteEvent): void {
    this.produtoService.listarTodos({ ativo: true }).subscribe(produtosAtivos => {
      this.produtosSugeridos = produtosAtivos.filter(p =>
        p.nome.toLowerCase().includes(event.query.toLowerCase())
      );
    });
  }

  adicionarItem(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const produto = this.itemForm.value.produto as ProdutoResponseDTO;
    const quantidadeParaAdicionar = this.itemForm.value.quantidade;

    const itemExistente = this.itensVenda.find(i => i.produto.id === produto.id);

    if (itemExistente) {
      const novaQuantidadeTotal = itemExistente.quantidade + quantidadeParaAdicionar;
      if (novaQuantidadeTotal > produto.quantidadeEstoque) {
        this.messageService.add({
          severity: 'error',
          summary: 'Estoque Insuficiente',
          detail: `Estoque máximo: ${produto.quantidadeEstoque}. Você já tem ${itemExistente.quantidade} no carrinho e tentou adicionar mais ${quantidadeParaAdicionar}.`
        });
        return;
      }

      itemExistente.quantidade = novaQuantidadeTotal;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;

    } else {
      if (quantidadeParaAdicionar > produto.quantidadeEstoque) {
        this.messageService.add({
          severity: 'error',
          summary: 'Estoque Insuficiente',
          detail: `Estoque disponível: ${produto.quantidadeEstoque}.`
        });
        return;
      }

      const novoItem: ItemVenda = {
        produto: produto,
        quantidade: quantidadeParaAdicionar,
        precoUnitario: produto.precoUnitario,
        subtotal: quantidadeParaAdicionar * produto.precoUnitario
      };
      this.itensVenda.push(novoItem);
    }

    this.atualizarTotal();
    this.limparFormularioItem();
  }

  removerItem(produtoId: number): void {
    this.itensVenda = this.itensVenda.filter(i => i.produto.id !== produtoId);
    this.atualizarTotal();
  }

  private atualizarTotal(): void {
    this.totalVenda = this.itensVenda.reduce((sum, item) => sum + item.subtotal, 0);
    this.calcularTroco();
  }

  calcularTroco(): void {
    if (this.valorRecebido && this.valorRecebido >= this.totalVenda) {
      this.troco = this.valorRecebido - this.totalVenda;
    } else {
      this.troco = 0;
    }
  }

  private limparFormularioItem(): void {
    this.itemForm.reset({ quantidade: 1 });
  }

  private limparEstadoVenda(): void {
    this.itensVenda = [];
    this.valorRecebido = null;
    this.atualizarTotal();
    this.limparFormularioItem();
  }
  
  cancelarVenda(): void {
    if (this.itensVenda.length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Venda cancelada.' });
      this.limparEstadoVenda(); 
      return;
    }
    
    this.confirmationService.confirm({
      message: 'Você tem itens no carrinho. Deseja realmente cancelar esta venda?',
      header: 'Confirmar Cancelamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Cancelar Venda',
      rejectLabel: 'Não, Manter Itens',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Venda cancelada.' });
        this.limparEstadoVenda();
      }
    });
  }

  finalizarVenda(): void {
    const usuarioLogado = this.authService.getLoggedUser;
    if (!usuarioLogado) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Sessão inválida. Faça login novamente.' });
      return;
    }

    if (this.itensVenda.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Adicione pelo menos um item à venda.' });
      return;
    }
    if (!this.valorRecebido || this.valorRecebido < this.totalVenda) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Valor recebido deve ser maior ou igual ao total.' });
      return;
    }

    const itensRequest: ItemVendaRequestDTO[] = this.itensVenda.map(item => ({
      produtoId: item.produto.id,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario
    }));

    const vendaRequest: VendaRequestDTO = {
      usuarioId: usuarioLogado.id,
      itens: itensRequest,
      valorRecebido: this.valorRecebido,
      total: this.totalVenda
    };

    this.vendaService.registrarVenda(vendaRequest).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Venda #${response.id} registrada! Troco: ${response.troco.toFixed(2)}` });
        this.limparEstadoVenda();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro ao Finalizar', detail: err.error.message || 'Não foi possível registrar a venda.' });
      }
    });
  }
}