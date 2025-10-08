export interface RecetaRq {
    message: string;
    citaId: number;         // Long -> number; obligatorio (enlaza con CitaRs)
    medicamentoId: number;  // Integer -> number; obligatorio
    dosis: string;          // String; e.g., "500mg cada 8 horas"
    indicaciones: string;
    // Date; no se envía, se genera en backend 
      // String; instrucciones detalladas, no vacío
}
// Opcional: Si prefieres una clase (útil para métodos o validación manual),
// pero interfaces son más comunes en frontend para DTOs.
export class recetaRq {
    citaId: number;
    medicamentoId: number;
    dosis: string;
    indicaciones: string;
    message!: string;

    constructor(
        citaId: number,
        medicamentoId: number,
        dosis: string,
        indicaciones: string
    ) {
        this.citaId = citaId;
        this.medicamentoId = medicamentoId;
        this.dosis = dosis;
        this.indicaciones = indicaciones;
    }
    // Getters (similares a Java)
    getCitaId(): number {
        return this.citaId;
    }
    getMedicamentoId(): number {
        return this.medicamentoId;
    }
    getDosis(): string {
        return this.dosis;
    }
    getIndicaciones(): string {
        return this.indicaciones;
    }
    // Setters si los necesitas (e.g., para actualizar)
    setCitaId(citaId: number): void {
        this.citaId = citaId;
    }
    setMedicamentoId(medicamentoId: number): void {
        this.medicamentoId = medicamentoId;
    }
    setDosis(dosis: string): void {
        this.dosis = dosis;
    }
    setIndicaciones(indicaciones: string): void {
        this.indicaciones = indicaciones;
    }

}