import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PloatManagmentService {
  // private PlotManagementUrlsave = environment.rootPath + 'Plot_Registration';  // URL to web api
  // private PlotManagementUrlAdd = environment.rootPath + 'Plot_Registration';  // URL to web api
  private PlotManagementUrlsave =
    environment.rootPath + "Plot_Registration/procPlot_Registration"; // URL to web api
  private PlotManagementUrlAdd =
    environment.rootPathApi + "Plot_Registration/procPlot_Registration"; // URL to web api

  constructor(private http: HttpClient) {}

  save(data) {
    return this.http.put<any[]>(this.PlotManagementUrlsave, data);
  }

  Add(data) {
    return this.http.post<any[]>(this.PlotManagementUrlAdd, data);
  }
  Delete(data) {
    return this.http.delete<any[]>(this.PlotManagementUrlAdd + "/" + data);
  }
}
