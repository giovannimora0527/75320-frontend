export class Paciente {
  id!: number;
  nombre!: string;
  nombres!: string; // Alias para compatibilidad
  apellido!: string;
  apellidos!: string; // Alias para compatibilidad
  cedula!: string;
  numeroDocumento!: string; // Alias para compatibilidad
  telefono!: string;
  email!: string;
  fechaNacimiento!: Date;
  direccion!: string;
  fechaCreacionRegistro!: string;
  fechaModificacionRegistro!: Date | null;
}