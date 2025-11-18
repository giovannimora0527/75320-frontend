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
  let roles: string[] = [];

  if (usuario?.rol) {
    // Si nos pasan el usuario explícito, usamos ese rol
    roles = [usuario.rol];
  } else if (loginResponse?.token) {
    // Si solo tenemos el token, sacamos el rol del payload
    try {
      const payload = JSON.parse(atob(loginResponse.token.split('.')[1]));
      if (payload.rol) {
        roles = [payload.rol]; // rol que viene en el JWT
      }
    } catch (e) {
      console.error('Error al decodificar el token para obtener roles', e);
    }
  }

  // Guardar en localStorage
  localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
  if (usuario) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
  }
  localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));

  // Actualizar estado
  const newState: AuthState = {
    isAuthenticated: true,
    token: loginResponse.token,
    usuario: usuario || null,
    roles: roles
  };

  this.authStateSubject.next(newState);
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
    return !!token && this.isTokenValid(token);
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Verifica si el token es válido (básicamente si no ha expirado)
   */
  private isTokenValid(token: string): boolean {
    try {
      // Decodificar el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar si el token no ha expirado
      return payload.exp > currentTime;
    } catch {
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