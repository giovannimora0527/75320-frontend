import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicoService } from './service/medico.service';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  medicos: any[] = [];
  constructor(private readonly medicoService: MedicoService) {
    this.listaredicos();
  }

  listaredicos() {
    this.medicoService.getMedicos().subscribe({
      next: (data) => {
        this.medicos = data as any[];
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  
}
