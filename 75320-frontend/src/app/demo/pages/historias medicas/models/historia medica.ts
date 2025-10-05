import { Paciente } from '../../paciente/models/paciente';
import { Medico } from '../../medico/models/medico';
import { Cita } from '../../citas/models/cita';
import { FormulaMedica } from '../../formulas medicas/models/formula medica';

export class HistoriaMedica {
  id!: number;
  fechaRegistro!: string;        // Ej: "2025-10-04"
  diagnostico!: string;          // Ej: "Gripe común"
  observaciones!: string;        // Ej: "Paciente estable, control en 15 días"
  paciente!: Paciente;           // Relación con el paciente
  medico!: Medico;               // Relación con el médico
  cita!: Cita;                   // Relación con la cita correspondiente
  formulaMedica!: FormulaMedica; // Relación con la fórmula asociada
}
