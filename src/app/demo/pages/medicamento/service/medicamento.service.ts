import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Medicamento } from '../models/medicamento';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medicamento';

  constructor(private backendService: BackendService) { }

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
}