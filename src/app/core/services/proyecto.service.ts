import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Proyecto } from "../models/proyecto.model";
import { Observable } from "rxjs";
import { PaginadoDTO } from "../models/PaginadoDTO";

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class ProyectoService{
private url = `${base_url}api/Proyecto`
constructor(private httpClient: HttpClient) { }
Registrar(proyecto: Proyecto): Observable<Proyecto> {
    return this.httpClient.post<Proyecto>(`${this.url}/RegistrarProyecto`, proyecto);
    }
listado(page = 1, pageSize = 10): Observable<PaginadoDTO<Proyecto>> {
  return this.httpClient.get<PaginadoDTO<Proyecto>>(
    `${this.url}/ListarProyectosPaginado?page=${page}&pageSize=${pageSize}`,
    { withCredentials: true }
  );
}
Actualizar(id_proyecto: number , proyecto : Proyecto){
      return this.httpClient.put<Proyecto[]>(`${this.url}/ActualizarProyecto/${id_proyecto}`, proyecto );
    }
Eliminar (id_proyecto: number): Observable<Proyecto> {
    return this.httpClient.delete<Proyecto>(`${this.url}/EliminarProyecto/${id_proyecto}`);
    }
}