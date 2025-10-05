import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriamedicaComponent } from './historiamedica.component';

describe('HistoriamedicaComponent', () => {
  let component: HistoriamedicaComponent;
  let fixture: ComponentFixture<HistoriamedicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriamedicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriamedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
