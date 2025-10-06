import { Medico } from '../../medico/models/medico';
import { Paciente } from '../../paciente/models/paciente';
import { Medicamento } from '../../medicamentos/models/medicamentos';

export class FormulaMedica {
  id!: number;
  fecha!: string;                // Ej: "2025-10-04"
  indicaciones!: string;         // Ej: "Tomar una tableta cada 8 horas"
  medico!: Medico;               // Relación con el médico que formula
  paciente!: Paciente;           // Relación con el paciente
  medicamentos!: Medicamento[];  // Lista de medicamentos recetados
}
