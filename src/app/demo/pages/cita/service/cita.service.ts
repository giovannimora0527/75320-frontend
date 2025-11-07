import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'cita';

  constructor(private readonly backendService: BackendService) {}

  buscarCitaPorPacienteId(pacienteId: number): Observable<Cita[]> {
    const params: HttpParams = new HttpParams().set('pacienteIds', pacienteId.toString());
    return this.backendService.get(this.urlBase, this.endpoint, 'listar-citas-paciente', params);
  }
}
