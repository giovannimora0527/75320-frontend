import { Cita } from 'src/app/demo/pages/citas/models/cita';
import { Paciente } from 'src/app/demo/pages/paciente/models/paciente';
import { Medico } from 'src/app/demo/pages/medico/models/medico';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';
import { Medicamento } from 'src/app/demo/pages/medicamento/models/medicamento';

export class Receta {
    id: number;
    dosis: string;
    indicaciones: string;
    cita: Cita;
    paciente: Paciente;
    medico: Medico;
    especializacion: Especializacion;
    medicamento: Medicamento;
}