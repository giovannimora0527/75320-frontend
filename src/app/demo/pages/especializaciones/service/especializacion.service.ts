import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from './../../../../../environments/environment';
import { Especializacion } from '../models/especializacion';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {

  // URL base que viene del environment
  urlBase: string = environment.apiUrlAuth;

  // Nombre del recurso en el backend
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) { }

  /**
   * Lista todas las especializaciones
   */
  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

}
