import { Paciente } from 'src/app/demo/pages/paciente/models/paciente';
import { Cita } from '../../citas/models/cita';

export class Receta {
    id: number;
    citaId: Cita
    paciente_id: Paciente; 
    medicamento_id: number;
    dosis: string;
    indicaciones: string;
    fecha_creacion_registro: Date;   
}