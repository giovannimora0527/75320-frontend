import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormulaMedica } from '../models/formula';

@Injectable({ providedIn: 'root' })
export class FormulasService {
  private readonly formulas$ = new BehaviorSubject<FormulaMedica[]>([
    { id: 1, paciente: 'Juan Pérez', medico: 'Dra. Gómez', fecha: '2025-10-01', descripcion: 'Paracetamol 500 mg c/8h por 3 días' }
  ]);

  list(): Observable<FormulaMedica[]> { return this.formulas$.asObservable(); }
}




