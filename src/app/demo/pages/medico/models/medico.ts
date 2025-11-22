import { Especializacion } from "./especializacion";

export class Medico {
    id!: number;
    nombres!: string;
    apellidos!: string;
    documento!: string;
    tipoDocumento!: string;
    telefono!: string;
    registroProfesional!: string;
    especializacion!: Especializacion;
}