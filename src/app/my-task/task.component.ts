import { Component, OnInit } from "@angular/core";
import { ServiceService } from "../service/service.service";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styles: [],
})
export class TaskComponent implements OnInit {
  tab = "";
  showcustomer: boolean = true;

  constructor(public serviceService: ServiceService) {}

  ngOnInit() {
    this.serviceService.getUserRole().subscribe((response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      response.forEach((element) => {
        if (element.RoleId == "f8dda85e-f967-4ac5-bf79-4d989ecfb863") {
          this.showcustomer = false;
        }
      });
    });
  }
}
