import * as os from 'os';
import { IResponseData } from './interfaces/IResponseData';

export default function success(data: any, options?: any): IResponseData {
  options = options || {};
  options.query = options.query || {};
  const responseBody: IResponseData = {
    meta: undefined,
    records: [],
  };
  data = data instanceof Array ? data : [data];
  data = data.map((each) => (each.toJSON ? each.toJSON() : each));
  responseBody.meta = {
    server: os.hostname(),
    offset: options.offset || options.query.offset || 0,
    limit: options.limit || options.query.limit || 50,
    recordCount: data.length,
    totalRecords: options.totalRecords || undefined,
  };
  responseBody.records = data;
  return responseBody;
}
