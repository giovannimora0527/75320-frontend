import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Paciente } from '../models/paciente';
import { environment } from './../../../../../environments/environment';

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

  guardarPaciente(paciente: Paciente): Observable<Paciente> {
  return this.backendService.post(this.urlBase, this.urlApi, 'crearPaciente', paciente);
  }


  actualizarPaciente(paciente: Paciente): Observable<Paciente> {
  return this.backendService.put(this.urlBase, this.urlApi, `${paciente.id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<void> {
    return this.backendService.delete(this.urlBase, this.urlApi, id);
  }


}
