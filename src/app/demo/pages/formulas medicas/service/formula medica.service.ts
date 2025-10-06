import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  private urlBase: string = environment.apiUrlAuth;
  private urlApi: string = 'formula-medica';

  constructor(private backendService: BackendService) {}

  // ✅ Método para listar fórmulas médicas
  getFormulas(): Observable<any> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  // ✅ Método para guardar nueva fórmula médica
  guardarFormula(formula: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', formula);
  }
}

