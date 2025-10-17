import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Especializacion } from '../models/especializacion';

@Injectable({ providedIn: 'root' })
export class EspecializacionesService {
  private readonly items$ = new BehaviorSubject<Especializacion[]>([
    { id: 1, nombre: 'Cardiología', descripcion: 'Trastornos del corazón y vasos' },
    { id: 2, nombre: 'Dermatología', descripcion: 'Piel, cabello y uñas' }
     ,{ id: 3, nombre: 'Neurología', descripcion: 'Trastornos del sistema nervioso; cefaleas y migraña' },
     { id: 4, nombre: 'Neumología', descripcion: 'Afecciones respiratorias: bronquitis, asma, infecciones respiratorias' },
     { id: 5, nombre: 'Gastroenterología', descripcion: 'Trastornos digestivos: reflujo, esofagitis' },
     { id: 6, nombre: 'Endocrinología', descripcion: 'Enfermedades metabólicas y hormonales: diabetes, tiroides' },
     { id: 7, nombre: 'Alergología', descripcion: 'Alergias respiratorias y reacciones alérgicas' },
     { id: 8, nombre: 'Medicina Interna', descripcion: 'Evaluación y manejo de condiciones médicas generales' },
     { id: 9, nombre: 'Infectología', descripcion: 'Diagnóstico y tratamiento de infecciones' },
     { id: 10, nombre: 'Otorrinolaringología', descripcion: 'Enfermedades de oído, nariz y garganta' },
     { id: 11, nombre: 'Rehabilitación', descripcion: 'Tratamiento de dolor muscular y recuperación funcional' },
     { id: 12, nombre: 'Nutrición', descripcion: 'Asesoría nutricional y manejo de peso' }
  ]);

  list(): Observable<Especializacion[]> { return this.items$.asObservable(); }
}




