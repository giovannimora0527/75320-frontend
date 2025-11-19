import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaLogsComponent } from './auditoria-logs.component';

describe('AuditoriaLogsComponent', () => {
  let component: AuditoriaLogsComponent;
  let fixture: ComponentFixture<AuditoriaLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriaLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
