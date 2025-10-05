import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Especializacion } from '../models/especializacion';

@Injectable({ providedIn: 'root' })
export class EspecializacionesService {
  private readonly items$ = new BehaviorSubject<Especializacion[]>([
    { id: 1, nombre: 'Cardiología', descripcion: 'Trastornos del corazón y vasos' },
    { id: 2, nombre: 'Dermatología', descripcion: 'Piel, cabello y uñas' }
  ]);

  list(): Observable<Especializacion[]> { return this.items$.asObservable(); }
}




