import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Importar para usar [(ngModel)]
import { HttpClientModule } from '@angular/common/http';
import { HistoriaMedicaService } from './service/historia medica.service';

@Component({
  standalone: true,
  selector: 'app-historias-medicas',
  templateUrl: './historias medicas.component.html',
  styleUrls: ['./historias medicas.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // ✅ Importar aquí también
    HttpClientModule
  ]
})
export class HistoriaMedicaComponent implements OnInit {
  historiasMedicas: any[] = [];
  form!: FormGroup;
  titleModal: string = '';
  titleBoton: string = '';

  constructor(
    private fb: FormBuilder,
    private historiaService: HistoriaMedicaService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerHistorias();
  }

  crearFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      paciente: ['', Validators.required],
      medico: ['', Validators.required],
      fecha: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required]
    });
  }

  obtenerHistorias(): void {
    this.historiaService.getHistorias().subscribe({
      next: (res: any) => {
        this.historiasMedicas = res || [];
      },
      error: (err) => {
        console.error('Error al obtener las historias médicas:', err);
      }
    });
  }

  abrirNuevaHistoria(): void {
    this.form.reset();
    this.titleModal = 'Nueva Historia Médica';
    this.titleBoton = 'Guardar';
    const modal = document.getElementById('modalCrearHistoria');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  abrirEditarHistoria(historia: any): void {
    this.form.patchValue(historia);
    this.titleModal = 'Editar Historia Médica';
    this.titleBoton = 'Actualizar';
    const modal = document.getElementById('modalCrearHistoria');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('modalCrearHistoria');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  guardarHistoria(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const historia = this.form.value;

    if (historia.id) {
      // Actualizar historia existente
      this.historiaService.actualizarHistoria(historia).subscribe({
        next: () => {
          alert('Historia médica actualizada correctamente');
          this.closeModal();
          this.obtenerHistorias();
        },
        error: (err) => {
          console.error('Error al actualizar la historia médica:', err);
        }
      });
    } else {
      // Crear nueva historia
      this.historiaService.crearHistoria(historia).subscribe({
        next: () => {
          alert('Historia médica creada correctamente');
          this.closeModal();
          this.obtenerHistorias();
        },
        error: (err) => {
          console.error('Error al crear la historia médica:', err);
        }
      });
    }
  }

  eliminarHistoria(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta historia médica?')) {
      this.historiaService.eliminarHistoria(id).subscribe({
        next: () => {
          alert('Historia médica eliminada correctamente');
          this.obtenerHistorias();
        },
        error: (err) => {
          console.error('Error al eliminar la historia médica:', err);
        }
      });
    }
  }
}




