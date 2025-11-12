import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';
import { Observable } from 'rxjs';
import { RespuestaRs } from 'src/app/models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) { }

  getEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.getEspecializaciones();
  }

  guardarEspecializacion(especializacion: Especializacion): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', especializacion);
  }

  actualizarEspecializacion(id: number, especializacion: Especializacion): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar?id=${id}`, especializacion);
  }

  eliminarEspecializacion(id: number): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `eliminar?id=${id}`, {});
  }
}
