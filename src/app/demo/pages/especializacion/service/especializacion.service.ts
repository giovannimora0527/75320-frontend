import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';
import { RespuestaRs } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) {}

  listarEspecialiazaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarEspecializacion(especializacion: Especializacion): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', especializacion);
  }

  actualizarEspecializacion(especiaizacion: Especializacion): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', especiaizacion);
  }
}