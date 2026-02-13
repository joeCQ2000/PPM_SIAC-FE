export interface egreso{
    id_egreso: number,
    id_proyecto: number,
    tipo_documento: string,
    total_documento : number,
    linea: string,
    valor_venta: number,
    impuesto: number,
    afect_impuesto: boolean,
    fecha_emision: Date,
    fecha_vencimiento: Date,
    estado: boolean,
}