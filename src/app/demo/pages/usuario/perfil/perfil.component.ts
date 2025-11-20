import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  usuarioActual: Usuario | null = null;

  constructor(private authService: AuthService) {
    this.usuarioActual = this.authService.getCurrentUser();
  }

}
