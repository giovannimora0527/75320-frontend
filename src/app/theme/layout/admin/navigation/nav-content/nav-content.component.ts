// angular import
import { Component, inject, output, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent {
  private location = inject(Location);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // public method
  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  wrapperWidth: number;
  windowWidth = window.innerWidth;

  NavCollapsedMob = output();

  // constructor
  constructor() {
    this.actualizarMenu();
    
    // Suscribirse a cambios en el estado de autenticación para actualizar el menú
    this.authService.authState$.subscribe(() => {
      console.log('NavContent: Estado de autenticación cambió, actualizando menú...');
      this.actualizarMenu();
      // Forzar detección de cambios
      setTimeout(() => {
        this.actualizarMenu();
      }, 100);
    });
  }

  /**
   * Actualiza el menú filtrando por roles
   */
  private actualizarMenu(): void {
    this.navigations = this.filtrarMenuPorRoles(NavigationItems);
    this.cdr.detectChanges();
  }

  /**
   * Filtra los items del menú según los roles del usuario
   */
  private filtrarMenuPorRoles(items: NavigationItem[]): NavigationItem[] {
    // Si no está autenticado, no mostrar nada
    if (!this.authService.isAuthenticated()) {
      return [];
    }

    const userRoles = this.authService.getUserRoles();
    const currentUser = this.authService.getCurrentUser();
    const userRol = currentUser?.rol || '';
    
    // Verificar si tiene rol ADMIN (comparación case-insensitive)
    const tieneAdmin = userRoles.some(r => r?.toUpperCase() === 'ADMIN') || 
                       userRol?.toUpperCase() === 'ADMIN';
    const tieneMedico = userRoles.some(r => r?.toUpperCase() === 'MEDICO') || 
                        userRol?.toUpperCase() === 'MEDICO';

    return items.map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => {
          // Filtrar según el ID del item
          switch (child.id) {
            case 'usuario':
            case 'medico':
            case 'especializacion':
            case 'auditoria':
              return tieneAdmin;
            case 'paciente':
            case 'medicamento':
            case 'formula-medica':
            case 'historia-medica':
              return tieneAdmin || tieneMedico;
            case 'cita':
              return this.authService.isAuthenticated(); // Todos los autenticados
            default:
              return true;
          }
        });
        return { ...item, children: filteredChildren };
      }
      return item;
    });
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
