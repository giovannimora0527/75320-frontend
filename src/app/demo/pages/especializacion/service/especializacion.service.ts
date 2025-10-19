import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';


@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) { }

  getEspecializaciones() {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
}
