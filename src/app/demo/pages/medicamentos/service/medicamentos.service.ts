import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Medicamento } from '../models/medicamento';

@Injectable({ providedIn: 'root' })
export class MedicamentosService {
  private readonly medicamentos$ = new BehaviorSubject<Medicamento[]>([
    { id: 1, nombre: 'Paracetamol', presentacion: 'Tabletas', concentracion: '500 mg', stock: 120, activo: true },
    { id: 2, nombre: 'Ibuprofeno', presentacion: 'Cápsulas', concentracion: '400 mg', stock: 60, activo: true },
    { id: 3, nombre: 'Amoxicilina', presentacion: 'Cápsulas', concentracion: '500 mg', stock: 80, activo: true },
    { id: 4, nombre: 'Omeprazol', presentacion: 'Cápsulas', concentracion: '20 mg', stock: 50, activo: true },
    { id: 5, nombre: 'Cetirizina', presentacion: 'Tabletas', concentracion: '10 mg', stock: 70, activo: true },
    { id: 6, nombre: 'Metformina', presentacion: 'Tabletas', concentracion: '500 mg', stock: 200, activo: true },
    { id: 7, nombre: 'Enalapril', presentacion: 'Tabletas', concentracion: '10 mg', stock: 90, activo: true },
    { id: 8, nombre: 'Salbutamol', presentacion: 'Inhalador', concentracion: '100 mcg/puff', stock: 40, activo: true },
    { id: 9, nombre: 'Prednisona', presentacion: 'Tabletas', concentracion: '20 mg', stock: 60, activo: true },
    { id: 10, nombre: 'Levotiroxina', presentacion: 'Tabletas', concentracion: '50 mcg', stock: 30, activo: true },
    { id: 11, nombre: 'Claritromicina', presentacion: 'Tabletas', concentracion: '500 mg', stock: 45, activo: true }
  ]);

  list(): Observable<Medicamento[]> {
    return this.medicamentos$.asObservable();
  }

  create(nuevo: Omit<Medicamento, 'id'>): void {
    const current = this.medicamentos$.value;
    const nextId = current.length ? Math.max(...current.map(m => m.id)) + 1 : 1;
    this.medicamentos$.next([...current, { id: nextId, ...nuevo }]);
  }

  update(id: number, cambios: Partial<Medicamento>): void {
    const updated = this.medicamentos$.value.map(m => m.id === id ? { ...m, ...cambios } : m);
    this.medicamentos$.next(updated);
  }

  remove(id: number): void {
    this.medicamentos$.next(this.medicamentos$.value.filter(m => m.id !== id));
  }
}




