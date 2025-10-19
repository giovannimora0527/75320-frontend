import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Especializacion } from './models/especializacion';
import { EspecializacionService } from './service/especializacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especializaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especializaciones.component.html',
  styleUrls: ['./especializaciones.component.scss']
})
export class EspecializacionesComponent implements OnInit {
  especializaciones: Especializacion[] = [];

  form: Especializacion = {
    id: 0,
    nombre: '',
    descripcion: '',
    codigoEspecializacion: ''
  };

  editingIndex: number | null = null;

  constructor(private especializacionService: EspecializacionService) {}

  ngOnInit() {
    this.listarEspecializaciones();
  }

  listarEspecializaciones() {
    const especializacionesGuardadas = this.cargarEspecializacionesDesdeLocalStorage();
    
    if (especializacionesGuardadas.length > 0) {
      this.especializaciones = especializacionesGuardadas;
    }

    this.especializacionService.getEspecializaciones().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.especializaciones = data;
          this.guardarEspecializacionesEnLocalStorage(data);
        } else if (this.especializaciones.length === 0) {
          this.cargarDatosEjemplo();
        }
      },
      error: (err) => {
        if (this.especializaciones.length === 0) {
          this.cargarDatosEjemplo();
        }
      }
    });
  }

  private cargarDatosEjemplo() {
    this.especializaciones = [
      {
        id: 1,
        nombre: 'Cardiología',
        descripcion: '',
        codigoEspecializacion: 'ESP-001'
      }
    ];
    this.guardarEspecializacionesEnLocalStorage(this.especializaciones);
  }

  private guardarEspecializacionesEnLocalStorage(especializaciones: Especializacion[]) {
    try {
      localStorage.setItem('especializaciones', JSON.stringify(especializaciones));
    } catch (error) {
      console.error('Error al guardar especializaciones en localStorage:', error);
    }
  }

  private cargarEspecializacionesDesdeLocalStorage(): Especializacion[] {
    try {
      const especializacionesGuardadas = localStorage.getItem('especializaciones');
      if (especializacionesGuardadas) {
        return JSON.parse(especializacionesGuardadas);
      }
    } catch (error) {
      console.error('Error al cargar especializaciones desde localStorage:', error);
    }
    return [];
  }

  save() {
    if (this.validarFormulario()) {
      const especializacionData: Especializacion = { ...this.form };

      if (this.editingIndex === null) {
        this.crearEspecializacion(especializacionData);
      } else {
        this.actualizarEspecializacion(especializacionData);
      }
    }
  }

  private validarFormulario(): boolean {
    if (!this.form.nombre || !this.form.codigoEspecializacion) {
      Swal.fire('Error', 'Por favor complete el nombre y código de la especialización', 'error');
      return false;
    }
    return true;
  }

  private crearEspecializacion(especializacionData: Especializacion) {
    especializacionData.id = this.obtenerSiguienteIdEspecializacion();
    
    this.especializacionService.crearEspecializacion(especializacionData).subscribe({
      next: (data) => {
        this.especializaciones = [...this.especializaciones, especializacionData];
        this.guardarEspecializacionesEnLocalStorage(this.especializaciones);
        this.mostrarMensajeExito('Especialización creada correctamente');
        this.reset();
      },
      error: (err) => {
        this.especializaciones = [...this.especializaciones, especializacionData];
        this.guardarEspecializacionesEnLocalStorage(this.especializaciones);
        this.mostrarMensajeExito('Especialización creada correctamente (guardada localmente)');
        this.reset();
      }
    });
  }

  private actualizarEspecializacion(especializacionData: Especializacion) {
    if (this.editingIndex !== null) {
      this.especializacionService.actualizarEspecializacion(especializacionData).subscribe({
        next: (data) => {
          const clone = [...this.especializaciones];
          clone[this.editingIndex!] = especializacionData;
          this.especializaciones = clone;
          this.guardarEspecializacionesEnLocalStorage(this.especializaciones);
          this.mostrarMensajeExito('Especialización actualizada correctamente');
          this.reset();
        },
        error: (err) => {
          const clone = [...this.especializaciones];
          clone[this.editingIndex!] = especializacionData;
          this.especializaciones = clone;
          this.guardarEspecializacionesEnLocalStorage(this.especializaciones);
          this.mostrarMensajeExito('Especialización actualizada correctamente (guardada localmente)');
          this.reset();
        }
      });
    }
  }

  private mostrarMensajeExito(mensaje: string) {
    Swal.fire('Éxito', mensaje, 'success');
  }

  private obtenerSiguienteIdEspecializacion(): number {
    if (this.especializaciones.length === 0) return 1;
    const maxId = Math.max(...this.especializaciones.map(e => e.id));
    return maxId + 1;
  }

  edit(index: number) {
    const item = this.especializaciones[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  remove(index: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar esta especialización?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const especializacion = this.especializaciones[index];
        
        this.especializacionService.eliminarEspecializacion(especializacion.id).subscribe({
          next: () => {
            this.eliminarEspecializacionDeLista(index);
            Swal.fire('Eliminada!', 'La especialización ha sido eliminada.', 'success');
          },
          error: (err) => {
            this.eliminarEspecializacionDeLista(index);
            Swal.fire('Eliminada!', 'La especialización ha sido eliminada (eliminada localmente).', 'success');
          }
        });
      }
    });
  }

  private eliminarEspecializacionDeLista(index: number) {
    this.especializaciones = this.especializaciones.filter((_, i) => i !== index);
    this.guardarEspecializacionesEnLocalStorage(this.especializaciones);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { 
      id: 0,
      nombre: '', 
      descripcion: '',
      codigoEspecializacion: ''
    };
    this.editingIndex = null;
  }
}