import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) {}

  getEspecializaciones(): Observable<any[]> {
    // 👇 devolvemos siempre un observable de arreglo
    return this.backendService.get<any[]>(this.urlBase, this.urlApi, 'listar');
  }

  guardarEspecializacion(especializacion: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', especializacion);
  }
}

