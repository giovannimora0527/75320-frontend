import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Usuario } from '../models/usuario';
import { environment } from './../../../../../environments/environment';
import { RespuestaRs } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'usuario';

  constructor(private backendService: BackendService) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarUsuario(usuario: Usuario): Observable<RespuestaRs> {   
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', usuario);
  }

  // CAMBIAR ESTE MÉTODO - Agregar parámetro id
  actualizarUsuario(id: number, usuario: Usuario): Observable<RespuestaRs> {   
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar?id=${id}`, usuario);
  }

  // AGREGAR ESTE MÉTODO si no lo tienes
  eliminarUsuario(id: number): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `eliminar?id=${id}`, {});
  }
}