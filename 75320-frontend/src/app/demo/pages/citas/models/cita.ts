import { Medico } from '../../medico/models/medico';
import { Paciente } from '../../paciente/models/paciente';

export class Cita {
  id?: number;
  paciente: string;
  medico: string;
  fecha: string;
  estado: boolean;

  constructor() {
    this.paciente = '';
    this.medico = '';
    this.fecha = '';
    this.estado = true;
  }
}

