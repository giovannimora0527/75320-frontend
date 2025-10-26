export class Medicamento {
  id?: number;
  nombre!: string;
  descripcion!: string;
  presentacion!: string;
  cantidad!: number;
  fechaCompra!: string;  // fecha_compra en BD
  fechaVence!: string;   // fecha_vence en BD
  fechaCreacionRegistro?: string;  // fecha_creacion_registro en BD
  fechaModificacionRegistro?: string;  // fecha_modificacion_registro en BD
}