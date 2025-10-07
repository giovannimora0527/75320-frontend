import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HistoriaClinica } from '../models/historia_clinica';

@Injectable({ providedIn: 'root' })
export class HistoriasService {
  private readonly historias$ = new BehaviorSubject<HistoriaClinica[]>([
  { "id": 2, "paciente": "María Torres", "medico": "Dr. Ramírez", "fecha": "2025-09-22", "motivo": "Tos persistente", "diagnostico": "Bronquitis" },  
  ]);

  list(): Observable<HistoriaClinica[]> { return this.historias$.asObservable(); }
}