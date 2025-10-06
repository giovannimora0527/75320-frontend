import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente = {} as Paciente;
  mostrarFormulario: boolean = false;

  constructor(private readonly pacienteService: PacienteService) {}

  ngOnInit() {
    this.listarPacientes();
  }

  listarPacientes() {
    this.pacienteService.getPacientes().subscribe({
      next: (data: any) => {
        this.pacientes = data;
        console.log('Pacientes cargados:', data);
      },
      error: (error) => {
        console.error('Error fetching pacientes:', error);
        // Datos de ejemplo para probar
        this.pacientes = [
          {
            id: 1,
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            nombres: 'María',
            apellidos: 'López',
            telefono: '3001234567',
            email: 'maria.lopez@email.com',
            fechaNacimiento: '1985-05-15',
            genero: 'Femenino',
            direccion: 'Calle 123 #45-67',
            estado: 'Activo'
          },
          {
            id: 2,
            tipoDocumento: 'CC',
            numeroDocumento: '987654321',
            nombres: 'Juan',
            apellidos: 'Pérez',
            telefono: '3109876543',
            email: 'juan.perez@email.com',
            fechaNacimiento: '1990-08-20',
            genero: 'Masculino',
            direccion: 'Carrera 78 #12-34',
            estado: 'Activo'
          }
        ];
      }
    });
  }

  nuevoPaciente() {
    this.pacienteSeleccionado = {
      id: 0,
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      fechaNacimiento: '',
      genero: '',
      direccion: '',
      estado: 'Activo'
    };
    this.mostrarFormulario = true;
  }

  editarPaciente(paciente: Paciente) {
    this.pacienteSeleccionado = { ...paciente };
    this.mostrarFormulario = true;
  }

  guardarPaciente() {
    if (this.pacienteSeleccionado.id === 0) {
      // Crear nuevo paciente
      this.pacienteSeleccionado.id = Math.max(0, ...this.pacientes.map(p => p.id)) + 1;
      this.pacientes.push({...this.pacienteSeleccionado});
      console.log('Creando nuevo paciente:', this.pacienteSeleccionado);
    } else {
      // Actualizar paciente existente
      const index = this.pacientes.findIndex(p => p.id === this.pacienteSeleccionado.id);
      if (index !== -1) {
        this.pacientes[index] = {...this.pacienteSeleccionado};
      }
      console.log('Actualizando paciente:', this.pacienteSeleccionado);
    }
    
    this.mostrarFormulario = false;
  }

  eliminarPaciente(id: number) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      console.log('Eliminando paciente con ID:', id);
      this.pacientes = this.pacientes.filter(p => p.id !== id);
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }
}