export interface Auditoria {
    id: number;
    username: string;
    description: string;
    transaccionFecha: Date;
    tipoAuditoria: string;
    ipAddress: string;
}