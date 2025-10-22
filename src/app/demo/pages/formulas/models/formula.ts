export interface Formula {
  id?: number;
  cita?: { id: number };          
  medicamento?: { id: number };   
  dosis: string;
  indicaciones: string;
  fechaRegistro?: string;
}
