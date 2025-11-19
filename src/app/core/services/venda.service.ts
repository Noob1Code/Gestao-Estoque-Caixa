import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VendaRequestDTO, VendaResponseDTO } from '../models/venda.dto';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  private apiUrl = 'http://localhost:8080/api/vendas';
  private http = inject(HttpClient);

  private toLocalISOString(date: Date): string {
    const pad = (num: number) => (num < 10 ? '0' : '') + num;

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
  }

  registrarVenda(venda: VendaRequestDTO): Observable<VendaResponseDTO> {
    return this.http.post<VendaResponseDTO>(this.apiUrl, venda);
  }

  listarVendas(filtros?: any): Observable<VendaResponseDTO[]> {
    let params = new HttpParams();

    if (filtros && filtros.dataInicio) {
      const dataInicioDate = new Date(filtros.dataInicio);
      params = params.append('dataInicio', this.toLocalISOString(dataInicioDate));
    }
    if (filtros && filtros.dataFim) {
      let dataFim = new Date(filtros.dataFim);
      params = params.append('dataFim', this.toLocalISOString(dataFim));
    }
    return this.http.get<VendaResponseDTO[]>(this.apiUrl, { params });
  }
}