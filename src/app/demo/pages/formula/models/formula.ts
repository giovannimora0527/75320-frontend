import { Cita } from "../../cita/model/cita";
import { Medicamento } from "../../medicamento/models/medicamento";


export class Formula {
  id!: number;
  citaId!:  Cita ;
  medicamentoId!: Medicamento;
  dosis!: string;
  indicaciones!: string;
  fechaCreacionRegistro!: Date;
}
  