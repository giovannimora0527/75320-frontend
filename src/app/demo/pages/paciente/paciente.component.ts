import { Component } from '@angular/core';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  pacientes: Paciente[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected: Paciente;

  form: FormGroup = new FormGroup({
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    telefono: new FormControl(''),
    email: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    genero: new FormControl(''),
    direccion: new FormControl(''),
    estado: new FormControl('')
  });

  constructor(
    private pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarPacientes();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.minLength(7)]],
      email: ['', [Validators.email]],
      fechaNacimiento: [''],
      genero: [''],
      direccion: [''],
      estado: ['Activo']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Servicio de listar pacientes.
   */
  listarPacientes() {
    console.log('Entro a cargar pacientes');
    
    // Primero intentar cargar desde localStorage
    const pacientesGuardados = this.cargarPacientesDesdeLocalStorage();
    if (pacientesGuardados.length > 0) {
      this.pacientes = pacientesGuardados;
      console.log('Pacientes cargados desde localStorage:', this.pacientes);
    }

    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
        this.pacientes = data;
          this.guardarPacientesEnLocalStorage(data);
        }
        console.log('Pacientes cargados desde backend:', this.pacientes);
      },
      error: (err) => {
        console.error('Error al listar pacientes:', err);
        
        // Si no hay datos en localStorage, cargar datos de ejemplo
        if (this.pacientes.length === 0) {
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
          },
          {
            id: 3,
            tipoDocumento: 'CE',
            numeroDocumento: 'CE123456',
            nombres: 'Ana',
            apellidos: 'García',
            telefono: '3201234567',
            email: 'ana.garcia@email.com',
            fechaNacimiento: '1992-03-10',
            genero: 'Femenino',
            direccion: 'Avenida 5 #23-45',
            estado: 'Inactivo'
            }
          ];
          this.guardarPacientesEnLocalStorage(this.pacientes);
        }
      }
    });
  }

  /**
   * Guarda los pacientes en localStorage
   */
  private guardarPacientesEnLocalStorage(pacientes: Paciente[]) {
    try {
      localStorage.setItem('pacientes', JSON.stringify(pacientes));
      console.log('Pacientes guardados en localStorage');
    } catch (error) {
      console.error('Error al guardar pacientes en localStorage:', error);
    }
  }

  /**
   * Carga los pacientes desde localStorage
   */
  private cargarPacientesDesdeLocalStorage(): Paciente[] {
    try {
      const pacientesGuardados = localStorage.getItem('pacientes');
      if (pacientesGuardados) {
        return JSON.parse(pacientesGuardados);
      }
    } catch (error) {
      console.error('Error al cargar pacientes desde localStorage:', error);
    }
    return [];
  }

  guardarPaciente() {
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Modo Creación
        const pacienteData = this.form.getRawValue();
        // Asignar ID único
        pacienteData.id = this.obtenerSiguienteIdPaciente();
        
        this.pacienteService.crearPaciente(pacienteData).subscribe({
          next: (data) => {
            console.log('Paciente guardado en backend:', data);
            // Agregar a la lista local
            this.pacientes.push(pacienteData);
            this.guardarPacientesEnLocalStorage(this.pacientes);
            Swal.fire('Creación exitosa', 'Paciente creado correctamente', 'success');
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al guardar paciente en backend:', err);
            // Fallback: guardar localmente
            this.pacientes.push(pacienteData);
            this.guardarPacientesEnLocalStorage(this.pacientes);
            Swal.fire('Creación exitosa', 'Paciente creado correctamente (guardado localmente)', 'success');
            this.closeModal();
          }
        });
    } else {
        // Modo Edición
        const pacienteData = { ...this.form.getRawValue(), id: this.pacienteSelected.id };
        
        this.pacienteService.actualizarPaciente(pacienteData).subscribe({
          next: (data) => {
            console.log('Paciente actualizado en backend:', data);
            // Actualizar en la lista local
            const index = this.pacientes.findIndex(p => p.id === pacienteData.id);
            if (index !== -1) {
              this.pacientes[index] = pacienteData;
            }
            this.guardarPacientesEnLocalStorage(this.pacientes);
            Swal.fire('Actualización exitosa', 'Paciente actualizado correctamente', 'success');
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al actualizar paciente en backend:', err);
            // Fallback: actualizar localmente
            const index = this.pacientes.findIndex(p => p.id === pacienteData.id);
      if (index !== -1) {
              this.pacientes[index] = pacienteData;
            }
            this.guardarPacientesEnLocalStorage(this.pacientes);
            Swal.fire('Actualización exitosa', 'Paciente actualizado correctamente (guardado localmente)', 'success');
            this.closeModal();
          }
        });
      }
    }
  }

  /**
   * Obtiene el siguiente ID disponible para pacientes
   */
  private obtenerSiguienteIdPaciente(): number {
    if (this.pacientes.length === 0) return 1;
    const maxId = Math.max(...this.pacientes.map(p => p.id));
    return maxId + 1;
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.limpiarFormulario();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearPaciente');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoPaciente() {
    this.pacienteSelected = {} as Paciente;
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    this.openModal('E');
    this.limpiarFormulario();
    // Cargar datos del paciente en el formulario
    this.form.patchValue({
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
      telefono: paciente.telefono,
      email: paciente.email,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      direccion: paciente.direccion,
      estado: paciente.estado
    });
  }

  eliminarPaciente(paciente: Paciente) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al paciente ${paciente.nombres} ${paciente.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pacienteService.eliminarPaciente(paciente.id).subscribe({
          next: () => {
            console.log('Paciente eliminado del backend');
            // Eliminar de la lista local
            this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
            this.guardarPacientesEnLocalStorage(this.pacientes);
            Swal.fire('Eliminado!', 'El paciente ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar paciente del backend:', err);
            // Fallback: eliminar localmente
            this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
            this.guardarPacientesEnLocalStorage(this.pacientes);
            Swal.fire('Eliminado!', 'El paciente ha sido eliminado (eliminado localmente).', 'success');
          }
        });
      }
    });
  }

  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombres: '',
      apellidos: '',
      tipoDocumento: '',
      numeroDocumento: '',
      telefono: '',
      email: '',
      fechaNacimiento: '',
      genero: '',
      direccion: '',
      estado: 'Activo'
    });
  }
}