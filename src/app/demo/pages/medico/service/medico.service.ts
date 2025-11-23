import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  urlBase = environment.apiUrl;
  endpoint: string = 'medico';

  constructor(private readonly backendService: BackendService) {}

  listarMedicos(): Observable<Medico[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarMedico(medico: Medico): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', medico);
  }

  actualizarMedico(medico: Medico): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', medico);
  }
}
