import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOption } from '../class/request-option';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestService<T> {
  private _http = inject(HttpClient);

  constructor() {}

  public http(request: RequestOption) {
    return this._callHttpClient(request);
  }

  private _callHttpClient(
    request: RequestOption
  ): Observable<ResponseModel<T>> {
    let rpta: any;

    switch (request.method) {
      case 'GET':
        if (request.type === 'BLOB') {
          rpta = this._http.get<Blob>(request.url, {
            params: this._getHttpParams(request.queryParams),
            responseType: 'blob' as 'json',
          });
        }
        else {
          rpta = this._http.get<ResponseModel<T>>(request.url, {
            params: this._getHttpParams(request.queryParams),
          });
        }
        break;
      case 'DELETE':
        rpta = this._http.delete<ResponseModel<T>>(request.url, {
          params: this._getHttpParams(request.queryParams),
        });
        break;
      case 'PUT':
        rpta = this._http.put<ResponseModel<T>>(request.url, request.request);
        break;
      case 'POST':
        rpta = this._http.post<ResponseModel<T>>(request.url, request.request);
        break;
    }
    return rpta;
  }

  private _getHttpParams(
    queryParams: { key: string; value: string | number }[]
  ): HttpParams {
    let paramsHttp: HttpParams = new HttpParams();
    queryParams.forEach((query) => {
      paramsHttp = paramsHttp.append(query.key, query.value);
    });

    return paramsHttp;
  }

  callHttpParameters(request: RequestOption): Observable<ResponseModel<T>> {
    let url: string = request.url;
    const pathsJoin = request?.pathVariables.join('/');
    if (pathsJoin) url += `/${pathsJoin}`;

    request.url = url;

    return this.http(request);
  }
}
