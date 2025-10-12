import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico';
import { RespuestaRs } from '../../usuario/models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medico';

  constructor(private backendService: BackendService) {}

  getMedicos(): Observable<Medico[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarMedico(medico: Medico): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', medico);
  }

  actualizarMedico(medico: Medico): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', medico);
  }
}
