import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
<<<<<<< HEAD
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
=======
/**
 * Servicio para interactuar con el backend mediante peticiones HTTP.
 * Proporciona métodos genéricos para realizar operaciones GET, POST, PUT y envío de archivos.
 *
 * @remarks
 * Este servicio utiliza el token almacenado en localStorage para autenticar las peticiones.
 *
 * @example
 * ```typescript
 * backendService.get('https://api.example.com', 'users', 'list');
 * ```
 *
 * @param http Instancia de HttpClient para realizar las peticiones HTTP.
 *
 * @method construirHeader Construye los encabezados HTTP, incluyendo el token de autenticación si está disponible.
 * @method get Realiza una petición GET genérica al backend.
 * @param urlApi URL base de la API.
 * @param endpoint Endpoint específico de la API.
 * @param service Servicio o recurso a consultar.
 * @param routerParams Parámetros opcionales para la ruta.
 *
 * @method post Realiza una petición POST genérica al backend.
 * @param urlApi URL base de la API.
 * @param endpoint Endpoint específico de la API.
 * @param service Servicio o recurso a consultar.
 * @param data Datos a enviar en el cuerpo de la petición.
 *
 * @method put Realiza una petición PUT genérica al backend.
 * @param urlApi URL base de la API.
 * @param endpoint Endpoint específico de la API.
 * @param service Servicio o recurso a consultar.
 * @param data Datos a enviar en el cuerpo de la petición.
 *
 * @method postFile Realiza una petición POST para enviar archivos al backend.
 * @param urlApi URL base de la API.
 * @param endpoint Endpoint específico de la API.
 * @param service Servicio o recurso a consultar.
 * @param data Archivo o datos a enviar en el cuerpo de la petición.
 */
export class BackendService {
  constructor(private http: HttpClient) { }

  construirHeader() {
    // Aqui obtenemos el token desde el local storage
    const tokenRecuperado = localStorage.getItem('token');
    if (tokenRecuperado != '') {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        Authorization: 'Bearer ' + tokenRecuperado,
      });
      return headers;
    } else {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      });
      return headers;
    }
  }

  /**
   * Metodo GET generico
   * @param urlApi URL base de la API
   * @param endpoint Endpoint específico
   * @param service Servicio o recurso
   * @param routerParams Parámetros opcionales de la ruta
   * @returns Observable<T> respuesta del servidor
   */
  get<T>(
    urlApi: string,        // URL base de la API
    endpoint: string,      // Endpoint específico
    service: string,       // Servicio o recurso
    routerParams?: HttpParams // Parámetros opcionales de la ruta
  ) {
    const tokenRecuperado = localStorage.getItem('token') || ''; // Evita `null`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });
    return this.http.get<T>(`${urlApi}/${endpoint}/${service}`, {
      params: routerParams,
      headers: headers,
      withCredentials: true,
    });
  }

  /**
   * Metodo generico POST
   * @param urlApi URL base de la API
   * @param endpoint Endpoint específico
   * @param service Servicio o recurso
   * @param data Datos a enviar en el cuerpo de la petición
   * @returns Observable<T> respuesta del servidor
   */
  
  post<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Observable<T> {
    const tokenRecuperado = localStorage.getItem('token') || ''; // Evita `null`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });
    return this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: headers,
      withCredentials: true,
    });
  }

  /**
   * Metodo generico PUT
   * @param urlApi URL base de la API
   * @param endpoint Endpoint específico
   * @param service Servicio o recurso
   * @param data Datos a enviar en el cuerpo de la petición
   * @returns Observable<T> respuesta del servidor
   */
  put<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Observable<T> {
    const tokenRecuperado = localStorage.getItem('token') || ''; // Evita `null`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });
    return this.http.put<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: headers,
    });
  }



  postFile<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Observable<T> {
    const tokenRecuperado = localStorage.getItem('token') || ''; // Evita `null`
    const headers = new HttpHeaders({
      mimeType: 'multipart/form-data',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });
    return this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: headers,
      withCredentials: true,
    });
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }
}



<<<<<<< HEAD

=======
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
