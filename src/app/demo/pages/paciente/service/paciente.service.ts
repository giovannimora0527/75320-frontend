import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../model/paciente';
import { RespuestaRs } from '../model/respuestaRs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backendService: BackendService) {
 }

  getPaciente(): Observable<Paciente[]>{
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
  guardarPaciente(paciente: Paciente): Observable<RespuestaRs>{
      return this.backendService.post(this.urlBase, this.urlApi, 'guardar', paciente);
 }
  
 actualizarPaciente(paciente: Paciente): Observable<RespuestaRs>{
      return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', paciente);
    }
    
  eliminarPaciente(paciente: Paciente): Observable<RespuestaRs>{
      return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', paciente);
  }
  
  
  
}