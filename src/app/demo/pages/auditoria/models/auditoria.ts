/**
 * Modelo que representa un registro de auditoría.
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
  tipoEvento: 'LOGIN' | 'RECUPERACION';
}

/**
 * Modelo para los filtros de búsqueda de auditoría.
 */
export interface AuditoriaFiltro {
  username?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  tipoEvento?: 'login' | 'recuperacion';
  exitoso?: boolean;
  pagina?: number;
  tamano?: number;
}

/**
 * Modelo de respuesta con lista paginada de auditoría.
 */
export interface AuditoriaLista {
  registros: Auditoria[];
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
}

