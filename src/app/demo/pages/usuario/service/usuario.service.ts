import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';
import { RespuestaRs } from '../models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlBase = environment.apiUrl;
  endpoint: string = 'usuario';

  constructor(private readonly backendService: BackendService) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarUsuario(usuario: Usuario): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', usuario);
  } 


}
