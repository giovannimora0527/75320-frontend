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
  // LOGIN DE USUARIO
  // ===========================
  loginUsuario(loginForm: LoginRq): Observable<LoginRs> {
    return this.backendService.post(
      this.urlBase,
      this.endpoint,
      'login',
      loginForm
    );
  }

  // ===========================
  // RECUPERAR CONTRASEÑA
  // ===========================
  recuperarContrasena(username: string): Observable<any> {
    return this.backendService.post(
      this.urlBase,
      this.endpoint,              // usa el mismo endpoint "auth"
      'recuperar-contrasena',     // el método en tu backend
      { username }
    );
  }
}
