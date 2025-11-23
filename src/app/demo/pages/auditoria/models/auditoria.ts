/**
 * Modelo de datos que representa un evento o registro de auditoría en el sistema.
 * * Esta interfaz define el contrato de datos que se espera recibir desde el backend
 * y se utiliza para tipar las respuestas de `AuditoriaService` y las filas de la tabla.
 * * @export
 * @interface Auditoria
 */
export interface Auditoria {
    /**
     * Identificador único del registro de auditoría (Primary Key).
     */
    id: number;

    /**
     * Nombre de usuario o login de la persona que realizó la acción.
     */
    username: string;

    /**
     * Detalle narrativo o técnico de la operación realizada.
     * @example "El usuario modificó el perfil del cliente ID 45"
     */
    description: string;

    /**
     * Fecha y hora exacta en la que ocurrió la transacción.
     * Generalmente viene en formato ISO 8601 desde el backend.
     */
    transaccionFecha: Date;

    /**
     * Categoría o tipo de la acción auditada.
     * Ayuda a clasificar los eventos (ej. LOGIN, INSERT, UPDATE, DELETE, ERROR).
     */
    tipoAuditoria: string;

    /**
     * Dirección IP desde la cual se originó la solicitud del usuario.
     * Útil para trazabilidad y seguridad.
     */
    ipAddress: string;
}