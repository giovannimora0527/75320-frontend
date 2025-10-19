import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { HistoriaMedica } from '../models/historia-medica';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriaMedicaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'historia-medica';

  constructor(private backendService: BackendService) {}

  getHistoriasMedicas(): Observable<HistoriaMedica[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  crearHistoriaMedica(historiaMedica: HistoriaMedica): Observable<HistoriaMedica> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', historiaMedica);
  }

  actualizarHistoriaMedica(historiaMedica: HistoriaMedica): Observable<HistoriaMedica> {
    return this.backendService.put(this.urlBase, this.urlApi, 'actualizar', historiaMedica);
  }

  eliminarHistoriaMedica(id: number): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', { id });
  }
}
