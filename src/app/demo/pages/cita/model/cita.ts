import { Paciente } from "src/app/models/paciente";
import { Medico } from "../../medico/models/medico";

export class Cita {
    id!: number;
    medico!: Medico;
    paciente!: Paciente;
    fechaHora!: Date;
    estado!: string;
    motivo!: string;
}