export interface PaginadoDTO<T>{
    total: number;
    page : number;
    page_size:  number;
    items: T[];
}