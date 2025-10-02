import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  titleModal: string = "Probando modal";

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

  clickEditar(usuario: Usuario) {
    console.log(usuario);
    Swal.fire('Hola', usuario.username, 'error');
  }

  guardarUsuario(){
     Swal.fire('Prueba Bug', "Contenido del modal", 'error');
  }
}
