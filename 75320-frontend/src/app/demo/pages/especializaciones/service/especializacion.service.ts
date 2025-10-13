import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'especializacion'; // sin 'api/' extra

  constructor(private backendService: BackendService) {}

  // Listar especializaciones
  getEspecializaciones(): Observable<any[]> {
    console.log('📡 GET:', `${this.urlBase}/${this.urlApi}/listar`);
    return this.backendService.get<any[]>(this.urlBase, this.urlApi, 'listar');
  }

  // Crear especialización
  guardarEspecializacion(especializacion: any): Observable<any> {
    console.log('📤 POST:', `${this.urlBase}/${this.urlApi}/crear`, especializacion);
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', especializacion);
  }
}


