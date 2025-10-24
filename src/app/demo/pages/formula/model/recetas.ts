import { Cita } from 'src/app/demo/pages/cita/model/cita';
import { Paciente } from 'src/app/demo/pages/paciente/models/paciente';
import { Medico } from 'src/app/demo/pages/medico/models/medico';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';
import { Medicamentos } from 'src/app/demo/pages/medicamento/model/medicamento';

export class Receta {
    id: number;
    dosis: string;
    indicaciones: string;
    cita: Cita;
    paciente: Paciente;
    medico: Medico;
    especializacion: Especializacion;
    medicamento: Medicamentos;
}