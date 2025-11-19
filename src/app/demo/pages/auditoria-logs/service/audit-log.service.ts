import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { AuditLogPage } from '../model/audit-log-page';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly urlBase: string = environment.apiUrl; // http://localhost:8000/clinica/v1
  private readonly endpoint: string = 'auditoria';

  constructor(private readonly backendService: BackendService) {}

  listarLogs(
    username?: string,
    tipoEvento?: string,
    fechaDesde?: string,
    fechaHasta?: string,
    page: number = 0,
    size: number = 10
  ): Observable<AuditLogPage> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (username) {
      params = params.set('username', username);
    }
    if (tipoEvento) {
      params = params.set('tipoEvento', tipoEvento);
    }
    if (fechaDesde) {
      params = params.set('fechaDesde', fechaDesde);
    }
    if (fechaHasta) {
      params = params.set('fechaHasta', fechaHasta);
    }

    return this.backendService.get<AuditLogPage>(
      this.urlBase,
      this.endpoint,
      'logs',
      params
    );
  }
}
