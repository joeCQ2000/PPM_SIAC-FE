import { NumberSymbol } from "@angular/common";

export interface ingreso{
    id_ingreso: number,
    id_proyecto: number,
    tipo_documento: string,
    moneda: string,
    tasa_cambio : string,
    total_documento : number,
    observacion: string,
    valor_venta: number,
    impuesto: number,
    afect_impuesto: boolean,
    fecha_emision: Date,
    fecha_vencimiento: Date,
    estado: boolean,
}