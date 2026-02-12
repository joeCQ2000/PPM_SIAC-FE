import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Especie } from '../models/especie.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class EspecieService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  Listar(): Observable<Especie[]>{
      return this.httpClient.get<Especie[]>(`${this.url}/ListarEspecies`, { withCredentials:true});
    }
  }