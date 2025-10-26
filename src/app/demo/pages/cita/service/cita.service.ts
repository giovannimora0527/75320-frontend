import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Cita } from '../model/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'cita';

  constructor(private backendService: BackendService) {
  }

  listarCitas(): Observable<Cita[]>{
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
}
