import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from './service/paciente.service';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-paciente',
  standalone: true,
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class PacienteComponent implements OnInit {
  pacientes: any[] = [];
  form!: FormGroup;
  titleModal = '';
  titleBoton = '';
  modal: any;
  pacienteSeleccionado: any = null;
  cargando = false;

  constructor(private fb: FormBuilder, private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerPacientes();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      fechaNacimiento: ['']
    });
  }

  obtenerPacientes(): void {
    this.cargando = true;
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data; // Actualizamos el arreglo con la data del backend
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.cargando = false;
      }
    });
  }

  abrirNuevoPaciente(): void {
    this.titleModal = 'Nuevo Paciente';
    this.titleBoton = 'Guardar';
    this.pacienteSeleccionado = null;
    this.form.reset();
    this.mostrarModal();
  }

  abrirEditarPaciente(paciente: any): void {
    this.titleModal = 'Editar Paciente';
    this.titleBoton = 'Actualizar';
    this.pacienteSeleccionado = paciente;
    this.form.patchValue({
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      telefono: paciente.telefono,
      email: paciente.email,
      direccion: paciente.direccion,
      fechaNacimiento: paciente.fechaNacimiento
    });
    this.mostrarModal();
  }

  guardarPaciente(): void {
    if (this.form.invalid) {
      alert('Complete todos los campos obligatorios.');
      return;
    }

    const pacienteData = this.form.value;

    if (this.pacienteSeleccionado) {
      // Actualizar paciente
      this.pacienteService.actualizarPaciente(this.pacienteSeleccionado.id, pacienteData).subscribe({
        next: () => {
          alert('✅ Paciente actualizado correctamente');
          this.pacienteSeleccionado = null;
          this.cerrarModal();
          this.obtenerPacientes(); // 🔹 Refrescamos la tabla automáticamente
        },
        error: (err) => console.error('Error al actualizar paciente:', err)
      });
    } else {
      // Crear paciente
      this.pacienteService.crearPaciente(pacienteData).subscribe({
        next: () => {
          alert('✅ Paciente creado correctamente');
          this.cerrarModal();
          this.obtenerPacientes(); // Refrescamos la tabla
        },
        error: (err) => console.error('Error al crear paciente:', err)
      });
    }
  }

  mostrarModal(): void {
    const modalElement = document.getElementById('modalPaciente');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  cerrarModal(): void {
    if (this.modal) this.modal.hide();
  }

  eliminarPaciente(id: number): void {
    if (confirm('¿Desea eliminar este paciente?')) {
      this.pacienteService.eliminarPaciente(id).subscribe({
        next: () => {
          alert('🗑️ Paciente eliminado correctamente');
          this.obtenerPacientes(); // Refrescamos la tabla después de eliminar
        },
        error: (err) => console.error('Error al eliminar paciente:', err)
      });
    }
  }
}


