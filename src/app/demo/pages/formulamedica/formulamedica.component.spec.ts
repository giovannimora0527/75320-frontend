import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulamedicaComponent } from './formulamedica.component';

describe('FormulamedicaComponent', () => {
  let component: FormulamedicaComponent;
  let fixture: ComponentFixture<FormulamedicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulamedicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulamedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
