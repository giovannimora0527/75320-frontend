<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from './service/cita.service';
import { PacienteService } from '../paciente/service/paciente.service';
import { MedicoService } from '../medico/service/medico.service';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cita.component.html'
})
export class CitaComponent implements OnInit {
  citas: any[] = [];
  pacientes: any[] = [];
  medicos: any[] = [];
  citaForm!: FormGroup;
  mostrarFormulario: boolean = false;
  editando: boolean = false;
  citaSeleccionada: any = null;

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCitas();
    this.cargarPacientes();
    this.cargarMedicos();
  }

  initForm(): void {
    this.citaForm = this.fb.group({
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaCita: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  cargarCitas(): void {
    this.citaService.getCitas().subscribe({
      next: (data) => (this.citas = Array.isArray(data) ? data : []),
      error: (err) => console.error('Error al cargar citas:', err)
    });
  }

  cargarPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => (this.pacientes = Array.isArray(data) ? data : []),
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  cargarMedicos(): void {
    this.medicoService.getMedicos().subscribe({
      next: (data) => (this.medicos = Array.isArray(data) ? data : []),
      error: (err) => console.error('Error al cargar médicos:', err)
    });
  }

  nuevaCita(): void {
    this.mostrarFormulario = true;
    this.editando = false;
    this.citaForm.reset();
  }

  abrirEditarCita(cita: any): void {
    this.mostrarFormulario = true;
    this.editando = true;
    this.citaSeleccionada = cita;
    this.citaForm.patchValue({
      pacienteId: cita.paciente?.id || '',
      medicoId: cita.medico?.id || '',
      fechaCita: cita.fechaCita,
      hora: cita.hora,
      motivo: cita.motivo
    });
  }

  guardarCita(): void {
    if (this.citaForm.invalid) {
      alert('Complete todos los campos requeridos');
      return;
    }

    // Construir objeto con paciente y medico como objetos {id: ...}
    const citaData = {
      paciente: { id: this.citaForm.value.pacienteId },
      medico: { id: this.citaForm.value.medicoId },
      fechaCita: this.citaForm.value.fechaCita,
      hora: this.citaForm.value.hora,
      motivo: this.citaForm.value.motivo
    };

    if (this.editando && this.citaSeleccionada) {
      this.citaService.editarCita(this.citaSeleccionada.id, citaData).subscribe({
        next: () => {
          alert('✅ Cita actualizada correctamente');
          this.cargarCitas();
          this.cancelar();
        },
        error: (err) => console.error('Error al editar cita:', err)
      });
    } else {
      this.citaService.crearCita(citaData).subscribe({
        next: () => {
          alert('✅ Cita creada correctamente');
          this.cargarCitas();
          this.cancelar();
        },
        error: (err) => console.error('Error al crear cita:', err)
      });
    }
  }

  eliminarCita(id: number): void {
    if (confirm('¿Desea eliminar esta cita?')) {
      this.citaService.deleteCita(id).subscribe({
        next: () => {
          alert('🗑️ Cita eliminada correctamente');
          this.cargarCitas();
        },
        error: (err) => console.error('Error al eliminar cita:', err)
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editando = false;
    this.citaSeleccionada = null;
    this.citaForm.reset();
=======
import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CitaService } from './service/cita.service';
import { Cita } from './models/cita';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cita',
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.scss'
})
export class CitaComponent {
  titleSpinner: string = '';
  citasList: Cita[] = [];

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly citaService: CitaService
  ) {
    this.listarCitas();
  }

  listarCitas() {
    this.citaService.listarCitas().subscribe(
      {
        next: (data) => {          
          this.citasList = data;        
        },
        error: (error) => {
          console.error('Error al listar las citas:', error); 
        }
      }
    );
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }
}






