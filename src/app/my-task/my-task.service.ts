import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class MyTaskService {
  private MytasksUrl = environment.rootPath + "BPEL/GetlistofTodo"; // URL to web api
  private MytasksUrlsuper = environment.rootPath + "BPEL/GetTodoListToSup"; // URL to web api
  private SupervisertasksUrl = environment.rootPath + "BPEL/GetlistofTodo"; // URL to web api
  private ViewAspNetUsersWorkInfoDetail =
    environment.rootPathApi + "view/View_postit_note_user";
  private IsLockedBy_OtherUserUrl =
    environment.rootPath + "BPEL/IsLockedBy_OtherUser";
  private GetSuperviedUsersUrl =
    environment.rootPath + "BPEL/Get_SuperviedUsers"; // URL to web api
  private AssignToUserUrl = environment.rootPath + "BPEL/reOpen"; // URL to web api

  constructor(private http: HttpClient) {}

  getMytasks(orgid, lanid) {
    return this.http.get(
      this.MytasksUrl +
        "?username=" +
        environment.username +
        "&orgid=" +
        orgid +
        "&lanid=" +
        lanid +
        "&userroll" +
        "=00000000-0000-0000-0000-000000000000"
    );
  }
  getMytaskss(orgid, Lang_code) {
    return this.http.get(
      this.MytasksUrl +
        "?username=" +
        environment.username +
        "&orgid=" +
        orgid +
        "&lanid=" +
        Lang_code +
        "&userroll" +
        "=00000000-0000-0000-0000-000000000000"
    );
  }
  getViewAspNetUsersWorkInfoDetail(data) {
    // User_ID = this.removeSlash(User_ID);
    return this.http.get<any>(
      this.ViewAspNetUsersWorkInfoDetail +
        "/application_number?application_number=" +
        data
    );
  }
  getSupervisertasks() {
    return this.http.get(
      this.SupervisertasksUrl +
        "?username=" +
        environment.username +
        "&orgid=60b3b81b-b839-4dc6-a46b-026d470f2dae&lanid=2C2EBBEA-3361-E111-95D5-00E04C05559B"
    );
  }

  AssignToUser(ApplicationNo, EmpID, todoid, username, status) {
    return this.http.post(
      this.AssignToUserUrl +
        "?ApplicationNo=" +
        ApplicationNo +
        "&eid=" +
        EmpID +
        "&todoid=" +
        todoid +
        "&userName=" +
        username +
        "&status=" +
        status,
      null
    );
  }
  GetSuperviedUsers() {
    return this.http.get(
      this.GetSuperviedUsersUrl + "?username=" + environment.username
    );
  }

  getMytasksbyusername() {
    return this.http.get(
      this.MytasksUrlsuper +
        "?username=" +
        environment.username +
        "&orgid=00000000-0000-0000-0000-000000000000&lanid=2C2EBBEA-3361-E111-95D5-00E04C05559B&userroll" +
        "=00000000-0000-0000-0000-000000000000"
    );
  }
  IsLockedBy_OtherUser(todoid) {
    return this.http.get(
      this.IsLockedBy_OtherUserUrl +
        "?todoid=" +
        todoid +
        "&Username=" +
        environment.username
    );
  }
}
