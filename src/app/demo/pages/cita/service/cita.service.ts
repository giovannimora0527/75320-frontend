import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Cita } from '../models/cita';
import { CitaRq } from '../models/cita-rq';
import { RespuestaRs } from 'src/app/models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private urlBase = environment.apiUrlAuth;
  private urlApi = 'cita';

  constructor(private backendService: BackendService) {}

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'por-fechahora');
  }

  guardarCita(cita: CitaRq): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', cita);
  }

  actualizarCita(id: number, cita: CitaRq): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar?id=${id}`, cita);
  }

  eliminarCita(id: number): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `eliminar?id=${id}`, {});
  }

  buscarCitaPorPacienteId(pacienteId: number): Observable<Cita[]> {
    const params: HttpParams = new HttpParams().set('pacienteIds', pacienteId.toString());
    return this.backendService.get(this.urlBase, this.urlApi, 'listar-citas-paciente', params);
  }
}
