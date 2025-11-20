// src/app/demo/pages/login/service/login.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LoginRs } from '../models/login-rs';
import { LoginRq } from '../models/login-rq';
import { RecuperacionPasswordRq } from '../models/recuperacion-password-rq';
import { RecuperacionPasswordRs } from '../models/recuperacion-password-rs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlBase = environment.apiUrl;
  endpoint: string = 'auth';

  constructor(private readonly backendService: BackendService) {}

  /**
   * Realiza el login de usuario
   */
  loginUsuario(loginForm: LoginRq): Observable<LoginRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'login', loginForm);
  }

  /**
   * Solicita la recuperación de contraseña
   * Envía el username al backend
   * 
   * @param recuperacionForm Formulario con el username
   * @returns Observable con la respuesta genérica del backend
   */
  recuperarPassword(recuperacionForm: RecuperacionPasswordRq): Observable<RecuperacionPasswordRs> {
    return this.backendService.post(
      this.urlBase, 
      this.endpoint, 
      'recuperar-contrasena', 
      recuperacionForm
    );
  }
}