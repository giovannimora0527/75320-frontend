import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
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
  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }

  private wrapWithSpinner<T>(request: Observable<T>): Observable<T> {
    this.utilityService.showSpinner();
    return new Observable<T>(subscriber => {
      request.subscribe({
        next: (value) => {
          subscriber.next(value);
          subscriber.complete();
        },
        error: (error: any) => {
          this.utilityService.showError(error.message || 'Error en la operación');
          subscriber.error(error);
        },
        complete: () => {
          this.utilityService.hideSpinner();
        }
      });
    });
  }

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
    urlApi: string,
    endpoint: string,
    service: string,
    routerParams?: HttpParams
  ): Observable<T> {
    const tokenRecuperado = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });

    const request = this.http.get<T>(`${urlApi}/${endpoint}/${service}`, {
      params: routerParams,
      headers: headers,
      withCredentials: true,
    });

    return this.wrapWithSpinner(request);
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
    const tokenRecuperado = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });

    const request = this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: headers,
      withCredentials: true,
    });

    return this.wrapWithSpinner(request);
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
    const tokenRecuperado = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });

    const request = this.http.put<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: headers,
    });

    return this.wrapWithSpinner(request);
  }



  postFile<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Observable<T> {
    const tokenRecuperado = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      mimeType: 'multipart/form-data',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });

    const request = this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: headers,
      withCredentials: true,
    });

    return this.wrapWithSpinner(request);
  }
}
