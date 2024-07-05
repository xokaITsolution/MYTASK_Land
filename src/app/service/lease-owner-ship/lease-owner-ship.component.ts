import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { LeaseOwnerShipService } from "./lease-owner-ship.service";
import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ConfirmationService, Message } from "primeng/api";
import { Guid } from "guid-typescript";
import { PlotComponent } from "../plot/plot.component";
import { Regions } from "../plot-managment/regions";
import { ServiceService } from "../service.service";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Params } from "@angular/router";
@Component({
  selector: "app-lease-owner-ship",
  templateUrl: "./lease-owner-ship.component.html",
  styleUrls: ["./lease-owner-ship.component.css"],
})
export class LeaseOwnerShipComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Output() openGIsFreehold = new EventEmitter();
  @Output() hideLeaseForm: EventEmitter<void> = new EventEmitter<void>();
  tasks;
  leaseForm = false;
  addnew = true;
  isnew = false;
  @Input() SelectedPlot;
  @Input() disable;
  @Input() todoid;
  @Input() applicationo;
  @Input() LicenceData;
  @Input() plotId;
  public leaseOwnerShip: LeaseOwnerShip;
  Saved = false;
  isleaseForm: boolean = false;
  zoneOptions = [];
  selectedRegion;
  woredas = [];
  customerdata: any;
  language: string;
  Customer_NAME: string;
  islease: boolean = false;
  isfreehole: boolean = false;
  msgs: any;
  isconfirmupdate: boolean;
  isconfirmsave: boolean;
  totalsizeoflease: number;
  totalsizeofleaseeach: number;
  iscustomerdata: boolean;
  iislease: boolean;
  todoidcurrent: any;
  iscanEdite: boolean;
  Lease_Type_Lookup: any;
  plotIdselected: any;
  iseditablesize: boolean;
  multipleplotcanbeadd: boolean = true;
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private leaseOwnerShipService: LeaseOwnerShipService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService,
    public serviceService: ServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.serviceService.leaseOwnerShip = new LeaseOwnerShip();
    this.serviceService.leaseOwnerShip.id = Guid.create().toString();
  }
  highlighted;
  ngOnChanges() {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log("leaseappppppp", params.todoID);
      this.todoidcurrent = params.todoID;
    });
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    console.log("haha lease", this.SelectedPlot);
    if (this.SelectedPlot) {
      this.getleaseOwnerShip(this.SelectedPlot.plot_ID);
      this.serviceService.getCookies();
      if (this.addnew) {
        this.serviceService.leaseOwnerShip.plot_ID = this.SelectedPlot.plot_ID;
        console.log("lease select", this.SelectedPlot);
        console.log(
          "lease plot id",
          this.serviceService.leaseOwnerShip.plot_ID,
          this.serviceService.polygonAreaname
        );

        this.serviceService.leaseOwnerShip.sdP_ID = this.SelectedPlot.sdP_ID;
        // this.serviceService.leaseOwnerShip.Lease_Hold_M2 = parseInt(
        //   localStorage.getItem("PolygonAreaname")
        // );

        // this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
        // if( this.serviceService.leaseOwnerShip.SDP_ID!=null || this.serviceService.leaseOwnerShip.SDP_ID!=undefined ){
        //   this.addLease()
        // }
      }
      // if()
    }

    this.leaseForm = false;
    //this.serviceService.leaseOwnerShip = this.SelectedPlot;
    this.getLease_Type_Lookup();
  }
  getLease_Type_Lookup() {
    this.serviceService.getLease_Type_Lookup().subscribe(
      (Lease_Type_Lookup) => {
        this.Lease_Type_Lookup = Lease_Type_Lookup;
        this.Lease_Type_Lookup = Object.assign([], this.Lease_Type_Lookup.list);
        console.log("Lease_Type_Lookup", Lease_Type_Lookup);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  ngOnInit() {
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    this.serviceService.leaseOwnerShip.sdP_ID =
      this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
    // if( this.serviceService.leaseOwnerShip.SDP_ID!=null || this.serviceService.leaseOwnerShip.SDP_ID!=undefined ){
    //   this.addLease()
    // }
  }
  onOptionsSelected(value) {
    console.log(value);

    if (value == 2) {
      this.openGIsFreehold.emit();

      this.serviceService.isfreeholdselected = true;
      this.iislease = true;
      this.islease = true;
      this.isfreehole = true;
      // Check if the value retrieved from localStorage is not null for Free_Hold_M2
      if (
        this.serviceService.leaseOwnerShip.free_Hold_M2 == null ||
        this.serviceService.leaseOwnerShip.free_Hold_M2 == 0
      ) {
        const freeHoldM2Value = this.serviceService.polygonAreanameFrehold;
        this.serviceService.leaseOwnerShip.free_Hold_M2 =
          freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;
      }

      if (
        this.serviceService.leaseOwnerShip.lease_Hold_M2 == null ||
        this.serviceService.leaseOwnerShip.lease_Hold_M2 == 0
      ) {
        const leaseHoldM2Value = this.serviceService.polygonAreaname;
        this.serviceService.leaseOwnerShip.lease_Hold_M2 =
          leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
      }
      this.serviceService.isFreeHold = true;
    } else if (value == 1) {
      this.iislease = true;
      this.islease = true;
      this.isfreehole = true;
      // Check if the value retrieved from localStorage is not null for Free_Hold_M2
      //const freeHoldM2Value = localStorage.getItem("PolygonAreanameFrehold");
      const freeHoldM2Value = this.serviceService.polygonAreanameFrehold;
      this.serviceService.leaseOwnerShip.free_Hold_M2 = 0;
      // freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;

      // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
      if (
        this.serviceService.leaseOwnerShip.lease_Hold_M2 == null ||
        this.serviceService.leaseOwnerShip.lease_Hold_M2 == 0
      ) {
        //const leaseHoldM2Value = localStorage.getItem("PolygonAreaname");
        const leaseHoldM2Value = this.serviceService.polygonAreaname;
        this.serviceService.leaseOwnerShip.lease_Hold_M2 =
          leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
      }
    } else if (value == 3) {
      this.islease = false;
      this.iislease = true;
      this.isfreehole = true;
      this.serviceService.leaseOwnerShip.lease_Hold_M2 = 0;
      // Check if the value retrieved from localStorage is not null for Free_Hold_M2
      if (
        this.serviceService.leaseOwnerShip.free_Hold_M2 == null ||
        this.serviceService.leaseOwnerShip.free_Hold_M2 == 0
      ) {
        //onst freeHoldM2Value = localStorage.getItem("PolygonAreaname");
        const freeHoldM2Value = this.serviceService.polygonAreaname;
        this.serviceService.leaseOwnerShip.free_Hold_M2 =
          freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;
      }
      // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
      //const leaseHoldM2Value = localStorage.getItem("PolygonAreaname");
      const leaseHoldM2Value = this.serviceService.polygonAreaname;
      this.serviceService.leaseOwnerShip.lease_Hold_M2 =
        this.serviceService.leaseOwnerShip.lease_Hold_M2;
      // leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
    }
    if (
      "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
        this.serviceService.Service_ID ||
      "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
        this.serviceService.Service_ID
    ) {
      this.iseditablesize = true;
    } else {
      this.iseditablesize = false;
    }
  }
  getcustomer(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerAll(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;
      if (this.customerdata.length > 0) {
        this.iscustomerdata = false;
      } else {
        this.iscustomerdata = true;
      }
    });
  }
  async getEthiopianToGregorian(date) {
    if (date) {
      var datenow = await this.serviceService
        .getEthiopianToGregorian(date)
        .toPromise();
      console.log(datenow);
      return datenow.nowTime;
    }
  }
  async getgregorianToEthiopianDate(date) {
    if (date != "0001-01-01T00:00:00") {
      var datenow = await this.serviceService
        .getgregorianToEthiopianDate(date)
        .toPromise();
      console.log(datenow);
      return datenow.nowTime;
    }
  }
  selectedDateTime(dates: any, selecter) {
    if (selecter == 2) {
      this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
  }
  async selectLease(task) {
    if (
      "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
        this.serviceService.Service_ID ||
      "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
        this.serviceService.Service_ID
    ) {
      this.iseditablesize = true;
    } else {
      this.iseditablesize = false;
    }
    console.log("tasktasktasktask", task);
    this.plotIdselected = task.plot_ID;
    this.serviceService.Totalarea = task.lease_Hold_M2 + task.free_Hold_M2;

    console.log();
    // Check if the value retrieved from localStorage is not null for Free_Hold_M2

    this.serviceService.currentplotsize =
      this.serviceService.leaseOwnerShip.lease_Hold_M2 +
      this.serviceService.leaseOwnerShip.lease_Hold_M2;
    this.serviceService.leaseOwnerShip.current_lease_bid_price = 0;
    this.serviceService.leaseOwnerShip.remaining_lease_payment = 0;
    this.addnew = false;
    // this.leaseForm = true;
    if (this.language == "amharic") {
      if (
        task.Date_of_final_lease_payment != null ||
        task.Date_of_final_lease_payment != undefined
      ) {
        task.Date_of_final_lease_payment =
          await this.getgregorianToEthiopianDate(
            task.Date_of_final_lease_payment
          );
      }
    }
    if (parseInt(task.Status) == 1 || task.To_Do_ID === this.todoidcurrent) {
      console.log(task.To_Do_ID, task.Status, task.Type_ID);
      if (parseInt(task.Type_ID) == 2) {
        this.serviceService.isfreeholdselected = true;
      } else if (parseInt(task.Type_ID) == 1) {
        this.serviceService.isfreeholdselected = false;
      } else if (parseInt(task.Type_ID) == 3) {
        //this.serviceService.isfreeholdselected = true;
      }
      // if (parseInt(task.Type_ID) == 2) {
      //   this.islease = true;
      //   this.iislease = false;
      //   this.isfreehole = false;
      //   const freeHoldM2Value = localStorage.getItem("PolygonAreanameFrehold");
      //   task.Free_Hold_M2 =
      //     freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;
      //   // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
      //   const leaseHoldM2Value = localStorage.getItem("PolygonAreaname");
      //   task.Lease_Hold_M2 =
      //     leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
      // } else if (parseInt(task.Type_ID) == 1) {
      //   this.iislease = false;
      //   this.islease = true;
      //   this.isfreehole = true;

      //   const freeHoldM2Value = localStorage.getItem("PolygonAreanameFrehold");
      //   task.Free_Hold_M2 =
      //     freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;

      //   // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
      //   const leaseHoldM2Value = localStorage.getItem("PolygonAreaname");
      //   task.Lease_Hold_M2 =
      //     leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
      // } else if (parseInt(task.Type_ID) == 3) {
      //   this.islease = false;
      //   this.iislease = true;
      //   this.isfreehole = false;
      //   const freeHoldM2Value = localStorage.getItem("PolygonAreanameFrehold");
      //   task.Free_Hold_M2 =
      //     freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;

      //   // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
      //   const leaseHoldM2Value = localStorage.getItem("PolygonAreaname");
      //   task.Lease_Hold_M2 =
      //     leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
      // }
    }

    this.serviceService.isleaseForm = true;
    this.serviceService
      .getcustomerbyid(task.customer_ID)
      .subscribe((resp: any) => {
        console.log("tasktasktasktask", resp.procCustomers);
        this.customerdata = resp.procCustomers;
        let customer = this.customerdata[0];

        if (this.language == "amharic") {
          this.Customer_NAME =
            customer.applicant_First_Name_AM +
            "  " +
            customer.applicant_Middle_Name_AM +
            " " +
            customer.applicant_Last_Name_AM;
          console.log("closeing.....");
          //
        } else {
          this.Customer_NAME =
            customer.applicant_First_Name_EN +
            "  " +
            customer.applicant_Middle_Name_En +
            " " +
            customer.applicant_Last_Name_EN;
        }
        this.serviceService.leaseOwnerShip = task;
      });
  }

  addLease() {
    if (
      "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
        this.serviceService.Service_ID ||
      "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
        this.serviceService.Service_ID ||
      "1c3d5a79-350e-4214-a343-d79e92a86e0f".toLocaleLowerCase() ==
        this.serviceService.Service_ID
    ) {
      this.serviceService.isleaseForm = true;
      this.serviceService.leaseOwnerShip = new LeaseOwnerShip();
      this.serviceService.leaseOwnerShip.id = Guid.create().toString();
      this.serviceService.leaseOwnerShip.plot_ID = this.SelectedPlot.plot_ID;
      this.serviceService.leaseOwnerShip.lease_Hold_M2 =
        this.SelectedPlot.plot_Size_M2;
      this.serviceService.leaseOwnerShip.free_Hold_M2 = 0;
      this.serviceService.leaseOwnerShip.type_ID = 1;

      this.serviceService.leaseOwnerShip.to_Do_ID = this.todoidcurrent;
      this.serviceService.leaseOwnerShip.application_No = this.applicationo;
      this.serviceService.leaseOwnerShip.lease_No = this.applicationo;

      // this.serviceService.leaseOwnerShip.SDP_ID = this.LicenceData.SDP_ID;
      this.serviceService.leaseOwnerShip.sdP_ID =
        this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
      this.addnew = true;
      this.leaseForm = true;
    } else {
      this.serviceService.isleaseForm = true;
      this.serviceService.leaseOwnerShip = new LeaseOwnerShip();
      this.serviceService.leaseOwnerShip.id = Guid.create().toString();
      this.serviceService.leaseOwnerShip.plot_ID = this.SelectedPlot.plot_ID;
      this.serviceService.leaseOwnerShip.to_Do_ID = this.todoidcurrent;
      this.serviceService.leaseOwnerShip.application_No = this.applicationo;
      this.serviceService.leaseOwnerShip.lease_No = this.applicationo;
      if (this.SelectedPlot.plot_Size_M2 > 0) {
        this.serviceService.leaseOwnerShip.lease_Hold_M2 =
          this.SelectedPlot.plot_Size_M2;
      } else {
        this.serviceService.currentplotsize = parseFloat(
          localStorage.getItem("PolygonAreaname")
        );
      }
      // this.serviceService.leaseOwnerShip.SDP_ID = this.LicenceData.SDP_ID;
      this.serviceService.leaseOwnerShip.sdP_ID =
        this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
      this.addnew = true;
      this.leaseForm = true;
    }
    if (
      "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
        this.serviceService.Service_ID ||
      "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
        this.serviceService.Service_ID
    ) {
      this.iseditablesize = true;
    } else {
      this.iseditablesize = false;
    }
  }

  Refresh() {
    this.leaseOwnerShipService
      .getAll(this.plotIdselected)
      .subscribe((CertificateVersion: any) => {
        let tasks = CertificateVersion;
        tasks = Object.assign([], tasks.list);
        console.log("this.tasksss", tasks);

        this.serviceService.leaseOwnerShip.free_Hold_M2 = parseFloat(
          tasks[0].free_Hold_M2
        );

        this.serviceService.leaseOwnerShip.lease_Hold_M2 = parseFloat(
          tasks[0].free_Hold_M2
        );
        console.log(
          "this.tasksss",
          tasks[0].free_Hold_M2,
          tasks[0].lease_Hold_M2
        );
      });
  }

  getleaseOwnerShip(plotID) {
    console.log("plotIDplotID", plotID);

    this.leaseOwnerShipService.getAllapi(plotID).subscribe(
      (CertificateVersion) => {
        this.tasks = CertificateVersion;
        this.tasks = Object.assign([], this.tasks.procLease_and_Owned_Lands);
        console.log("this.tasks", this.tasks);
        this.serviceService.leaselist = this.tasks;
        if (this.tasks.length > 0) {
          this.serviceService.toMess = false;
          if (this.serviceService.multipleplotcanbeadd) {
            let filterservice = this.serviceService.multipleplotcanbeadd.filter(
              (x) => x.id === this.serviceService.Service_ID
            );
            if (filterservice.length > 0) {
              if (this.tasks.length > 0) {
                this.multipleplotcanbeadd = true;
              } else {
                this.multipleplotcanbeadd = false;
              }
            } else {
              if (this.tasks.length > 0) {
                this.multipleplotcanbeadd = false;
              } else {
                this.multipleplotcanbeadd = true;
              }
            }
          }
          if (parseInt(this.tasks[0].type_ID) === 1) {
            this.islease = true;
            this.iislease = false;
            this.isfreehole = false;
          } else if (parseInt(this.tasks[0].type_ID) === 2) {
            this.islease = true;
            this.iislease = true;
            this.isfreehole = false;
          } else {
            this.islease = false;
            this.iislease = true;
            this.isfreehole = false;
          }

          if (this.todoidcurrent == this.tasks[0].to_Do_ID) {
            this.iscanEdite = true;
          } else {
            this.iscanEdite = false;
          }
        } else {
          this.serviceService.toMess = true;
          console.log("tasks", this.tasks, this.serviceService.toMess);
        }
      },
      (error) => {
        console.log(error);
        if (error.status == "400") {
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Errors[0].message
          );
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      }
    );
  }

  confirmsave() {
    this.msgs = "Are you sure that you want to save?";
    this.isconfirmsave = true;
  }

  confirmupdate() {
    this.msgs = "Are you sure that you want to update?";
    this.isconfirmupdate = true;
  }

  // confirmupdate() {
  //   this.msgs = [];
  //   this.confirmationService.confirm({
  //     message: "Are you sure that you want to update?",
  //     header: "Confirmation",
  //     icon: "pi pi-exclamation-triangle",
  //     accept: () => {
  //       this.msgs = [
  //         {
  //           severity: "info",
  //           summary: "Confirmed",
  //           detail: "You have accepted",
  //         },
  //       ];
  //       this.save();
  //     },
  //     reject: () => {
  //       this.msgs = [
  //         {
  //           severity: "info",
  //           summary: "Rejected",
  //           detail: "You have rejected",
  //         },
  //       ];
  //     },
  //   });
  // }
  async save() {
    // console.log("🚀 ~ PlotManagmentComponent ~ save ~ Licence_Service_ID:", this.serviceService.LicenceserviceID,
    // this.serviceService.Licence_Service_ID
    // )
    if (this.serviceService.Licence_Service_ID != this.serviceService.LicenceserviceID){
      const toast = this.notificationsService.error(
        "Error",
        "this plot created by other technical officer so you can't update it /ይህ ፕሎት በሌላ ቴክኒካል ኦፊሰር የተፈጠረ ስለሆነ ማዘመን አይችሉም"
      );
      return
    }
    // console.log(
    //   this.serviceService.currentplotsize,
    //   this.serviceService.leaseOwnerShip.lease_Hold_M2
    // );
    const maxAreaDifference =
      environment.Totalareatolerance * this.serviceService.currentplotsize;
    let toaleplotsize =
      this.serviceService.leaseOwnerShip.lease_Hold_M2 +
      this.serviceService.leaseOwnerShip.free_Hold_M2;
    const areaDifference = Math.abs(
      toaleplotsize - parseFloat(localStorage.getItem("PolygonAreaname"))
    );
    console.log(maxAreaDifference, areaDifference);

    let totalsize =
      parseFloat(this.serviceService.leaseOwnerShip.free_Hold_M2) +
      parseFloat(this.serviceService.leaseOwnerShip.lease_Hold_M2);

    console.log("totalsize", totalsize);

    this.leaseOwnerShipService
      .getAllapi(this.serviceService.leaseOwnerShip.plot_ID)
      .subscribe((CertificateVersion: any) => {
        let tasks = CertificateVersion;
        tasks = Object.assign([], tasks.procLease_and_Owned_Lands);
        console.log("this.tasks", tasks);

        console.log("leaselist", tasks);
        if (tasks.length > 0) {
          tasks.forEach((element) => {
            if (element.Plot_ID != this.serviceService.leaseOwnerShip.plot_ID) {
              if (parseInt(element.Status) === 1) {
                let totalsizeeach =
                  parseFloat(element.free_Hold_M2) +
                  parseFloat(element.lease_Hold_M2);

                this.totalsizeofleaseeach += totalsizeeach;
              }
            }
          });
          this.totalsizeoflease =
            parseFloat(localStorage.getItem("PolygonAreaname")) -
            this.totalsizeofleaseeach;
        } else {
          this.totalsizeoflease = this.serviceService.currentplotsize;
        }
      });
    if (this.totalsizeoflease < totalsize) {
      const toast = this.notificationsService.warn(
        "the sum of Leasehold and Freehold is must not greater than total  plot size/የሊዝ ይዞታ እና ነፃ ይዞታ ድምር ከጠቅላላ የቦታ መጠን መብለጥ የለበትም"
      );
      return;
    } else {
      if (this.language == "amharic") {
        this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
          await this.getEthiopianToGregorian(
            this.serviceService.leaseOwnerShip.date_of_final_lease_payment
          );
      }
      this.serviceService.getUserRole().subscribe((response: any) => {
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.serviceService.leaseOwnerShip.updated_By = response[0].UserId;
    
      this.leaseOwnerShipService
        .saveapi(this.serviceService.leaseOwnerShip)
        .subscribe(
          async (deptSuspension) => {
            console.log("deptSuspension", deptSuspension);
            const toast = this.notificationsService.success(
              "Sucess"
            );
            // localStorage.setItem("PolygonAreaname", "" + 0);
            // localStorage.setItem("PolygonAreanameFrehold", "" + 0);

            //this.serviceService.disablefins = false;
            this.getleaseOwnerShip(this.serviceService.leaseOwnerShip.plot_ID);
            const maxAreaDifferences =
              environment.Totalareatolerance * this.serviceService.Totalarea;

            const areaDifferences = Math.abs(
              totalsize - parseFloat(localStorage.getItem("PolygonAreaname"))
            );
            console.log(
              "🚀 ~ LeaseOwnerShipComponent ~ areaDifferences:",
              areaDifferences,
              maxAreaDifferences
            );

            //   if (areaDifferences <= maxAreaDifferences) {
            //     this.serviceService.plotsizenotequal = false;
            //   } else {
            //     this.serviceService.plotsizenotequal = true;
            //     const toast = this.notificationsService.warn(
            //       `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
            // በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት
            //  ${Math.abs(
            //    totalsize - parseInt(localStorage.getItem("PolygonAreaname"))
            //  )}`
            //     );
            //   }
            // if (this.language == "amharic") {
            //   this.serviceService.leaseOwnerShip.Date_of_final_lease_payment =
            //     await this.getgregorianToEthiopianDate(
            //       this.serviceService.leaseOwnerShip.Date_of_final_lease_payment
            //     );
            // }
            if (!this.Saved) {
              //this.completed.emit();
              this.Saved = true;
            }
          },
          async (error) => {
            console.log(error);

            if (error.status == "400") {
              const toast = this.notificationsService.error(
                "Error",
                error.error.InnerException.Errors[0].message
              );
              if (this.language == "amharic") {
                this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                  await this.getgregorianToEthiopianDate(
                    this.serviceService.leaseOwnerShip
                      .date_of_final_lease_payment
                  );
              }
            } else {
              const toast = this.notificationsService.error(
                "Error",
                "SomeThing Went Wrong"
              );
              if (this.language == "amharic") {
                this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                  await this.getgregorianToEthiopianDate(
                    this.serviceService.leaseOwnerShip
                      .date_of_final_lease_payment
                  );
              }
            }
          }
        );
      console.log("saveing....");
      })
    }
  
  }

  Delete() {
    // this.confirmationService.confirm({
    // message: "Are you sure u want to delete this Lease?",
    //accept: () => {
    this.serviceService.leaseOwnerShip.is_Deleted = true;
    this.serviceService.getUserRole().subscribe((response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.serviceService.leaseOwnerShip.updated_By = response[0].UserId;
  
    this.leaseOwnerShipService
      .Delete(this.serviceService.leaseOwnerShip.lease_No)
      .subscribe(
        (deptSuspension) => {
          const toast = this.notificationsService.success(
            "Sucess",
            deptSuspension
          );

          this.leaseForm = false;
          this.addnew = false;

          if (this.SelectedPlot) {
            this.getleaseOwnerShip(this.serviceService.leaseOwnerShip.plot_ID);
          }
          //this.completeddel.emit(this.plotManagment);
        },
        (error) => {
          console.log(error);
          if (error.status == "400") {
            const toast = this.notificationsService.error(
              "Error",
              error.error.InnerException.Errors[0].message
            );
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }
        }
      );
    console.log("saveing....");
    })
  }
  //});
  //}

  async add() {
    if (
      this.serviceService.leaseOwnerShip.customer_ID ===
      "00000000-0000-0000-0000-000000000000"
    ) {
      const toast = this.notificationsService.warn(
        "LEASE OWNERSHIP MUST HAVE CUSTOMER ID ,ድጋሜ ደንበኛን ይምረጡ "
      );

      return;
    }
    const maxAreaDifferences =
      environment.Totalareatolerance * this.serviceService.currentplotsize;
    let totalpoltsize =
      this.serviceService.leaseOwnerShip.lease_Hold_M2 +
      this.serviceService.leaseOwnerShip.free_Hold_M2;
    let freeHoldM2Value = parseFloat(
      localStorage.getItem("PolygonAreanameFrehold")
    );
    // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
    let leaseHoldM2Value = parseFloat(localStorage.getItem("PolygonAreaname"));

    let totalsum = freeHoldM2Value + leaseHoldM2Value;
    const areaDifferences = Math.abs(totalpoltsize - totalsum);
    console.log(maxAreaDifferences, areaDifferences, totalsum);
    if (
      this.serviceService.leaseOwnerShip.to_Do_ID == null ||
      this.serviceService.leaseOwnerShip.to_Do_ID == undefined
    ) {
      this.serviceService.leaseOwnerShip.to_Do_ID = this.todoidcurrent;
    }

    let totalsize =
      parseFloat(this.serviceService.leaseOwnerShip.free_Hold_M2) +
      parseFloat(this.serviceService.leaseOwnerShip.lease_Hold_M2);

    console.log("totalsize", totalsize);
    this.serviceService.getUserRole().subscribe((response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.serviceService.leaseOwnerShip.created_By = response[0].UserId;
  
    this.leaseOwnerShipService
      .getAllapi(this.serviceService.leaseOwnerShip.plot_ID)
      .subscribe((CertificateVersion: any) => {
        let tasks = CertificateVersion;
        tasks = Object.assign([], tasks.procLease_and_Owned_Lands);
        console.log("this.tasks", tasks);

        console.log("leaselist", tasks);
        if (tasks.length > 0) {
          tasks.forEach((element) => {
            if (
              "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
                this.serviceService.Service_ID ||
              "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
                this.serviceService.Service_ID
            ) {
            } else {
              if (
                element.Plot_ID != this.serviceService.leaseOwnerShip.plot_ID
              ) {
                let totalsizeeach =
                  parseFloat(element.free_Hold_M2) +
                  parseFloat(element.lease_Hold_M2);

                this.totalsizeofleaseeach += totalsizeeach;
              }
            }
          });
          this.totalsizeoflease = totalsum - this.totalsizeofleaseeach;
        } else {
          this.totalsizeoflease = totalsum;
        }
      });
    })
    if (
      "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
        this.serviceService.Service_ID ||
      "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
        this.serviceService.Service_ID
    ) {
      if (this.language == "amharic") {
        this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
          await this.getEthiopianToGregorian(
            this.serviceService.leaseOwnerShip.date_of_final_lease_payment
          );
      }
      this.serviceService.getUserRole().subscribe((response: any) => {
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.serviceService.leaseOwnerShip.created_By = response[0].UserId;
    
      this.leaseOwnerShipService
        .Addapi(this.serviceService.leaseOwnerShip)
        .subscribe(
          async (deptSuspension) => {
            console.log("deptSuspension", deptSuspension);
            const toast = this.notificationsService.success(
              "Sucess"
              
            );
            localStorage.setItem("PolygonAreaname", "" + 0);
            localStorage.setItem("PolygonAreanameFrehold", "" + 0);

            this.serviceService.Totalarea =
              parseFloat(this.serviceService.leaseOwnerShip.lease_Hold_M2) +
              parseFloat(this.serviceService.leaseOwnerShip.free_Hold_M2);
            this.getleaseOwnerShip(this.serviceService.leaseOwnerShip.plot_ID);
            const maxAreaDifferences =
              environment.Totalareatolerance * this.serviceService.Totalarea;

            const areaDifferences = Math.abs(totalsize - totalsum);

            if (areaDifferences <= maxAreaDifferences) {
              this.serviceService.plotsizenotequal = false;
            } else {
              this.serviceService.plotsizenotequal = false;
              //     const toast = this.notificationsService.warn(
              //       `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
              // በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት
              //  ${Math.abs(totalsize - totalsum)}`
              //     );
            }

            if (this.language == "amharic") {
              this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                await this.getgregorianToEthiopianDate(
                  this.serviceService.leaseOwnerShip.date_of_final_lease_payment
                );
            }

            //this.serviceService.disablefins = false;

            this.leaseForm = false;
            this.serviceService.isleaseForm = false;
            if (!this.Saved) {
              this.addnew = false;
              //this.completed.emit();
              this.Saved = true;
              this.serviceService.isleaseForm = false;
            }
            // const warningMessage = "የሊዝ ወይም የነባር ይዞታ መመዝገቡን አረጋግጥ/Check lease or freehold record is active for this plot";
            // const toastWarning = this.notificationsService.warn(
            //   "Warning",
            //   warningMessage
            // );
          },
          async (error) => {
            console.log(error);

            if (error.status == "400") {
              const toast = this.notificationsService.error(
                "Error",
                error.error.InnerException.Errors[0].message
              );
              this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                await this.getgregorianToEthiopianDate(
                  this.serviceService.leaseOwnerShip.date_of_final_lease_payment
                );
            } else {
              const toast = this.notificationsService.error(
                "Error",
                "SomeThing Went Wrong"
              );
              this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                await this.getgregorianToEthiopianDate(
                  this.serviceService.leaseOwnerShip.date_of_final_lease_payment
                );
            }
          }
        );
      })
    } else {
      if (this.totalsizeoflease < totalsize) {
        const toast = this.notificationsService.warn(
          "the sum of Leasehold and Freehold is must not greater than total  plot size/የሊዝ ይዞታ እና ነፃ ይዞታ ድምር ከጠቅላላ የቦታ መጠን መብለጥ የለበትም"
        );
        return;
      } else {
        if (this.language == "amharic") {
          this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
            await this.getEthiopianToGregorian(
              this.serviceService.leaseOwnerShip.date_of_final_lease_payment
            );
        }
        this.serviceService.getUserRole().subscribe((response: any) => {
          console.log("responseresponseresponse", response, response[0].RoleId);
          this.serviceService.leaseOwnerShip.created_By = response[0].UserId;
      
        this.leaseOwnerShipService
          .Addapi(this.serviceService.leaseOwnerShip)
          .subscribe(
            async (deptSuspension) => {
              console.log("deptSuspension", deptSuspension);
              const toast = this.notificationsService.success(
                "Sucess"
              );
              localStorage.setItem("PolygonAreaname", "" + 0);
              localStorage.setItem("PolygonAreanameFrehold", "" + 0);

              this.serviceService.Totalarea =
                parseFloat(this.serviceService.leaseOwnerShip.lease_Hold_M2) +
                parseFloat(this.serviceService.leaseOwnerShip.free_Hold_M2);
              this.getleaseOwnerShip(
                this.serviceService.leaseOwnerShip.plot_ID
              );
              const maxAreaDifferences =
                environment.Totalareatolerance * this.serviceService.Totalarea;

              const areaDifferences = Math.abs(totalsize - totalsum);

              if (areaDifferences <= maxAreaDifferences) {
                this.serviceService.plotsizenotequal = false;
              } else {
                this.serviceService.plotsizenotequal = false;
                //     const toast = this.notificationsService.warn(
                //       `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
                // በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት
                //  ${Math.abs(totalsize - totalsum)}`
                //     );
              }

              if (this.language == "amharic") {
                this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                  await this.getgregorianToEthiopianDate(
                    this.serviceService.leaseOwnerShip
                      .date_of_final_lease_payment
                  );
              }

              //this.serviceService.disablefins = false;

              this.leaseForm = false;
              this.serviceService.isleaseForm = false;
              if (!this.Saved) {
                this.addnew = false;
                //this.completed.emit();
                this.Saved = true;
                this.serviceService.isleaseForm = false;
              }
              // const warningMessage = "የሊዝ ወይም የነባር ይዞታ መመዝገቡን አረጋግጥ/Check lease or freehold record is active for this plot";
              // const toastWarning = this.notificationsService.warn(
              //   "Warning",
              //   warningMessage
              // );
            },
            async (error) => {
              console.log(error);

              if (error.status == "400") {
                const toast = this.notificationsService.error(
                  "Error",
                  error.error
                );
                this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                  await this.getgregorianToEthiopianDate(
                    this.serviceService.leaseOwnerShip
                      .date_of_final_lease_payment
                  );
              } else {
                const toast = this.notificationsService.error(
                  "Error",
                  "SomeThing Went Wrong"
                );
                this.serviceService.leaseOwnerShip.date_of_final_lease_payment =
                  await this.getgregorianToEthiopianDate(
                    this.serviceService.leaseOwnerShip
                      .date_of_final_lease_payment
                  );
              }
            }
          );
        })
        console.log("saveing....");
      }
    }
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }
  visible;
  closeModal(customer) {
    this.visible = false;
    this.serviceService.leaseOwnerShip.customer_ID = customer.customer_ID;

    if (this.language == "amharic") {
      this.Customer_NAME =
        customer.applicant_First_Name_AM +
        "  " +
        customer.applicant_Middle_Name_AM +
        " " +
        customer.applicant_Last_Name_AM;
      console.log("closeing.....");
    } else {
      this.Customer_NAME =
        customer.applicant_First_Name_EN +
        "  " +
        customer.applicant_Middle_Name_En +
        " " +
        customer.applicant_Last_Name_EN;
    }
  }
}

export class LeaseOwnerShip {
  // public ID: string;
  // public Type_ID: any;
  // public Lease_No: any;
  // public Lease_Price: any;
  // public Free_Hold_M2: any;
  // public Lease_Hold_M2: any;
  // public Customer_ID: any;
  // public Plot_ID: any;
  // public Status;
  // public SDP_ID;
  // public To_Do_ID;
  // public Is_Deleted;
  // public Application_No;
  // public Total_lease_amount_to_be_paid;
  // public Amount_of_down_payment;
  // public Amount_of_the_annual_lease_payment;
  // public Lease_period_in_Year;
  // public Date_of_final_lease_payment;
  // public Current_lease_bid_price;
  // public Remaining_lease_payment;
  // {
    public id 
    public to_Do_ID
    public approved_By
    public type_ID
    public lease_No
    public free_Hold_M2
    public lease_Hold_M2
    public plot_ID
    public sdP_ID
    public customer_ID
    public application_No
    public status
    public total_lease_amount_to_be_paid
    public amount_of_down_payment
    public amount_of_the_annual_lease_payment
    public lease_period_in_Year
    public date_of_final_lease_payment
    public created_By
    public updated_By
    public deleted_By
     public is_Deleted
    // public created_Date
    // public updated_Date
    // public deleted_Date
    public remaining_lease_payment
    public current_lease_bid_price
  
}
