import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private urlBase = environment.apiUrlAuth;
  private urlApi = 'pacientes';

  constructor(private backendService: BackendService) {}

  // Obtener todos los pacientes
  getPacientes(): Observable<any[]> {
    return this.backendService.get(this.urlBase, this.urlApi, '').pipe(
      map((res: any) => {
        console.log('✅ Respuesta del backend:', res);
        // El backend devuelve directamente un array
        if (Array.isArray(res)) return res;
        return [];
      })
    );
  }

  // Crear paciente
  crearPaciente(data: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', data);
  }

  // Actualizar paciente
 
 actualizarPaciente(id: number, data: any): Observable<any> {
  return this.backendService.put(this.urlBase, this.urlApi, `${id}`, data);
 }


  // Eliminar paciente
  eliminarPaciente(id: number): Observable<any> {
    return this.backendService.delete(this.urlBase, this.urlApi, `eliminar/${id}`);
  }
}














