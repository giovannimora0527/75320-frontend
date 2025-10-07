import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Cita } from '../models/cita';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'cita';

  constructor(private backendService: BackendService) { }

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
}