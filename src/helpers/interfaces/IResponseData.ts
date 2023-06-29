export interface IResponseData {
  meta: IMeta;
  records: any[];
}

interface IMeta {
  server: string;
  offset: number;
  limit: number;
  recordCount: number;
  totalRecords: number;
}
