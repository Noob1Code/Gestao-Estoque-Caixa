export interface ProdutoResponseDTO {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeEstoque: number;
  precoUnitario: number;
  ativo: boolean; 
}
export type TipoMovimento = 'ENTRADA' | 'AJUSTE';

export interface ProdutoRequestDTO {
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeEstoque: number;
  precoUnitario: number;
  ativo: boolean;
}

export interface MovimentoEstoqueRequestDTO {
  tipo: TipoMovimento;
  quantidade: number;
  motivo?: string;
  usuarioId: number;
}