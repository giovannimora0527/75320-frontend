export interface Cita {
  id: number;
  fecha: string; // ISO string o dd/MM/yyyy
  paciente: string;
  medico: string;
  estado: 'Programada' | 'Completada' | 'Cancelada';
}




