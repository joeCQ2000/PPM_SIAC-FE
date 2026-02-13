import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ingreso } from "../models/ingreso.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class IngresoService{
    private url = `${base_url}api/Ingresos`
      constructor(private httpClient: HttpClient) { }
    Registrar(ingreso: ingreso): Observable<ingreso> {
        return this.httpClient.post<ingreso>(`${this.url}/RegistrarEgreso`, ingreso);
        }
    Listar(): Observable<ingreso[]>{
        return this.httpClient.get<ingreso[]>(`${this.url}/ListarEgresos`,);
        }
    Actualizar(ingreso : ingreso,id_ingreso: number){
        return this.httpClient.put<ingreso[]>(`${this.url}/EditarEgresos/${id_ingreso}`, ingreso );
        }
    Eliminar (id_ingreso: number, ingreso: ingreso): Observable<ingreso> {
        return this.httpClient.delete<ingreso>(`${this.url}/EliminarEgresoso/${id_ingreso}`,{body: ingreso});
        }
}