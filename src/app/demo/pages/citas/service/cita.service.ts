import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'cita';

  constructor(private backendService: BackendService) {}

  
  getCitas(): Observable<any[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  
  guardarCita(cita: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', cita);
  }
}


