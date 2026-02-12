  import { CommonModule } from '@angular/common';
  import { HttpClient, HttpResponse } from '@angular/common/http';
  import { ChangeDetectorRef, Component, OnInit, HostListener  } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { debounceTime, distinctUntilChanged, forkJoin, map, Observable, of, startWith, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
  import { Cliente } from 'src/app/core/models/cliente.model';
  import { Equipos } from 'src/app/core/models/equipos.model';
  import { Especie } from 'src/app/core/models/especie.model';
  import { Ictiometros } from 'src/app/core/models/ictiometro.model';
  import { MuestreoCompleto } from 'src/app/core/models/muestreo.model';
  import { PuntoControlDTO } from 'src/app/core/models/puntocontrolDTO.model';
  import { TipoInstalacion } from 'src/app/core/models/tipo_instalacion.model';
  import { Ubigeo } from 'src/app/core/models/ubigeo.model';
  import { Usuario } from 'src/app/core/models/usuario.model';
  import { AuthService } from 'src/app/core/services/auth';
  import { ClienteService } from 'src/app/core/services/cliente';
  import { MatriculaService } from 'src/app/core/services/embarcaciones';
  import { EquipoService } from 'src/app/core/services/equipo';
  import { EspecieService } from 'src/app/core/services/especie';
  import { IctiometroService } from 'src/app/core/services/ictiometro';
  import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
  import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
  import { MatInputModule } from '@angular/material/input';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MuestreoCompletoService } from 'src/app/core/services/muestreo'; 
  import {PuntoControlService } from 'src/app/core/services/punto_control';
  import { TipoInstalacionService } from 'src/app/core/services/tipo_instalacion';
  import { UbigeoService } from 'src/app/core/services/ubigeo';
  import { UsuarioService } from 'src/app/core/services/usuario';
  import Swal from 'sweetalert2';
  import { Embarcaciones } from 'src/app/core/models/embarcaciones.model';
  import { PdfService } from 'src/app/core/services/pdf';
  import { PdfPreviewDialogComponent } from '../table/components/pdf-preview/pdf-preview-dialog.component';
  import { MatDialog } from '@angular/material/dialog';

  @Component({
    selector: 'app-muestreo',
    templateUrl: './muestreo_pesca.component.html',
    styleUrls: ['./muestreo_pesca.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule, MatAutocompleteModule,MatFormFieldModule, MatInputModule, NgxMatSelectSearchModule],
  })
  export class MuestreoPescaComponent implements OnInit {
    matriculasFiltradas$: Observable<any[]> = new Observable();  
    equiposFiltrados$: Observable<any[]> = new Observable();  
    IctiometrosFiltrados$: Observable<any[]> = new Observable(); 
    UsuarioPrimarioFiltrados$: Observable<any[]> = new Observable(); 
    UsuarioSecundarioFiltrados$: Observable<any[]> = new Observable();   
    private destroy$ = new Subject<void>();
    matriculas: Embarcaciones[] = [];  
    muestreoForm!: FormGroup;
    clientes: Cliente[] = [];
    equipos : Equipos[] = [];
    ictiometros: Ictiometros[] =[];
    especies : Especie[] = [];
    usuarios : Usuario[] = [];
    usuariosPrimario : Usuario[] = [];
    usuariosSecundario : Usuario[] = [];
    regiones : Ubigeo[] = [];
    provincias : Ubigeo[] = [];
    distritos : Ubigeo[]=[];
    puntosdecontrol : PuntoControlDTO[] =[];
    muestreos : MuestreoCompleto[] =[];
    instalaciones: TipoInstalacion[] = [];
  checked: any;
    httpClient: any;

    constructor(
      private fb: FormBuilder,
      private muestreoService: MuestreoCompletoService,
      private router: Router,
      private clienteservice : ClienteService,
      private equiposervice : EquipoService,
      private especieservice : EspecieService,
      private usuarioservice : UsuarioService,
      private ubigeoservice : UbigeoService,
      private cdr : ChangeDetectorRef,
      private route : ActivatedRoute,
      private auth : AuthService,
      private puntocontrolservice : PuntoControlService,
      private tipoinstalacionservice : TipoInstalacionService,
      private ictiometroservice : IctiometroService,
      private matriculaservice : MatriculaService,
      private pdfservice : PdfService,
      private dialog : MatDialog
    ) {}
  modoEdicion = false;
  modoVer = false
  id_actual : number | null = null;
  submitted= false;
  
  
    get detalle(): FormArray {
      return this.muestreoForm.get('detalle') as FormArray;
    }
    get f(){
    return this.muestreoForm.controls;
  }
  

  noZeroValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 0 ? { noZero: true } : null;
  }
  trackByFila = (_: number, ctrl: AbstractControl) => ctrl.get('nro_fila')?.value ?? _;
  displayFnPuntoControl = (id: number | null): string => {
    if (id == null) return '';

    const punto = this.puntosdecontrol.find(p => p.Id_Punto_Control === id);
    if (!punto) return '';

    const clienteId = (punto as any).Id_Cliente;   


    const cliente = this.clientes.find(c => c.id_cliente === clienteId);
    return cliente?.razon_social ?? '';
  };
  displayFn = (id: number | string | null): string => {
    if (id == null || id === '') return '';
    const idNum = typeof id === 'string' ? Number(id) : id;
    if (!idNum) return '';

    const emb = this.matriculas.find(m => (m as any).id_Embarcacion === idNum);
    if (!emb) return '';
  //console.log('emb encontrada:', emb);
  //console.log('keys:', Object.keys(emb as any));
    return emb.matricula;
    
  };
  displayFnIctiometro = (id: number | null): string => {
    if (id == null) return '';
    const ict = this.ictiometros.find(i => i.id_ictiometro === id);
    return ict ? ict.codigo_barcode : '';
  };
  displayFnUsuarios = (value: Usuario | number | string | null): string => {
    if (value == null || value === '') return '';

    if (typeof value === 'object') return value.nombre_completo ?? '';

    // Si el control tiene el id (number o string)
    const id = typeof value === 'string' ? Number(value) : value;
    return this.usuarios.find(u => u.id_usuario === id)?.nombre_completo ?? '';
  };

  displayFnEquipos = (id: number | null): string => {
    if (id == null) return '';
    const eq = this.equipos.find(e => e.id_equipo === id);
    return eq ? eq.codigo : '';
  };
  get ictiometroCtrl(): FormControl {
    return this.muestreoForm.get('id_ictiometro') as FormControl;
  }
  get usuarioprimarioCtrl(): FormControl {
    return this.muestreoForm.get('id_fiscalizador_primario') as FormControl;
  }
  get usuariosecundarioCtrl(): FormControl {
    return this.muestreoForm.get('id_fiscalizador_secundario') as FormControl;
  }
  get equiposCtrl(): FormControl {
    return this.muestreoForm.get('id_equipo') as FormControl;
  }

  get matriculaCtrl(): FormControl {
    return this.muestreoForm.get('Id_Embarcacion') as FormControl;
  }
  get puntoControlCtrl(): FormControl {
    return this.muestreoForm.get('Id_Punto_Control') as FormControl;
  }

    ngOnInit(): void {
      this.muestreoForm = this.fb.group({
        correlativo: [{value: "Correlativo", disabled: true }],
        id_region: [0, [Validators.required, this.noZeroValidator]],
        id_provincia: [0, Validators.required  ],
        id_distrito: [0, Validators.required],
        id_punto_control:[0, [Validators.required, this.noZeroValidator]],
        id_tipo_instalacion : [0, [Validators.required, this.noZeroValidator]],
        fecha_registro: [{value : new Date().toISOString().split('T')[0], disabled : true}],
        unidad_fiscalizada: ['', Validators.required],
        id_cliente: [{ value: 0, disabled: true }, [Validators.required, this.noZeroValidator]],      
        nombre_ep: [{value: '', disabled: true }],
        Id_Embarcacion: [''],
        cap_bod_m3_arqueo:  [{value: '', disabled: true }],
        peso_dec_t: [0],
        peso_registrado_t: [null, Validators.required],
        nro_rep_pesaje: [''],
        placa: [''],  
        peso_guia_t: [0],

        tolva: [false, Validators.required],
        tolva_nro: [0],
        muelle: [false, Validators.required],
        zona_recepcion: [false, Validators.required],
        dpa: [false, Validators.required],
        terminal_pesquero: [false, Validators.required],
        carretera: [false, Validators.required],
        garita_peaje: [false, Validators.required],
        otros: [false, Validators.required],
        otros_descripcion: [''],

        en_descarga: [false, Validators.required],
        por_cuarteo: [false],
        total_pulpo: [false, Validators.required],
        descarga_acumulada_t: [''],
        toma_muestra_1: [null, Validators.required],
        toma_muestra_2: [null, Validators.required],
        toma_muestra_3: [null, Validators.required],

        id_especie:  [0, [Validators.required, this.noZeroValidator]],
        
        peso: [null, [Validators.required]],          
        total: [{ value: 0, disabled: true }],   
        porcentaje: [{value: '100', disabled: true }],
        

        fecha_inicio_toma:[{value : this.fechaLocal(), disabled : true}],
        hora_inicio_toma: [{value: this.horaLocal(), disabled: true}],
        fecha_fin_toma: [{value : this.fechaLocal(), disabled : true}],
        hora_fin_toma: [{value: '', disabled: true}],

        media_aritmetica_cm: [{ value: 0, disabled: true }],
        moda_cm: [{ value: 0, disabled: true }],
        moda_nro: [{ value: 0, disabled: true }],

        total_ejemplares: [{ value: 0, disabled: true }],
        ejemplares_juveniles_pct: [{ value: 0, disabled: true }],
        ejemplares_juveniles_nro: [{ value: 0, disabled: true }],

        id_ictiometro: [null, Validators.required],
        id_equipo:  [0, [Validators.required, this.noZeroValidator]],
        zona_pesca: ['', Validators.required],
        codigo_bitacora: ['', Validators.required],
        observaciones: [''],

        id_fiscalizador_primario:  [0, [Validators.required, this.noZeroValidator]],
        id_fiscalizador_secundario:  [0, [Validators.required, this.noZeroValidator]],
        representantePresente: [false],        
        nombre_representante: [''],
        dni_representante: [''],
        cargo_representante: [''],
        nombre_testigo: [''],
        dni_testigo: [''],

        detalle: this.fb.array([]),
      });    
      this.inicializarDetalles();
      this.muestreoForm.get('peso')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(peso => {
      this.muestreoForm.get('total')?.setValue(peso, { emitEvent: false });
    });
      
      const idStr = this.route.snapshot.paramMap.get('id');
      this.id_actual = idStr ? Number(idStr) : null;

      this.modoVer = this.route.snapshot.url.some(seg => seg.path === 'ver');
      this.modoEdicion = !!this.id_actual && !this.modoVer;
      this.matriculaservice.listarTodas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.matriculas = data;
       if (this.id_actual) this.cargarMuestreo(this.id_actual);
      }
    });
    this.muestreoForm.get('representantePresente')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(present => {
        const nombre = this.muestreoForm.get('nombre_representante');
        const dni    = this.muestreoForm.get('dni_representante');
        const cargo  = this.muestreoForm.get('cargo_representante');

        if (present) {
          nombre?.setValidators([Validators.required]);
          dni?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]); // 8 dígitos
          cargo?.setValidators([Validators.required]);
        } else {
          nombre?.clearValidators();
          dni?.clearValidators();
          cargo?.clearValidators();
        }

        nombre?.updateValueAndValidity();
        dni?.updateValueAndValidity();
        cargo?.updateValueAndValidity();
      });
      this.clienteservice.Listar().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        //console.log('Clientes :',data);
        this.clientes =data;

      },
    });
    this.equiposervice.Listar().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        //console.log('Equipos :',data);
        this.equipos =data;

      },
    });
    
    this.ictiometroservice.Listar().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        //console.log('Ictiometros :',data);
        this.ictiometros =data;

      },
    });
    
    this.equiposFiltrados$ = this.equiposCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(valor => {
      if (valor && typeof valor === 'object') {
        return of([]);
      }

      return this.equiposervice.buscarEquipos(valor).pipe(
        map((resultados: Ictiometros[]) => resultados)
      );
    })
  );
  
  this.matriculasFiltradas$ = this.matriculaCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(valor => {

      if (typeof valor !== 'string') return of([]);

      const texto = valor.trim();
      return this.matriculaservice.buscarMatriculas(texto).pipe(
        map(resultados => resultados)
      );
    })
  );
  this.IctiometrosFiltrados$ = this.muestreoForm.get('id_ictiometro')!.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(valor => {
      //console.log('Buscando:', valor);
      return this.ictiometroservice.buscarIctiometros(valor).pipe(
        map((resultados: any[]) => {
          //console.log('Resultados del endpoint:', resultados);

          if (!valor || valor.trim() === '') {
            //console.log('Sin filtro, devolviendo todos');
            return resultados;
          }
      
          const filtrados = resultados.filter((item: any) => 
            (item.codigo_barcode || '').toLowerCase().includes(valor.toLowerCase())
          );
          
          //console.log('Filtrados por "' + valor + '":', filtrados);
          return filtrados;
        })
      );
    })
  );
  this.UsuarioPrimarioFiltrados$ = this.usuarioprimarioCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(valor => {
      if (valor && typeof valor === 'object') {
        return of([]);
      }

      return this.usuarioservice.buscarUsuarios(valor).pipe(
        map((resultados: Usuario[]) => resultados)
      );
    })
  );
  this.UsuarioSecundarioFiltrados$ = this.usuariosecundarioCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(valor => {
      if (valor == null) return of([]);
      if (typeof valor === 'object' || typeof valor === 'number') return of([]);

      const q = valor.trim();
      if (!q) return of([]);

      return this.usuarioservice.buscarUsuarios(q).pipe(
        map(lista => {
          const idPrimario = this.usuarioprimarioCtrl.value;
          const idPrim = typeof idPrimario === 'number'
            ? idPrimario
            : typeof idPrimario === 'object' && idPrimario
              ? (idPrimario as any).id_usuario
              : null;

          return idPrim ? lista.filter(u => u.id_usuario !== idPrim) : lista;
        })
      );
    })
  );
  this.tipoinstalacionservice.ListarInstalaciones().pipe(takeUntil(this.destroy$)).subscribe({
    
    next: (data) => {
      //console.log('Instalaciones recibidas:', data);

      this.instalaciones = data.map((instalaciones: any) => {
        return {
          Id_Tipo_Instalacion: instalaciones.id_Tipo_Instalacion,
          Codigo: instalaciones.codigo,
          Nombre: instalaciones.nombre,  
          Descripcion: instalaciones.descripcion,  
          Id_Cliente: instalaciones.id_Cliente, 
          Estado: instalaciones.estado,
  
        };
        
      });

      //console.log('Instalaciones', this.instalaciones);
    },
  });
  this.muestreoForm.get('id_tipo_instalacion')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(tipo => {
      const pesoCtrl = this.muestreoForm.get('peso_guia_t');

      if (tipo === '2') {                      
        pesoCtrl?.enable();                
      } else {                               
        pesoCtrl?.disable();                
        pesoCtrl?.setValue(0);                 
      }
      
    });  
    this.especieservice.Listar().subscribe({
      next: (data)=>{
        //console.log('Especies :',data);
        this.especies =data;

      },
    });
    this.usuarioservice.Listar().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        //console.log('Usuarios :',data);
        this.usuarios = data;
        this.usuariosPrimario =[...data];
        this.usuariosSecundario =[...data];

      
      this.muestreoForm.get('id_fiscalizador_primario')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((idPrimario) => {
    if (idPrimario && idPrimario !== 0) {
      this.usuariosSecundario = this.usuarios.filter(u => u.id_usuario !== idPrimario);
    } else {
      this.usuariosSecundario = [...this.usuarios];
    }
    //console.log('Primario seleccionado:', idPrimario);
    //console.log('Lista secundaria antes:', this.usuariosSecundario);
    //console.log('Lista secundaria después:', this.usuarios.filter(u => u.id_usuario !== idPrimario));
    //this.cdr.detectChanges();
    });
    },
    });
    this.ubigeoservice.ListarRegiones().pipe(takeUntil(this.destroy$)).subscribe({
    next: (data) => {
      //console.log('Regiones:', data);
      this.regiones = data;
    },
    error: (err) => console.error('Error al listar regiones', err)
  });

  this.muestreoForm.get('id_region')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((id_region) => {
    this.provincias = [];
  this.muestreoForm.get('id_provincia')?.setValue(0, { emitEvent: false });

    if (id_region && id_region > 0) {
      this.ubigeoservice.ListarProvincias(id_region).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          //console.log('Provincias:', data);
          this.provincias = data;
        },
        error: (err) => console.error('Error al listar provincias', err)
      });
    }
  });

  this.muestreoForm.get('id_provincia')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((id_provincia) => {

    this.distritos = [];
  this.muestreoForm.get('id_distrito')?.setValue(0, { emitEvent: false });
    this.puntosdecontrol = [];
  this.muestreoForm.get('id_punto_control')?.setValue(0, { emitEvent: false });
  if (id_provincia && id_provincia > 0) {

      this.ubigeoservice.ListarDistritos(id_provincia).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          //console.log('Distritos:', data);
          this.distritos = data;
        },
        error: (err) => console.error('Error al listar los distritos', err)
      });

      const tipoInstalacion = this.muestreoForm.get('id_tipo_instalacion')?.value;

      const provinciaObj = this.provincias.find(p => p.id_ubigeo === +id_provincia);
      const ubigeo = provinciaObj?.ubigeo; 
      //console.log('Provincia seleccionada:', provinciaObj);
      //console.log('Ubigeo obtenido:', ubigeo);

        if (ubigeo && tipoInstalacion > 0) {
        this.puntocontrolservice.obtenerPuntoControl(ubigeo, tipoInstalacion).pipe(takeUntil(this.destroy$)).subscribe({
          next: (data) => {
            //console.log('Puntos de Control recibidas:', data);
            this.puntosdecontrol = data.map((puntosdecontrol : any) => ({
              Id_Punto_Control: puntosdecontrol.id_Punto_Control,
              ubigeo : puntosdecontrol.ubigeo,
              Id_Tipo_Instalacion: puntosdecontrol.id_Tipo_Instalacion,
              codigo : puntosdecontrol.codigo,
              Id_Cliente:  puntosdecontrol.id_Cliente 
            }));
          },
          error: (err) => console.error('Error al listar puntos de control', err)
        });
      }
    }
  });

  this.muestreoForm.get('id_tipo_instalacion')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((tipoInstalacion) => {
    this.puntosdecontrol = [];
    this.muestreoForm.get('id_punto_control')?.setValue(0, { emitEvent: false });

    const id_provincia = this.muestreoForm.get('id_provincia')?.value;
    if (id_provincia && id_provincia > 0 && tipoInstalacion > 0) {
      const provinciaObj = this.provincias.find(p => p.id_ubigeo === +id_provincia);
      const ubigeo = provinciaObj?.ubigeo;

      if (ubigeo) {
        this.puntocontrolservice.obtenerPuntoControl(ubigeo, tipoInstalacion).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
            //console.log('Puntos de Control recibidas:', data);
            this.puntosdecontrol = data.map((puntosdecontrol : any) => ({
              Id_Punto_Control: puntosdecontrol.id_Punto_Control,
              ubigeo : puntosdecontrol.ubigeo,
              Id_Tipo_Instalacion: puntosdecontrol.id_Tipo_Instalacion,
              codigo : puntosdecontrol.codigo,
              Id_Cliente:  puntosdecontrol.id_Cliente 
            }));
          },
          error: (err) => console.error('Error al listar puntos de control', err)
        });
      }
    }
  });
  this.muestreoForm.get('id_punto_control')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((id_punto_control) => {
    //console.log('Punto de control seleccionado:', id_punto_control);
    
    if (id_punto_control && id_punto_control > 0) {
      // Aquí puedes hacer validaciones o cargar datos relacionados
      const puntoSeleccionado = this.puntosdecontrol.find(
        p => p.Id_Punto_Control === id_punto_control
      );
      //console.log('Punto seleccionado:', puntoSeleccionado);
      
      // Si necesitas actualizar el cliente basado en el punto de control
      if (puntoSeleccionado?.Id_Cliente) {
        this.muestreoForm.patchValue({
          id_cliente: puntoSeleccionado.Id_Cliente
        }, { emitEvent: false });
      }
    }
  });
  this.muestreoForm.get('Id_Embarcacion')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((id_embarcacion) => {
    //console.log('Embarcación seleccionada:', id_embarcacion);
    
    if (id_embarcacion && typeof id_embarcacion === 'number' && id_embarcacion > 0) {
      const embarcacionSeleccionada = this.matriculas.find(
        m => m.id_Embarcacion === id_embarcacion
      );
      //console.log('Embarcación encontrada:', embarcacionSeleccionada);
      
      if (embarcacionSeleccionada) {
        // Actualizar otros campos relacionados
        this.muestreoForm.patchValue({
          cap_bod_m3_arqueo: embarcacionSeleccionada.capBod_M3,
          nombre_ep: embarcacionSeleccionada.embarcacion
        }, { emitEvent: false });
        
        // Buscar y actualizar cliente
        const cliente = this.clientes.find(c =>
          c.razon_social?.trim().toLowerCase() === 
          embarcacionSeleccionada.razon_Social_Armador?.trim().toLowerCase()
        );
        
        if (cliente) {
          this.muestreoForm.patchValue({
            id_cliente: cliente.id_cliente
          }, { emitEvent: false });
        }
      }
    }
  });
    }
   private inicializarDetalles(): void {
  const detalleArray = this.muestreoForm.get('detalle') as FormArray;
  if (detalleArray.length) return;

  for (let i = 0; i < 180; i++) {
    detalleArray.push(
      this.fb.group({
        nro_fila: [i + 1],
        medida: new FormControl<number | null>(null, { updateOn: 'blur' })
      })
    );
  }
}
  onSelectMatricula(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as Embarcaciones;

    this.muestreoForm.patchValue({
      Id_Embarcacion: selected.id_Embarcacion,   
      cap_bod_m3_arqueo: selected.capBod_M3,
      nombre_ep: selected.embarcacion
    });

    const cliente = this.clientes.find(c =>
      c.razon_social?.trim().toLowerCase() === selected.razon_Social_Armador?.trim().toLowerCase()
    );
    this.muestreoForm.patchValue({
      id_cliente: cliente ? cliente.id_cliente : 0
    });
  }
  onSelectIctiometro(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as Ictiometros;   

    this.muestreoForm.patchValue({
      id_ictiometro: selected.id_ictiometro
    });
  }
  onSelectUsuarioPrimario(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as Usuario;

    this.muestreoForm.patchValue(
      { id_fiscalizador_primario: selected.id_usuario },
      { emitEvent: false } // clave para que no dispare el buscarUsuarios otra vez
    );
  }
  onSelectUsuarioSecundario(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as Usuario;

    this.muestreoForm.patchValue(
      { id_fiscalizador_secundario: selected.id_usuario },
      { emitEvent: false } // clave para que no dispare el buscarUsuarios otra vez
    );
  }
  onSelectEquipos(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as Equipos;   

    this.muestreoForm.patchValue({
      id_equipo: selected.id_equipo
    });
  }

  cargarMuestreo(id: number) {
    this.muestreoService.obtenerPorId(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        //console.log('Datos del muestreo a editar:', data);
        const rawEmb =
          (data as any).id_embarcacion ??
          (data as any).Id_Embarcacion ??
          (data as any).id_Embarcacion ??
          (data as any).idEmbarcacion ??
          null;

        const idEmb = typeof rawEmb === 'object' && rawEmb !== null
          ? Number((rawEmb as any).id_Embarcacion ?? (rawEmb as any).Id_Embarcacion)
          : Number(rawEmb);
        const finFecha = ((data as any).fecha_fin_toma) ?? (data.fecha_inicio_toma);
        const finHora  = (data as any).hora_fin_toma ?? data.hora_inicio_toma;
        //console.log('FK embarcacion raw:', rawEmb, '=> idEmb:', idEmb);

        const parseDate = (v: any) => v ? v.split('T')[0] : null;
        const toBool = (v: any) => v === true || v === 1;
        this.muestreoForm.patchValue({
          correlativo: data.correlativo,
          id_region: data.id_region,
          id_provincia: data.id_provincia,
          id_distrito: data.id_distrito,
          id_tipo_instalacion: data.id_tipo_instalacion,
          fecha_registro: parseDate(data.fecha_registro),
          unidad_fiscalizada: data.unidad_fiscalizada,
          id_cliente: data.id_cliente,
          nombre_ep: data.nombre_ep,
          Id_Embarcacion: Number.isFinite(idEmb) ? idEmb : null,
          cap_bod_m3_arqueo: data.cap_bod_m3_arqueo,
          peso_dec_t: data.peso_dec_t,
          peso_registrado_t: data.peso_registrado_t,
          nro_rep_pesaje: data.nro_rep_pesaje,
          placa: data.placa,
          peso_guia_t: data.peso_guia_t,

          tolva: toBool(data.tolva),
          tolva_nro :data.tolva_nro,
          muelle: toBool(data.muelle),
          zona_recepcion: toBool(data.zona_recepcion),
          dpa: toBool(data.dpa),
          terminal_pesquero: toBool(data.terminal_pesquero),
          carretera: toBool(data.carretera),
          garita_peaje: toBool(data.garita_peaje),
          otros: toBool(data.otros),
          otros_descripcion: data.otros_descripcion,

          en_descarga: toBool(data.en_descarga),
          por_cuarteo: toBool(data.por_cuarteo),
          total_pulpo: toBool(data.total_pulpo),
          descarga_acumulada_t: data.descarga_acumulada_t,
          toma_muestra_1: data.toma_muestra_1,
          toma_muestra_2: data.toma_muestra_2,
          toma_muestra_3: data.toma_muestra_3,

          id_especie: data.id_especie,
          peso: data.peso,
          porcentaje: data.porcentaje,
          total: data.total,

          fecha_inicio_toma: parseDate(data.fecha_inicio_toma),
          hora_inicio_toma: data.hora_inicio_toma,
          fecha_fin_toma: parseDate(finFecha),
          hora_fin_toma:finHora,

          media_aritmetica_cm: data.media_aritmetica_cm,
          ejemplares_juveniles_pct: data.ejemplares_juveniles_pct,
          ejemplares_juveniles_nro: data.ejemplares_juveniles_nro,

          id_ictiometro: data.id_ictiometro,
          moda_cm: data.moda_cm,
          moda_nro: data.moda_nro,
          total_ejemplares: data.total_ejemplares,

          id_equipo: data.id_equipo,
          observaciones: data.observaciones,

          id_fiscalizador_primario: data.id_fiscalizador_primario,
          id_fiscalizador_secundario: data.id_fiscalizador_secundario,

          nombre_representante: data.nombre_representante,
          dni_representante: data.dni_representante,
          cargo_representante: data.cargo_representante,
          nombre_testigo: data.nombre_testigo,
          dni_testigo: data.dni_testigo,
          zona_pesca : data.zona_pesca,
          codigo_bitacora : data.codigo_bitacora
        }, { emitEvent: false });
       
        forkJoin({
    provincias: this.ubigeoservice.ListarProvincias(data.id_region),
    distritos: this.ubigeoservice.ListarDistritos(data.id_provincia)
    
  }).pipe(
    takeUntil(this.destroy$),
    switchMap(({ provincias, distritos }) => {
      // Guardar los datos
      this.provincias = provincias;
      this.distritos = distritos;
      //console.log('prov[0].id_ubigeo:', this.provincias?.[0]?.id_ubigeo, 'typeof:', typeof this.provincias?.[0]?.id_ubigeo);
      
      // Establecer valores en el formulario
      this.muestreoForm.get('id_provincia')?.setValue(data.id_provincia, { emitEvent: false });
      this.muestreoForm.get('id_distrito')?.setValue(data.id_distrito, { emitEvent: false });

      // Ahora obtener puntos de control
      const provinciaObj = this.provincias.find(p => p.id_ubigeo === +data.id_provincia);
      const ubigeo = provinciaObj?.ubigeo;
      const tipoInst = Number(data.id_tipo_instalacion);

      if (!ubigeo || !tipoInst) return of([]);

      return this.puntocontrolservice.obtenerPuntoControl(ubigeo, tipoInst);
      
    }),

    
          tap((pcs: any) => {
          this.puntosdecontrol = pcs.map((pc: any) => ({
            Id_Punto_Control: pc.Id_Punto_Control ?? pc.id_Punto_Control ?? pc.id_punto_control,
            ubigeo: pc.ubigeo,
            Id_Tipo_Instalacion: pc.Id_Tipo_Instalacion ?? pc.id_Tipo_Instalacion ?? pc.id_tipo_instalacion,
            codigo: pc.codigo,
            
            Id_Cliente: pc.Id_Cliente ?? pc.id_Cliente  
          }));

          this.muestreoForm.get('id_punto_control')?.setValue(Number(data.id_punto_control), { emitEvent: false });

        })
        ).pipe(takeUntil(this.destroy$)).subscribe();
        if (this.modoVer) {
          this.muestreoForm.disable({ emitEvent: false });
        // this.cdr.detectChanges();          // actualiza el DOM
        }
        

        //console.log('Datos del muestreo a editar:', data);

        this.muestreoForm.get('Id_Embarcacion')?.setValue(
    Number.isFinite(idEmb) ? idEmb : null,
    { emitEvent: true }
    
  );
  if (this.modoVer) {
            this.muestreoForm.disable({emitEvent: false});          
          }

        this.setDetalleDesdeBackend((data as any).detalle ?? []);
        if (this.modoVer) {
        this.muestreoForm.disable({ emitEvent: false });
        //this.cdr.detectChanges();
        }
        //console.log('modoVer', this.modoVer);
        //console.log('id_region', this.muestreoForm.get('id_region')?.value);
        //console.log('id_provincia', this.muestreoForm.get('id_provincia')?.value);
        //console.log('provincias.length', this.provincias.length)
      },
      error: (err) => console.error('Error al cargar el muestreo', err)
    });
  }
  private marcarFinalizadoLocal(id: number): void {
    const key = 'muestreos_finalizados';
    const arr: number[] = JSON.parse(localStorage.getItem(key) || '[]');

    if (!arr.includes(id)) arr.push(id);

    localStorage.setItem(key, JSON.stringify(arr));
  }
private setDetalleDesdeBackend(detalleBackend: any[] = []): void {
  const map = new Map<number, any>();
  detalleBackend.forEach(d => map.set(d.nro_fila, d.medida));

  for (let i = 0; i < this.detalle.length; i++) {
    this.detalle.at(i).get('medida')!.setValue(map.get(i + 1) ?? null, { emitEvent: false });
  }
}
  private fechaLocal(d = new Date()): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private horaLocal(d = new Date()): string {
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${min}`;
  }
  Volver():void{
    this.router.navigate(['/components/table']);
  }

  registrar(): void {
    this.submitted = true;

    if (this.muestreoForm.invalid) {
      this.muestreoForm.markAllAsTouched();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      Swal.fire({
        icon: 'error',
        title: 'Favor de rellenar los datos faltantes',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
        background: '#1E293B',
        color: '#ffff'
      });

      return;
    }

    const ahora = new Date();

    if (this.modoEdicion && this.id_actual) {
      
      this.muestreoForm.patchValue({
        fecha_fin_toma: this.fechaLocal(ahora),
        hora_fin_toma: this.horaLocal(ahora),
      }, { emitEvent: false });
    } else {
      
      this.muestreoForm.patchValue({
        fecha_inicio_toma: this.fechaLocal(ahora),
        hora_inicio_toma: this.horaLocal(ahora),
        fecha_fin_toma: this.fechaLocal(ahora),
        hora_fin_toma: this.horaLocal(ahora),
      }, { emitEvent: false });
    }


    const formValue = this.muestreoForm.getRawValue();


    if (typeof formValue.Id_Embarcacion === 'object' && formValue.Id_Embarcacion !== null) {
      formValue.Id_Embarcacion = formValue.Id_Embarcacion.id_Embarcacion;
    }


    const detallesValidos = (formValue.detalle ?? []).filter((d: any) =>
      d.medida !== null && d.medida !== undefined && d.medida !== ''
    );


    const muestreo: MuestreoCompleto = {
      ...formValue,
      detalle: detallesValidos
    };

    // PUT o POST
    if (this.modoEdicion && this.id_actual) {
      (muestreo as any).id_parte_muestreo = this.id_actual;

      this.muestreoService.actualizar(this.id_actual, muestreo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            console.log('Actualización exitosa', resp);
            Swal.fire({
              icon: 'success',
              title: 'Muestreo actualizado correctamente',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 10000,
              background: '#1E293B',
              color: '#ffff'
            });
            this.router.navigate(['/components/table']);
          },
          error: (err) => {
            console.error('Error al actualizar', err);
            Swal.fire({
              icon: 'warning',
              title: 'Ocurrió un error en el actualizado',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2000,
              background: '#1E293B',
              color: '#ffff'
            });
          }
        });

    } else {
      this.muestreoService.registrar(muestreo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            console.log('Registro exitoso', resp);
            Swal.fire({
              icon: 'success',
              title: 'Muestreo registrado correctamente',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 10000,
              background: '#1E293B',
              color: '#ffff'
            });
            this.router.navigate(['/components/table']);
          },
          error: (err) => {
            console.error('Error al registrar', err);
            Swal.fire({
              icon: 'error',
              title: 'Ocurrió un error en el registrado',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 5000,
              background: '#1E293B',
              color: '#ffff'
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  finalizar(): void {
    if (!this.id_actual) return;

    this.pdfservice.generarPdf(this.id_actual).pipe(
      map((resp: HttpResponse<Blob>) => {
        const body = resp.body;
        if (!body) throw new Error('El PDF llegó vacío');

        const contentType = resp.headers.get('content-type') ?? 'application/pdf';
        return new Blob([body], { type: contentType });
      })
    ).subscribe({
      next: (pdfBlob: Blob) => {
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const ref = this.dialog.open(PdfPreviewDialogComponent, {
          width: '80vw',
          maxWidth: '900px',
          data: {
            blob: pdfBlob,
            url: pdfUrl,          
            fileName: `muestreo_${this.id_actual}.pdf` 
          } as any
        });

        ref.afterClosed().pipe(take(1)).subscribe(result => {

          URL.revokeObjectURL(pdfUrl);

          if (result?.downloaded) {
            Swal.fire({
              icon: 'success',
              title: 'Muestreo finalizado',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 8000,
              background: '#1E293B',
              color: '#fff'
            });

            this.marcarFinalizadoLocal(this.id_actual!);
            this.router.navigate(['/components/table'], { state: { finalizedId: this.id_actual } });
          }
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'No se pudo generar el PDF' });
      }
    });
  }
  }


