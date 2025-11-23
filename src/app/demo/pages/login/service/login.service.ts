import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LoginRs } from '../models/login-rs';
import { LoginRq } from '../models/login-rq';
import { RecuperarPasswordRq } from '../models/password-rq';
import { RespuestaRs } from '../../login/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlBase = environment.apiUrl;
  endpoint: string = 'auth';

  constructor(private readonly backendService: BackendService) {}

  loginUsuario(loginForm: LoginRq): Observable<LoginRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'login', loginForm);
  }

/**
   * Inicia el proceso de recuperación de contraseña.
   * * Realiza una petición HTTP POST al endpoint `'recuperar'`.
   * * Funcionalmente: Verifica que el usuario/email exista y, de ser así,
   * gatilla el envío del correo electrónico con las instrucciones de recuperación.
   *
   * @param {RecuperarPasswordRq} recuperarPassword - Objeto de petición (DTO) que contiene el identificador del usuario (username o email).
   * @returns {Observable<RespuestaRs>} Observable que emite la respuesta del servidor (éxito o mensaje de error).
   */
  testEmail(recuperarPassword: RecuperarPasswordRq): Observable<RespuestaRs> {
    return this.backendService.post(
      this.urlBase,
      this.endpoint,
      'recuperar',
      recuperarPassword
    );
  }
}