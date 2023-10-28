import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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

    return this.http.get(url, { headers });
  }
  fetchStyleFile(href: any) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    return this.http.get(href, { headers });
  }
  fetchGroupLayers(subcityGroupName): Observable<any> {
    const url = `${this.geourl}/rest/workspaces/${subcityGroupName}/layergroups.json`;
    // Set the required headers
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    return this.http.get(url, { headers });
  }
  getLayersFromGeoserver(url: any): Observable<any> {
    //const basurlemp: string = 'http://192.168.0.104:8080/geoserver/rest/workspaces/Arada_AddisLand/layerGroups.json';
    //const url = 'http://192.168.0.104:8080/geoserver/rest/layers/child_group_layer.json';

    // const groupUrl = `http://192.168.0.104:8080/geoserver/rest/layers/layer/Lines.json`;
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));
    return this.http.get<any>(url, { headers });
  }
}
