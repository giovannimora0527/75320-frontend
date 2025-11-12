import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';
import { Formula } from '../models/formula';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'receta';

  constructor(private readonly backendService: BackendService) {}

  listarFormulas(): Observable<Formula[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarFormula(formula: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', formula);
  }

  actualizarFormula(formula: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', formula);
  }
}
