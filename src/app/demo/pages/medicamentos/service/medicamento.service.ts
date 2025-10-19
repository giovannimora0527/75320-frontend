import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento } from '../models/medicamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medicamento';

  constructor(private backendService: BackendService) {}

  getMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  crearMedicamento(medicamento: Medicamento): Observable<Medicamento> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', medicamento);
  }

  actualizarMedicamento(medicamento: Medicamento): Observable<Medicamento> {
    return this.backendService.put(this.urlBase, this.urlApi, 'actualizar', medicamento);
  }

  eliminarMedicamento(id: number): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'eliminar', { id });
  }
}
