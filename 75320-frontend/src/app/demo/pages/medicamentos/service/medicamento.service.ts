import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private apiUrl = 'http://localhost:3000/medicamentos'; // Cambia a tu API real

  constructor(private http: HttpClient) {}

  // Obtener todos los medicamentos
  getMedicamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un nuevo medicamento
  crearMedicamento(medicamento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, medicamento);
  }

  // Actualizar un medicamento existente
  actualizarMedicamento(medicamento: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${medicamento.id}`, medicamento);
  }

  // Eliminar un medicamento (opcional)
  eliminarMedicamento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

