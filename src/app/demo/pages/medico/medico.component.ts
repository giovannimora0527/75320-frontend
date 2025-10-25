import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';

interface MedicoResponse {
  data?: Medico[];
  content?: Medico[];
}

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss']
})
export class MedicoComponent implements OnInit {
  medicos: Medico[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void {
    this.listarMedicos();
  }

  listarMedicos() {
    this.isLoading = true;
    this.medicoService.getMedicos().subscribe({
      next: (data: MedicoResponse | Medico[]) => {
        if (Array.isArray(data)) {
          this.medicos = data;
        } else if (data && Array.isArray(data.data)) {
          this.medicos = data.data;
        } else if (data && Array.isArray(data.content)) {
          this.medicos = data.content;
        } else {
          this.medicos = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al listar médicos:', error);
        this.medicos = [];
        this.isLoading = false;
      }
    });
  }

  filtrarMedicos() {
    const termino = this.searchTerm.toLowerCase();
    return this.medicos.filter(m =>
      m.nombres?.toLowerCase().includes(termino) ||
      m.apellidos?.toLowerCase().includes(termino) ||
      m.especializacion?.nombre?.toLowerCase().includes(termino)
    );
  }
}
