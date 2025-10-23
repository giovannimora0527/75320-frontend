import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Especializacion } from '../models/especializacion';
import { environment } from '../../../../../environments/environment';
import { RespuestaRs } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) {}

  listarEspecializaciones (): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarEspecializacion(Especializacion: Especializacion): Observable<RespuestaRs> {   
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar',Especializacion);
  }

  actualizarEspecializacion(Especializacion: Especializacion    ): Observable<RespuestaRs> {      
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', Especializacion);
  }
}
