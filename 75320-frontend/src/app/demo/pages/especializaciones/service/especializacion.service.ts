import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
=======
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';
import { RespuestaRs } from '../models/respuesta';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase: string = environment.apiUrlAuth;
<<<<<<< HEAD
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
=======
  urlApi: string = 'especializacion';

  constructor(private backendService: BackendService) {}

  listarEspecialiazaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarEspecializacion(especializacion: Especializacion): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', especializacion);
  }

  actualizarEspecializacion(especiaizacion: Especializacion): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', especiaizacion);
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }
}


