export interface PaginadoDTO<T>{
    Total: number;
    Page : number;
    PageSize:  number;
    items: T[];
}