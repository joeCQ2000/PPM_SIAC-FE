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
        return this.httpClient.post<ingreso>(`${this.url}/RegistrarIngresos`, ingreso);
        }
    Listar(): Observable<ingreso[]>{
        return this.httpClient.get<ingreso[]>(`${this.url}/ListarIngresos`,);
        }
    Actualizar(id_ingreso: number){
        return this.httpClient.put<ingreso[]>(`${this.url}/EditarIngresos/${id_ingreso}`,id_ingreso);
        }
    Eliminar (id_ingreso: number): Observable<ingreso> {
        return this.httpClient.delete<ingreso>(`${this.url}/EliminarIngreso/${id_ingreso}`);
        }
}