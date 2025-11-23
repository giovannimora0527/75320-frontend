/**
 * Modelo que representa una historia médica.
 */
export interface HistoriaMedica {
  id?: number;
  pacienteId: number;
  medicoId: number;
  fechaConsulta: Date | string;
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  fechaCreacion?: Date | string;
  fechaActualizacion?: Date | string;
}

