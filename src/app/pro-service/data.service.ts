import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient) {}
  url = "";

  // postdata(data: any) {
  //   return this.http.post(this.url, data);
  // }

  getbasinIdAndsiteType() {
    return this.http.get(this.url);
  }
  getSiteID(id: any) {
    return this.http.get(this.url + "id?Site_ID=" + id);
  }
  getStationName(name: any) {
    return this.http.get(this.url + "id?Station_Name=" + name);
  }
  getStationCode(code: any) {
    return this.http.get(this.url + "id?Station_Code=" + code);
  }
  getDataOwner(owner: any) {
    return this.http.get(this.url + "id?Data_Owner=" + owner);
  }
  getBasinID(owner: any) {
    return this.http.get(this.url + "id?Basin_ID=" + owner);
  }
  getSiteType(owner: any) {
    return this.http.get(this.url + "id?Site_Type=" + owner);
  }
}
