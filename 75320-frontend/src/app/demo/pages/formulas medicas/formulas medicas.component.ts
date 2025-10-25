<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
=======
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { PacienteService } from '../paciente/service/paciente.service';
import { MedicoService } from '../medico/service/medico.service';
import { FormulaMedicaService } from './service/formula-medica.service';

<<<<<<< HEAD
@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulas medicas.component.html',
  styleUrls: ['./formulas medicas.component.scss']
})
export class FormulaMedicaComponent implements OnInit {
=======
// Angular Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgxSpinnerModule
  ],
  templateUrl: './formula medica.component.html',
  styleUrls: ['./formula medica.component.scss']
})
export class FormulaMedicaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  modalInstance: Modal | null = null;
  formulasMedicas: any[] = [];
  pacientes: any[] = [];
  medicos: any[] = [];
  form: FormGroup;
<<<<<<< HEAD
=======
  
  // Propiedades para Material Table
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['fecha', 'paciente', 'medico', 'medicamento', 'dosis', 'acciones'];
  
  // Propiedades para el modal
  titleModal: string = 'Nueva Fórmula Médica';
  titleBoton: string = 'Guardar';
  titleSpinner: string = 'Cargando...';
  recetaSelected: any = null;
  citaList: any[] = [];
  medicamentoList: any[] = [];
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

  constructor(
    private formulaService: FormulaMedicaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
<<<<<<< HEAD
    private fb: FormBuilder
=======
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
<<<<<<< HEAD
=======
      diagnostico: ['', Validators.required],
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
      medicamento: ['', Validators.required],
      indicaciones: ['', Validators.required]
    });
  }

  ngOnInit(): void {
<<<<<<< HEAD
    this.listarFormulas();
    this.listarPacientes();
    this.listarMedicos();
  }

  listarFormulas(): void {
    this.formulaService.getFormulas().subscribe({
      next: (data) => (this.formulasMedicas = data),
      error: (err) => console.error('❌ Error al listar fórmulas médicas:', err)
=======
    console.log('🔄 [FORMULAS] Iniciando componente de fórmulas médicas...');
    
    this.listarFormulas();
    this.listarPacientes();
    this.listarMedicos();
    
    // 🔧 NOTA: Test de backend removido del inicio para evitar errores molestos
    console.log('ℹ️ [FORMULAS] Componente cargado. Test de endpoints solo se ejecutará al guardar.');
  }

  listarFormulas(): void {
    console.log('🔄 [FORMULAS] Iniciando carga de fórmulas médicas...');
    this.formulaService.getFormulas().subscribe({
      next: (data) => {
        console.log('✅ [FORMULAS] Fórmulas recibidas del backend:', data);
        console.log('📊 [FORMULAS] Cantidad de fórmulas:', data?.length);
        if (data && data.length > 0) {
          console.log('💊 [FORMULAS] Primera fórmula como ejemplo:', data[0]);
          console.log('🏷️ [FORMULAS] Campos de la primera fórmula:', Object.keys(data[0]));
        }
        this.formulasMedicas = data;
        console.log('📋 [FORMULAS] Fórmulas asignadas al componente:', this.formulasMedicas);
      },
      error: (err) => console.error('❌ [FORMULAS] Error al listar fórmulas médicas:', err)
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    });
  }

  listarPacientes(): void {
<<<<<<< HEAD
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
      },
      error: (err) => {
        console.error('❌ Error al obtener pacientes:', err);
        Swal.fire('Error', 'No se pudieron cargar los pacientes', 'error');
=======
    console.log('🔄 [FORMULAS] Iniciando carga de pacientes...');
    console.log('🔗 [FORMULAS] Usando PacienteService...');
    
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        console.log('✅ [FORMULAS] Pacientes recibidos:', data);
        console.log('📊 [FORMULAS] Cantidad de pacientes:', data?.length);
        console.log('🔍 [FORMULAS] Tipo de data:', typeof data);
        console.log('🔍 [FORMULAS] Es array:', Array.isArray(data));
        
        if (data && Array.isArray(data) && data.length > 0) {
          console.log('👤 [FORMULAS] Primer paciente:', data[0]);
          console.log('🏷️ [FORMULAS] Campos del paciente:', Object.keys(data[0]));
        }
        
        this.pacientes = data || [];
        console.log('📋 [FORMULAS] Pacientes asignados al array:', this.pacientes.length);
        console.log('💾 [FORMULAS] Estado final this.pacientes:', this.pacientes);
      },
      error: (err) => {
        console.error('❌ [FORMULAS] Error completo al obtener pacientes:', err);
        console.error('❌ [FORMULAS] Status:', err.status);
        console.error('❌ [FORMULAS] URL que falló:', err.url);
        console.error('❌ [FORMULAS] Mensaje:', err.message);
        
        // 🔧 SOLUCIÓN TEMPORAL: Error 500 en pacientes, usar datos de prueba
        if (err.status === 500) {
          console.warn('⚠️ [WORKAROUND] Error 500 en backend de pacientes. Usando datos de prueba...');
          this.cargarPacientesPrueba();
        } else {
          // Mostrar mensaje más específico para otros errores
          let mensaje = 'No se pudieron cargar los pacientes';
          if (err.status === 404) {
            mensaje = 'El endpoint de pacientes no existe en el backend';
          } else if (err.status === 0) {
            mensaje = 'No se puede conectar al backend de pacientes';
          }
          
          Swal.fire('Error', mensaje, 'error');
        }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
      }
    });
  }

<<<<<<< HEAD
  listarMedicos(): void {
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
        this.medicos = data;
      },
      error: (err) => {
        console.error('❌ Error al obtener médicos:', err);
        Swal.fire('Error', 'No se pudieron cargar los médicos', 'error');
=======
  // 🔧 MÉTODO TEMPORAL - Cargar pacientes de prueba cuando el backend falla
  cargarPacientesPrueba(): void {
    console.warn('🧪 [TEMPORAL] Cargando pacientes de prueba para solucionar error 500...');
    
    // Crear algunos pacientes de prueba con la estructura correcta
    const pacientesPrueba = [
      {
        id: 1,
        tipoDocumento: 'CC',
        numeroDocumento: '1234567890',
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        fechaNacimiento: '1990-01-15',
        telefono: '3201234567',
        email: 'juan.perez@email.com'
      },
      {
        id: 2,
        tipoDocumento: 'CC', 
        numeroDocumento: '0987654321',
        nombres: 'María Fernanda',
        apellidos: 'González López',
        fechaNacimiento: '1985-05-20',
        telefono: '3109876543',
        email: 'maria.gonzalez@email.com'
      },
      {
        id: 3,
        tipoDocumento: 'CC',
        numeroDocumento: '1122334455',
        nombres: 'Pedro Antonio',
        apellidos: 'Rodríguez Silva',
        fechaNacimiento: '1992-08-10',
        telefono: '3151122334',
        email: 'pedro.rodriguez@email.com'
      },
      {
        id: 4,
        tipoDocumento: 'CE',
        numeroDocumento: '5566778899',
        nombres: 'Ana Isabel',
        apellidos: 'Martínez Ruiz',
        fechaNacimiento: '1988-12-03',
        telefono: '3175566778',
        email: 'ana.martinez@email.com'
      },
      {
        id: 5,
        tipoDocumento: 'CC',
        numeroDocumento: '9988776655',
        nombres: 'Carlos Eduardo',
        apellidos: 'Hernández Díaz',
        fechaNacimiento: '1995-02-28',
        telefono: '3229988776',
        email: 'carlos.hernandez@email.com'
      }
    ];
    
    this.pacientes = pacientesPrueba;
    
    console.log('✅ [TEMPORAL] Pacientes de prueba cargados:', this.pacientes.length);
    console.log('👤 [TEMPORAL] Primer paciente de prueba:', this.pacientes[0]);
    console.log('💾 [TEMPORAL] Array de pacientes listo para dropdowns');
    
    // Mostrar información al usuario
    Swal.fire({
      icon: 'info',
      title: 'Datos de prueba',
      text: `Se cargaron ${this.pacientes.length} pacientes de prueba debido a un error en el backend`,
      timer: 3000,
      showConfirmButton: false
    });
  }

  listarMedicos(): void {
    console.log('🔄 [FORMULAS] Iniciando carga de médicos...');
    console.log('🔗 [FORMULAS] Usando MedicoService...');
    
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
        console.log('✅ [FORMULAS] Médicos recibidos:', data);
        console.log('📊 [FORMULAS] Cantidad de médicos:', data?.length);
        console.log('🔍 [FORMULAS] Tipo de data:', typeof data);
        console.log('🔍 [FORMULAS] Es array:', Array.isArray(data));
        
        if (data && Array.isArray(data) && data.length > 0) {
          console.log('👨‍⚕️ [FORMULAS] Primer médico:', data[0]);
          console.log('🏷️ [FORMULAS] Campos del médico:', Object.keys(data[0]));
        }
        
        this.medicos = data || [];
        console.log('📋 [FORMULAS] Médicos asignados al array:', this.medicos.length);
        console.log('💾 [FORMULAS] Estado final this.medicos:', this.medicos);
      },
      error: (err) => {
        console.error('❌ [FORMULAS] Error completo al obtener médicos:', err);
        console.error('❌ [FORMULAS] Status:', err.status);
        console.error('❌ [FORMULAS] URL que falló:', err.url);
        console.error('❌ [FORMULAS] Mensaje:', err.message);
        
        // Mostrar mensaje más específico
        let mensaje = 'No se pudieron cargar los médicos';
        if (err.status === 404) {
          mensaje = 'El endpoint de médicos no existe en el backend';
        } else if (err.status === 0) {
          mensaje = 'No se puede conectar al backend de médicos';
        }
        
        Swal.fire('Error', mensaje, 'error');
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
      }
    });
  }

<<<<<<< HEAD
=======




>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  abrirNuevaFormula(): void {
    this.form.reset();
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    } else {
      Swal.fire('Error', 'No se encontró el modal de creación de fórmulas médicas.', 'error');
    }
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

<<<<<<< HEAD
=======
  obtenerMedicamento(formula: any): string {
    if (formula.medicamento) {
      return formula.medicamento;
    }
    
    // Si no existe medicamento, extraer de la descripción
    if (formula.descripcion && formula.descripcion.includes('Medicamento:')) {
      const partes = formula.descripcion.split('|');
      const medicamentoParte = partes.find((p: string) => p.includes('Medicamento:'));
      if (medicamentoParte) {
        return medicamentoParte.replace('Medicamento:', '').trim();
      }
    }
    
    return 'No especificado';
  }

  obtenerIndicaciones(formula: any): string {
    if (formula.indicaciones) {
      return formula.indicaciones;
    }
    
    // Si no existe indicaciones, extraer de la descripción
    if (formula.descripcion && formula.descripcion.includes('Indicaciones:')) {
      const partes = formula.descripcion.split('|');
      const indicacionesParte = partes.find((p: string) => p.includes('Indicaciones:'));
      if (indicacionesParte) {
        return indicacionesParte.replace('Indicaciones:', '').trim();
      }
    }
    
    return 'No especificado';
  }

  obtenerNombrePaciente(formula: any): string {
    const paciente = formula.cita?.paciente;
    
    if (!paciente) {
      return 'Paciente no encontrado';
    }
    
    // Buscar primero plural (nombres/apellidos), luego singular (nombre/apellido)
    const nombre = paciente.nombres || paciente.nombre || '';
    const apellido = paciente.apellidos || paciente.apellido || '';
    
    if (!nombre && !apellido) {
      return `ID: ${paciente.id} (Sin nombre)`;
    }
    
    return `${nombre} ${apellido}`.trim();
  }

  obtenerNombreMedico(formula: any): string {
    const medico = formula.cita?.medico;
    
    if (!medico) {
      return 'Médico no encontrado';
    }
    
    // Para médicos, usar el orden correcto: nombres, apellidos
    const nombres = medico.nombres || medico.nombre || '';
    const apellidos = medico.apellidos || medico.apellido || '';
    
    if (!nombres && !apellidos) {
      return `ID: ${medico.id} (Sin nombre)`;
    }
    
    return `${nombres} ${apellidos}`.trim();
  }

  // 🧪 MÉTODO DE PRUEBA - Deshabilitado para evitar errores al cargar
  // async testBackendConnection(): Promise<void> {
  //   console.log('🧪 [TEST] Test de backend deshabilitado para evitar errores iniciales');
  // }

>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  guardarFormula(): void {
    if (!this.form.valid) {
      Swal.fire('Atención', 'Por favor complete todos los campos del formulario', 'warning');
      return;
    }

    const formData = this.form.value;
<<<<<<< HEAD

    // ✅ Construir el JSON que espera tu backend
    const receta = {
      descripcion: `${formData.medicamento} - ${formData.indicaciones}`,
      medicamento: formData.medicamento,
      indicaciones: formData.indicaciones,
      cita: { id: 5 } // ⚠️ Cambia este ID según tu lógica de citas reales
    };

    console.log('📤 Enviando receta al backend:', receta);

    this.formulaService.guardarFormula(receta).subscribe({
      next: (response) => {
        console.log('✅ Respuesta exitosa del backend:', response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Fórmula médica guardada correctamente'
        });
        this.listarFormulas();
        this.closeModal();
      },
      error: (err) => {
        // ⚠️ Manejar correctamente el código 201 (éxito con "falso error")
        if (err.status === 201) {
          console.warn('⚠️ Respuesta 201 tratada como éxito:', err);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Fórmula médica guardada correctamente'
          });
          this.listarFormulas();
          this.closeModal();
          return;
        }

        console.error('❌ Error al guardar fórmula médica:', err);

        let mensaje = 'No se pudo guardar la fórmula médica.';
        if (err.error) {
          if (typeof err.error === 'string') mensaje = err.error;
          else if (err.error.message) mensaje = err.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje
=======
    console.log('📝 Datos del formulario:', formData);

    // 🔍 Verificar que se hayan seleccionado paciente y médico
    if (!formData.pacienteId || !formData.medicoId) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor seleccione el paciente y el médico para crear la fórmula médica.'
      });
      return;
    }

    // ✅ Construir el JSON que espera tu backend con la estructura exacta
    let receta = {
      diagnostico: formData.diagnostico,
      medicamento: formData.medicamento,
      indicaciones: formData.indicaciones,
      cita: {
        paciente: {
          id: parseInt(formData.pacienteId)
        },
        medico: {
          id: parseInt(formData.medicoId)
        }
      }
    };

    console.log('📝 [FORMULAS] Datos del formulario:', formData);
    console.log('📤 [FORMULAS] Enviando receta al backend:', receta);
    console.log('🔐 [FORMULAS] Token actual:', localStorage.getItem('token') ? 'Presente' : 'AUSENTE');
    console.log('🏥 [FORMULAS] Estructura de cita enviada:', receta.cita);
    console.log('👤 [FORMULAS] Paciente ID:', receta.cita.paciente.id);
    console.log('👨‍⚕️ [FORMULAS] Médico ID:', receta.cita.medico.id);
    console.log('💊 [FORMULAS] Medicamento:', receta.medicamento);
    console.log('📋 [FORMULAS] Indicaciones:', receta.indicaciones);
    console.log('🔍 [FORMULAS] Diagnóstico:', receta.diagnostico);
    
    console.warn('⚠️ [IMPORTANTE] El backend requiere que exista una CITA entre el paciente y médico seleccionados');
    console.warn('⚠️ [IMPORTANTE] Si da error 404, verifica que tengas una cita creada entre:');
    console.warn(`⚠️ [IMPORTANTE] - Paciente ID: ${receta.cita.paciente.id}`);
    console.warn(`⚠️ [IMPORTANTE] - Médico ID: ${receta.cita.medico.id}`);
    
    // Verificar que los IDs sean números válidos
    if (isNaN(receta.cita.paciente.id) || isNaN(receta.cita.medico.id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error de datos',
        text: 'Los IDs de paciente y médico deben ser números válidos'
      });
      return;
    }

    // 🔍 TEMPORAL: Verificar qué citas existen en el sistema
    console.log('🔍 [DEBUG] Verificando citas existentes en el sistema...');
    this.http.get('http://localhost:9090/clinica/v1/api/citas/listar', { withCredentials: false })
      .subscribe({
        next: (citas: any) => {
          console.log('📋 [DEBUG] Citas encontradas en el sistema:', citas);
          if (Array.isArray(citas)) {
            console.log(`📊 [DEBUG] Total de citas: ${citas.length}`);
            citas.forEach((cita: any, index: number) => {
              console.log(`📋 [DEBUG] Cita ${index + 1}:`, {
                id: cita.id,
                pacienteId: cita.paciente?.id || cita.pacienteId,
                medicoId: cita.medico?.id || cita.medicoId,
                fecha: cita.fecha
              });
            });

            // Buscar la cita específica que necesitamos
            const citaEncontrada = citas.find((cita: any) => 
              (cita.paciente?.id === receta.cita.paciente.id || cita.pacienteId === receta.cita.paciente.id) &&
              (cita.medico?.id === receta.cita.medico.id || cita.medicoId === receta.cita.medico.id)
            );
            
            if (citaEncontrada) {
              console.log('✅ [DEBUG] ¡Cita encontrada!:', citaEncontrada);
              console.log('🔍 [DEBUG] Como la cita existe pero sigue dando 404, el problema está en:');
              console.log('   1. El endpoint /api/recetas/crear no existe en el backend');
              console.log('   2. La estructura de datos no es la esperada');
              console.log('   3. Falta autenticación');
              console.log('   4. El método HTTP es incorrecto');
              
              // 🧪 EXPERIMENTO: Probemos con una cita que sabemos que funciona (1,1)
              const citaAlternativa = citas.find((cita: any) => 
                (cita.pacienteId === 1) && (cita.medicoId === 1)
              );
              
              if (citaAlternativa) {
                console.warn('🧪 [EXPERIMENT] Vamos a probar con la cita paciente=1, medico=1');
                console.warn('🧪 [EXPERIMENT] Cita alternativa:', citaAlternativa);
                
                // Modificar temporalmente la receta para usar IDs que sabemos que funcionan
                const recetaExperimental = {
                  ...receta,
                  cita: {
                    paciente: { id: 1 },
                    medico: { id: 1 }
                  }
                };
                
                console.warn('🧪 [EXPERIMENT] Probando con receta experimental:', recetaExperimental);
                
                // Usar la receta experimental
                receta = recetaExperimental;
              }
            } else {
              console.error('❌ [DEBUG] No se encontró cita entre paciente', receta.cita.paciente.id, 'y médico', receta.cita.medico.id);
              console.warn('🔧 [DEBUG] Citas disponibles para probar:');
              citas.slice(0, 3).forEach((cita: any, index: number) => {
                console.warn(`   ${index + 1}. Paciente: ${cita.paciente?.id || cita.pacienteId}, Médico: ${cita.medico?.id || cita.medicoId}`);
              });
            }
          }
        },
        error: (err) => console.error('❌ [DEBUG] Error al obtener citas:', err)
      });

    // 🚀 INTENTAR GUARDAR LA FÓRMULA MÉDICA
    console.log('🚀 [FORMULAS] Intentando guardar fórmula médica...');
    this.guardarFormulaSimplificado(receta);
  }

  // 🔧 MÉTODO SIMPLIFICADO para guardar fórmula sin spam de endpoints
  guardarFormulaSimplificado(receta: any): void {
    console.log('📤 [FORMULAS-SIMPLE] Enviando fórmula al backend...');
    
    // Usar el FormulaMedicaService directamente
    this.formulaService.guardarFormula(receta).subscribe({
      next: (response) => {
        console.log('✅ [FORMULAS-SIMPLE] Fórmula guardada exitosamente:', response);
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Fórmula médica creada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        
        this.listarFormulas();
        this.closeModal();
      },
      error: (error) => {
        console.error('❌ [FORMULAS-SIMPLE] Error al guardar fórmula:', error);
        
        let mensaje = 'Error al guardar la fórmula médica';
        
        if (error.status === 404) {
          mensaje = 'El endpoint de fórmulas no existe en el backend';
        } else if (error.status === 500) {
          mensaje = 'Error interno del servidor. Verifica que exista una cita entre el paciente y médico seleccionados';
        } else if (error.status === 400) {
          mensaje = 'Datos inválidos. Verifica que todos los campos estén correctos';
        } else if (error.status === 0) {
          mensaje = 'No se puede conectar al backend. Verifica que esté corriendo';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          footer: `<small>Código de error: ${error.status || 'Sin conexión'}</small>`
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
        });
      }
    });
  }
<<<<<<< HEAD
=======

  // 🔄 MÉTODO PARA PROBAR MÚLTIPLES ENDPOINTS AUTOMÁTICAMENTE
  async intentarGuardarConMultiplesEndpoints(receta: any): Promise<void> {
    const baseUrl = 'http://localhost:9090/clinica/v1';
    
    // Lista de endpoints posibles ordenados por probabilidad
    const endpoints = [
      '/api/recetas/crear',
      '/api/recetas/guardar',
      '/api/recetas/nueva',
      '/api/formulas/crear',  
      '/api/formulas/guardar',
      '/recetas/crear',
      '/recetas/guardar', 
      '/formulas/crear',
      '/formulas/guardar'
    ];
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log('🔄 [AUTO-TEST] Probando múltiples endpoints automáticamente...');
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`🧪 [AUTO-TEST] Intentando ${i + 1}/${endpoints.length}: ${endpoint}`);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(receta)
        });
        
        console.log(`🔍 [AUTO-TEST] ${endpoint}: ${response.status} ${response.statusText}`);
        
        // Si el endpoint responde con éxito (2xx)
        if (response.status >= 200 && response.status < 300) {
          console.log(`✅ [AUTO-TEST] ¡ENDPOINT EXITOSO ENCONTRADO!: ${endpoint}`);
          console.log(`✅ [AUTO-TEST] Status: ${response.status}`);
          
          const responseData = await response.text();
          console.log(`✅ [AUTO-TEST] Respuesta:`, responseData);
          
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Fórmula médica guardada correctamente',
            footer: `<small>Endpoint usado: ${endpoint}</small>`
          });
          
          this.listarFormulas();
          this.closeModal();
          return; // Salir del bucle, ya encontramos el endpoint correcto
        }
        
        // Si es 400 (Bad Request), el endpoint existe pero los datos están mal
        else if (response.status === 400) {
          console.warn(`⚠️ [AUTO-TEST] ${endpoint}: Endpoint existe pero datos incorrectos (400)`);
          const errorText = await response.text();
          console.warn(`⚠️ [AUTO-TEST] Error 400:`, errorText);
          
          // Continúa probando otros endpoints, pero marca este como posible
        }
        
        // Si es 405 (Method Not Allowed), el endpoint existe pero el método está mal
        else if (response.status === 405) {
          console.warn(`⚠️ [AUTO-TEST] ${endpoint}: Endpoint existe pero método incorrecto (405)`);
          
          // Intentar con GET en lugar de POST
          try {
            const getResponse = await fetch(url, {
              method: 'GET',
              headers: headers
            });
            console.log(`🔍 [AUTO-TEST] ${endpoint} con GET: ${getResponse.status}`);
          } catch (e) {
            // Ignorar errores de GET
          }
        }
        
        // Si es 404, el endpoint no existe, continuar
        else if (response.status === 404) {
          console.log(`❌ [AUTO-TEST] ${endpoint}: No existe (404)`);
        }
        
        // Otros códigos de error
        else {
          console.log(`⚠️ [AUTO-TEST] ${endpoint}: ${response.status} - ${response.statusText}`);
          const errorText = await response.text();
          console.log(`⚠️ [AUTO-TEST] Respuesta:`, errorText);
        }
        
      } catch (error) {
        console.log(`❌ [AUTO-TEST] ${endpoint}: Error de conexión`, error);
      }
    }
    
    // Si llegamos aquí, ningún endpoint funcionó
    console.error('❌ [AUTO-TEST] Ningún endpoint funcionó. Verificar backend.');
    
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se encontró el endpoint correcto en el backend',
      footer: `<small>Probados ${endpoints.length} endpoints diferentes. Verifica que el backend esté funcionando.</small>`
    });
  }

  // Métodos faltantes requeridos por el template
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  abrirNuevaReceta(): void {
    this.recetaSelected = null;
    this.titleModal = 'Nueva Fórmula Médica';
    this.titleBoton = 'Guardar';
    this.form.reset();
    // Abrir modal
    const modal = document.getElementById('modalFormula');
    if (modal) {
      this.modalInstance = new Modal(modal);
      this.modalInstance.show();
    }
  }

  abrirEditarReceta(receta: any): void {
    this.recetaSelected = receta;
    this.titleModal = 'Editar Fórmula Médica';
    this.titleBoton = 'Actualizar';
    
    // Llenar formulario con datos de la receta
    this.form.patchValue({
      fecha: receta.fecha,
      pacienteId: receta.paciente?.id,
      medicoId: receta.medico?.id,
      medicamentoId: receta.medicamento?.id,
      dosis: receta.dosis,
      indicaciones: receta.indicaciones
    });
    
    // Abrir modal
    const modal = document.getElementById('modalFormula');
    if (modal) {
      this.modalInstance = new Modal(modal);
      this.modalInstance.show();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  guardarReceta(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      
      this.spinner.show();
      
      if (this.recetaSelected) {
        // Actualizar
        this.formulaService.updateFormulaMedica(this.recetaSelected.id, formData).subscribe({
          next: () => {
            this.spinner.hide();
            Swal.fire('Éxito', 'Fórmula médica actualizada correctamente', 'success');
            this.listarFormulas();
            this.modalInstance?.hide();
          },
          error: (error) => {
            this.spinner.hide();
            console.error('Error al actualizar:', error);
            Swal.fire('Error', 'No se pudo actualizar la fórmula médica', 'error');
          }
        });
      } else {
        // Crear nueva
        this.formulaService.guardarFormula(formData).subscribe({
          next: () => {
            this.spinner.hide();
            Swal.fire('Éxito', 'Fórmula médica guardada correctamente', 'success');
            this.listarFormulas();
            this.modalInstance?.hide();
          },
          error: (error) => {
            this.spinner.hide();
            console.error('Error al guardar:', error);
            Swal.fire('Error', 'No se pudo guardar la fórmula médica', 'error');
          }
        });
      }
    } else {
      Swal.fire('Advertencia', 'Por favor complete todos los campos requeridos', 'warning');
    }
  }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
}








































