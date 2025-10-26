import { Component, OnInit } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.scss']
})
export class EspecializacionComponent implements OnInit {

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  especializaciones: Especializacion[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  especializacionSelected: Especializacion | null = null;
  form!: FormGroup;
  mensaje: string = '';
  tipoMensaje: 'success' | 'danger' | '' = '';

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarFormulario();
    this.ListarEspecializacion();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required]],
      // Validación por defecto: requerido. El patrón se aplica solo en creación.
      codigoEspecialidad: ['', [Validators.required]]
    });
  }

  ListarEspecializacion() {
    this.especializacionService.getEspecializaciones().subscribe({
      next: (data: any) => {
        // Normalizar la respuesta para asegurar que el campo codigoEspecialidad exista
        const rawList: any[] = Array.isArray(data)
          ? data
          : (data && Array.isArray(data.data))
            ? data.data
            : (data && Array.isArray(data.content))
              ? data.content
              : [];

        this.especializaciones = rawList.map((item: any) => {
          return {
            id: item.id,
            nombre: item.nombre,
            descripcion: item.descripcion,
            // soporta varias variantes que pueda devolver el backend
            codigoEspecialidad: item.codigoEspecialidad || item.codigo_especializacion || item.codigoEspecializacion || ''
          } as Especializacion;
        });
      },
      error: (error) => {
        console.error('Error al listar especializaciones:', error);
        this.especializaciones = [];
      }
    });
  }

  openModal(modo: 'C' | 'E') {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Registrar Especialización' : 'Editar Especialización';
    this.titleBoton = modo === 'C' ? 'Guardar' : 'Actualizar';
    const modalElement = document.getElementById('modalEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.form.reset();
    }
  }

  abrirNuevoEspecializacion() {
    this.especializacionSelected = null;
    this.form.reset();
    // Aplicar patrón obligatorio para la creación: debe iniciar con COD_
    const codigoCtrl = this.form.get('codigoEspecialidad');
    if (codigoCtrl) {
      codigoCtrl.setValidators([Validators.required, Validators.pattern(/^COD_[A-Za-z0-9_-]+$/)]);
      codigoCtrl.updateValueAndValidity();
    }
    this.openModal('C');
  }

  abrirEditarEspecializacion(esp: Especializacion) {
    this.especializacionSelected = esp;
    this.form.patchValue({
      nombre: esp.nombre,
      descripcion: esp.descripcion,
      codigoEspecialidad: esp.codigoEspecialidad
    });
    // En edición NO forzamos el pattern (solo lectura del código)
    const codigoCtrl = this.form.get('codigoEspecialidad');
    if (codigoCtrl) {
      codigoCtrl.setValidators([Validators.required]);
      codigoCtrl.updateValueAndValidity();
    }
    this.openModal('E');
  }

  guardarEspecializacion() {
    // Si el formulario es inválido, marcar los controles y mostrar error (no enviar)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Corrige los errores del formulario antes de continuar.', 'error');
      return;
    }

    const data = this.form.getRawValue();

    // Validaciones adicionales y limpieza
    const nombre = (data.nombre || '').toString().trim();
    const descripcion = (data.descripcion || '').toString().trim();
  const codigo = (data.codigoEspecialidad || '').toString().trim();

    if (!nombre || !descripcion || !codigo) {
      Swal.fire('Error', 'Nombre, descripción y código son requeridos y no pueden estar vacíos.', 'error');
      return;
    }

    // Mapear al formato que espera el backend (DTO fields - camelCase)
    const backendPayload: any = {
      nombre: nombre,
      descripcion: descripcion,
      codigoEspecialidad: codigo
    };

    const getFriendlyMessageFrom = (input: any) => {
      // input puede ser un objeto de error Http, o la propia respuesta del backend
      const raw = input?.error?.message || input?.message || input?.error || input?.errorMessage || input?.statusText || input?.toString() || '';
      const text = (raw || '').toString();
      const lower = text.toLowerCase();
      if (!text) return 'Ocurrió un error al procesar la solicitud.';
      // Detectar errores SQL/DB y devolver mensaje amigable
      if (lower.includes('data truncation') || lower.includes('data too long') || lower.includes('data too long for column')) {
        return 'El código es demasiado largo para la base de datos. Use un código más corto con formato "COD_<secuencia>" (ej. COD_001).';
      }
      if (lower.includes('constraint') || lower.includes('duplicate') || lower.includes('unique')) {
        return 'El código ya existe o viola una restricción. Usa un código diferente.';
      }
      // Si la respuesta incluye HTML/stack trace u otros textos largos, acortar
      if (text.length > 250) return text.slice(0, 240) + '...';
      return text;
    };

    const handleResponse = (res: any, successTitle: string, successDefault: string) => {
      const indicatesError = !!(
        !res ||
        res.error ||
        res.errors ||
        res.success === false ||
        res.ok === false ||
        (typeof res.status === 'string' && /error|fail|failed/i.test(res.status))
      );
      if (indicatesError) {
        Swal.fire('Error', getFriendlyMessageFrom(res), 'error');
        return;
      }
      Swal.fire(successTitle, res?.message || successDefault, 'success');
      this.ListarEspecializacion();
      this.closeModal();
    };

    if (this.modoFormulario === 'C') {
      this.especializacionService.guardarEspecializacion(backendPayload).subscribe({
        next: (res: any) => handleResponse(res, 'Creación exitosa', 'Especialización creada'),
        error: (err) => {
          Swal.fire('Error al guardar la Especialidad', getFriendlyMessageFrom(err), 'error');
        }
      });
    } else if (this.modoFormulario === 'E' && this.especializacionSelected?.id) {
      const payload = {
        id: this.especializacionSelected.id,
        nombre: nombre,
        descripcion: descripcion,
        codigoEspecialidad: codigo
      };
      this.especializacionService.actualizarEspecializacion(this.especializacionSelected.id, payload).subscribe({
        next: (res: any) => handleResponse(res, 'Actualización exitosa', 'Especialización actualizada'),
        error: (err) => {
          Swal.fire('Error', getFriendlyMessageFrom(err), 'error');
        }
      });
    }
  }

  eliminarEspecializacion(esp: Especializacion) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la especialización "${esp.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.especializacionService.eliminarEspecializacion(esp.id).subscribe({
          next: (res: any) => {
            Swal.fire('Eliminado', res.message || 'Especialización eliminada', 'success');
            this.ListarEspecializacion();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Ocurrió un error', 'error');
          }
        });
      }
    });
  }

}
