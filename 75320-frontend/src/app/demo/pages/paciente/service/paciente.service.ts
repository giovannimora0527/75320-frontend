import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { map } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
=======
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/paciente';
import { RespuestaRs } from '../../usuario/models/respuesta';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
<<<<<<< HEAD
  private urlBase = environment.apiUrlAuth;
  private urlApi = 'pacientes';

  constructor(private backendService: BackendService) {}

  // Obtener todos los pacientes
  getPacientes(): Observable<any[]> {
    return this.backendService.get(this.urlBase, this.urlApi, '').pipe(
      map((res: any) => {
        console.log('✅ Respuesta del backend:', res);
        // El backend devuelve directamente un array
        if (Array.isArray(res)) return res;
        return [];
      })
    );
  }

  // Crear paciente
  crearPaciente(data: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', data);
  }

  // Actualizar paciente
 
 actualizarPaciente(id: number, data: any): Observable<any> {
  return this.backendService.put(this.urlBase, this.urlApi, `${id}`, data);
 }


  // Eliminar paciente
  eliminarPaciente(id: number): Observable<any> {
    return this.backendService.delete(this.urlBase, this.urlApi, `eliminar/${id}`);
=======
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backendService: BackendService) {}

  listarPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  getPacientes(): Observable<Paciente[]> {
    return this.listarPacientes();
  }

  guardarPaciente(paciente: Paciente): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', paciente);
  }

  actualizarPaciente(paciente: Paciente): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', paciente);
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }
}














