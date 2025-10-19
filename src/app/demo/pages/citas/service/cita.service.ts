import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Cita } from '../models/cita';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'cita';

  constructor(private backendService: BackendService) {}

  getCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  crearCita(cita: Cita): Observable<Cita> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', cita);
  }

  actualizarCita(cita: Cita): Observable<Cita> {
    return this.backendService.put(this.urlBase, this.urlApi, 'actualizar', cita);
  }

  eliminarCita(id: number): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', { id });
  }
}
