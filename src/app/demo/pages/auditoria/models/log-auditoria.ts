/**
 * Modelo que representa un registro de log de auditoría del sistema.
 * 
 * @interface LogAuditoria
 */
export interface LogAuditoria {
  /** Identificador único del log */
  id: number;
  
  /** Fecha y hora de la transacción */
  fechaHora: Date | string;
  
  /** Nombre de usuario relacionado con el evento */
  usuario: string;
  
  /** Tipo de evento registrado (LOGIN_FALLIDO, RECUPERACION_PASSWORD, etc.) */
  tipoEvento: string;
  
  /** Descripción detallada del evento */
  descripcion: string;
  
  /** Dirección IP desde donde se originó la acción */
  direccionIp?: string;
  
  /** Información adicional en formato JSON */
  metadata?: any;
}

/**
 * Modelo para la respuesta paginada de logs de auditoría.
 * 
 * @interface LogsAuditoriaResponse
 */
export interface LogsAuditoriaResponse {
  /** Lista de logs de auditoría */
  data: LogAuditoria[];
  
  /** Número total de registros */
  total: number;
  
  /** Página actual */
  pagina: number;
  
  /** Tamaño de página */
  tamanoPagina: number;
  
  /** Número total de páginas */
  totalPaginas: number;
}

/**
 * Modelo para los filtros de búsqueda de logs de auditoría.
 * 
 * @interface FiltrosLogsAuditoria
 */
export interface FiltrosLogsAuditoria {
  /** Fecha de inicio para filtrar */
  fechaInicio?: Date | string;
  
  /** Fecha de fin para filtrar */
  fechaFin?: Date | string;
  
  /** Nombre de usuario para filtrar */
  usuario?: string;
  
  /** Tipo de evento para filtrar */
  tipoEvento?: string;
  
  /** Número de página */
  pagina?: number;
  
  /** Tamaño de página */
  tamanoPagina?: number;
}

