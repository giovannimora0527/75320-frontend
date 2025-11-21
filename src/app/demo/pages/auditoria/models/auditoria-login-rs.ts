import { AuditoriaLogin } from './auditoria-login';

/**
 * Response paginado para consultas de auditoría de login.
 */
export interface AuditoriaLoginRs {
  /** Lista de registros de auditoría */
  contenido: AuditoriaLogin[];
  
  /** Número total de elementos */
  totalElementos: number;
  
  /** Número total de páginas */
  totalPaginas: number;
  
  /** Número de página actual (base 0) */
  paginaActual: number;
  
  /** Tamaño de página */
  tamanoPagina: number;
  
  /** Indica si hay más páginas */
  tieneSiguiente: boolean;
  
  /** Indica si hay página anterior */
  tieneAnterior: boolean;
}

