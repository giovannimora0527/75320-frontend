import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { HistoriaMedicaComponent } from './historias medicas.component';

describe('HistoriaMedicaComponent', () => {
  let component: HistoriaMedicaComponent;
  let fixture: ComponentFixture<HistoriaMedicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaMedicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaMedicaComponent);
=======

import { HistoriaComponent } from './historia.component';

describe('HistoriaComponent', () => {
  let component: HistoriaComponent;
  let fixture: ComponentFixture<HistoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaComponent);
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
