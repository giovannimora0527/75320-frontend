import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  // ✅ Usa la misma ruta del backend (RecetaApiController)
  private apiUrl = 'http://localhost:8000/clinica/v1/api/recetas';

  constructor(private http: HttpClient) {}

  getFormulas(): Observable<any[]> {
    // coincide con el método listar del backend
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  guardarFormula(formula: any): Observable<any> {
    // coincide con el método crear del backend
    return this.http.post<any>(`${this.apiUrl}/crear`, formula);
  }
}




