import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Medicamento } from '../models/medicamento';
import { environment } from 'src/environments/environment';
import { RespuestaRs } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medicamento';

  constructor(private backendService: BackendService) {}

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  obtenerMedicamento(id: number): Observable<Medicamento> {
    return this.backendService.get(this.urlBase, this.urlApi, `buscar/${id}`);
  }

  guardarMedicamento(medicamento: Medicamento): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', medicamento);
  }

  actualizarMedicamento(id: number, medicamento: Medicamento): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `actualizar?id=${id}`, medicamento);
  }  

  eliminarMedicamento(id: number): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.urlApi, `eliminar?id=${id}`, {});
  }  

  buscarPorNombre(nombre: string): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.urlApi, `buscar-nombre/${nombre}`);
  }
}
