import { Cita } from '../../cita/models/cita';
import { Medicamento } from '../../medicamento/models/medicamento';

export interface FormulaMedica {
  id?: number;
  citaId?: number;
  medicamentoId?: number;
  dosis: string;
  cantidadRecetada: number;
  indicaciones: string;
  fechaHora?: string;

  // 👇 Estas propiedades son opcionales pero útiles si el backend las envía
  cita?: Cita;
  medicamento?: Medicamento;
}
