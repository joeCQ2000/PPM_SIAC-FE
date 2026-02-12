import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = `${base_url}api/Login`;
   constructor(private httpClient: HttpClient) { }

  Login(nombre_usuario: string, clave: string): Observable<any> {
    return this.httpClient.post(`${this.url}/Autenticacion`, { nombre_usuario, clave }, {
      withCredentials: true 
    }).pipe(
      tap((response: any) => {
        this.setUserData(response.usuario);
      })
    );
  }

  lgetCurrentUser(): Observable<any> {
    return this.httpClient.get(`${this.url}/me`, {
      withCredentials: true
    });
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post(`${this.url}/refresh`, {
      withCredentials: true
    });
  }
  isAuthenticated$(): Observable<boolean> {
    return this.lgetCurrentUser().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

 logout(): Observable<any> {
    return this.httpClient.post(`${this.url}/CerrarSesion`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.clearUserData())
    );
  }

   private setUserData(nombre_usuario: any): void {
    sessionStorage.setItem('nombre_usuario', JSON.stringify(nombre_usuario));
  }
  private clearUserData(): void {
    sessionStorage.removeItem('nombre_usuario');
  }

}