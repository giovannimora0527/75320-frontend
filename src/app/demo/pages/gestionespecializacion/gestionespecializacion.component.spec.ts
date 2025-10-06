import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionespecializacionComponent } from './gestionespecializacion.component';

describe('GestionespecializacionComponent', () => {
  let component: GestionespecializacionComponent;
  let fixture: ComponentFixture<GestionespecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionespecializacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionespecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
