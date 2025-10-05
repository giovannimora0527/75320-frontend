export class Medicamento {
  id!: number;
  nombre!: string;               // Ej: "Paracetamol"
  descripcion!: string;          // Ej: "Analgésico y antipirético"
  laboratorio!: string;          // Ej: "Genfar"
  dosis!: string;                // Ej: "500mg"
  presentacion!: string;         // Ej: "Tabletas"
  precio!: number;               // Ej: 2500
  cantidadDisponible!: number;   // Ej: 150
}
