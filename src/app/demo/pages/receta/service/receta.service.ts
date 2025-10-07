import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Receta } from '../models/receta';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {

  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'receta';

  constructor(private backendService: BackendService) { }

  listarRecetas(): Observable<Receta[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
}	