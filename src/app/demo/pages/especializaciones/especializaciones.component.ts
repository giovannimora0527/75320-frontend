import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { EspecializacionService } from './service/especializacion.service';

@Component({
  selector: 'app-especializacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './especializaciones.component.html',
  styleUrls: ['./especializaciones.component.scss']
})
export class EspecializacionComponent implements OnInit {
  modalInstance: Modal | null = null;
  especializaciones: any[] = [];
  form!: FormGroup;

  constructor(
    private especializacionService: EspecializacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.listarEspecializaciones();
  }

  listarEspecializaciones(): void {
    this.especializacionService.getEspecializaciones().subscribe({
      next: (data: any) => {
        console.log('📦 Especializaciones desde backend:', data);

        if (Array.isArray(data)) {
          this.especializaciones = data;
        } else if (data && typeof data === 'object') {
          this.especializaciones = data.content || data.data || [];
        } else {
          this.especializaciones = [];
        }
      },
      error: (err) => {
        console.error('❌ Error al listar especializaciones', err);
        this.especializaciones = [];
      }
    });
  }

  abrirNuevaEspecializacion(): void {
    this.form.reset();
    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

  guardarEspecializacion(): void {
    if (this.form.invalid) {
      Swal.fire('⚠️ Error', 'Complete todos los campos requeridos', 'warning');
      return;
    }

    const especializacionData = this.form.value;

    this.especializacionService.guardarEspecializacion(especializacionData).subscribe({
      next: () => {
        Swal.fire('✅ Éxito', 'Especialización guardada correctamente', 'success');
        this.listarEspecializaciones();
        this.closeModal();
      },
      error: (err) => {
        console.error('❌ Error al guardar especialización', err);
        Swal.fire('❌ Error', 'No se pudo guardar la especialización', 'error');
      }
    });
  }
}

