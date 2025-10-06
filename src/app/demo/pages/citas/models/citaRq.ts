
export interface CitaRq {
    pacienteId: number;  // Integer -> number; obligatorio
    medicoId: number;    // Long -> number; obligatorio
    fechaHora: string;   // String; formato esperado: ISO string (e.g., "2023-10-01T14:30:00")
    estado: string;      // String; e.g., "programada", "en_progreso"
    motivo: string;      // String; texto descriptivo, no vacío
}

export class citaRq {

    pacienteId: number;
    medicoId: number;
    fechaHora: string;
    estado: string;
    motivo: string;
    message!: string;

    constructor(
        pacienteId: number,
        medicoId: number,
        fechaHora: string,
        estado: string,
        motivo: string
    )
    {
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.motivo = motivo;
    }
        // Getters (similares a Java)
    getPacienteId(): number {
        return this.pacienteId;
    }
    getMedicoId(): number {
        return this.medicoId;
    }
    getFechaHora(): string {
        return this.fechaHora;
    }
    getEstado(): string {
        return this.estado;
    }
    getMotivo(): string {
        return this.motivo;
    }
    // Setters si los necesitas (e.g., para actualizar)
    setPacienteId(pacienteId: number): void {
        this.pacienteId = pacienteId;
    }
    setMedicoId(medicoId: number): void {
        this.medicoId = medicoId;
    }
    setFechaHora(fechaHora: string): void {
        this.fechaHora = fechaHora;
    }
    setEstado(estado: string): void {
        this.estado = estado;
    }
    setMotivo(motivo: string): void {
        this.motivo = motivo;
    }

}