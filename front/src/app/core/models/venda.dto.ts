import { ProdutoResponseDTO } from './produto.dto';

export interface ItemVenda {
  produto: ProdutoResponseDTO; 
  quantidade: number;
  precoUnitario: number; 
  subtotal: number;
}
export interface ItemVendaRequestDTO {
  produtoId: number;
  quantidade: number;
  precoUnitario: number; 
}
export interface VendaRequestDTO {
  usuarioId: number;
  itens: ItemVendaRequestDTO[];
  valorRecebido: number;
  total: number;
}
export interface ItemVendaResponseDTO {
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}
export interface VendaResponseDTO {
  id: number;
  dataVenda: string;
  total: number;
  valorRecebido: number;
  troco: number;
  nomeOperador: string;
  itens: ItemVendaResponseDTO[]; 
}