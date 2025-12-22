export class ProductParams {
  sort?: string;
  pageIndex: number = 0;     // default 0
  pageSize: number = 10;     // default 4
  count?: number;
  search?: string;
}