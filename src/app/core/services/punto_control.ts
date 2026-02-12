import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {PuntoControl } from '../models/punto_control.model';
import { PuntoControlDTO } from '../models/puntocontrolDTO.model';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class PuntoControlService {
    
    private url = `${base_url}api/MuestreoCompleto`;
  constructor(private httpClient: HttpClient) { }
  obtenerPuntoControl(ubigeo: string,tipoInstalacion: number): Observable<PuntoControlDTO[]> {
    const params = new HttpParams()
      .set('ubigeo', ubigeo)
      .set('tipoInstalacion', tipoInstalacion.toString());

   return this.httpClient.get<PuntoControlDTO[]>(`${this.url}/ListadodePuntosControl`, { params })
      .pipe(
        map(data => data.map(item => ({
          ...item,
          ubigeo: item.ubigeo  // Asegurar mapeo correcto
        }))),
        catchError(this.handleError)
      );
  }
   private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Error al obtener puntos de control'));
  }
  }