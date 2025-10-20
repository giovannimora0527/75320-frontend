import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from '../../../../../environments/environment';
import { Paciente } from '../models/paciente';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backend: BackendService) {}

  listar(): Observable<Paciente[]> { 
    return this.backend.get(this.urlBase, this.urlApi, 'listar'); 
  }
  
  listarActivos(): Observable<Paciente[]> { 
    return this.backend.get(this.urlBase, this.urlApi, 'listar-activos'); 
  }

  buscarPorId(id: number): Observable<Paciente> {
    return this.backend.get(this.urlBase, this.urlApi, `buscar/${id}`);
  }

  crear(paciente: Paciente): Observable<Paciente> {
    return this.backend.post(this.urlBase, this.urlApi, 'crear', paciente);
  }

  actualizar(id: number, paciente: Paciente): Observable<Paciente> {
    return this.backend.put(this.urlBase, this.urlApi, `actualizar/${id}`, paciente);
  }

  eliminar(id: number): Observable<void> {
    return this.backend.delete(this.urlBase, this.urlApi, `eliminar/${id}`);
  }

  desactivar(id: number): Observable<Paciente> {
    return this.backend.put(this.urlBase, this.urlApi, `desactivar/${id}`, {});
  }

  activar(id: number): Observable<Paciente> {
    return this.backend.put(this.urlBase, this.urlApi, `activar/${id}`, {});
  }
}


