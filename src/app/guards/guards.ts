import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

/**
 * Guard para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Mostrar mensaje de que necesita autenticarse
  Swal.fire({
    title: 'Acceso denegado',
    text: 'Debe iniciar sesión para acceder a esta página',
    icon: 'warning',
    confirmButtonText: 'Ir al login'
  }).then(() => {
    // Redirigir al login y guardar la URL intentada para redirigir después
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
  });

  return false;
};

/**
 * Guard para proteger rutas basadas en roles específicos
 * Requiere que el usuario tenga al menos uno de los roles especificados
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero verificar si está autenticado
  if (!authService.isAuthenticated()) {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión para acceder a esta página',
      icon: 'warning',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    });
    return false;
  }

  // Obtener los roles requeridos desde los datos de la ruta
  const requiredRoles: string[] = route.data?.['roles'] || [];

  // Si no se especifican roles, solo verificar autenticación
  if (requiredRoles.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene alguno de los roles requeridos
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // El usuario no tiene los roles necesarios
  Swal.fire({
    title: 'Acceso denegado',
    text: `No tiene permisos para acceder a esta página. Roles requeridos: ${requiredRoles.join(', ')}`,
    icon: 'error',
    confirmButtonText: 'Entendido'
  }).then(() => {
    // Redirigir al dashboard o página principal
    router.navigate(['/dashboard']);
  });

  return false;
};

/**
 * Guard para roles de administrador
 * Verifica que el usuario tenga el rol ADMIN
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión para acceder a esta página',
      icon: 'warning',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    });
    return false;
  }

  if (authService.hasRole('ADMIN')) {
    return true;
  }

  Swal.fire({
    title: 'Acceso denegado',
    text: 'Solo los administradores pueden acceder a esta página',
    icon: 'error',
    confirmButtonText: 'Entendido'
  }).then(() => {
    router.navigate(['/dashboard']);
  });

  return false;
};

/**
 * Guard para roles de médico
 * Verifica que el usuario tenga el rol MEDICO
 */
export const medicoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión para acceder a esta página',
      icon: 'warning',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    });
    return false;
  }

  if (authService.hasRole('MEDICO') || authService.hasRole('ADMIN')) {
    return true;
  }

  Swal.fire({
    title: 'Acceso denegado',
    text: 'Solo los médicos pueden acceder a esta página',
    icon: 'error',
    confirmButtonText: 'Entendido'
  }).then(() => {
    router.navigate(['/dashboard']);
  });

  return false;
};

/**
 * Guard para roles de paciente
 * Verifica que el usuario tenga el rol PACIENTE
 */
export const pacienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión para acceder a esta página',
      icon: 'warning',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    });
    return false;
  }

  if (authService.hasRole('PACIENTE') || authService.hasRole('ADMIN')) {
    return true;
  }

  Swal.fire({
    title: 'Acceso denegado',
    text: 'Solo los pacientes pueden acceder a esta página',
    icon: 'error',
    confirmButtonText: 'Entendido'
  }).then(() => {
    router.navigate(['/dashboard']);
  });

  return false;
};

/**
 * Guard para evitar que usuarios autenticados accedan al login
 * Redirige al dashboard si ya están autenticados
 */
export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Si ya está autenticado, redirigir al dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

/**
 * Guard que permite acceso solo a usuarios no autenticados (páginas públicas)
 */
export const publicGuard: CanActivateFn = () => {
  return true; // Siempre permite el acceso (para páginas públicas)
};

/**
 * Guard combinado para médicos y administradores
 */
export const medicoAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión para acceder a esta página',
      icon: 'warning',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    });
    return false;
  }

  if (authService.hasAnyRole(['MEDICO', 'ADMIN'])) {
    return true;
  }

  Swal.fire({
    title: 'Acceso denegado',
    text: 'Solo los médicos y administradores pueden acceder a esta página',
    icon: 'error',
    confirmButtonText: 'Entendido'
  }).then(() => {
    router.navigate(['/dashboard']);
  });

  return false;
};

/**
 * Guard que verifica permisos específicos para módulos
 */
export const modulePermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión para acceder a esta página',
      icon: 'warning',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    });
    return false;
  }

  const module = route.data?.['module'];

  // Lógica específica por módulo
  switch (module) {
    case 'usuarios':
      return authService.hasRole('ADMIN');
    
    case 'pacientes':
      return authService.hasAnyRole(['ADMIN', 'MEDICO']);
    
    case 'medicos':
      return authService.hasRole('ADMIN');
    
    case 'citas':
      return authService.hasAnyRole(['ADMIN', 'MEDICO', 'PACIENTE']);
    
    case 'formulas':
      return authService.hasAnyRole(['ADMIN', 'MEDICO']);
    
    case 'medicamentos':
      return authService.hasAnyRole(['ADMIN', 'MEDICO']);
    
    case 'historias':
      return authService.hasAnyRole(['ADMIN', 'MEDICO']);
    
    case 'especializaciones':
      return authService.hasRole('ADMIN');
    
    default:
      return true;
  }
};