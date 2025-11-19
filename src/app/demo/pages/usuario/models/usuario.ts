export interface Usuario {
  id: number;
  username: string;
  email: string;
  rol: string;
  fechaCreacion: Date;
  activo: boolean;
}