import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface RecuperarPasswordRq {
  username: string;
}

export interface RecuperarPasswordRs {
  mensaje: string;
  status: number;
  success: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RecuperarPasswordService {
  private urlBase = environment.apiUrlAuth;
  private endpoint = 'recuperar-contrasena';

  constructor(private http: HttpClient) {}

  /**
   * Solicita la recuperación de contraseña para un usuario.
   * @param username Nombre de usuario para recuperar la contraseña.
   * @returns Observable con la respuesta del servidor.
   */
  recuperarPassword(username: string): Observable<RecuperarPasswordRs> {
    const url = `${this.urlBase}/auth/${this.endpoint}`;
    const body: RecuperarPasswordRq = { username };
    return this.http.post<RecuperarPasswordRs>(url, body);
  }
}

