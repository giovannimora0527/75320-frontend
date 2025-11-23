export interface CitaRq {
    pacienteId: number;
    medicoId: number;
    fechaHora: string;
    estado?: string;
    motivo?: string;
  }
  