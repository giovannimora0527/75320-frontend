import { Medicamento } from './medicamento';

export class Receta {
  id!: number;
  cita!: number;
  medicamento!: Medicamento;
  dosis!: string;
  indicaciones!: string;
  fechaCreacionRegistro!: string;
}