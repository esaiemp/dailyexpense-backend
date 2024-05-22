import { Pagination } from "../interfaces/pagination";

export const PaginateResponse =<Type>(data: any, limit:number,page?: number): Pagination<Type> =>{
    const {results, total}=data;
    const lastPage=Math.ceil(total/limit);
    const nextPage= page ? (page+1 >lastPage ? null : page+1) : null;
    const prevPage= page ? (page-1 < 1 ? null :page-1) : null;
    return {
      data: [...results],
      total,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    };
};
