import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private subcityGroupName = environment.SubcityName;
  private geourl = environment.geoser;

  constructor(private http: HttpClient) {}

  fetchStyleLayers(layername) {
    // http://<geoserver-url>/rest/layers/${layerName}.json
    const url = `${this.geourl}/rest/layers/${layername}.json`;
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    //return this.http.get(url, { headers });
    return this.http.get(url, { headers }).pipe(catchError(this.handleError));
  }
  fetchStyleFile(href: any) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    //return this.http.get(href, { headers });
    return this.http.get(href, { headers });
  }
  fetchGroupLayers(subcityGroupName): Observable<any> {
    const url = `${this.geourl}/rest/workspaces/${subcityGroupName}/layergroups.json`;
    // Set the required headers
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    // return this.http.get(url, { headers });
    return this.http.get(url, { headers }).pipe(catchError(this.handleError));
  }
  handleError(error: any) {
    // You can customize the error handling logic here.
    // For example, log the error for debugging purposes.
    console.error("HTTP Error:", error);

    // Rethrow the error so it can be caught by the component.
    return throwError(error);
  }
  getLayersFromGeoserver(url: any): Observable<any> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));
    //return this.http.get<any>(url, { headers });
    return this.http.get(url, { headers }).pipe(catchError(this.handleError));
  }
}
