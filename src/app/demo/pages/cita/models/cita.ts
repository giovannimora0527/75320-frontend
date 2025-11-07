import { Medico } from "../../medico/models/medico";
import { Paciente } from "../../paciente/models/paciente";

export class Cita {
    id!: number;
    fechaHora!: string;
    estado!: string;
    motivo!: string;
    paciente!: Paciente;
    medico!: Medico;
}