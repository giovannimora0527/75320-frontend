export class LoginRs {
    token!: string;
    // Campos adicionales que el backend puede enviar
    mensaje?: string;
    intentosRestantes?: number;
    tiempoBloqueado?: string;
}