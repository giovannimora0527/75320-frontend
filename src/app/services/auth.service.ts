import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  private readonly baseUrl = 'http://localhost:8000/clinica/v1/auth';

  private authStateSubject = new BehaviorSubject<AuthState>(this.getInitialAuthState());
  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.checkExistingAuth();
  }

  /** ======================
   *  🔹 MÉTODO NUEVO: RECUPERAR CONTRASEÑA
   *  ====================== */
  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/recuperar-contrasena`, { email });
  }

  /** ======================
   *  LOGIN
   *  ====================== */
  login(loginResponse: LoginRs): void {
    const token = loginResponse.token;
    const payload = this.decodeToken(token);

    const usuario: Usuario = {
      id: 0,
      username: payload.sub,
      rol: payload.rol,
      email: payload.sub + '@example.com',
      fechaCreacion: new Date(),
      activo: true
    };

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    localStorage.setItem(this.ROLES_KEY, JSON.stringify([payload.rol]));

    this.authStateSubject.next({
      isAuthenticated: true,
      token: token,
      usuario: usuario,
      roles: [payload.rol]
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLES_KEY);

    this.authStateSubject.next({
      isAuthenticated: false,
      token: null,
      usuario: null,
      roles: []
    });

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Usuario | null {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }

  getUserRoles(): string[] {
    const r = localStorage.getItem(this.ROLES_KEY);
    return r ? JSON.parse(r) : [];
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  }

  hasRole(role: string): boolean {
  const roles = this.getUserRoles();

  // Si el backend no envía roles → permitir el acceso
  if (!roles || roles.length === 0) return true;

  return roles.includes(role);
}

  hasAnyRole(roles: string[]): boolean {
  const userRoles = this.getUserRoles();

  if (!userRoles || userRoles.length === 0) return true;

  return roles.some(r => userRoles.includes(r));
}

  get isAuthenticated$(): Observable<boolean> {
    return this.authState$.pipe(map(state => state.isAuthenticated));
  }

  private getInitialAuthState(): AuthState {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const u = localStorage.getItem(this.USER_KEY);
    const r = localStorage.getItem(this.ROLES_KEY);

    return {
      isAuthenticated: !!token,
      token,
      usuario: u ? JSON.parse(u) : null,
      roles: r ? JSON.parse(r) : []
    };
  }

  private checkExistingAuth(): void {
  const token = this.getToken();

  // Si no hay token → cerrar sesión
  if (!token) {
    this.logout();
    return;
  }

  // Si el token NO tiene fecha de expiración → asumir que es válido
  try {
    const payload = this.decodeToken(token);

    if (!payload.exp) {
      console.warn("⚠️ Token sin fecha de expiración. Se tratará como válido.");
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) this.logout();

  } catch (e) {
    this.logout();
  }
}

}
