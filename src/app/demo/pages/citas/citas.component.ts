import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita } from './models/cita';
import { CitaService } from './service/cita.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent implements OnInit {
  citas: Cita[] = [];

  form: Cita = {
    id: 0,
    paciente: '',
    medico: '',
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'Programada',
    notas: ''
  };

  editingIndex: number | null = null;

  constructor(private citaService: CitaService) {}

  ngOnInit() {
    this.listarCitas();
  }

  listarCitas() {
    const citasGuardadas = this.cargarCitasDesdeLocalStorage();
    
    if (citasGuardadas.length > 0) {
      this.citas = citasGuardadas;
    }

    this.citaService.getCitas().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.citas = data;
          this.guardarCitasEnLocalStorage(data);
        } else if (this.citas.length === 0) {
          this.cargarDatosEjemplo();
        }
      },
      error: (err) => {
        if (this.citas.length === 0) {
          this.cargarDatosEjemplo();
        }
      }
    });
  }

  private cargarDatosEjemplo() {
    this.citas = [
      {
        id: 1,
        paciente: 'Juan Pérez',
        medico: 'Dra. López',
        fecha: '2025-10-05',
        hora: '10:00',
        motivo: 'Consulta general',
        estado: 'Programada',
        notas: 'Paciente con dolor de cabeza'
      }
    ];
    this.guardarCitasEnLocalStorage(this.citas);
  }

  private guardarCitasEnLocalStorage(citas: Cita[]) {
    try {
      localStorage.setItem('citas', JSON.stringify(citas));
    } catch (error) {
      console.error('Error al guardar citas en localStorage:', error);
    }
  }

  private cargarCitasDesdeLocalStorage(): Cita[] {
    try {
      const citasGuardadas = localStorage.getItem('citas');
      if (citasGuardadas) {
        return JSON.parse(citasGuardadas);
      }
    } catch (error) {
      console.error('Error al cargar citas desde localStorage:', error);
    }
    return [];
  }

  save() {
    if (this.validarFormulario()) {
      const citaData: Cita = { ...this.form };

      if (this.editingIndex === null) {
        this.crearCita(citaData);
      } else {
        this.actualizarCita(citaData);
      }
    }
  }

  private validarFormulario(): boolean {
    if (!this.form.paciente || !this.form.medico || !this.form.fecha || !this.form.hora || !this.form.motivo) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return false;
    }
    return true;
  }

  private crearCita(citaData: Cita) {
    citaData.id = this.obtenerSiguienteIdCita();
    
    this.citaService.crearCita(citaData).subscribe({
      next: (data) => {
        this.citas = [...this.citas, citaData];
        this.guardarCitasEnLocalStorage(this.citas);
        this.mostrarMensajeExito('Cita creada correctamente');
        this.reset();
      },
      error: (err) => {
        this.citas = [...this.citas, citaData];
        this.guardarCitasEnLocalStorage(this.citas);
        this.mostrarMensajeExito('Cita creada correctamente (guardada localmente)');
        this.reset();
      }
    });
  }

  private actualizarCita(citaData: Cita) {
    if (this.editingIndex !== null) {
      this.citaService.actualizarCita(citaData).subscribe({
        next: (data) => {
          const clone = [...this.citas];
          clone[this.editingIndex!] = citaData;
          this.citas = clone;
          this.guardarCitasEnLocalStorage(this.citas);
          this.mostrarMensajeExito('Cita actualizada correctamente');
          this.reset();
        },
        error: (err) => {
          const clone = [...this.citas];
          clone[this.editingIndex!] = citaData;
          this.citas = clone;
          this.guardarCitasEnLocalStorage(this.citas);
          this.mostrarMensajeExito('Cita actualizada correctamente (guardada localmente)');
          this.reset();
        }
      });
    }
  }

  private mostrarMensajeExito(mensaje: string) {
    Swal.fire('Éxito', mensaje, 'success');
  }

  private obtenerSiguienteIdCita(): number {
    if (this.citas.length === 0) return 1;
    const maxId = Math.max(...this.citas.map(c => c.id));
    return maxId + 1;
  }

  edit(index: number) {
    const item = this.citas[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  reprogram(index: number) {
    this.edit(index);
  }

  remove(index: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea cancelar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar!',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        const cita = this.citas[index];
        
        this.citaService.eliminarCita(cita.id).subscribe({
          next: () => {
            this.eliminarCitaDeLista(index);
            Swal.fire('Cancelada!', 'La cita ha sido cancelada.', 'success');
          },
          error: (err) => {
            this.eliminarCitaDeLista(index);
            Swal.fire('Cancelada!', 'La cita ha sido cancelada (eliminada localmente).', 'success');
          }
        });
      }
    });
  }

  private eliminarCitaDeLista(index: number) {
    this.citas = this.citas.filter((_, i) => i !== index);
    this.guardarCitasEnLocalStorage(this.citas);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { 
      id: 0,
      paciente: '', 
      medico: '', 
      fecha: '', 
      hora: '',
      motivo: '',
      estado: 'Programada',
      notas: ''
    };
    this.editingIndex = null;
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Programada': return 'badge bg-primary';
      case 'Confirmada': return 'badge bg-success';
      case 'Completada': return 'badge bg-secondary';
      case 'Cancelada': return 'badge bg-danger';
      default: return 'badge bg-light text-dark';
    }
  }
}