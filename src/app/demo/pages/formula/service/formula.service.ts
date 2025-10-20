import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // 👈 importa map
import { BackendService } from 'src/app/services/backend.service';
import { environment } from './../../../../../environments/environment';

import { Formula } from '../models/formula';
import { RespuestaRs } from '../models/respuestaRs';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'receta'; // backend expone /receta

  constructor(private backendService: BackendService) {}

  listarFormulas(): Observable<Formula[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar').pipe(
      map((data: any[]) =>
        data.map(item => ({
          id: item.id,
          cita: item.cita,
          medicamento: item.medicamento,
          dosis: item.dosis,
          indicaciones: item.indicaciones,
          fechaCreacionRegistro: item.fechaCreacionRegistro
        }))
      )
    );
  }

  guardarFormula(formula: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', formula);
  }

  actualizarFormula(formula: Formula): Observable<RespuestaRs> {
    // el backend usa POST para actualizar con el id en la URL
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar/${formula.id}`, formula);
  }

}
