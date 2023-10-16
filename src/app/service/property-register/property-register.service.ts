import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PropertyRegisterService {
  public PropertyManagmentUrl = environment.rootPath + "Property_Registration"; // URL to web api
  public PropertyManagmentUrlapi =
    environment.rootPathApi + "Property_Registration/procProperty_Registration"; // URL to web api

  constructor(public http: HttpClient) {}

  save(data) {
    return this.http.put<any[]>(this.PropertyManagmentUrlapi, data);
  }

  Add(data) {
    return this.http.post<any[]>(this.PropertyManagmentUrlapi, data);
  }
}
