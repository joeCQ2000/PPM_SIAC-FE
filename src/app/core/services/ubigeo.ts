import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { MuestreoCompleto } from '../models/muestreo.model';
import { Ubigeo } from '../models/ubigeo.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  ListarRegiones(): Observable<Ubigeo[]>{
      return this.httpClient.get<Ubigeo[]>(`${this.url}/ListarRegiones`, { withCredentials:true});
    }
  ListarProvincias(Id_region: any): Observable<Ubigeo[]>{
      return this.httpClient.get<Ubigeo[]>(`${this.url}/ListarProvincias/${Id_region}`, { withCredentials:true});
    }
    ListarDistritos(Id_provincia: any): Observable<Ubigeo[]>{
      return this.httpClient.get<Ubigeo[]>(`${this.url}/ListarDistritos/${Id_provincia}`, { withCredentials:true});
    }
  }