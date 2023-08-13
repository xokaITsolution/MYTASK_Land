import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaseOwnerShipService {
  private learseownerURLsave = environment.rootPath + 'Lease_and_Owned_Land/Put';  // URL to web api
  private learseownerURLAdd = environment.rootPath + 'Lease_and_Owned_Land/Post';  // URL to web api
  private learseownerURL = environment.rootPath + 'Lease_and_Owned_Land';  // URL to web api
  private learseownerURLDelete =
    environment.rootPath + "Lease_and_Owned_Land/Delete"; // URL to web api

  constructor(private http: HttpClient) {
  }

  Delete(data) {
    return this.http.delete<any[]>(this.learseownerURLDelete + '/' + data);
  }

  getAll(plotID) {
    return (this.http.get<any[]>(this.learseownerURL + '?' + 'sortOrder=test&currentFilter=' + plotID + '&searchString&pageIndex&pageSize'));
  }


  save(data) {
    return (this.http.put<any[]>(this.learseownerURLsave, data));
  }

  Add(data) {
    return (this.http.post<any[]>(this.learseownerURLAdd, data));
  }
}
