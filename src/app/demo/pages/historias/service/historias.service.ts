import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HistoriaClinica } from '../models/historia';

@Injectable({ providedIn: 'root' })
export class HistoriasService {
  private readonly historias$ = new BehaviorSubject<HistoriaClinica[]>([
    { id: 1, paciente: 'Juan Pérez', medico: 'Dra. Gómez', fecha: '2025-09-20', motivo: 'Dolor de cabeza', diagnostico: 'Migraña' }
  ]);

  list(): Observable<HistoriaClinica[]> { return this.historias$.asObservable(); }
}




