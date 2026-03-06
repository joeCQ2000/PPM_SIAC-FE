import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { egreso } from "../models/egreso.model";
import { Observable } from "rxjs";

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class EgresoService{
    private url = `${base_url}api/Egresos`
    constructor(private httpClient: HttpClient) { }
    Registrar(egreso: egreso): Observable<egreso> {
        return this.httpClient.post<egreso>(`${this.url}/RegistrarEgresos`, egreso);
        }
    Listar(): Observable<egreso[]>{
        return this.httpClient.get<egreso[]>(`${this.url}/ListarEgresos`,);
        }
    Actualizar(id_egreso: number){
        return this.httpClient.put<egreso[]>(`${this.url}/EditarEgresos/${id_egreso}`,id_egreso );
        }
    Eliminar (id_egreso: number): Observable<egreso> {
        return this.httpClient.delete<egreso>(`${this.url}/EliminarEgreso/${id_egreso}` );
        }
}

