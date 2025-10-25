import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
<<<<<<< HEAD
=======
import { Cita } from '../models/cita';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

@Injectable({
  providedIn: 'root'
})
export class CitaService {
<<<<<<< HEAD
  private urlBase: string = environment.apiUrlAuth;
  private urlApi: string = 'citas';

  constructor(private backendService: BackendService) {}

  // Obtener todas las citas
  getCitas(): Observable<any> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  // Crear una nueva cita
  crearCita(data: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', data);
  }

  // Editar una cita existente
  editarCita(id: number, data: any): Observable<any> {
    return this.backendService.put(this.urlBase, this.urlApi, `editar/${id}`, data);
  }

  // Eliminar una cita
  deleteCita(id: number): Observable<any> {
    return this.backendService.delete(this.urlBase, this.urlApi, `eliminar/${id}`);
  }
=======
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'cita';

  constructor(private backendService: BackendService) {
  }

  listarCitas(): Observable<Cita[]>{
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
}







<<<<<<< HEAD

=======
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
