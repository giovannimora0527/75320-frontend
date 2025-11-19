export interface AuditLog {
  id: number;
  fechaHora: string;
  username: string;
  tipoEvento: string;
  descripcion: string;
  ipOrigen: string;
  exito?: boolean | null;
}
