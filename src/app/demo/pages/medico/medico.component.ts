import { Component } from '@angular/core';
import { Medico } from './models/medico';
import { MedicoService } from './service/medico.service';
import { Especializacion } from './models/especializacion';
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
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicos: Medico[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: Medico;

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
    },
    { 
      id: 4, 
      nombre: 'Neurología', 
      descripcion: 'Especialidad en enfermedades del sistema nervioso', 
      codigoEspecializacion: 'NEU-001' 
    },
    { 
      id: 5, 
      nombre: 'Ortopedia', 
      descripcion: 'Especialidad en enfermedades del sistema musculoesquelético', 
      codigoEspecializacion: 'ORT-001' 
    }
  ];

  form: FormGroup = new FormGroup({
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    telefono: new FormControl(''),
    registroProfesional: new FormControl(''),
    especializacion: new FormControl('')
  });

  constructor(
    private medicoService: MedicoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicos();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.minLength(7)]],
      registroProfesional: ['', [Validators.required]],
      especializacion: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Servicio de listar médicos.
   */
  listarMedicos() {
    console.log('Entro a cargar médicos');
    
    // Primero intentar cargar desde localStorage
    const medicosGuardados = this.cargarMedicosDesdeLocalStorage();
    if (medicosGuardados.length > 0) {
      this.medicos = medicosGuardados;
      console.log('Médicos cargados desde localStorage:', this.medicos);
    }

    this.medicoService.getMedicos().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.medicos = data;
          this.guardarMedicosEnLocalStorage(data);
        }
        console.log('Médicos cargados desde backend:', this.medicos);
      },
      error: (err) => {
        console.error('Error al listar médicos:', err);
        
        
        if (this.medicos.length === 0) {
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
            },
            {
              id: 3,
              tipoDocumento: 'CE',
              numeroDocumento: 'CE123456',
              nombres: 'Roberto',
              apellidos: 'Silva',
              telefono: '3201234567',
              registroProfesional: 'MED54321',
              especializacion: this.especializaciones[2]
            }
          ];
          this.guardarMedicosEnLocalStorage(this.medicos);
        }
      }
    });
  }

  
  private guardarMedicosEnLocalStorage(medicos: Medico[]) {
    try {
      localStorage.setItem('medicos', JSON.stringify(medicos));
      console.log('Médicos guardados en localStorage');
    } catch (error) {
      console.error('Error al guardar médicos en localStorage:', error);
    }
  }

  
  private cargarMedicosDesdeLocalStorage(): Medico[] {
    try {
      const medicosGuardados = localStorage.getItem('medicos');
      if (medicosGuardados) {
        return JSON.parse(medicosGuardados);
      }
    } catch (error) {
      console.error('Error al cargar médicos desde localStorage:', error);
    }
    return [];
  }

  guardarMedico() {
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        
        const medicoData = this.form.getRawValue();
      
        medicoData.id = this.obtenerSiguienteId();
        
      
        if (medicoData.especializacion) {
          medicoData.especializacion = this.especializaciones.find(esp => esp.id == medicoData.especializacion);
        }
        
        this.medicoService.crearMedico(medicoData).subscribe({
          next: (data) => {
            console.log('Médico guardado en backend:', data);
            
            this.medicos.push(medicoData);
            this.guardarMedicosEnLocalStorage(this.medicos);
            Swal.fire('Creación exitosa', 'Médico creado correctamente', 'success');
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al guardar médico en backend:', err);
            
            this.medicos.push(medicoData);
            this.guardarMedicosEnLocalStorage(this.medicos);
            Swal.fire('Creación exitosa', 'Médico creado correctamente (guardado localmente)', 'success');
            this.closeModal();
          }
        });
      } else {
      
        const medicoData = { ...this.form.getRawValue(), id: this.medicoSelected.id };
        
      
        if (medicoData.especializacion) {
          medicoData.especializacion = this.especializaciones.find(esp => esp.id == medicoData.especializacion);
        }
        
        this.medicoService.actualizarMedico(medicoData).subscribe({
          next: (data) => {
            console.log('Médico actualizado en backend:', data);
            // Actualizar en la lista local
            const index = this.medicos.findIndex(m => m.id === medicoData.id);
            if (index !== -1) {
              this.medicos[index] = medicoData;
            }
            this.guardarMedicosEnLocalStorage(this.medicos);
            Swal.fire('Actualización exitosa', 'Médico actualizado correctamente', 'success');
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al actualizar médico en backend:', err);
            // Fallback: actualizar localmente
            const index = this.medicos.findIndex(m => m.id === medicoData.id);
            if (index !== -1) {
              this.medicos[index] = medicoData;
            }
            this.guardarMedicosEnLocalStorage(this.medicos);
            Swal.fire('Actualización exitosa', 'Médico actualizado correctamente (guardado localmente)', 'success');
            this.closeModal();
          }
        });
      }
    }
  }

  /**
   * Obtiene el siguiente ID disponible
   */
  private obtenerSiguienteId(): number {
    if (this.medicos.length === 0) return 1;
    const maxId = Math.max(...this.medicos.map(m => m.id));
    return maxId + 1;
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.limpiarFormulario();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Médico' : 'Editar Médico';
    this.titleBoton = modo === 'C' ? 'Guardar Médico' : 'Actualizar Médico';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedico() {
    this.medicoSelected = new Medico();
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarMedico(medico: Medico) {
    this.medicoSelected = medico;
    this.openModal('E');
    this.limpiarFormulario();
    // Cargar datos del médico en el formulario
    this.form.patchValue({
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      tipoDocumento: medico.tipoDocumento,
      numeroDocumento: medico.numeroDocumento,
      telefono: medico.telefono,
      registroProfesional: medico.registroProfesional,
      especializacion: medico.especializacion?.id || ''
    });
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al médico ${medico.nombres} ${medico.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico.id).subscribe({
          next: () => {
            console.log('Médico eliminado del backend');
            // Eliminar de la lista local
            this.medicos = this.medicos.filter(m => m.id !== medico.id);
            this.guardarMedicosEnLocalStorage(this.medicos);
            Swal.fire('Eliminado!', 'El médico ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar médico del backend:', err);
            // Fallback: eliminar localmente
            this.medicos = this.medicos.filter(m => m.id !== medico.id);
            this.guardarMedicosEnLocalStorage(this.medicos);
            Swal.fire('Eliminado!', 'El médico ha sido eliminado (eliminado localmente).', 'success');
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
      registroProfesional: '',
      especializacion: ''
    });
  }
}