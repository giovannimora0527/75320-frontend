export interface FormulaMedica {
  id: number;
  paciente: string;
  medico: string;
  fecha: string;
  indicaciones: string;
  medicamentos?: string[];
  estado: string;
}
