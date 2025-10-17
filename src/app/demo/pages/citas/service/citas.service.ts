import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cita } from '../models/cita';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private readonly citas$ = new BehaviorSubject<Cita[]>([
    { id: 3, fecha: '2025-09-03T10:00:00', paciente: 'María López', medico: 'Dr. Fernández', estado: 'Programada' },
    { id: 4, fecha: '2025-09-10T14:30:00', paciente: 'Carlos Ramírez', medico: 'Dra. Morales', estado: 'Completada' },
    { id: 5, fecha: '2025-09-15T09:15:00', paciente: 'Lucía Martínez', medico: 'Dr. Herrera', estado: 'Programada' },
    { id: 6, fecha: '2025-09-20T16:00:00', paciente: 'Andrés Gómez', medico: 'Dra. Ruiz', estado: 'Completada' },
    { id: 7, fecha: '2025-09-25T08:30:00', paciente: 'Sofía Díaz', medico: 'Dr. Navarro', estado: 'Programada' },
    { id: 8, fecha: '2025-09-30T11:00:00', paciente: 'Miguel Torres', medico: 'Dra. Castillo', estado: 'Programada' },
    { id: 9, fecha: '2025-10-01T13:45:00', paciente: 'Elena Vargas', medico: 'Dr. Rojas', estado: 'Completada' },
    { id: 10, fecha: '2025-10-03T10:30:00', paciente: 'Pablo Ortega', medico: 'Dra. Silva', estado: 'Programada' },
    { id: 11, fecha: '2025-10-04T15:00:00', paciente: 'Ana Castillo', medico: 'Dr. Méndez', estado: 'Programada' },
    { id: 12, fecha: '2025-10-06T09:30:00', paciente: 'Diego Molina', medico: 'Dra. Pérez', estado: 'Programada' },
    { id: 13, fecha: '2025-09-07T09:00:00', paciente: 'Mariana Santos', medico: 'Dr. Herrera', estado: 'Programada' },
    { id: 14, fecha: '2025-10-02T14:00:00', paciente: 'Roberto Chávez', medico: 'Dra. Castillo', estado: 'Programada' }
  ]);

  list(): Observable<Cita[]> { return this.citas$.asObservable(); }
}




