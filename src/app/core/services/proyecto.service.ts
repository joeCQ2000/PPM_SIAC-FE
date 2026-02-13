import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { proyecto } from "../models/proyecto.model";
import { Observable } from "rxjs";
import { PaginadoDTO } from "../models/PaginadoDTO";

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class ProyectoService{
private url = `${base_url}api/Proyecto`
constructor(private httpClient: HttpClient) { }
Registrar(proyecto: proyecto): Observable<proyecto> {
    return this.httpClient.post<proyecto>(`${this.url}/RegistrarProyecto`, proyecto);
    }
listado(page = 1, pageSize = 10): Observable<PaginadoDTO<proyecto>> {
  return this.httpClient.get<PaginadoDTO<proyecto>>(
    `${this.url}/ListarProyectosPaginado?page=${page}&pageSize=${pageSize}`,
    { withCredentials: true }
  );
}
Actualizar(id_proyecto: number , proyecto : proyecto){
      return this.httpClient.put<proyecto[]>(`${this.url}/ActualizarProyecto/${id_proyecto}`, proyecto );
    }
Eliminar (proyecto: proyecto, id_proyecto: number): Observable<proyecto> {
    return this.httpClient.delete<proyecto>(`${this.url}/EliminarProyecto/$${id_proyecto}`,{body: proyecto});
    }
}