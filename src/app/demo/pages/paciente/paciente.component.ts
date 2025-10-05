import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from './service/paciente.service';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  pacientes: any[] = [];
  constructor(private svc: PacienteService) {
    this.svc.listar().subscribe({
      next: (d) => this.pacientes = d as any[],
      error: (e) => console.error('Error pacientes:', e)
    });
  }

}
