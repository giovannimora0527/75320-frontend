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

  testEmail(recuperarPassword: RecuperarPasswordRq): Observable<RespuestaRs> {
    return this.backendService.post(
      this.urlBase,
      this.endpoint,
      'recuperar',
      recuperarPassword
    );
  }
}