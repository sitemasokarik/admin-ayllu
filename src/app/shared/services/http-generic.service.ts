import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestService } from './http-request.service';
import { RequestOption } from '../class/request-option';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class HttpGenericService<T> {
  protected _httpRequest = inject(HttpRequestService);
  protected _url = '';

  constructor() {}

  get(request: RequestOption): Observable<ResponseModel<T> | any> {
    request.url = `${request.url ?? this._url}/${
      request.resource ?? 'getall'
    }`;
    request.method = 'GET';
    return this._httpRequest.callHttpParameters(request);
  }

  getById(request: RequestOption): Observable<ResponseModel<T>> {
    request.url = `${request.url ?? this._url}/${
      request.resource ?? 'getbyid'
    }`;
    request.method = 'GET';
    return this._httpRequest.callHttpParameters(request);
  }

  create(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = 'POST';
    request.url = `${this._url}/${request.resource ?? 'create'}`;
    return this._httpRequest.http(request);
  }

  update(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = 'PUT';
    request.url = `${this._url}/${request.resource ?? 'update'}`;
    return this._httpRequest.http(request);
  }

  patch(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = 'PATCH';
    request.url = `${this._url}/${request.resource ?? 'patch'}`;
    return this._httpRequest.http(request);
  }

  delete(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = 'DELETE';
    request.url = `${this._url}/${request.resource ?? 'delete'}`;
    return this._httpRequest.callHttpParameters(request);
  }

  post(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = 'POST';
    request.url = `${this._url}/${request.resource}`;
    return this._httpRequest.callHttpParameters(request);
  }
}
