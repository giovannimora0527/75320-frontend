import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/paciente';
import { RespuestaRs } from '../../usuario/models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backendService: BackendService) {}

  listarPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarPaciente(paciente: Paciente): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', paciente);
  }

  actualizarPaciente(paciente: Paciente): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', paciente);
  }
}
