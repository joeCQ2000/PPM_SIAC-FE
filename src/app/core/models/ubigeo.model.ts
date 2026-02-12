export interface Ubigeo{
    id_ubigeo : number;
    id_padre: number;
    codigo : string;
    ubigeo : string ;
    nivel : number;
    nombre : string;
    id_usuario_creacion : number;
    fecha_creacion : Date;
    id_usuario_modificacion?: number;
    fecha_modificacion? : Date;
    estado : boolean;

}