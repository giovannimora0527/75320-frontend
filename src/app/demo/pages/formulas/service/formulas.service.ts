import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormulaMedica } from '../models/formula';

@Injectable({ providedIn: 'root' })
export class FormulasService {
  private readonly formulas$ = new BehaviorSubject<FormulaMedica[]>([
    { id: 2, paciente: 'María López', medico: 'Dr. Fernández', fecha: '2025-09-03', descripcion: 'Ibuprofeno 400 mg c/8h por 5 días' },
    { id: 3, paciente: 'Carlos Ramírez', medico: 'Dra. Morales', fecha: '2025-09-10', descripcion: 'Amoxicilina 500 mg c/12h por 7 días' },
    { id: 4, paciente: 'Lucía Martínez', medico: 'Dr. Herrera', fecha: '2025-09-15', descripcion: 'Omeprazol 20 mg c/24h por 14 días' },
    { id: 5, paciente: 'Andrés Gómez', medico: 'Dra. Ruiz', fecha: '2025-09-20', descripcion: 'Cetirizina 10 mg c/24h por 7 días' },
    { id: 6, paciente: 'Sofía Díaz', medico: 'Dr. Navarro', fecha: '2025-09-25', descripcion: 'Metformina 500 mg c/12h por 30 días' },
    { id: 7, paciente: 'Miguel Torres', medico: 'Dra. Castillo', fecha: '2025-09-30', descripcion: 'Enalapril 10 mg c/24h por 30 días' },
    { id: 8, paciente: 'Elena Vargas', medico: 'Dr. Rojas', fecha: '2025-10-01', descripcion: 'Salbutamol inhalador según necesidad' },
    { id: 9, paciente: 'Pablo Ortega', medico: 'Dra. Silva', fecha: '2025-10-03', descripcion: 'Prednisona 20 mg c/24h decreciente por 5 días' },
    { id: 10, paciente: 'Ana Castillo', medico: 'Dr. Méndez', fecha: '2025-10-04', descripcion: 'Levotiroxina 50 mcg c/24h por 90 días' },
    { id: 11, paciente: 'Diego Molina', medico: 'Dra. Pérez', fecha: '2025-10-06', descripcion: 'Claritromicina 500 mg c/12h por 7 días' }
  ]);

  list(): Observable<FormulaMedica[]> { return this.formulas$.asObservable(); }
}




