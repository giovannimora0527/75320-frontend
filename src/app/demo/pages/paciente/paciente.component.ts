import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { PacienteService } from './service/paciente.service';
import { UtilService } from 'src/app/services/common/util.service';
import { Paciente } from './model/paciente';

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

  /** 🔍 Listado filtrado y variable del campo de búsqueda */
  pacienteFiltrado: Paciente[] = [];
  filtroPaciente: string = '';
  tipoDocumentoFiltro: string = '';

  /** 🔽 Variables de ordenamiento */
  criterioOrden: string = '';
  direccionOrden: 'asc' | 'desc' = 'asc';

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
        this.pacienteList = data || [];
        this.filtrarPacientes(); // ✅ Mantiene la lista filtrada actualizada
      },
      error: (error) => {
        console.error('Error al obtener pacientes:', error);
        Swal.fire('Error', 'No se pudieron cargar los pacientes.', 'error');
      }
    });
  }

  /** 🔍 Filtrado de pacientes */
  filtrarPacientes(): void {
    const filtro = this.filtroPaciente.toLowerCase().trim();

    // 🔹 Si no hay texto en el filtro y no se seleccionó tipo, mostrar todos los pacientes
    if (!filtro && !this.tipoDocumentoFiltro) {
      this.pacienteFiltrado = [...this.pacienteList];
      return;
    }

    // Normalizar a strings para evitar llamar .includes sobre undefined
    this.pacienteFiltrado = this.pacienteList.filter(p => {
      const numero = (p.numeroDocumento || '').toLowerCase();
      const nombres = (p.nombres || '').toLowerCase();
      const apellidos = (p.apellidos || '').toLowerCase();
      const telefono = (p.telefono || '').toLowerCase();
      const direccion = (p.direccion || '').toLowerCase();
      const genero = (p.genero || '').toLowerCase();
      const usuarioIdStr = p.usuarioId != null ? p.usuarioId.toString() : '';
      const matchTexto = (
        numero.includes(filtro) ||
        nombres.includes(filtro) ||
        apellidos.includes(filtro) ||
        telefono.includes(filtro) ||
        direccion.includes(filtro) ||
        genero.includes(filtro) ||
        usuarioIdStr.includes(filtro) // Soporte de búsqueda por Usuario ID
      );

      // Si hay filtro por tipo de documento, y no coincide, excluir
      if (this.tipoDocumentoFiltro) {
        const tipo = (p.tipoDocumento || '').toUpperCase();
        if (tipo !== this.tipoDocumentoFiltro) return false;
      }

      // Si no hay texto de búsqueda, pero pasó el filtro de tipo (o no existe), incluir
      if (!filtro) return true;

      return matchTexto;
    });
  }

  /** 🔽 Ordenar tabla por columna */
  ordenarPor(campo: keyof Paciente | 'usuarioId'): void {
    if (this.criterioOrden === campo) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.criterioOrden = campo;
      this.direccionOrden = 'asc';
    }

    this.pacienteFiltrado.sort((a: any, b: any) => {
      const valorA = (a[campo] ?? '').toString().toLowerCase();
      const valorB = (b[campo] ?? '').toString().toLowerCase();

      if (valorA < valorB) return this.direccionOrden === 'asc' ? -1 : 1;
      if (valorA > valorB) return this.direccionOrden === 'asc' ? 1 : -1;
      return 0;
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
    const usuarioId = (paciente as any)?.usuarioId ?? null;
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

    const accion = this.modoFormulario === 'C' ? 'crear' : 'actualizar';
    const titulo = this.modoFormulario === 'C' ? 'Crear paciente' : 'Actualizar paciente';
    const texto = this.modoFormulario === 'C'
      ? '¿Desea crear este paciente?'
      : '¿Desea actualizar los datos de este paciente?';

    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.modoFormulario === 'C' ? 'Sí, crear' : 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        if (this.modoFormulario === 'C') {
          this.crearPaciente(pacienteData);
        } else {
          this.actualizarPacienteBackend({ ...this.pacienteSelected, ...pacienteData });
        }
      }
    });
  }

  confirmarEliminarPaciente(paciente: Paciente): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al paciente ${paciente.nombres} ${paciente.apellidos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.eliminarPaciente(paciente);
      }
    });
  }

  private eliminarPaciente(paciente: Paciente): void {
    this.pacienteService.eliminarPaciente(paciente).subscribe({
      next: (resp) => {
        Swal.fire('Eliminado', resp.message || 'Paciente eliminado correctamente.', 'success');
        this.listarPaciente();
      },
      error: (err) => {
        console.error('Error al eliminar paciente:', err);
        Swal.fire('Error', err?.error?.message || 'No se pudo eliminar el paciente.', 'error');
      }
    });
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
