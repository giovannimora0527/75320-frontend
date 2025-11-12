import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

/**
 * Interceptor para agregar el token JWT a todas las peticiones HTTP
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();

    // Si hay token, agregarlo a los headers
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continuar con la petición y manejar errores de autenticación
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es error 401 (No autorizado), hacer logout
        if (error.status === 401) {
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Ir al login'
          }).then(() => {
            this.authService.logout();
          });
        }
        
        // Si es error 403 (Prohibido), mostrar mensaje
        if (error.status === 403) {
          Swal.fire({
            title: 'Acceso denegado',
            text: 'No tiene permisos para realizar esta acción.',
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        }

        return throwError(() => error);
      })
    );
  }
}