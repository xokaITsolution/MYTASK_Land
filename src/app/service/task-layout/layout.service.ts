import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) {
  }

  getFormData(formcode, taskLevel): Observable<FormData> {
    if (!environment.production) {
      return this.http.get<any>('http://land.xokait.com.et/DB/' + formcode + '.json');
    }
    else {
      if(taskLevel != 1){
        return this.http.get<any>(environment.formPath + formcode + '.json');
      }
      else{
        return this.http.get<any>(environment.formPath + formcode + '.json');
      }
    }
  }


}

