import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DeptSuspensionRecordService {
  private DeptSuspensionURL = environment.rootPath + "Debt_Suspension_Record"; // URL to web api
  private DeptSuspensionURLapi =
    environment.rootPathApi +
    "Debt_Suspension_Record/procDebt_Suspension_Record"; // URL to web api
    private DeptSuspensionURLapi1 =
    environment.rootPathApi +
    "Debt_Suspension_Record/procDebt_Suspension_Record/Title_Deed_No/"; // URL to web api
   
  constructor(private http: HttpClient) {}

  getAll(certefcatversionID) {
    return this.http.get<any[]>(
      this.DeptSuspensionURL +
        "?" +
        "sortOrder=test&currentFilter=" +
        certefcatversionID +
        "&searchString&pageIndex&pageSize"
    );
  }

  save(data) {
    return this.http.put<any[]>(this.DeptSuspensionURL, data);
  }

  Add(data) {
    return this.http.post<any[]>(this.DeptSuspensionURL, data);
  }
  saveapi(data) {
    return this.http.put<any[]>(this.DeptSuspensionURLapi, data);
  }

  Addapi(data) {
    return this.http.post<any[]>(this.DeptSuspensionURLapi, data);
  }
  getAllapi(data) {
    return this.http.get<any[]>(this.DeptSuspensionURLapi + "/" + data);
  }
  getAllapi1(data,titledeed) {
    return this.http.get<any[]>(this.DeptSuspensionURLapi1 + titledeed + "?ID="+ data);
  }
}
