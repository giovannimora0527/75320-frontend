import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backendService: BackendService) { }

  getPacientes() {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  createPaciente(paciente: Paciente) {
    const url = `${this.urlBase}/${this.urlApi}/guardar`;
    // Diagnóstico rápido en consola
    // eslint-disable-next-line no-console
    console.log('POST ->', url, paciente);
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', paciente);
  }

  eliminarPaciente(id: number) {
    // Enviar id como query param (RequestParam) y cuerpo vacío
    return this.backendService.post(this.urlBase, this.urlApi, `eliminar?id=${id}`, {});
  }

  actualizarPaciente(id: number, paciente: Paciente) {
    const url = `${this.urlBase}/${this.urlApi}/actualizar?id=${id}`;
    console.log('PUT ->', url, paciente);
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar?id=${id}`, paciente);
  }
}
