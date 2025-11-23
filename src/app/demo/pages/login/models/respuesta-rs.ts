/**
 * Objeto de Transferencia de Datos (DTO) para la respuesta estándar del servidor.
 * * Encapsula el resultado de una operación de negocio enviada desde el backend.
 * * El sufijo `Rs` es una convención de nomenclatura para indicar "Response" (Respuesta).
 * * @export
 * @class RespuestaRs
 */
export class RespuestaRs {
    /**
     * Mensaje descriptivo del resultado de la operación.
     * * Generalmente contiene texto legible para el usuario final (feedback),
     * útil para mostrar en alertas o notificaciones (ej. SweetAlert).
     */
    mensaje!: string;

    /**
     * Código numérico de estado de la operación.
     * * Puede corresponder a códigos HTTP (200, 400, 500) o códigos internos
     * de lógica de negocio definidos por el equipo de backend.
     */
    status!: number;
}