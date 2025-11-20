// angular import
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/demo/pages/usuario/models/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, CommonModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent {
  usuarioActual: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';

    this.usuarioActual = this.authService.getCurrentUser();
  }

  irAlPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  cerrarSesion(): void {
    // aquí asumo que tu AuthService ya borra token/user, si no:
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
