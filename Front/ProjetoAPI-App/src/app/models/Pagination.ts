export class Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;

}

export class PaginatedResul<T>{
    result: T;
    pagination: Pagination;
}
    
