import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
<<<<<<< HEAD
=======
import { Medico } from '../models/medico';
import { RespuestaRs } from '../../usuario/models/respuesta';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
<<<<<<< HEAD
  private urlBase: string = environment.apiUrlAuth;
  private urlApi: string = 'medicos';

  constructor(private backendService: BackendService) {}

  /**
   * ✅ Listar todos los médicos
   */
  listarMedicos(): Observable<any> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  /**
   * ✅ Método alternativo para compatibilidad
   */
  getMedicos(): Observable<any> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  /**
   * ✅ Obtener un médico por su ID
   */
  obtenerMedicoPorId(id: number): Observable<any> {
    return this.backendService.get(this.urlBase, this.urlApi, `obtener/${id}`);
  }

  /**
   * ✅ Crear un nuevo médico
   */
  crearMedico(data: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', data);
  }

  /**
   * ✅ Guardar médico (compatibilidad)
   */
  guardarMedico(data: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', data);
  }

  /**
   * ✅ Actualizar médico existente
   */
  actualizarMedico(id: number, data: any): Observable<any> {
    return this.backendService.put(this.urlBase, this.urlApi, `actualizar/${id}`, data);
  }

  /**
   * ✅ Eliminar médico por ID
   */
  eliminarMedico(id: number): Observable<any> {
    return this.backendService.delete(this.urlBase, this.urlApi, `eliminar/${id}`);
=======
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medico';

  constructor(private backendService: BackendService) {}

  getMedicos(): Observable<Medico[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  listarMedicos(): Observable<Medico[]> {
    return this.getMedicos();
  }

  guardarMedico(medico: Medico): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', medico);
  }

  actualizarMedico(medico: Medico): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', medico);
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }
}















