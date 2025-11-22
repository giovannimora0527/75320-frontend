export interface AuditoriaLog {
  id: number;
  username: string;
  tipoEvento: string;
  descripcion: string;
  direccionIp: string;
  fechaEvento: string;
  exitoso: boolean;
}
