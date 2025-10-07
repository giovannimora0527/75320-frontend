import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HistoriaClinica } from '../models/historia';

@Injectable({ providedIn: 'root' })
export class HistoriasService {
  private readonly historias$ = new BehaviorSubject<HistoriaClinica[]>([
    { id: 1, paciente: 'Juan Pérez', medico: 'Dra. Gómez', fecha: '2025-09-20', motivo: 'Dolor de cabeza', diagnostico: 'Migraña' },
    { id: 2, paciente: 'María López', medico: 'Dr. Fernández', fecha: '2025-09-03', motivo: 'Dolor muscular', diagnostico: 'Tensión muscular' },
    { id: 3, paciente: 'Carlos Ramírez', medico: 'Dra. Morales', fecha: '2025-09-10', motivo: 'Tos y fiebre', diagnostico: 'Bronquitis aguda' },
    { id: 4, paciente: 'Lucía Martínez', medico: 'Dr. Herrera', fecha: '2025-09-15', motivo: 'Ardor epigástrico', diagnostico: 'Esofagitis por reflujo' },
    { id: 5, paciente: 'Andrés Gómez', medico: 'Dra. Ruiz', fecha: '2025-09-20', motivo: 'Estornudos y picor', diagnostico: 'Rinitis alérgica' },
    { id: 6, paciente: 'Sofía Díaz', medico: 'Dr. Navarro', fecha: '2025-09-25', motivo: 'Control glicemia', diagnostico: 'Diabetes tipo 2' },
    { id: 7, paciente: 'Miguel Torres', medico: 'Dra. Castillo', fecha: '2025-09-30', motivo: 'Mareos y cefalea', diagnostico: 'Hipertensión esencial' },
    { id: 8, paciente: 'Elena Vargas', medico: 'Dr. Rojas', fecha: '2025-10-01', motivo: 'Sibilancias', diagnostico: 'Asma bronquial intermitente' },
    { id: 9, paciente: 'Pablo Ortega', medico: 'Dra. Silva', fecha: '2025-10-03', motivo: 'Inflamación y malestar', diagnostico: 'Reacción alérgica' },
    { id: 10, paciente: 'Ana Castillo', medico: 'Dr. Méndez', fecha: '2025-10-04', motivo: 'Fatiga y aumento de peso', diagnostico: 'Hipotiroidismo primario' },
    { id: 11, paciente: 'Diego Molina', medico: 'Dra. Pérez', fecha: '2025-10-06', motivo: 'Tos y dolor de garganta', diagnostico: 'Infección respiratoria leve' }
  ]);

  list(): Observable<HistoriaClinica[]> { return this.historias$.asObservable(); }
}




