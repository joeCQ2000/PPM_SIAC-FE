import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { MuestreoCompleto } from '../models/muestreo.model';
import { PaginadoDTO } from '../models/PaginadoDTO';
import { TablaListadoDeMuestreoDTO } from '../models/TablaListadoDeMuestreoDTO';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class MuestreoCompletoService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  registrar(muestreo: MuestreoCompleto): Observable<MuestreoCompleto> {
    return this.httpClient.post<MuestreoCompleto>(`${this.url}/registrar`, muestreo, { withCredentials:true});
  
    }
  Listar(): Observable<MuestreoCompleto[]>{
      return this.httpClient.get<MuestreoCompleto[]>(`${this.url}/Listar`, { withCredentials:true});
    }
  obtenerPorId (id: number){
      return this.httpClient.get<MuestreoCompleto>(`${this.url}/${id}`, { withCredentials:true})
    }
  actualizar(id: number , muestreo : MuestreoCompleto){
      return this.httpClient.put<MuestreoCompleto[]>(`${this.url}/Actualizar`, muestreo, { withCredentials:true});
    }
  finalizar(id: number, muestreo: MuestreoCompleto) {
  return this.actualizar(id, muestreo);
    }

 listado(page = 1, pageSize = 10): Observable<PaginadoDTO<TablaListadoDeMuestreoDTO>> {
  return this.httpClient.get<PaginadoDTO<TablaListadoDeMuestreoDTO>>(
    `${this.url}/listado?page=${page}&pageSize=${pageSize}`,
    { withCredentials: true }
  );
}

  }
