import { HttpExceptionResponse } from "../exceptions/http-exception-response.interface";

export interface CustomHttpExceptionResponse extends HttpExceptionResponse{
    path: string;
    method: string;
    timeStamp: Date;
}