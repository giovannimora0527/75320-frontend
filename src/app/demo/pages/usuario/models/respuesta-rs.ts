export class RespuestaRs {
    mensaje!: string;    
    status!: number;
    data?: any; // Datos opcionales devueltos por la operación (puede contener usuario, password, etc.)
}