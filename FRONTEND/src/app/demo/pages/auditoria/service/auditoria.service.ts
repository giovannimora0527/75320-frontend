import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Auditoria, AuditoriaPage, AuditoriaFiltros } from '../models/auditoria';

/**
 * Servicio para consultar los registros de auditoría del sistema.
 * Proporciona métodos para obtener logs de login y recuperación de contraseña con filtros y paginación.
 */
@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private urlBase = environment.apiUrlAuth;
  private endpoint = 'auditoria';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los registros de auditoría de login con filtros y paginación.
   * @param filtros Filtros de búsqueda y paginación.
   * @returns Observable con la página de resultados.
   */
  listarAuditoriaLogin(filtros: AuditoriaFiltros): Observable<AuditoriaPage> {
    let params = new HttpParams()
      .set('page', filtros.page.toString())
      .set('size', filtros.size.toString());

    if (filtros.username) {
      params = params.set('username', filtros.username);
    }
    if (filtros.exitoso !== undefined && filtros.exitoso !== null) {
      params = params.set('exitoso', filtros.exitoso.toString());
    }
    if (filtros.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }

    return this.http.get<AuditoriaPage>(`${this.urlBase}/${this.endpoint}/login`, { params });
  }

  /**
   * Obtiene los registros de auditoría de recuperación de contraseña con filtros y paginación.
   * @param filtros Filtros de búsqueda y paginación.
   * @returns Observable con la página de resultados.
   */
  listarAuditoriaRecuperacion(filtros: AuditoriaFiltros): Observable<AuditoriaPage> {
    let params = new HttpParams()
      .set('page', filtros.page.toString())
      .set('size', filtros.size.toString());

    if (filtros.username) {
      params = params.set('username', filtros.username);
    }
    if (filtros.exitoso !== undefined && filtros.exitoso !== null) {
      params = params.set('exitoso', filtros.exitoso.toString());
    }
    if (filtros.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }

    return this.http.get<AuditoriaPage>(`${this.urlBase}/${this.endpoint}/recuperacion`, { params });
  }
}



