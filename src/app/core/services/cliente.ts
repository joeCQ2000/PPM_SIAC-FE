import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  Listar(): Observable<Cliente[]>{
      return this.httpClient.get<Cliente[]>(`${this.url}/ListarClientes`, { withCredentials:true});
    }
  }