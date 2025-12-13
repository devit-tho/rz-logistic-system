export interface PagiationRequest {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginationResponse<T> {
  datas: T[];
  meta: PaginateMeta;
}

export interface PaginateMeta {
  page: number;
  totalPages: number;
  search?: string;
  totalResources: number;
  // tableCount: number;
}
