export interface Cita {
  id: number;
  paciente: string;
  medico: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  notas?: string;
}