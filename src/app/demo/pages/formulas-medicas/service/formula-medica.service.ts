import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { FormulaMedica } from '../models/formula-medica';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'formula-medica';

  constructor(private backendService: BackendService) {}

  getFormulasMedicas(): Observable<FormulaMedica[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  crearFormulaMedica(formulaMedica: FormulaMedica): Observable<FormulaMedica> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', formulaMedica);
  }

  actualizarFormulaMedica(formulaMedica: FormulaMedica): Observable<FormulaMedica> {
    return this.backendService.put(this.urlBase, this.urlApi, 'actualizar', formulaMedica);
  }

  eliminarFormulaMedica(id: number): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', { id });
  }
}
