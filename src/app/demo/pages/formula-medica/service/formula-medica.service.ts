import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { FormulaMedica } from '../models/formula-medica';
import { RespuestaRs } from 'src/app/models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  private urlBase: string = environment.apiUrlAuth; // ya lo tenías
  private urlApi: string = 'api/recetas';

  constructor(private backendService: BackendService) {}

  listarFormulas(): Observable<FormulaMedica[]> {
    // ruta 'listar' en tu backend
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarFormula(formula: FormulaMedica): Observable<RespuestaRs> {
    // POST a /api/recetas (según tu backend guarda con POST a base)
    // si tu backend usa exactamente /api/recetas (sin acción), ajusta backendService.post accordingly
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', formula);
  }

  eliminarFormula(id: number): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', { id });
  }

  actualizarFormula(id: number, formula: FormulaMedica): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar?id=${id}`, formula);
  }
}
