import { Especializacion } from "./especializacion";

export interface Medico {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  registroProfesional: string;
  especializacion: Especializacion;
}