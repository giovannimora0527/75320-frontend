import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { PacienteService } from './service/paciente.service';
import { UtilService } from 'src/app/services/common/util.service';
import { Paciente } from './model/paciente'; // ⚠️ Ajusta la ruta según tu estructura


@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected: Paciente = new Paciente();
  titleSpinner: string = "Cargando pacientes...";
  pacienteList: Paciente[] = [];
 

  form: FormGroup = new FormGroup({
    usuarioId: new FormControl(null, Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    fechaNacimiento: new FormControl('', Validators.required),
    genero: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl(''),
  });

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly utilService: UtilService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
  ) {
    this.inicializarFormulario();
    this.listarPaciente();
    this.mostrarSpinnerTemporal();
  }

  mostrarSpinnerTemporal(): void {
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 2000);
  }

  inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      usuarioId: [null, Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: [''],
      telefono: [''],
      direccion: [''],
    });
  }

  listarPaciente(): void {
    this.pacienteService.getPaciente().subscribe({
      next: (data) => {
        this.pacienteList = data;
      },
      error: (error) => {
        console.error('Error al obtener pacientes:', error);
        Swal.fire('Error', 'No se pudieron cargar los pacientes.', 'error');
      }
    });
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

  openModal(modo: string): void {
    this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearPaciente');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoPaciente(): void {
    this.pacienteSelected = new Paciente();
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarPaciente(paciente: Paciente): void {
    this.pacienteSelected = paciente;
    const usuarioId = (paciente as any)?.usuarioId ?? (paciente as any)?.usuario?.id ?? null;
    this.form.patchValue({ ...paciente, usuarioId });
    this.openModal('E');
  }

  guardarPaciente(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    const pacienteData = this.form.getRawValue();

    if (this.modoFormulario === 'C') {
      this.crearPaciente(pacienteData);
    } else {
      this.actualizarPacienteBackend({ ...this.pacienteSelected, ...pacienteData });
    }
  }

  private crearPaciente(pacienteData: any): void {
    this.pacienteService.guardarPaciente(pacienteData).subscribe({
      next: (data) => {
        Swal.fire('Éxito', data.message || 'Paciente creado correctamente.', 'success');
        this.listarPaciente();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear paciente:', error);
        Swal.fire('Error', error?.error?.message || 'Error al crear paciente.', 'error');
      }
    });
  }

  private actualizarPacienteBackend(pacienteActualizado: Paciente): void {
    this.pacienteService.actualizarPaciente(pacienteActualizado).subscribe({
      next: (data) => {
        Swal.fire('Éxito', data.message || 'Paciente actualizado correctamente.', 'success');
        this.listarPaciente();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar paciente:', error);
        Swal.fire('Error', error?.error?.message || 'Error al actualizar paciente.', 'error');
      }
    });
  }
}
