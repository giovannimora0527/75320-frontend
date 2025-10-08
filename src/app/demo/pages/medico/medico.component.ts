import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';

@Component({
  selector: 'app-medico',
  imports: [],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  constructor(private readonly medicoService: MedicoService) {
    this.listaredicos();
  }

  listaredicos() {
    this.medicoService.getMedicos().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  
}
