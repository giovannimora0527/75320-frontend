import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private baseUrl = 'http://localhost:3000/medicos'; // Cambia por tu API

  constructor(private http: HttpClient) {}

  getMedicos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  crearMedico(medico: any): Observable<any> {
    return this.http.post(this.baseUrl, medico);
  }

  actualizarMedico(medico: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${medico.id}`, medico);
  }

  eliminarMedico(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

