import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';


@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) { }

  getEspecializaciones() {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarEspecializacion(especializacion: Especializacion) {
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', especializacion);
  }

  actualizarEspecializacion(id: number, especializacion: Especializacion) {
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar?id=${id}`, especializacion);
  }

  eliminarEspecializacion(id: number) {
    return this.backendService.post(this.urlBase, this.urlApi, `eliminar?id=${id}`, {});
  }
}
