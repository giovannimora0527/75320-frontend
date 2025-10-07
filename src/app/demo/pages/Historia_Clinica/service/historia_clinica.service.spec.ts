// historia_clinica.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriasComponent } from '../historia_clinica.component';

describe('HistoriasComponent', () => {
  let component: HistoriasComponent;
  let fixture: ComponentFixture<HistoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
