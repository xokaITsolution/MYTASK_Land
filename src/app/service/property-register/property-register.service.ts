import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyRegisterService {
  public PropertyManagmentUrl = environment.rootPath + 'Property_Registration';  // URL to web api

  constructor(public http: HttpClient) { }


  save(data) {
    return (this.http.put<any[]>(this.PropertyManagmentUrl, data));
  }

  Add(data) {
    return (this.http.post<any[]>(this.PropertyManagmentUrl, data));
  }
}
