import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BackendService } from '../../../../services/backend.service';
import { LogsAuditoriaResponse, FiltrosLogsAuditoria } from '../models/log-auditoria';

/**
 * Servicio para interactuar con el endpoint de logs de auditoría del backend.
 * 
 * @remarks
 * Este servicio proporciona métodos para consultar los registros de auditoría
 * con soporte para paginación y filtros.
 * 
 * @example
 * ```typescript
 * auditoriaService.obtenerLogs({ pagina: 1, tamanoPagina: 10 }).subscribe(logs => {
 *   console.log(logs);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private urlBase = environment.apiUrlAuth; // Usar apiUrlAuth para consistencia
  private endpoint = 'auditoria';

  constructor(private backendService: BackendService) {}

  /**
   * Obtiene los logs de auditoría con paginación y filtros opcionales.
   * 
   * @param filtros Filtros de búsqueda (fecha, usuario, tipo de evento, paginación)
   * @returns Observable con la respuesta paginada de logs
   * 
   * @example
   * ```typescript
   * const filtros: FiltrosLogsAuditoria = {
   *   fechaInicio: new Date('2024-01-01'),
   *   fechaFin: new Date('2024-12-31'),
   *   usuario: 'admin',
   *   tipoEvento: 'LOGIN_FALLIDO',
   *   pagina: 1,
   *   tamanoPagina: 20
   * };
   * 
   * this.auditoriaService.obtenerLogs(filtros).subscribe(response => {
   *   console.log('Total de logs:', response.total);
   *   console.log('Logs:', response.data);
   * });
   * ```
   */
  obtenerLogs(filtros?: FiltrosLogsAuditoria): Observable<LogsAuditoriaResponse> {
    // Construir parámetros de consulta
    let params = new HttpParams();
    
    // Siempre agregar paginación por defecto
    const pagina = filtros?.pagina || 1;
    const tamanoPagina = filtros?.tamanoPagina || 20;
    params = params.set('pagina', pagina.toString());
    params = params.set('tamanoPagina', tamanoPagina.toString());
    
    // Agregar filtros opcionales solo si tienen valor
    if (filtros) {
      if (filtros.fechaInicio) {
        const fechaFormateada = this.formatearFecha(filtros.fechaInicio);
        // Formatear como YYYY-MM-DD si es necesario
        if (fechaFormateada.includes('T')) {
          params = params.set('fechaInicio', fechaFormateada.split('T')[0]);
        } else {
          params = params.set('fechaInicio', fechaFormateada);
        }
      }
      if (filtros.fechaFin) {
        const fechaFormateada = this.formatearFecha(filtros.fechaFin);
        // Formatear como YYYY-MM-DD si es necesario
        if (fechaFormateada.includes('T')) {
          params = params.set('fechaFin', fechaFormateada.split('T')[0]);
        } else {
          params = params.set('fechaFin', fechaFormateada);
        }
      }
      if (filtros.usuario && filtros.usuario.trim()) {
        params = params.set('usuario', filtros.usuario.trim());
      }
      if (filtros.tipoEvento && filtros.tipoEvento.trim()) {
        params = params.set('tipoEvento', filtros.tipoEvento.trim());
      }
    }

    // El BackendService construye la URL como: ${urlBase}/${endpoint}/${service}
    // Entonces la URL final será: http://localhost:8000/clinica/v1/auditoria/listar
    // Si el endpoint no existe, el backend puede devolver 404 o 500
    return this.backendService.get<LogsAuditoriaResponse>(
      this.urlBase,
      this.endpoint,
      'listar',  // Usar 'listar' que es el patrón estándar del backend
      params
    );
  }

  /**
   * Obtiene los tipos de eventos disponibles para filtrar.
   * 
   * @returns Observable con la lista de tipos de eventos
   */
  obtenerTiposEventos(): Observable<string[]> {
    // Si el endpoint no existe, retornar valores por defecto
    // Esto evita errores cuando el backend no tiene este endpoint implementado
    return this.backendService.get<string[]>(
      this.urlBase,
      this.endpoint,
      'tipos-eventos'
    );
  }

  /**
   * Formatea una fecha a formato ISO string para enviar al backend.
   * 
   * @param fecha Fecha a formatear (Date o string)
   * @returns String con la fecha en formato ISO
   * @private
   */
  private formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    
    if (fecha instanceof Date) {
      // Formatear como YYYY-MM-DD para el backend
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // Si es string, verificar formato
    if (typeof fecha === 'string') {
      // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
      }
      // Si tiene hora, extraer solo la fecha
      if (fecha.includes('T')) {
        return fecha.split('T')[0];
      }
      return fecha;
    }
    
    return String(fecha);
  }
}

