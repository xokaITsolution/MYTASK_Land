import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class MyTaskService {
  private MytasksUrl = environment.rootPath + "BPEL/GetlistofTodo"; // URL to web api
  private SupervisertasksUrl = environment.rootPath + "BPEL/GetlistofTodo"; // URL to web api

  private IsLockedBy_OtherUserUrl =
    environment.rootPath + "BPEL/IsLockedBy_OtherUser";

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
  getMytaskss() {
    return this.http.get(
      this.MytasksUrl +
        "?username=" +
        environment.username +
        "&orgid=00000000-0000-0000-0000-000000000000&lanid=2C2EBBEA-3361-E111-95D5-00E04C05559B&userroll" +
        "=00000000-0000-0000-0000-000000000000"
    );
  }
  getSupervisertasks(orgid) {
    return this.http.get(
      this.SupervisertasksUrl +
        "?username=" +
        environment.username +
        "&orgid=" +
        orgid +
        "&lanid=10D04E8B-3361-E111-95D5-00E04C05559B"
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
