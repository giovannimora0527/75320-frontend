import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoriaMedica } from './models/historia-medica';
import { HistoriaMedicaService } from './service/historia-medica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historias-medicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historias-medicas.component.html',
  styleUrls: ['./historias-medicas.component.scss']
})
export class HistoriasMedicasComponent implements OnInit {
  historias: HistoriaMedica[] = [];

  form: HistoriaMedica = {
    id: 0,
    paciente: '',
    diagnostico: '',
    fecha: '',
    notas: '',
    medico: '',
    tratamiento: '',
    estado: 'Activa'
  };

  editingIndex: number | null = null;

  constructor(private historiaMedicaService: HistoriaMedicaService) {}

  ngOnInit() {
    this.listarHistoriasMedicas();
  }

  listarHistoriasMedicas() {
    const historiasGuardadas = this.cargarHistoriasDesdeLocalStorage();
    
    if (historiasGuardadas.length > 0) {
      this.historias = historiasGuardadas;
    }

    this.historiaMedicaService.getHistoriasMedicas().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.historias = data;
          this.guardarHistoriasEnLocalStorage(data);
        } else if (this.historias.length === 0) {
          this.cargarDatosEjemplo();
        }
      },
      error: (err) => {
        if (this.historias.length === 0) {
          this.cargarDatosEjemplo();
        }
      }
    });
  }

  private cargarDatosEjemplo() {
    this.historias = [
      {
        id: 1,
        paciente: 'Juan Pérez',
        diagnostico: 'Gripe común',
        fecha: '2025-10-05',
        notas: 'Paciente presenta fiebre, dolor de cabeza y malestar general. Recomendado reposo y líquidos.',
        medico: 'Dra. López',
        tratamiento: 'Paracetamol 500mg cada 8 horas, reposo absoluto',
        estado: 'Activa'
      }
    ];
    this.guardarHistoriasEnLocalStorage(this.historias);
  }

  private guardarHistoriasEnLocalStorage(historias: HistoriaMedica[]) {
    try {
      localStorage.setItem('historiasMedicas', JSON.stringify(historias));
    } catch (error) {
      console.error('Error al guardar historias en localStorage:', error);
    }
  }

  private cargarHistoriasDesdeLocalStorage(): HistoriaMedica[] {
    try {
      const historiasGuardadas = localStorage.getItem('historiasMedicas');
      if (historiasGuardadas) {
        return JSON.parse(historiasGuardadas);
      }
    } catch (error) {
      console.error('Error al cargar historias desde localStorage:', error);
    }
    return [];
  }

  save() {
    if (this.validarFormulario()) {
      const historiaData: HistoriaMedica = { ...this.form };

      if (this.editingIndex === null) {
        this.crearHistoriaMedica(historiaData);
      } else {
        this.actualizarHistoriaMedica(historiaData);
      }
    }
  }

  private validarFormulario(): boolean {
    if (!this.form.paciente || !this.form.diagnostico || !this.form.fecha || !this.form.notas || !this.form.medico) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return false;
    }
    return true;
  }

  private crearHistoriaMedica(historiaData: HistoriaMedica) {
    historiaData.id = this.obtenerSiguienteIdHistoria();
    
    this.historiaMedicaService.crearHistoriaMedica(historiaData).subscribe({
      next: (data) => {
        this.historias = [...this.historias, historiaData];
        this.guardarHistoriasEnLocalStorage(this.historias);
        this.mostrarMensajeExito('Historia médica creada correctamente');
        this.reset();
      },
      error: (err) => {
        this.historias = [...this.historias, historiaData];
        this.guardarHistoriasEnLocalStorage(this.historias);
        this.mostrarMensajeExito('Historia médica creada correctamente (guardada localmente)');
        this.reset();
      }
    });
  }

  private actualizarHistoriaMedica(historiaData: HistoriaMedica) {
    if (this.editingIndex !== null) {
      this.historiaMedicaService.actualizarHistoriaMedica(historiaData).subscribe({
        next: (data) => {
          const clone = [...this.historias];
          clone[this.editingIndex!] = historiaData;
          this.historias = clone;
          this.guardarHistoriasEnLocalStorage(this.historias);
          this.mostrarMensajeExito('Historia médica actualizada correctamente');
          this.reset();
        },
        error: (err) => {
          const clone = [...this.historias];
          clone[this.editingIndex!] = historiaData;
          this.historias = clone;
          this.guardarHistoriasEnLocalStorage(this.historias);
          this.mostrarMensajeExito('Historia médica actualizada correctamente (guardada localmente)');
          this.reset();
        }
      });
    }
  }

  private mostrarMensajeExito(mensaje: string) {
    Swal.fire('Éxito', mensaje, 'success');
  }

  private obtenerSiguienteIdHistoria(): number {
    if (this.historias.length === 0) return 1;
    const maxId = Math.max(...this.historias.map(h => h.id));
    return maxId + 1;
  }

  edit(index: number) {
    const item = this.historias[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  remove(index: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar esta historia médica?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const historia = this.historias[index];
        
        this.historiaMedicaService.eliminarHistoriaMedica(historia.id).subscribe({
          next: () => {
            this.eliminarHistoriaDeLista(index);
            Swal.fire('Eliminada!', 'La historia médica ha sido eliminada.', 'success');
          },
          error: (err) => {
            this.eliminarHistoriaDeLista(index);
            Swal.fire('Eliminada!', 'La historia médica ha sido eliminada (eliminada localmente).', 'success');
          }
        });
      }
    });
  }

  private eliminarHistoriaDeLista(index: number) {
    this.historias = this.historias.filter((_, i) => i !== index);
    this.guardarHistoriasEnLocalStorage(this.historias);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { 
      id: 0,
      paciente: '', 
      diagnostico: '', 
      fecha: '', 
      notas: '',
      medico: '',
      tratamiento: '',
      estado: 'Activa'
    };
    this.editingIndex = null;
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Activa': return 'badge bg-primary';
      case 'Cerrada': return 'badge bg-success';
      case 'Archivada': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  }
}