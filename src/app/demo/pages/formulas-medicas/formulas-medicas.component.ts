import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaMedica } from './models/formula-medica';
import { FormulaMedicaService } from './service/formula-medica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulas-medicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulas-medicas.component.html',
  styleUrls: ['./formulas-medicas.component.scss']
})
export class FormulasMedicasComponent implements OnInit {
  formulas: FormulaMedica[] = [];

  form: FormulaMedica = {
    id: 0,
    paciente: '',
    medico: '',
    fecha: '',
    indicaciones: '',
    medicamentos: [],
    estado: 'Activa'
  };

  medicamentoInput: string = '';
  editingIndex: number | null = null;

  constructor(private formulaMedicaService: FormulaMedicaService) {}

  ngOnInit() {
    this.listarFormulasMedicas();
  }

  listarFormulasMedicas() {
    const formulasGuardadas = this.cargarFormulasDesdeLocalStorage();
    
    if (formulasGuardadas.length > 0) {
      this.formulas = formulasGuardadas;
    }

    this.formulaMedicaService.getFormulasMedicas().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.formulas = data;
          this.guardarFormulasEnLocalStorage(data);
        } else if (this.formulas.length === 0) {
          this.cargarDatosEjemplo();
        }
      },
      error: (err) => {
        if (this.formulas.length === 0) {
          this.cargarDatosEjemplo();
        }
      }
    });
  }

  private cargarDatosEjemplo() {
    this.formulas = [
      {
        id: 1,
        paciente: 'Juan Pérez',
        medico: 'Dra. López',
        fecha: '2025-10-05',
        indicaciones: 'Tomar 1 tableta cada 8 horas por 7 días',
        medicamentos: ['Paracetamol 500mg', 'Ibuprofeno 400mg'],
        estado: 'Activa'
      }
    ];
    this.guardarFormulasEnLocalStorage(this.formulas);
  }

  private guardarFormulasEnLocalStorage(formulas: FormulaMedica[]) {
    try {
      localStorage.setItem('formulasMedicas', JSON.stringify(formulas));
    } catch (error) {
      console.error('Error al guardar fórmulas en localStorage:', error);
    }
  }

  private cargarFormulasDesdeLocalStorage(): FormulaMedica[] {
    try {
      const formulasGuardadas = localStorage.getItem('formulasMedicas');
      if (formulasGuardadas) {
        return JSON.parse(formulasGuardadas);
      }
    } catch (error) {
      console.error('Error al cargar fórmulas desde localStorage:', error);
    }
    return [];
  }

  save() {
    if (this.validarFormulario()) {
      const formulaData: FormulaMedica = { ...this.form };

      if (this.editingIndex === null) {
        this.crearFormulaMedica(formulaData);
      } else {
        this.actualizarFormulaMedica(formulaData);
      }
    }
  }

  private validarFormulario(): boolean {
    if (!this.form.paciente || !this.form.medico || !this.form.fecha || !this.form.indicaciones) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return false;
    }
    return true;
  }

  private crearFormulaMedica(formulaData: FormulaMedica) {
    formulaData.id = this.obtenerSiguienteIdFormula();
    
    this.formulaMedicaService.crearFormulaMedica(formulaData).subscribe({
      next: (data) => {
        this.formulas = [...this.formulas, formulaData];
        this.guardarFormulasEnLocalStorage(this.formulas);
        this.mostrarMensajeExito('Fórmula médica creada correctamente');
        this.reset();
      },
      error: (err) => {
        this.formulas = [...this.formulas, formulaData];
        this.guardarFormulasEnLocalStorage(this.formulas);
        this.mostrarMensajeExito('Fórmula médica creada correctamente (guardada localmente)');
        this.reset();
      }
    });
  }

  private actualizarFormulaMedica(formulaData: FormulaMedica) {
    if (this.editingIndex !== null) {
      this.formulaMedicaService.actualizarFormulaMedica(formulaData).subscribe({
        next: (data) => {
          const clone = [...this.formulas];
          clone[this.editingIndex!] = formulaData;
          this.formulas = clone;
          this.guardarFormulasEnLocalStorage(this.formulas);
          this.mostrarMensajeExito('Fórmula médica actualizada correctamente');
          this.reset();
        },
        error: (err) => {
          const clone = [...this.formulas];
          clone[this.editingIndex!] = formulaData;
          this.formulas = clone;
          this.guardarFormulasEnLocalStorage(this.formulas);
          this.mostrarMensajeExito('Fórmula médica actualizada correctamente (guardada localmente)');
          this.reset();
        }
      });
    }
  }

  private mostrarMensajeExito(mensaje: string) {
    Swal.fire('Éxito', mensaje, 'success');
  }

  private obtenerSiguienteIdFormula(): number {
    if (this.formulas.length === 0) return 1;
    const maxId = Math.max(...this.formulas.map(f => f.id));
    return maxId + 1;
  }

  agregarMedicamento() {
    if (this.medicamentoInput.trim()) {
      if (!this.form.medicamentos) {
        this.form.medicamentos = [];
      }
      this.form.medicamentos.push(this.medicamentoInput.trim());
      this.medicamentoInput = '';
    }
  }

  eliminarMedicamento(index: number) {
    if (this.form.medicamentos) {
      this.form.medicamentos.splice(index, 1);
    }
  }

  edit(index: number) {
    const item = this.formulas[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  remove(index: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar esta fórmula médica?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const formula = this.formulas[index];
        
        this.formulaMedicaService.eliminarFormulaMedica(formula.id).subscribe({
          next: () => {
            this.eliminarFormulaDeLista(index);
            Swal.fire('Eliminada!', 'La fórmula médica ha sido eliminada.', 'success');
          },
          error: (err) => {
            this.eliminarFormulaDeLista(index);
            Swal.fire('Eliminada!', 'La fórmula médica ha sido eliminada (eliminada localmente).', 'success');
          }
        });
      }
    });
  }

  private eliminarFormulaDeLista(index: number) {
    this.formulas = this.formulas.filter((_, i) => i !== index);
    this.guardarFormulasEnLocalStorage(this.formulas);
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
      indicaciones: '',
      medicamentos: [],
      estado: 'Activa'
    };
    this.medicamentoInput = '';
    this.editingIndex = null;
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Activa': return 'badge bg-success';
      case 'Completada': return 'badge bg-secondary';
      case 'Cancelada': return 'badge bg-danger';
      default: return 'badge bg-light text-dark';
    }
  }
}