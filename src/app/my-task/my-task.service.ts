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
  private getSendPaymentReminder =
    environment.rootPathApi + "finance/SendPaymentReminder";
  private IsLockedBy_OtherUserUrl =
    environment.rootPath + "BPEL/IsLockedBy_OtherUser";
  private GetSuperviedUsersUrl =
    environment.rootPath + "BPEL/Get_SuperviedUsers"; // URL to web api
  private AssignToUserUrl = environment.rootPath + "BPEL/AssigEmpToDo"; // URL to web api
  private MytasksUrls = environment.rootPathApi + "todolist/todolist";
  constructor(private http: HttpClient) {}

  getcompressedtodolist(orgid, lanid) {
    return this.http.get(
      this.MytasksUrls +
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
        "&orgid=00000000-0000-0000-0000-000000000000&lanid=2C2EBBEA-3361-E111-95D5-00E04C05559B"
    );
  }

  AssignToUser(ApplicationNo, EmpID, todoid, username, status, taskid) {
    return this.http.post(
      this.AssignToUserUrl +
        "?ApplicationNo=" +
        ApplicationNo +
        "&EmpID=" +
        EmpID +
        "&todoid=" +
        todoid +
        "&userName=" +
        username +
        "&status=" +
        status +
        "&taskid=" +
        taskid,
      null
    );
  }
  GetgetSendPaymentReminder(application) {
    return this.http.get(
      this.getSendPaymentReminder + "?applicationNumber=" + application
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
        "&orgid=00000000-0000-0000-0000-000000000000&lanid=2C2EBBEA-3361-E111-95D5-00E04C05559B"
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
