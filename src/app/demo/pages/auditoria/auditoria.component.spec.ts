import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditoriaComponent } from './auditoria.component';

/**
 * Suite de pruebas unitarias para {@link AuditoriaComponent}.
 * * Este bloque describe el conjunto de pruebas diseñadas para verificar
 * el comportamiento y la integridad del componente de Auditoría.
 * * @see https://angular.io/guide/testing
 */
describe('AuditoriaComponent', () => {
  /** * La instancia del componente que se está probando.
   * Permite acceder a las propiedades y métodos lógicos de la clase.
   */
let component: AuditoriaComponent;

  /** * El "fixture" (accesorio) de prueba.
   * Proporciona acceso tanto a la instancia del componente como a su plantilla (DOM)
   * para depuración y detección de cambios.
   */
let fixture: ComponentFixture<AuditoriaComponent>;

/**
   * Configuración asíncrona del entorno de pruebas.
   * Se ejecuta antes de cada caso de prueba individual (`it`).
   * * 1. Configura un módulo de prueba dinámico.
   * 2. Importa el componente (asumiendo que es Standalone).
   * 3. Compila los componentes y crea la instancia.
   * 4. Ejecuta la detección de cambios inicial.
   */
beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AuditoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
});

/**
   * Prueba de creación básica (Sanity Check).
   * * Verifica que la instancia del componente se haya instanciado correctamente
   * y no sea nula o indefinida.
   */
it('should create', () => {
    expect(component).toBeTruthy();
    });
});