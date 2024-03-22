// database-monitoring.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class DatabaseMonitoringService {
  constructor(private http: HttpClient) {}
  private dbstatus = environment.rootPath + "BPEL/";

  private databaseURL =
    environment.rootPathApi +
    "Network/Network/checkDatabaseStatus?databaseName=";
  checkDatabaseStatus(databaseUrl: string): Observable<boolean> {
    let dataurl = this.databaseURL + databaseUrl;
    return this.http.get(dataurl, { observe: "response" }).pipe(
      map((response: HttpResponse<any>) => response.status === 200),
      catchError((error) => of(false))
    );
  }

  getdbstatus(orgid) {
    return this.http.get(this.dbstatus + "GetDBServerStatus?orgid=" + orgid);
  }
}
