import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { RespuestaRs } from '../../usuario/models/respuesta';
import { Formula } from '../models/formula';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'receta';

  constructor(private backendService: BackendService) {}

  listarFormulas(): Observable<Formula[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarFormula(formula: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', formula);
  }

  actualizarFormula(formula: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', formula);
  }
}
