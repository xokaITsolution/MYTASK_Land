import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TitleDeedRegistrationService {
  private DeedURL = environment.rootPath + "Deed_Registration"; // URL to web api
  private DeedURLApi =
    environment.rootPathApi + "Deed_Registration/procDeed_Registration";
  constructor(private http: HttpClient) {}

  getAll(propertyid) {
    return this.http.get<any[]>(
      this.DeedURL +
        "?" +
        "sortOrder=test&currentFilter=" +
        propertyid +
        "&searchString&pageIndex&pageSize"
    );
  }

  getproprtyby(propertyid) {
    return this.http.get<any[]>(this.DeedURLApi + "/" + propertyid);
  }
  getAllby() {
    return this.http.get<any[]>(this.DeedURLApi);
  }

  save(data) {
    return this.http.put<any[]>(this.DeedURLApi, data);
  }

  Add(data) {
    return this.http.post<any[]>(this.DeedURLApi, data);
  }

  Delete(data) {
    const header: HttpHeaders = new HttpHeaders()
      .append("Content-Type", "application/json; charset=UTF-8")
      .append(
        "Authorization",
        "Bearer " + sessionStorage.getItem("accessToken")
      );
    const httpOptions = {
      headers: header,
      body: data,
    };
    return this.http.delete<any[]>(this.DeedURL, httpOptions);
  }
}
