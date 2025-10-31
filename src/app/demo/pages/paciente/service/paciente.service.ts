import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backendService: BackendService) {}

  buscarPacientePorDocumento(documento: string): Observable<Paciente> {
    const params = new HttpParams().set('numeroDocumento', documento);
    return this.backendService.get(this.urlBase, this.urlApi, 'buscar-paciente-documento', params);
  }
}
