import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PacienteComponent } from './paciente.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('PacienteComponent', () => {
  let component: PacienteComponent;
  let fixture: ComponentFixture<PacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacienteComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should have form controls defined', () => {
    expect(component.form.contains('nombres')).toBeTrue();
    expect(component.form.contains('apellidos')).toBeTrue();
    expect(component.form.contains('tipo_documento')).toBeTrue();
    expect(component.form.contains('numero_documento')).toBeTrue();
  });
});
