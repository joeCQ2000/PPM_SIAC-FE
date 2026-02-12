import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class PdfService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  generarPdf(id: number): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`${this.url}/generar-pdf/${id}`, {
      responseType: 'blob',
      observe: 'response',
      withCredentials: true
    });
}
  }