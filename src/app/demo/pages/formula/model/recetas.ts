import { Cita } from "src/app/demo/pages/cita/model/cita";
import { Medicamentos } from "src/app/demo/pages/medicamento/model/medicamento";

export class Recetas {
    
    id!: number;
    citaId!: Cita;
    medicamentoId!: Medicamentos;
    dosis!: string;
    indicaciones!: string;

}