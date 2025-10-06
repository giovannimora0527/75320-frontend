import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:3000/pacientes'; // Cambia según tu backend

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearPaciente(paciente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, paciente);
  }

  actualizarPaciente(paciente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${paciente.id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
