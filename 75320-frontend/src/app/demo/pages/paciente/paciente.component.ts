<<<<<<< HEAD
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
=======
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
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

// Angular Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-paciente',
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
    modoFormulario: string = '';
    pacientes: Paciente[] = [];
    dataSource = new MatTableDataSource<Paciente>([]);
    displayedColumns: string[] = ['id','usuarioId', 'tipoDocumento', 'numeroDocumento', 'nombres', 'apellidos', 'fechaNacimiento', 'genero', 'telefono', 'direccion', 'acciones'];
    titleModal: string = '';
    titleBoton: string = '';
    pacienteSelected: Paciente;
    titleSpinner: string = "";
  
    form: FormGroup = new FormGroup({
      usuarioId: new FormControl('', Validators.required),
      tipoDocumento: new FormControl('', Validators.required),
      numeroDocumento: new FormControl('', Validators.required),
      nombres: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
      telefono: new FormControl(''),
      direccion: new FormControl('', Validators.required)
    });
  
    constructor(
      private readonly pacienteService: PacienteService,
      private readonly formBuilder: FormBuilder,
      private readonly spinner: NgxSpinnerService
    ) {
      this.listarPacientes();
      this.cargarFormulario();
      this.titleSpinner = "Cargando Pacientes...";
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    }
    
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Configurar filtro personalizado
        this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
          const searchString = filter.toLowerCase();
          return data.id?.toString().includes(searchString) ||
                 data.usuarioId?.toString().includes(searchString) ||
                 data.tipoDocumento?.toLowerCase().includes(searchString) ||
                 data.numeroDocumento?.toLowerCase().includes(searchString) ||
                 data.nombres?.toLowerCase().includes(searchString) ||
                 data.apellidos?.toLowerCase().includes(searchString) ||
                 data.fechaNacimiento?.toString().includes(searchString) ||
                 data.genero?.toLowerCase().includes(searchString) ||
                 data.telefono?.toLowerCase().includes(searchString) ||
                 data.direccion?.toLowerCase().includes(searchString);
        };
      }

    cargarFormulario() {
      this.form = this.formBuilder.group({
        usuarioId: ['', [Validators.required]],
        tipoDocumento: ['', [Validators.required]],
        numeroDocumento: ['', [Validators.required]],
        nombres: ['', [Validators.required]],
        apellidos: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        telefono: [''],
        direccion: ['', [Validators.required]]
      });
    }
  
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
  
    listarPacientes() {
      this.pacienteService.listarPacientes().subscribe({
        next: (data) => {
          console.log(data);
          this.pacientes = data;
          this.dataSource.data = data;
        },

        error: (err) => {
          this.spinner.hide();
          console.error('Error al listar pacientes:', err);
          Swal.fire('Error', 'Ocurrió un error al cargar los pacientes.', 'error');
        }
      });
    }
  
  
    guardarPaciente() {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
          return;
        }
    
        if (this.modoFormulario === 'C') {
          // Crear paciente
          this.pacienteService.guardarPaciente(this.form.getRawValue()).subscribe({
            next: (data) => {          
              Swal.fire('Éxito', data.message, 'success');
              this.listarPacientes();
              this.closeModal();
            },
            error: (error) => {
              console.error('Error creating paciente:', error);
              Swal.fire("Error", error.error.message, "error");
            }
          });
        } else {
          // Editar paciente
          const pacienteActualizado = { ...this.pacienteSelected, ...this.form.getRawValue() };      
          this.pacienteService.actualizarPaciente(pacienteActualizado).subscribe({
            next: (data) => { 
              Swal.fire('Éxito', data.message, 'success');
              this.listarPacientes();
              this.closeModal();
            },
            error: (error) => {
              console.error('Error updating paciente:', error);
              Swal.fire("Error", error.error.message, "error");
            }
          });
        }
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
      this.pacienteSelected = new Paciente();
      this.limpiarFormulario();
      // Dejamos el formulario en blanco
      this.openModal('C');
    }
  
    abrirEditarPaciente(paciente: Paciente) {
      this.limpiarFormulario();
      this.pacienteSelected = paciente;
      this.form.get("usuarioId").setValue(this.pacienteSelected.usuarioId);
      this.form.get("tipoDocumento").setValue(this.pacienteSelected.tipoDocumento);
      this.form.get("numeroDocumento").setValue(this.pacienteSelected.numeroDocumento);
      this.form.get("nombres").setValue(this.pacienteSelected.nombres);
      this.form.get("apellidos").setValue(this.pacienteSelected.apellidos);
      this.form.get("fechaNacimiento").setValue(this.pacienteSelected.fechaNacimiento);
      this.form.get("genero").setValue(this.pacienteSelected.genero);
      this.form.get("telefono").setValue(this.pacienteSelected.telefono);
      this.form.get("direccion").setValue(this.pacienteSelected.direccion);
      this.openModal('E');
    }

    limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      usuarioId: '',
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      direccion: '',
    });
  }

  /**
   * Aplicar filtro a la tabla de Material
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    }
  }
}


