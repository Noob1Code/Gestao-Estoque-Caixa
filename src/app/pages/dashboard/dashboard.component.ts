import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar'; 
import { TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button'; 
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { VendaService } from '../../core/services/venda.service';
import { ProdutoService } from '../../core/services/produto.service';
import { VendaResponseDTO } from '../../core/models/venda.dto';
import { ProdutoResponseDTO } from '../../core/models/produto.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    FormsModule, 
    DialogModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit {

  private vendaService = inject(VendaService);
  private produtoService = inject(ProdutoService);

  faturamentoHoje: number = 0;
  qtdVendasHoje: number = 0;
  produtosBaixoEstoque: number = 0;

  topProdutosData: any;
  topProdutosOptions: any;
  estoqueData: any;
  estoqueOptions: any;

  dataInicio: Date | null = new Date(); 
  dataFim: Date | null = new Date();    
  
  baixoEstoqueDialogVisible = false; 
  produtosBaixoEstoqueLista: ProdutoResponseDTO[] = [];

  ngOnInit() {
    this.carregarDadosVendas();
    this.carregarDadosEstoque();
    this.configurarOpcoesGraficos();
  }

  carregarDadosVendas(): void {
    const filtros = { dataInicio: this.dataInicio, dataFim: this.dataFim };

    this.vendaService.listarVendas(filtros).subscribe({
      next: (vendas) => {
        this.calcularKpisVendas(vendas);
        this.gerarGraficoTopProdutos(vendas);
      },
      error: (err) => console.error('Erro ao carregar vendas', err)
    });
  }

  carregarDadosEstoque() {
    this.produtoService.listarTodos({ ativo: true }).subscribe({
      next: (produtos) => {
        this.produtosBaixoEstoqueLista = produtos.filter(p => p.quantidadeEstoque < 10);
        this.produtosBaixoEstoque = this.produtosBaixoEstoqueLista.length;
        this.gerarGraficoEstoque(produtos);
      },
      error: (err) => console.error('Erro ao carregar produtos', err)
    });
  }
  
  aplicarFiltro() {
    this.carregarDadosVendas();
  }
  
  mostrarBaixoEstoque() {
    this.baixoEstoqueDialogVisible = true;
  }

  private calcularKpisVendas(vendas: VendaResponseDTO[]) {
    this.qtdVendasHoje = vendas.length;
    this.faturamentoHoje = vendas.reduce((acc, v) => acc + v.total, 0);
  }

  private gerarGraficoTopProdutos(vendas: VendaResponseDTO[]) {
    const mapaProdutos: { [key: string]: number } = {};

    vendas.forEach(venda => {
      venda.itens.forEach(item => {
        if (mapaProdutos[item.nomeProduto]) {
          mapaProdutos[item.nomeProduto] += item.quantidade;
        } else {
          mapaProdutos[item.nomeProduto] = item.quantidade;
        }
      });
    });
    
    const ordenados = Object.entries(mapaProdutos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.topProdutosData = {
      labels: ordenados.map(item => item[0]),
      datasets: [
        {
          label: 'Qtd. Vendida (Período)',
          data: ordenados.map(item => item[1]),
          backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'],
          borderColor: ['#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3'],
          borderWidth: 1
        }
      ]
    };
  }

  private gerarGraficoEstoque(produtos: ProdutoResponseDTO[]) {
    const comEstoque = produtos.filter(p => p.quantidadeEstoque >= 10).length;
    const baixoEstoque = produtos.filter(p => p.quantidadeEstoque < 10).length;

    this.estoqueData = {
      labels: ['Estoque Saudável', 'Baixo Estoque'],
      datasets: [
        {
          data: [comEstoque, baixoEstoque],
          backgroundColor: ['#22c55e', '#ef4444'],
          hoverBackgroundColor: ['#16a34a', '#dc2626']
        }
      ]
    };
  }

  private configurarOpcoesGraficos() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.topProdutosOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        y: {
          grid: { color: surfaceBorder, drawBorder: false },
          beginAtZero: true,
          ticks: { 
            color: textColorSecondary,
            stepSize: 1 
          }
        }
      }
    };

    this.estoqueOptions = {
      plugins: {
        legend: {
          labels: { usePointStyle: true, color: textColor }
        }
      }
    };
  }

  limparFiltros(): void {
    this.dataInicio = null;
    this.dataFim = null;
    this.carregarDadosVendas();
  }
}