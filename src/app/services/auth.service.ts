import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRs } from '../demo/pages/login/models/login-rs';
import { Usuario } from '../demo/pages/usuario/models/usuario';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  usuario: Usuario | null;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'auth_user';
  private readonly ROLES_KEY = 'auth_roles';

  private authStateSubject = new BehaviorSubject<AuthState>(this.getInitialAuthState());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private readonly router: Router) {
    // Verificar si hay datos de autenticación al inicializar
    this.checkExistingAuth();
  }

  /**
   * Obtiene el estado inicial de autenticación desde localStorage
   */
  private getInitialAuthState(): AuthState {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    const rolesStr = localStorage.getItem(this.ROLES_KEY);

    return {
      isAuthenticated: !!token,
      token: token,
      usuario: userStr ? JSON.parse(userStr) : null,
      roles: rolesStr ? JSON.parse(rolesStr) : []
    };
  }

  /**
   * Verifica la autenticación existente al inicializar el servicio
   */
  private checkExistingAuth(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      // El token existe y es válido, mantener el estado actual
      return;
    } else if (token) {
      // El token existe pero no es válido, limpiar datos
      this.logout();
    }
  }

  /**
   * Realiza el login del usuario
   */
  login(loginResponse: LoginRs, usuario?: Usuario): void {
  console.log('AuthService.login() - Iniciando login');

    // Guardar el token
    localStorage.setItem(this.TOKEN_KEY, loginResponse.token);

    // Decodificar roles desde el token
    const payload = JSON.parse(atob(loginResponse.token.split('.')[1]));

    // TOMAR SIEMPRE roles desde el token (NO desde usuario)
    let roles: string[] = [];

    if (payload.roles) {
  // Validar que sea un array antes de usar .map()
      if (Array.isArray(payload.roles)) {
        roles = payload.roles.map((r: string) => r.toUpperCase());
      } else if (typeof payload.roles === 'string') {
        // Si es un string, convertirlo a array
        roles = [payload.roles.toUpperCase()];
      } else {
        // Si no es array ni string, usar vacío
        roles = [];
      }
    } else {
      // Si no existe, roles vacío
      roles = [];
    }

    // Guardar usuario si lo mandas opcional
    if (usuario) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    }

    // Guardar roles corregidos
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));

    // Actualizar estado global
    this.authStateSubject.next({
      isAuthenticated: true,
      token: loginResponse.token,
      usuario: usuario || null,
      roles: roles
    });

    console.log("ROLES DEL TOKEN:", roles);
  }

  /**
   * Realiza el logout del usuario
   */
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLES_KEY);

    // Actualizar estado
    const newState: AuthState = {
      isAuthenticated: false,
      token: null,
      usuario: null,
      roles: []
    };

    this.authStateSubject.next(newState);

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Obtiene los roles del usuario actual
   */
  getUserRoles(): string[] {
    const rolesStr = localStorage.getItem(this.ROLES_KEY);
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const isValid = !!token && this.isTokenValid(token);
    console.log('AuthService.isAuthenticated() - Token:', token ? 'existe' : 'no existe', 'Válido:', isValid);
    return isValid;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles().map(r => r.toUpperCase());
    return roles.includes(role.toUpperCase());
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles().map(r => r.toUpperCase());
    const searchRoles = roles.map(r => r.toUpperCase());
    return searchRoles.some(role => userRoles.includes(role));
  }

  /**
   * Verifica si el token es válido (básicamente si no ha expirado)
   */
  private isTokenValid(token: string): boolean {

    if (!token || token.split('.').length !== 3) {
        console.error('Token inválido: formato incorrecto');
        return false;
      }
    try {
      // Decodificar el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload decodificado:', payload);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log('Tiempo actual (segundos):', currentTime);
      // Verificar si el token no ha expirado
            // El token puede tener 'exp' (timestamp en segundos) o 'fecha_fin_sesion' (timestamp en segundos)
      if (payload.exp) {
        console.log('Token tiene exp:', payload.exp, 'Válido:', payload.exp > currentTime);
        return payload.exp > currentTime;
      } else if (payload.fecha_fin_sesion) {
        // fecha_fin_sesion viene como timestamp en segundos (Unix timestamp)
        // Si el valor es muy grande (> 1e12), está en milisegundos, si no, está en segundos
        let expirationTime: number;
        if (typeof payload.fecha_fin_sesion === 'number') {
          // Si el número es mayor a 1e12, está en milisegundos, si no, está en segundos
          expirationTime = payload.fecha_fin_sesion > 1e12 
            ? Math.floor(payload.fecha_fin_sesion / 1000)
            : payload.fecha_fin_sesion;
        } else {
          // Si es un string o Date, convertirlo
          expirationTime = Math.floor(new Date(payload.fecha_fin_sesion).getTime() / 1000);
        }
        console.log('Token tiene fecha_fin_sesion (raw):', payload.fecha_fin_sesion);
        console.log('Token tiene fecha_fin_sesion (procesado):', expirationTime);
        console.log('Tiempo actual:', currentTime);
        console.log('Válido:', expirationTime > currentTime);
        return expirationTime > currentTime;
      }
      
      // Si no tiene fecha de expiración, considerar válido (no ideal pero funcional)
      console.warn('Token sin fecha de expiración, considerando válido');
      return true;
    } catch (error) {
      // Si hay error al decodificar, el token no es válido
      console.error('Error al validar token:', error);
      // Si hay error al decodificar, el token no es válido
      return false;
    }
  }

  /**
   * Obtiene el estado actual de autenticación
   */
  getCurrentAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  /**
   * Observable que indica si el usuario está autenticado
   */
  get isAuthenticated$(): Observable<boolean> {
    return new Observable(observer => {
      this.authState$.subscribe(state => {
        observer.next(state.isAuthenticated);
      });
    });
  }
}