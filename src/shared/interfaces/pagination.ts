export interface Pagination<Type> {
    data: Type[],
    total: number,
    currentPage: number,
    nextPage?: number,
    prevPage?: number,
    lastPage?: number,
  }
  