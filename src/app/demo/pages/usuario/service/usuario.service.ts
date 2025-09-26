import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Usuario } from '../models/usuario';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = "usuario";

  constructor(private backendService: BackendService) { }

  listarUsuarios(): Observable<Usuario[]> {
     return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

}
