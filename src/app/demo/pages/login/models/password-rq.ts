/**
 * Objeto de Transferencia de Datos (DTO) para la solicitud de recuperación de contraseña.
 * * Representa el cuerpo (payload) que se envía al servidor para iniciar el trámite.
 * * El sufijo `Rq` es una convención de nomenclatura para indicar "Request" (Petición).
 * * @export
 * @class RecuperarPasswordRq
 */
export class RecuperarPasswordRq  {
    /**
     * Identificador único del usuario en el sistema.
     * * Dependiendo de la lógica del backend, puede ser el nombre de usuario (login) o el correo electrónico.
     * * El operador `!` (Definite Assignment Assertion) le indica a TypeScript que esta propiedad
     * será asignada antes de ser utilizada, evitando errores de compilación por inicialización.
     */
    username!: string;
}