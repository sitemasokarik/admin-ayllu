import { QueryParamsApi } from "../interfaces/query-params-api.interface";

export class RequestOption {
  url: string;
  resource: string;
  request: any;
  type: ResponseType = 'JSON';
  json: boolean = true;
  method: MethodHttp;
  excludeLoader: string = '0';
  pathVariables: (string | number | boolean)[] = [];
  queryParams: QueryParamsApi[] = [];

  constructor(init?: Partial<RequestOption>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

type MethodHttp = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type ResponseType = 'JSON' | 'BLOB';
