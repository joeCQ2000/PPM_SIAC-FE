import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoInstalacion } from '../models/tipo_instalacion.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class TipoInstalacionService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  ListarInstalaciones(): Observable<TipoInstalacion[]>{
      return this.httpClient.get<TipoInstalacion[]>(`${this.url}/ListarInstalaciones`, { withCredentials:true});
    }
  }