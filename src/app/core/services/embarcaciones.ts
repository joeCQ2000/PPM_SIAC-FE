import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private url = `${base_url}api/MuestreoCompleto`; 

  constructor(private http: HttpClient) {}

  buscarMatriculas(matricula: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/buscarEmbarcaciones`, {
      params: { 
        search: matricula,
        limit: '2000'
      }
    });
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/ListarEmbarcaciones`);
  }
}