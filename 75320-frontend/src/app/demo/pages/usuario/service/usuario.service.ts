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
  // URL base correcta según application.properties
  urlBase: string = 'http://localhost:8000/clinica/v1';
  urlApi: string = 'usuario';

  constructor(private backendService: BackendService) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarUsuario(usuario: Usuario): Observable<RespuestaRs> {   
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', usuario);
  }
}


