import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditoriaLog } from '../model/auditoria-log.model';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private url = "http://localhost:8000/clinica/v1/auditoria/buscar";

  constructor(private http: HttpClient) {}

  buscar(usuario: string, tipo: string, fechaDesde: string, fechaHasta: string, page: number, size: number): Observable<any> {

    const token = localStorage.getItem("token"); // ⬅️ OBLIGATORIO

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (usuario) params = params.set('usuario', usuario);
    if (tipo) params = params.set('tipo', tipo);
    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);

    return this.http.get<any>(this.url, { params, headers });
  }
}
