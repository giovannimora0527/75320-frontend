import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from './service/pacientes.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss'], // Apunta al SCSS existente
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class PacienteComponent implements OnInit {

  pacientes: any[] = [];
  form!: FormGroup;
  titleModal: string = '';
  titleBoton: string = '';

  constructor(private fb: FormBuilder, private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerPacientes();
  }

  crearFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [0, Validators.required],
      genero: ['', Validators.required]
    });
  }

  obtenerPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (res: any) => {
        this.pacientes = res || [];
      },
      error: (err) => {
        console.error('Error al obtener pacientes:', err);
      }
    });
  }

  abrirNuevoPaciente(): void {
    this.form.reset();
    this.titleModal = 'Nuevo Paciente';
    this.titleBoton = 'Guardar';
    (document.getElementById('modalCrearPaciente') as any)?.classList.add('show');
    (document.getElementById('modalCrearPaciente') as any).style.display = 'block';
  }

  abrirEditarPaciente(paciente: any): void {
    this.form.patchValue(paciente);
    this.titleModal = 'Editar Paciente';
    this.titleBoton = 'Actualizar';
    (document.getElementById('modalCrearPaciente') as any)?.classList.add('show');
    (document.getElementById('modalCrearPaciente') as any).style.display = 'block';
  }

  closeModal(): void {
    (document.getElementById('modalCrearPaciente') as any)?.classList.remove('show');
    (document.getElementById('modalCrearPaciente') as any).style.display = 'none';
  }

  guardarPaciente(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const paciente = this.form.value;

    if (paciente.id) {
      // Actualizar paciente existente
      this.pacienteService.actualizarPaciente(paciente).subscribe({
        next: () => {
          alert('Paciente actualizado correctamente');
          this.closeModal();
          this.obtenerPacientes();
        },
        error: (err) => {
          console.error('Error al actualizar paciente:', err);
        }
      });
    } else {
      // Crear nuevo paciente
      this.pacienteService.crearPaciente(paciente).subscribe({
        next: () => {
          alert('Paciente creado correctamente');
          this.closeModal();
          this.obtenerPacientes();
        },
        error: (err) => {
          console.error('Error al crear paciente:', err);
        }
      });
    }
  }
}


