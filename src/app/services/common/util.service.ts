import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  urlBase: string = environment.apiUrlAuth;

  constructor(private backendService: BackendService) {}


  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, "especializacion", 'listar'); 
  }
}
