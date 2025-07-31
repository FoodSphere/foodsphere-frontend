import { ESort } from "./enum";

export interface IPagination {
  page: number;
  limit: number;
  totalItems?: number;
  totalPages?: number;
}

export interface IBaseResponse {
  message: {
    th: string;
    en: string;
  };
  statusCode: number;
}

export interface IBaseResponseData<T> extends IBaseResponse {
  data: T;
}
