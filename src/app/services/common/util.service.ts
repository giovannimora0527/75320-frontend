import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(){}

  listarEspecializaciones(): Observable<any[]> {
    // Stub: devuelve lista vacía. Si deseas, conecta con el backend después.
    return of([]);
  }
}
