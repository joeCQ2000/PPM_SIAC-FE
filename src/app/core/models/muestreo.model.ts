
    export interface MuestreoCompleto {
    id_parte_muestreo: number;

    correlativo?: string;
    id_region: number;
    id_provincia: number;
    id_distrito : number;
    id_punto_control : number;
    id_tipo_instalacion : number,
    fecha_registro: Date;

    unidad_fiscalizada: string;
    id_cliente: number;
    nombre_ep?: string;
    Id_Embarcacion: number;
    cap_bod_m3_arqueo?: number;
    peso_dec_t?: number;
    peso_registrado_t?: number;
    nro_rep_pesaje?: string;
    placa?: string;
    peso_guia_t?: number;

    tolva: boolean;
    tolva_nro?: number;
    muelle: boolean;
    zona_recepcion: boolean;
    dpa: boolean;
    terminal_pesquero: boolean;
    carretera: boolean;
    garita_peaje: boolean;
    otros: boolean;
    otros_descripcion?: string;

    en_descarga: boolean;
    por_cuarteo: boolean;
    total_pulpo: boolean;
    descarga_acumulada_t?: string;
    toma_muestra_1?: number;
    toma_muestra_2?: number;
    toma_muestra_3?: number;

    id_especie: number;
    peso?: number;
    porcentaje?: number;
    total?: number;

    fecha_inicio_toma?: Date;
    hora_inicio_toma?: string;   
    fecha_fin_toma?: Date;
    hora_fin_toma?: string;

    media_aritmetica_cm?: number;
    moda_cm?: number;
    moda_nro?: number;

    total_ejemplares?: number;
    ejemplares_juveniles_pct?: number;
    ejemplares_juveniles_nro?: number;

    id_ictiometro: number;
    id_equipo: number;
    zona_pesca?: string;
    codigo_bitacora?: string;
    observaciones?: string;

    id_fiscalizador_primario: number;
    id_fiscalizador_secundario?: number;
    nombre_representante?: string;
    dni_representante?: string;
    cargo_representante?: string;
    nombre_testigo?: string;
    dni_testigo?: string;
razon_social?: string;
    detalle: ParteMuestreoDetalle[];
    }

    export interface ParteMuestreoDetalle {
    nro_fila: number;
    medida: number;
    }