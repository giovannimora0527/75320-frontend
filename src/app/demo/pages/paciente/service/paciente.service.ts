import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'paciente';

  constructor(private backend: BackendService) {}

  listar() { return this.backend.get(this.urlBase, this.urlApi, 'listar'); }
  listarActivos() { return this.backend.get(this.urlBase, this.urlApi, 'listar-activos'); }
}


