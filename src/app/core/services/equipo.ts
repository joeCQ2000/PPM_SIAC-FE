import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Equipos } from '../models/equipos.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class EquipoService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  Listar(): Observable<Equipos[]>{
      return this.httpClient.get<Equipos[]>(`${this.url}/ListarLosEquipos`, { withCredentials:true});
    }
  buscarEquipos(codigo: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}/buscarEquipos`, {
      params: { 
        search: codigo,
        limit: '2000'
      }
    });
  }
  }