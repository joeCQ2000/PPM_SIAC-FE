import { egreso } from "src/app/core/models/egreso.model";
import { ingreso } from "src/app/core/models/ingreso.model";

export interface BuscarPorIdProyecto{
id: number,
per: string,
nro_Contrato: string,
centro_Costo:string,
responsable: string
descripcion : string,
fecha_Inicio: Date,
estado: boolean,
servicio: string,
idCliente : number,
nombreCliente: string,
ingresos: ingreso[];
  egresos: egreso[];
}
export interface Ingreso {
  id_ingreso: number;
  id_proyecto: number;
  tipo_documento: string;
  moneda: string;
  tasa_cambio: number;
  observacion: string;
  linea: string;
  valor_venta: number;
  total_documento: number;
  impuesto: number;
  afect_impuestos: boolean;
  fecha_emision: Date | string;
  fecha_vencimiento: Date | string;
  estado: boolean;
}

export interface Egreso {
  id_egreso: number;
  id_proyecto: number;
  tipo_documento: string;
  valor_venta: number;
  tasa_cambio: number;
  fecha_emision: Date;
  fecha_vencimiento: Date;
  linea: string;
  recurso?: string;
  numero?: string;
  moneda?: string;
  estado: boolean;
}