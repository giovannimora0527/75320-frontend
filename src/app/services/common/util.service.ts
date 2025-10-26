import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';
import { Observable } from 'rxjs';
import { Medicamento } from 'src/app/demo/pages/formula/models/medicamento';
import { Cita } from 'src/app/demo/pages/formula/models/cita';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  urlBase: string = environment.apiUrlAuth;

  constructor(private backendService: BackendService) {}


  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, "especializacion", 'listar'); 
  }

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, "medicamento", 'listar'); 
  }

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, "cita", 'listar'); 
  }
}
