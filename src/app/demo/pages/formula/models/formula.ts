import { Cita } from "../../cita/models/cita";
import { Medicamento } from "../../medicamento/models/medicamento";

export class Formula {
    id!: number;
    indicaciones!: string;
    dosis!: string;
    fechaCreacionRegistro!: Date;
    fechaActualizacionRegistro!: Date;
    cita!: Cita;
    medicamento!: Medicamento;
}