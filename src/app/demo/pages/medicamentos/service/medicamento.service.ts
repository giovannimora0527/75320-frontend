import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private baseUrl = 'http://localhost:8000/clinica/v1/api/medicamentos'; // ✅ URL correcta

  constructor(private http: HttpClient) {}

  // 🧾 Listar todos los medicamentos
  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listar`);
  }

  // ➕ Crear un nuevo medicamento
  crear(medicamento: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/crear`, medicamento);
  }

  // ✏️ Actualizar un medicamento existente
  actualizar(id: number, medicamento: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/actualizar/${id}`, medicamento);
  }

  // ❌ Eliminar un medicamento
  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/eliminar/${id}`);
  }
}




