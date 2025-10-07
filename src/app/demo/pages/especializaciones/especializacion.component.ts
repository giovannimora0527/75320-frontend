import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Especializacion } from './models/especializacion';
import { EspecializacionService } from './service/especializacion.service';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})
export class EspecializacionComponent {

  especializaciones: Especializacion[] = [];

  constructor(private especializacionService: EspecializacionService) {
    this.listarEspecializaciones();
  }

  listarEspecializaciones() {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializaciones = data;
        console.log('Especializaciones cargadas:', this.especializaciones);
      },
      error: (err) => console.error('Error al listar especializaciones:', err)
    });
  }
}

