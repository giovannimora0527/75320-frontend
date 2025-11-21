import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { AuditoriaLoginRq } from '../models/auditoria-login-rq';
import { AuditoriaLoginRs } from '../models/auditoria-login-rs';

/**
 * Servicio para consultar logs de auditoría de inicio de sesión.
 * 
 * @author Sistema
 */
@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  
  private readonly urlBase = environment.apiUrl;
  private readonly endpoint = 'auditoria';
  
  constructor(private readonly backendService: BackendService) {}
  
  /**
   * Consulta los registros de auditoría con filtros y paginación.
   * 
   * @param filtros Filtros y parámetros de paginación.
   * @returns Observable con la respuesta paginada.
   */
  consultarAuditoria(filtros: AuditoriaLoginRq): Observable<AuditoriaLoginRs> {
    return this.backendService.post<AuditoriaLoginRs>(
      this.urlBase,
      this.endpoint,
      'consultar',
      filtros
    );
  }
}

