import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacienteService } from './pacientes.service';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

  const dummyPacientes = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', edad: 30, genero: 'Masculino' },
    { id: 2, nombre: 'María', apellido: 'Gómez', edad: 25, genero: 'Femenino' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacienteService]
    });

    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch pacientes', () => {
    service.getPacientes().subscribe(pacientes => {
      expect(pacientes.length).toBe(2);
      expect(pacientes).toEqual(dummyPacientes);
    });

    const req = httpMock.expectOne('http://localhost:3000/pacientes');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPacientes);
  });

  it('should create a paciente', () => {
    const newPaciente = { nombre: 'Carlos', apellido: 'López', edad: 40, genero: 'Masculino' };

    service.crearPaciente(newPaciente).subscribe(paciente => {
      expect(paciente).toEqual({ id: 3, ...newPaciente });
    });

    const req = httpMock.expectOne('http://localhost:3000/pacientes');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...newPaciente });
  });

  it('should update a paciente', () => {
    const updatedPaciente = { id: 1, nombre: 'Juan', apellido: 'Pérez', edad: 31, genero: 'Masculino' };

    service.actualizarPaciente(updatedPaciente).subscribe(paciente => {
      expect(paciente.edad).toBe(31);
    });

    const req = httpMock.expectOne(`http://localhost:3000/pacientes/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPaciente);
  });

  it('should delete a paciente', () => {
    const pacienteId = 1;

    service.eliminarPaciente(pacienteId).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`http://localhost:3000/pacientes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
