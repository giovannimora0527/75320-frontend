import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento } from '../models/medicamento';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {
  private urlBase = environment.apiUrlAuth;
  private urlApi = 'medicamento';

  constructor(private backendService: BackendService) {}

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarMedicamento(medicamento: Medicamento): Observable<Medicamento> {
    return this.backendService.post<Medicamento>(this.urlBase, this.urlApi, 'guardar', medicamento);
  }

  actualizarMedicamento(medicamento: Medicamento): Observable<Medicamento> {
    return this.backendService.post<Medicamento>(this.urlBase, this.urlApi, 'actualizar', medicamento);
  }
}
