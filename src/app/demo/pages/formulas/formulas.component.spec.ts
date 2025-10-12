import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulasComponent } from './formulas.component';

describe('FormulasComponent', () => {
  let component: FormulasComponent;
  let fixture: ComponentFixture<FormulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});