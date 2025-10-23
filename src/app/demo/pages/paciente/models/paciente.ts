export class Paciente {
  id!: number;
  usuarioId!: number;
  tipoDocumento!: string;
  numeroDocumento!: string;
  nombres!: string;
  apellidos!: string;
  fechaNacimiento!: string; // ISO string (YYYY-MM-DD)
  genero!: string;
  telefono!: string;
  direccion!: string;
}