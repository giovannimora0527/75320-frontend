import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
 

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss']
})
export class MedicoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicos: Medico[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: Medico;
  constructor(private readonly medicoService: MedicoService) {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.getMedicos().subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.medicos = data as Medico[];
        } else if (data && Array.isArray(data.data)) {
          this.medicos = data.data as Medico[];
        } else if (data && Array.isArray(data.content)) {
          this.medicos = data.content as Medico[];
        } else {
          this.medicos = [];
        }
      },
      error: (error) => {
        console.error('Error al listar medicos:', error);
        this.medicos = [];
      }
    });
  }

  
}
