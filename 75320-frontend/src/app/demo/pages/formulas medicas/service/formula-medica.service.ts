import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
=======
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
<<<<<<< HEAD
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




=======

  constructor(private readonly backendService: BackendService) { }

  // Add your service methods here
  getFormulaMedica(): Observable<any> {
    return this.backendService.get(environment.apiUrlAuth, 'formula', 'medica');
  }

  getFormulas(): Observable<any> {
    return this.getFormulaMedica();
  }

  saveFormulaMedica(data: any): Observable<any> {
    return this.backendService.post(environment.apiUrlAuth, 'formula', 'medica', data);
  }

  guardarFormula(data: any): Observable<any> {
    return this.saveFormulaMedica(data);
  }

  updateFormulaMedica(id: number, data: any): Observable<any> {
    return this.backendService.put(environment.apiUrlAuth, 'formula', `medica/${id}`, data);
  }
}
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
