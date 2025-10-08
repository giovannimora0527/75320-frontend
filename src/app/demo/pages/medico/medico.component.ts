import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';

@Component({
  selector: 'app-medico',
  imports: [CommonModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
    //modalInstance: Modal | null = null;
    modoFormulario: string = '';
    Medicos: Medico[] = [];
    titleModal: string = '';
    titleBoton: string = '';
    MedicoSelected: Medico;

  constructor(private readonly medicoService: MedicoService) {
    this.listarMedicos();
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
        next: (data) => {
        this.Medicos= data;
        console.log('Medicos cargados:', this.Medicos);
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  
}
