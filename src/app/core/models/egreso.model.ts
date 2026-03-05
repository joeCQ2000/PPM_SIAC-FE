export interface egreso{
    id_egreso: number,
    id_proyecto: number,
    tipo_documento: string,
    linea: string,
    valor_venta: number,
    fecha_emision: Date,
    fecha_vencimiento: Date,
    estado: boolean,
    numero: string,
    recurso: string,
    moneda: string,
    observacion:string,
}