/**
 * Modelo para los registros de auditoría.
 */
export interface Auditoria {
  id: number;
  usernameIngresado: string;
  fechaHora: string;
  exitoso: boolean;
  descripcion: string;
  ipOrigen?: string;
  usuarioId?: number;
  emailUsuario?: string;
  tipo: 'LOGIN' | 'RECUPERACION';
}

/**
 * Modelo para la respuesta paginada de auditoría.
 */
export interface AuditoriaPage {
  content: Auditoria[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * Modelo para los filtros de auditoría.
 */
export interface AuditoriaFiltros {
  username?: string;
  exitoso?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  tipo: 'LOGIN' | 'RECUPERACION' | 'TODOS';
  page: number;
  size: number;
}

