import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
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
  }
}















