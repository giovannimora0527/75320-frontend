<<<<<<< HEAD
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
=======
import { Paciente } from "src/app/models/paciente";
import { Medico } from "../../medico/models/medico";

export class Cita {
    id!: number;
    medico!: Medico;
    paciente!: Paciente;
    fechaHora!: Date;
    estado!: string;
    motivo!: string;
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
}

