import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Equipos } from '../models/equipos.model';
import { Ictiometros } from '../models/ictiometro.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class IctiometroService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  Listar(): Observable<Ictiometros[]>{
      return this.httpClient.get<Ictiometros[]>(`${this.url}/ListarIctiometros`, { withCredentials:true});
    }
  buscarIctiometros(codigo: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}/buscarIctiometros`, {
      params: { 
        search: codigo,
        limit: '2000'
      }
    });
  }
  }