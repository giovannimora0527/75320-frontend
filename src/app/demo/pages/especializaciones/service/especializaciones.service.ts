import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Especializacion } from '../models/especializacion';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) {}

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  obtenerEspecializacion(id: number): Observable<Especializacion> {
    return this.backendService.get(this.urlBase, this.urlApi, id.toString());
  }

  crearEspecializacion(especializacion: Especializacion): Observable<Especializacion> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', especializacion);
  }

  actualizarEspecializacion(especializacion: Especializacion): Observable<Especializacion> {
    return this.backendService.put(this.urlBase, this.urlApi, `${especializacion.id}`, especializacion);
  }

  eliminarEspecializacion(id: number): Observable<void> {
    return this.backendService.delete(this.urlBase, this.urlApi, id);
  }
}
