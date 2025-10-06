import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medico';

  constructor(private backendService: BackendService) {}

  getMedicos() {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
}
