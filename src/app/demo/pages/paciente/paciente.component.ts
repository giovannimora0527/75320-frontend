import { Component, AfterViewInit } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './model/paciente';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements AfterViewInit {
  pacienteList: Paciente[] = [];
  pacienteFiltrado: Paciente[] = [];
  pacienteSelected: Paciente;

  // Campos para filtros
  filtros = {
    id: '',
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: ''
  };

  constructor(private readonly pacienteService: PacienteService) {
    this.listarPacientes();
  }

  ngAfterViewInit() {
    this.initializeTooltips();
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacienteList = data;
        this.pacienteFiltrado = [...data]; // Inicialmente todo
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => console.error('Error fetching pacientes:', error)
    });
  }

  aplicarFiltros() {
    const { id, tipoDocumento, numeroDocumento, nombres, apellidos, fechaNacimiento } = this.filtros;

    this.pacienteFiltrado = this.pacienteList.filter(p =>
      (!id || p.id.toString().includes(id)) &&
      (!tipoDocumento || p.tipoDocumento.toLowerCase().includes(tipoDocumento.toLowerCase())) &&
      (!numeroDocumento || p.numeroDocumento.toLowerCase().includes(numeroDocumento.toLowerCase())) &&
      (!nombres || p.nombres.toLowerCase().includes(nombres.toLowerCase())) &&
      (!apellidos || p.apellidos.toLowerCase().includes(apellidos.toLowerCase())) &&
      (!fechaNacimiento || (p.fechaNacimiento && p.fechaNacimiento.toString().includes(fechaNacimiento)))
    );
  }

  private initializeTooltips() {
    try {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const bootstrapGlobal = (window as any).bootstrap;
        if (bootstrapGlobal?.Tooltip) {
          new bootstrapGlobal.Tooltip(tooltipTriggerEl);
        }
      });
    } catch (error) {
      console.warn('Bootstrap tooltips could not be initialized:', error);
    }
  }
}