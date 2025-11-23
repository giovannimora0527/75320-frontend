import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { HistoriaMedica } from '../models/historia-medica';
import { RespuestaRs } from 'src/app/models/respuesta';

/**
 * Servicio para gestionar las historias médicas.
 */
@Injectable({
  providedIn: 'root'
})
export class HistoriaMedicaService {
  private urlBase: string = environment.apiUrl;
  private endpoint: string = 'historia-medica';

  constructor(private backendService: BackendService) {}

  /**
   * Lista todas las historias médicas.
   */
  listarHistorias(): Observable<HistoriaMedica[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  /**
   * Obtiene una historia médica por su ID.
   */
  obtenerHistoria(id: number): Observable<HistoriaMedica> {
    return this.backendService.get(this.urlBase, this.endpoint, `buscar/${id}`);
  }

  /**
   * Obtiene las historias médicas de un paciente específico.
   */
  listarPorPaciente(pacienteId: number): Observable<HistoriaMedica[]> {
    return this.backendService.get(this.urlBase, this.endpoint, `paciente/${pacienteId}`);
  }

  /**
   * Guarda una nueva historia médica.
   */
  guardarHistoria(historia: HistoriaMedica): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', historia);
  }

  /**
   * Actualiza una historia médica existente.
   */
  actualizarHistoria(id: number, historia: HistoriaMedica): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, `actualizar?id=${id}`, historia);
  }

  /**
   * Elimina una historia médica.
   */
  eliminarHistoria(id: number): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, `eliminar?id=${id}`, {});
  }
}
