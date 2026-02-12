import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  Listar(): Observable<Usuario[]>{
      return this.httpClient.get<Usuario[]>(`${this.url}/ListarUsuariosFiscalizadores`, { withCredentials:true});
    }
  buscarUsuarios(codigo: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}/buscarUsuarios`, {
      params: { 
        search: codigo,
        limit: '2000'
      }
    });
  }
  }