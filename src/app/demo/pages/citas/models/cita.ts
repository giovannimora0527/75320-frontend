import { Paciente } from 'src/app/demo/pages/paciente/models/paciente';
import { Medico } from 'src/app/demo/pages/medico/models/medico';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';

export class Cita {
    id: number;
    fechaHora: string;
    estado: string;
    motivo: string;
    paciente: Paciente;
    medico: Medico;
    especializacion: Especializacion;
}