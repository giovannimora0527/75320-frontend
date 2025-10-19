export interface Medicamento {
  id: number;
  nombre: string;
  codigo: string;
  presentacion: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  estado: string;
}