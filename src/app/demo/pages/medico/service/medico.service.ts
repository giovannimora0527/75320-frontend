import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medico';

  constructor(private backendService: BackendService) {}

  getMedicos(): Observable<Medico[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
}
