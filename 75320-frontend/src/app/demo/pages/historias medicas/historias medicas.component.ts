<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../paciente/service/paciente.service';
import { MedicoService } from '../medico/service/medico.service';
import { HistoriaMedicaService } from './service/historia-medica.service';

@Component({
  selector: 'app-historias-medicas',
  standalone: true,
  templateUrl: './historias medicas.component.html',
  styleUrls: ['./historias medicas.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class HistoriasMedicasComponent implements OnInit {
  form!: FormGroup;
  historiasMedicas: any[] = [];
  pacientes: any[] = [];
  medicos: any[] = [];
  mostrarModal = false;
  esEdicion = false;
  historiaSeleccionada: any = null;

  cargandoPacientes = true;
  cargandoMedicos = true;

  constructor(
    private fb: FormBuilder,
    private historiaService: HistoriaMedicaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarHistorias();
    this.listarPacientes();
    this.listarMedicos();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      fecha: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
    });
  }

  listarHistorias(): void {
    this.historiaService.getHistorias().subscribe({
      next: (data) => (this.historiasMedicas = data || []),
      error: (err) => console.error('❌ Error al cargar historias médicas', err),
    });
  }

  listarPacientes(): void {
    this.cargandoPacientes = true;
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = Array.isArray(data) ? data : [];
        this.cargandoPacientes = false;
      },
      error: (err) => {
        console.error('❌ Error cargando pacientes:', err);
        this.cargandoPacientes = false;
      },
    });
  }

  listarMedicos(): void {
    this.cargandoMedicos = true;
    this.medicoService.getMedicos().subscribe({
      next: (data) => {
        this.medicos = Array.isArray(data) ? data : [];
        this.cargandoMedicos = false;
      },
      error: (err) => {
        console.error('❌ Error cargando médicos:', err);
        this.cargandoMedicos = false;
      },
    });
  }

  abrirNuevaHistoria(): void {
    this.esEdicion = false;
    this.form.reset();
    this.mostrarModal = true;
  }

  abrirEditarHistoria(historia: any): void {
    this.esEdicion = true;
    this.historiaSeleccionada = historia;
    this.form.patchValue({
      id: historia.id,
      fecha: historia.fecha,
      diagnostico: historia.diagnostico,
      tratamiento: historia.tratamiento,
      pacienteId: historia.paciente?.id,
      medicoId: historia.medico?.id,
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarHistoria(): void {
    if (this.form.invalid) {
      alert('Complete todos los campos requeridos.');
      return;
    }

    // Mapear paciente y medico completos
    const pacienteSeleccionado = this.pacientes.find(
      (p) => p.id == this.form.value.pacienteId
    );
    const medicoSeleccionado = this.medicos.find(
      (m) => m.id == this.form.value.medicoId
    );

    const historiaData = {
      fecha: this.form.value.fecha,
      diagnostico: this.form.value.diagnostico,
      tratamiento: this.form.value.tratamiento,
      paciente: { id: pacienteSeleccionado?.id },
      medico: { id: medicoSeleccionado?.id },
    };

    if (this.esEdicion && this.historiaSeleccionada) {
      this.historiaService
        .actualizarHistoria(this.historiaSeleccionada.id, historiaData)
        .subscribe({
          next: (historiaActualizada: any) => {
            historiaActualizada.paciente = pacienteSeleccionado;
            historiaActualizada.medico = medicoSeleccionado;

            // Reemplazar en la lista local
            const index = this.historiasMedicas.findIndex(
              (h) => h.id === historiaActualizada.id
            );
            if (index !== -1) this.historiasMedicas[index] = historiaActualizada;

            this.cerrarModal();
          },
          error: (err) =>
            console.error('❌ Error al actualizar historia médica', err),
        });
    } else {
      this.historiaService.crearHistoria(historiaData).subscribe({
        next: (historiaCreada: any) => {
          // Asignar nombres para mostrar en la tabla
          historiaCreada.paciente = pacienteSeleccionado;
          historiaCreada.medico = medicoSeleccionado;

          // Agregar a la tabla
          this.historiasMedicas.push(historiaCreada);
          this.cerrarModal();
        },
        error: (err) => console.error('❌ Error al crear historia médica', err),
      });
    }
  }

  eliminarHistoria(id: number): void {
    if (confirm('¿Desea eliminar esta historia médica?')) {
      this.historiaService.eliminarHistoria(id).subscribe({
        next: () => {
          this.historiasMedicas = this.historiasMedicas.filter(
            (h) => h.id !== id
          );
        },
        error: (err) => console.error('❌ Error al eliminar historia médica', err),
      });
    }
  }
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-historia',
  imports: [],
  templateUrl: './historias medicas.component.html',
  styleUrl: './historias medicas.component.scss'
})
export class HistoriaComponent {

>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
}












<<<<<<< HEAD

=======
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
