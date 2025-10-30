import { Cita } from "../../cita/model/cita";
import { Medicamento } from "../../medicamento/models/medicamento";

export class Formula {
    id!: number;
    cita!: Cita;
    medicamento!: Medicamento;
    dosis!: string;
    indicaciones!: string;
    fechaCreacionRegistro!: string;
    fechaActualizacionRegistro!: string;
}