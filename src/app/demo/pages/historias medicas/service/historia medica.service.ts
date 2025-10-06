import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriaMedicaService {
  private apiUrl = 'http://localhost:3000/historias'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getHistorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearHistoria(historia: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, historia);
  }

  actualizarHistoria(historia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${historia.id}`, historia);
  }

  eliminarHistoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}



