import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { Especializacion } from './models/especializacion';

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent implements OnInit {
  medicos: Medico[] = [];
  medicoSeleccionado: Medico = {} as Medico;
  mostrarFormulario: boolean = false;
  especializaciones: Especializacion[] = [
    { 
      id: 1, 
      nombre: 'Cardiología', 
      descripcion: 'Especialidad en enfermedades del corazón', 
      codigoEspecializacion: 'CAR-001' 
    },
    { 
      id: 2, 
      nombre: 'Pediatría', 
      descripcion: 'Especialidad en salud infantil', 
      codigoEspecializacion: 'PED-001' 
    },
    { 
      id: 3, 
      nombre: 'Dermatología', 
      descripcion: 'Especialidad en enfermedades de la piel', 
      codigoEspecializacion: 'DER-001' 
    }
  ];

  constructor(private readonly medicoService: MedicoService) {}

  ngOnInit() {
    this.listarMedicos();
  }

  listarMedicos() {
    this.medicoService.getMedicos().subscribe({
      next: (data: any) => {
        this.medicos = data;
        console.log('Médicos cargados:', data);
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
        // Datos de ejemplo para probar
        this.medicos = [
          {
            id: 1,
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            nombres: 'Carlos',
            apellidos: 'Gómez',
            telefono: '3001234567',
            registroProfesional: 'MED12345',
            especializacion: this.especializaciones[0]
          },
          {
            id: 2,
            tipoDocumento: 'CC',
            numeroDocumento: '987654321',
            nombres: 'Ana',
            apellidos: 'Martínez',
            telefono: '3109876543',
            registroProfesional: 'MED67890',
            especializacion: this.especializaciones[1]
          }
        ];
      }
    });
  }

  nuevoMedico() {
    this.medicoSeleccionado = {
      id: 0,
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      registroProfesional: '',
      especializacion: {} as Especializacion
    };
    this.mostrarFormulario = true;
  }

  editarMedico(medico: Medico) {
    this.medicoSeleccionado = { ...medico };
    this.mostrarFormulario = true;
  }

  guardarMedico() {
    if (this.medicoSeleccionado.id === 0) {
      // Crear nuevo médico
      this.medicoSeleccionado.id = Math.max(0, ...this.medicos.map(m => m.id)) + 1;
      this.medicos.push({...this.medicoSeleccionado});
      console.log('Creando nuevo médico:', this.medicoSeleccionado);
    } else {
      // Actualizar médico existente
      const index = this.medicos.findIndex(m => m.id === this.medicoSeleccionado.id);
      if (index !== -1) {
        this.medicos[index] = {...this.medicoSeleccionado};
      }
      console.log('Actualizando médico:', this.medicoSeleccionado);
    }
    
    this.mostrarFormulario = false;
  }

  eliminarMedico(id: number) {
    if (confirm('¿Está seguro de eliminar este médico?')) {
      console.log('Eliminando médico con ID:', id);
      this.medicos = this.medicos.filter(m => m.id !== id);
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
  }
}