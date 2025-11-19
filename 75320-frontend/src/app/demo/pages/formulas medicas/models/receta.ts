import { Medicamento } from '../../medicamentos/models/medicamentos';
import { Cita } from './cita';

export class Receta {
  id!: number;
  cita!: Cita;
  medicamento!: Medicamento;
  dosis!: string;
  indicaciones!: string;
  fechaCreacionRegistro!: string;
}