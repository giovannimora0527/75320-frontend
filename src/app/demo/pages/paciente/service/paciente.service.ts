import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/paciente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backendService: BackendService) {}

  getPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  crearPaciente(paciente: Paciente): Observable<Paciente> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', paciente);
  }

  actualizarPaciente(paciente: Paciente): Observable<Paciente> {
    return this.backendService.put(this.urlBase, this.urlApi, 'actualizar', paciente);
  }

  eliminarPaciente(id: number): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', { id });
  }
}