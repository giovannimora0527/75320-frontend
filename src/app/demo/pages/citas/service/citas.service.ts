import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cita } from '../models/cita';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private readonly citas$ = new BehaviorSubject<Cita[]>([
    { id: 1, fecha: '2025-10-05T09:00:00', paciente: 'Juan Pérez', medico: 'Dra. Gómez', estado: 'Programada' },
    { id: 2, fecha: '2025-10-06T11:30:00', paciente: 'Ana Ruiz', medico: 'Dr. López', estado: 'Completada' }
  ]);

  list(): Observable<Cita[]> { return this.citas$.asObservable(); }
}




