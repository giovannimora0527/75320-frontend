import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';

@Component({
  selector: 'app-usuario',
  imports: [],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {
    this.listarUsuarios();
  }

  /**
   * Servicio de listar usuarios.
   */
  listarUsuarios() {
    console.log('Entro a cargar usuarios');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
         this.usuarios = data;
         console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => console.error('Error al listar usuarios:', err)
    });
  }
}
