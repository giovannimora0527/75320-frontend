import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Formula } from '../models/formula';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  private urlBase = environment.apiUrlAuth;
  private urlApi = 'receta';

  constructor(private backendService: BackendService) {}

  listarFormulas(): Observable<Formula[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listaReceta');
}


  guardarFormula(formula: any): Observable<Formula> {
  return this.backendService.post<Formula>(this.urlBase, this.urlApi, 'Creacion_de_Receta', formula);
}



  actualizarFormula(formula: Formula): Observable<Formula> {
    return this.backendService.put(this.urlBase, this.urlApi, `${formula.id}`, formula);
  }

  eliminarFormula(id: number): Observable<void> {
    return this.backendService.delete(this.urlBase, this.urlApi, id);
  }
}
