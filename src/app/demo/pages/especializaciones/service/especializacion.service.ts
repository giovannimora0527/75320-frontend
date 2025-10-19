import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) {}

  getEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  crearEspecializacion(especializacion: Especializacion): Observable<Especializacion> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', especializacion);
  }

  actualizarEspecializacion(especializacion: Especializacion): Observable<Especializacion> {
    return this.backendService.put(this.urlBase, this.urlApi, 'actualizar', especializacion);
  }

  eliminarEspecializacion(id: number): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', { id });
  }
}
