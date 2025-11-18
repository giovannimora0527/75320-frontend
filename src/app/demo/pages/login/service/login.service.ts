import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LoginRs } from '../models/login-rs';
import { LoginRq } from '../models/login-rq';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private urlBase = environment.apiUrl;
  private endpoint: string = 'auth';   // donde están tus endpoints de autenticación

  constructor(private readonly backendService: BackendService) {}

  // ===========================
  // INICIAR SESIÓN (LOGIN)
  // ===========================
  autenticar(payload: LoginRq): Observable<LoginRs> {
    // Llama a: POST http://localhost:8000/clinica/v1/auth/login
    return this.backendService.post<LoginRs>(
      this.urlBase,
      this.endpoint,   // "auth"
      'login',         // método del backend: /auth/login
      payload
    );
  }

  // ===========================
  // RECUPERAR CONTRASEÑA
  // ===========================
  recuperarContrasena(username: string): Observable<any> {
    // Llama a: POST http://localhost:8000/clinica/v1/auth/recuperar-contrasena
    return this.backendService.post(
      this.urlBase,
      this.endpoint,              // usa el mismo endpoint "auth"
      'recuperar-contrasena',     // el método en tu backend
      { username }
    );
  }
}
