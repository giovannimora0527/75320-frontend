export interface HistoriaMedica {
  id: number;
  paciente: string;
  diagnostico: string;
  fecha: string;
  notas: string;
  medico: string;
  tratamiento?: string;
  estado: string;
}
