import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  private construirHeader(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
    return headers;
  }

  /**
   * Construye URL evitando barras dobles y barra final innecesaria
   */
  private construirUrl(urlBase: string, endpoint: string, service: string): string {
    const base = urlBase.replace(/\/+$/, '');
    const ep = endpoint.replace(/^\/+|\/+$/g, '');
    const srv = service.replace(/^\/+/, '');
    return srv ? `${base}/${ep}/${srv}` : `${base}/${ep}`;
  }

  get<T>(urlBase: string, endpoint: string, service: string, routerParams?: HttpParams): Observable<T> {
    const headers = this.construirHeader();
    const url = this.construirUrl(urlBase, endpoint, service);
    return this.http.get<T>(url, { params: routerParams, headers, withCredentials: true });
  }

  post<T>(urlBase: string, endpoint: string, service: string, data: any): Observable<T> {
    const headers = this.construirHeader();
    const url = this.construirUrl(urlBase, endpoint, service);
    return this.http.post<T>(url, data, { headers, withCredentials: true });
  }

  put<T>(urlBase: string, endpoint: string, service: string, data: any): Observable<T> {
    const headers = this.construirHeader();
    const url = this.construirUrl(urlBase, endpoint, service);
    return this.http.put<T>(url, data, { headers, withCredentials: true });
  }

  delete<T>(urlBase: string, endpoint: string, service: string): Observable<T> {
    const headers = this.construirHeader();
    const url = this.construirUrl(urlBase, endpoint, service);
    return this.http.delete<T>(url, { headers, withCredentials: true });
  }
}




