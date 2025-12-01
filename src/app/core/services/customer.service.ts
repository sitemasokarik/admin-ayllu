import { Injectable } from '@angular/core';
import { HttpGenericService } from '../../shared/services/http-generic.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService<T> extends HttpGenericService<T> {
  constructor() {
    super();
    const base = environment.apiUrl ?? '';
    this._url = `${base}/Cliente`;
  }
}
