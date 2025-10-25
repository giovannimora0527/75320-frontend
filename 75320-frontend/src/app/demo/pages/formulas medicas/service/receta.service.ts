import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Receta } from '../models/receta';
import { RespuestaRs } from '../../usuario/models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'receta';

  constructor(private backendService: BackendService) {}

  listarRecetas(): Observable<Receta[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarReceta(receta: Receta): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', receta);
  }

  actualizarReceta(receta: Receta): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', receta);
  }
}