import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdutoRequestDTO, ProdutoResponseDTO, MovimentoEstoqueRequestDTO } from '../models/produto.dto';
@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = 'http://localhost:8080/api/produtos';
  private http = inject(HttpClient);

  listarTodos(filtros?: { ativo: boolean }): Observable<ProdutoResponseDTO[]> {
    let params = new HttpParams();
    if (filtros && filtros.ativo === true) {
      params = params.append('ativo', 'true');
    }
    return this.http.get<ProdutoResponseDTO[]>(this.apiUrl, { params });
  }

  criar(produto: ProdutoRequestDTO): Observable<ProdutoResponseDTO> {
    return this.http.post<ProdutoResponseDTO>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: ProdutoRequestDTO): Observable<ProdutoResponseDTO> {
    return this.http.put<ProdutoResponseDTO>(`${this.apiUrl}/${id}`, produto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  movimentarEstoque(idProduto: number, movimento: MovimentoEstoqueRequestDTO): Observable<ProdutoResponseDTO> {
    return this.http.post<ProdutoResponseDTO>(`${this.apiUrl}/movimentar/${idProduto}`, movimento);
  }
}