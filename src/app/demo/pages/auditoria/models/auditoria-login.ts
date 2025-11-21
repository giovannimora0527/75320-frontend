/**
 * Entidad de auditoría de inicio de sesión.
 */
export interface AuditoriaLogin {
  /** Identificador único del registro */
  id: number;
  
  /** Nombre de usuario ingresado en el intento de login */
  usernameIngresado: string;
  
  /** Fecha y hora del intento de login */
  fechaHora: string; // ISO string format
  
  /** Indica si el intento fue exitoso o fallido */
  exitoso: boolean;
  
  /** Descripción del resultado (éxito o motivo del fallo) */
  descripcion?: string;
  
  /** IP desde donde se realizó el intento de login */
  ipOrigen?: string;
  
  /** ID del usuario si el login fue exitoso */
  usuarioId?: number;
}

