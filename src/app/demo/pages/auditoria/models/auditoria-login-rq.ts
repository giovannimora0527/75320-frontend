/**
 * Request para consultar logs de auditoría con filtros y paginación.
 */
export interface AuditoriaLoginRq {
  /** Nombre de usuario para filtrar (opcional) */
  username?: string;
  
  /** Fecha de inicio del rango (opcional) */
  fechaDesde?: string; // ISO string format
  
  /** Fecha de fin del rango (opcional) */
  fechaHasta?: string; // ISO string format
  
  /** Filtrar por tipo de evento: true = exitosos, false = fallidos, null = todos */
  exitoso?: boolean | null;
  
  /** Número de página (base 0) */
  pagina?: number;
  
  /** Tamaño de página (número de registros por página) */
  tamano?: number;
  
  /** Campo por el cual ordenar */
  ordenarPor?: string;
  
  /** Dirección del ordenamiento: ASC o DESC */
  direccion?: string;
}

