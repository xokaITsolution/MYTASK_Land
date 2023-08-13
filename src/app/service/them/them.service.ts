import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemService {
  private ThemURL = environment.rootPath + 'Them_Certificate_Version';  // URL to web api

  constructor(private http: HttpClient) {
  }


  getAll(certefcatversionID) {
    return (this.http.get<any[]>(this.ThemURL + '?' + 'sortOrder=test&currentFilter=' + certefcatversionID + '&searchString&pageIndex&pageSize'));
  }

  save(data) {
    return (this.http.put<any[]>(this.ThemURL, data));
  }

  Add(data) {
    return (this.http.post<any[]>(this.ThemURL, data));
  }
}
