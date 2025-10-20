import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../model/especializacion';
import { RespuestaRs } from '../model/respuestaRs';
@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {

  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) {
 }

  listarEspecializaciones(): Observable<Especializacion[]>{
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
  guardarEspecializaciones(especializacion: Especializacion): Observable<RespuestaRs>{
      return this.backendService.post(this.urlBase, this.urlApi, 'guardar', especializacion);
 }
  
  actualizarEspecializaciones(especializacion: Especializacion): Observable<RespuestaRs>{
      return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', especializacion);
    }
  eliminarEspecializaciones(especializacion: Especializacion): Observable<RespuestaRs>{
      return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', especializacion);
    }
  
  
}