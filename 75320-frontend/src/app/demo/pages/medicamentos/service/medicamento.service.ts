import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
=======
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento } from '../models/medicamentos';
import { RespuestaRs } from '../models/respuesta';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
<<<<<<< HEAD
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
=======
  urlBase: string = environment.apiUrlAuth;
  urlApi: string = 'medicamento';

  constructor(private backendService: BackendService) {}

  listarMedicamento(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  guardarMedicamento(medicamento: Medicamento): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', medicamento);
  }

  actualizarMedicamento(medicamento: Medicamento): Observable<RespuestaRs>{
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', medicamento);
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }
}



<<<<<<< HEAD

=======
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
