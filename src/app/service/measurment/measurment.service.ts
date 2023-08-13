import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MeasurmentService {
  private MeasurementURL = environment.rootPath + 'Property_Measurement';  // URL to web api

  constructor(private http: HttpClient) { }



  getAll(propertyid) {
    return (this.http.get<any[]>(this.MeasurementURL + '?' + 'sortOrder=test&currentFilter=' +
      propertyid + '&searchString&pageIndex&pageSize'));
  }

  save(data) {
    return (this.http.put(this.MeasurementURL, data));
  }

  Add(data) {
    return (this.http.post(this.MeasurementURL, data));
  }

  Delete(data) {
    //     let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json; charset=UTF-8')
      .append('Authorization', 'Bearer ' + sessionStorage.getItem('accessToken'));
    const httpOptions = {
      headers: header,
      body: data
    };
    return (this.http.delete(this.MeasurementURL, httpOptions));
  }

}
