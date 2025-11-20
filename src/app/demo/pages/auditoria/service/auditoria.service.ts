import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { AuditoriaLista, AuditoriaFiltro } from '../models/auditoria';

/**
 * Servicio para consultar registros de auditoría.
 */
@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'auditoria';

  constructor(private readonly backendService: BackendService) {}

  /**
   * Lista registros de auditoría con filtros y paginación.
   * @param filtro Filtros de búsqueda
   * @returns Observable con la lista paginada de registros
   */
  listarAuditoria(filtro: AuditoriaFiltro): Observable<AuditoriaLista> {
    return this.backendService.post<AuditoriaLista>(
      this.urlBase,
      this.endpoint,
      'listar',
      filtro
    );
  }
}

