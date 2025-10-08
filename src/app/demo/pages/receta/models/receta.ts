import { Paciente } from 'src/app/demo/pages/paciente/models/paciente';
import { Cita } from '../../citas/models/cita';
import { Medicamento } from 'src/app/demo/pages/medicamentos/models/medicamento';

export class Receta {
    id: number;
    citaId: Cita
    paciente_id: Paciente; 
    medicamento_id: Medicamento;
    dosis: string;
    indicaciones: string; 
}