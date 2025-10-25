import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { EspecializacionComponent } from './especializaciones.component';
=======

import { EspecializacionComponent } from './especializacion.component';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

describe('EspecializacionComponent', () => {
  let component: EspecializacionComponent;
  let fixture: ComponentFixture<EspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecializacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
