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
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private leaseOwnerShipService: LeaseOwnerShipService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService,
    public serviceService: ServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.leaseOwnerShip = new LeaseOwnerShip();
    this.leaseOwnerShip.ID = Guid.create().toString();
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
      if (this.addnew) {
        this.leaseOwnerShip.Plot_ID = this.SelectedPlot.plot_ID;
        console.log("lease select", this.SelectedPlot);
        console.log(
          "lease plot id",
          this.leaseOwnerShip.Plot_ID,
          localStorage.getItem("PolygonAreaname")
        );

        this.leaseOwnerShip.SDP_ID = this.SelectedPlot.sdP_ID;
        // this.leaseOwnerShip.Lease_Hold_M2 = parseInt(
        //   localStorage.getItem("PolygonAreaname")
        // );

        // this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
        // if( this.leaseOwnerShip.SDP_ID!=null || this.leaseOwnerShip.SDP_ID!=undefined ){
        //   this.addLease()
        // }
      }
      // if()
    }

    this.leaseForm = false;
    //this.leaseOwnerShip = this.SelectedPlot;
  }
  ngOnInit() {
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    this.leaseOwnerShip.SDP_ID =
      this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
    // if( this.leaseOwnerShip.SDP_ID!=null || this.leaseOwnerShip.SDP_ID!=undefined ){
    //   this.addLease()
    // }
  }
  onOptionsSelected(value) {
    console.log(value);

    if (value == 2) {
      this.islease = false;
      this.iislease = false;
      this.isfreehole = false;
      this.leaseOwnerShip.Free_Hold_M2 = 0;
      this.leaseOwnerShip.Lease_Hold_M2 = parseFloat(
        localStorage.getItem("PolygonAreaname")
      );
    } else if (value == 1) {
      this.iislease = false;
      this.islease = true;
      this.isfreehole = true;
      this.leaseOwnerShip.Lease_Hold_M2 = parseFloat(
        localStorage.getItem("PolygonAreaname")
      );
      this.leaseOwnerShip.Free_Hold_M2 = 0;
    } else if (value == 3) {
      this.islease = false;
      this.iislease = true;
      this.isfreehole = false;
      this.leaseOwnerShip.Lease_Hold_M2 = 0;
      this.leaseOwnerShip.Free_Hold_M2 = parseFloat(
        localStorage.getItem("PolygonAreaname")
      );
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
      this.leaseOwnerShip.Date_of_final_lease_payment =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
  }
  async selectLease(task) {
    console.log("tasktasktasktask", task);

    this.serviceService.Totalarea = task.Lease_Hold_M2 + task.Free_Hold_M2;
    this.serviceService.currentplotsize = parseFloat(
      localStorage.getItem("PolygonAreaname")
    );
    console.log();

    // if (parseFloat(localStorage.getItem("PolygonAreaname"))) {
    //   task.Lease_Hold_M2 = parseFloat(localStorage.getItem("PolygonAreaname"));
    // }
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
        this.islease = false;
        this.iislease = false;
        this.isfreehole = false;
        task.Free_Hold_M2 = 0;
        task.Lease_Hold_M2 = parseFloat(
          localStorage.getItem("PolygonAreaname")
        );
      } else if (parseInt(task.Type_ID) == 1) {
        this.iislease = false;
        this.islease = true;
        this.isfreehole = true;
        task.Lease_Hold_M2 = parseFloat(
          localStorage.getItem("PolygonAreaname")
        );
        task.Free_Hold_M2 = 0;
      } else if (parseInt(task.Type_ID) == 3) {
        this.islease = false;
        this.iislease = true;
        this.isfreehole = false;
        task.Lease_Hold_M2 = 0;
        task.Free_Hold_M2 = parseFloat(localStorage.getItem("PolygonAreaname"));
      }
    }

    this.serviceService.isleaseForm = true;
    this.serviceService
      .getcustomerbyid(task.Customer_ID)
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
        this.leaseOwnerShip = task;
      });
  }

  addLease() {
    this.serviceService.isleaseForm = true;
    this.leaseOwnerShip = new LeaseOwnerShip();
    this.leaseOwnerShip.ID = Guid.create().toString();
    this.leaseOwnerShip.Plot_ID = this.SelectedPlot.plot_ID;
    this.leaseOwnerShip.To_Do_ID = this.todoidcurrent;
    this.leaseOwnerShip.Application_No = this.applicationo;
    this.leaseOwnerShip.Lease_Hold_M2 = localStorage.getItem("PolygonAreaname");
    this.serviceService.currentplotsize = parseFloat(
      localStorage.getItem("PolygonAreaname")
    );
    // this.leaseOwnerShip.SDP_ID = this.LicenceData.SDP_ID;
    this.leaseOwnerShip.SDP_ID =
      this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
    this.addnew = true;
    this.leaseForm = true;
  }
  // regionSelected(events) {
  //   Regions.find(
  //     region => {
  //       if (region.orgCode == events) {
  //         console.log('yuiop',events)

  //         this.selectedRegion = region;

  //         return true;
  //       }
  //       return false;
  //     }
  //   );
  // }

  getleaseOwnerShip(plotID) {
    console.log("plotIDplotID", plotID);

    this.leaseOwnerShipService.getAll(plotID).subscribe(
      (CertificateVersion) => {
        this.tasks = CertificateVersion;
        this.tasks = Object.assign([], this.tasks.list);
        console.log("this.tasks", this.tasks);
        this.serviceService.leaselist = this.tasks;
        if (this.tasks.length > 0) {
          this.serviceService.toMess = false;

          if (parseInt(this.tasks[0].Type_ID) === 1) {
            this.islease = false;
            this.iislease = false;
            this.isfreehole = false;
          } else if (parseInt(this.tasks[0].Type_ID) === 2) {
            this.islease = false;
            this.iislease = true;
            this.isfreehole = false;
          } else {
            this.islease = false;
            this.iislease = true;
            this.isfreehole = false;
          }

          if (this.todoidcurrent == this.tasks[0].To_Do_ID) {
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
    console.log(
      this.serviceService.currentplotsize,
      this.leaseOwnerShip.Lease_Hold_M2
    );
    const maxAreaDifference =
      environment.Totalareatolerance * this.serviceService.currentplotsize;
    let toaleplotsize =
      this.leaseOwnerShip.Lease_Hold_M2 + this.leaseOwnerShip.Free_Hold_M2;
    const areaDifference = Math.abs(
      toaleplotsize - parseFloat(localStorage.getItem("PolygonAreaname"))
    );
    console.log(maxAreaDifference, areaDifference);

    let totalsize =
      parseFloat(this.leaseOwnerShip.Free_Hold_M2) +
      parseFloat(this.leaseOwnerShip.Lease_Hold_M2);

    console.log("totalsize", totalsize);

    this.serviceService
      .getAll(this.leaseOwnerShip.Plot_ID)
      .subscribe((CertificateVersion: any) => {
        let tasks = CertificateVersion;
        tasks = Object.assign([], tasks.list);
        console.log("this.tasks", tasks);

        console.log("leaselist", tasks);
        if (tasks.length > 0) {
          tasks.forEach((element) => {
            if (element.Plot_ID != this.leaseOwnerShip.Plot_ID) {
              if (parseInt(element.Status) === 1) {
                let totalsizeeach =
                  parseFloat(element.Free_Hold_M2) +
                  parseFloat(element.Lease_Hold_M2);

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
        this.leaseOwnerShip.Date_of_final_lease_payment =
          await this.getEthiopianToGregorian(
            this.leaseOwnerShip.Date_of_final_lease_payment
          );
      }

      this.leaseOwnerShipService.save(this.leaseOwnerShip).subscribe(
        async (deptSuspension) => {
          console.log("deptSuspension", deptSuspension);
          const toast = this.notificationsService.success(
            "Sucess",
            deptSuspension
          );

          //this.serviceService.disablefins = false;
          this.getleaseOwnerShip(this.leaseOwnerShip.Plot_ID);
          const maxAreaDifferences =
            environment.Totalareatolerance * this.serviceService.Totalarea;

          const areaDifferences = Math.abs(
            totalsize - parseFloat(localStorage.getItem("PolygonAreaname"))
          );

          if (areaDifferences <= maxAreaDifferences) {
            this.serviceService.plotsizenotequal = false;
          } else {
            this.serviceService.plotsizenotequal = true;
            const toast = this.notificationsService.warn(
              `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
          በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት
           ${Math.abs(
             totalsize - parseInt(localStorage.getItem("PolygonAreaname"))
           )}`
            );
          }
          if (this.language == "amharic") {
            this.leaseOwnerShip.Date_of_final_lease_payment =
              await this.getgregorianToEthiopianDate(
                this.leaseOwnerShip.Date_of_final_lease_payment
              );
          }
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
              this.leaseOwnerShip.Date_of_final_lease_payment =
                await this.getgregorianToEthiopianDate(
                  this.leaseOwnerShip.Date_of_final_lease_payment
                );
            }
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
            if (this.language == "amharic") {
              this.leaseOwnerShip.Date_of_final_lease_payment =
                await this.getgregorianToEthiopianDate(
                  this.leaseOwnerShip.Date_of_final_lease_payment
                );
            }
          }
        }
      );
      console.log("saveing....");
    }
  }

  Delete() {
    // this.confirmationService.confirm({
    // message: "Are you sure u want to delete this Lease?",
    //accept: () => {
    this.leaseOwnerShip.Is_Deleted = true;
    this.leaseOwnerShipService.Delete(this.leaseOwnerShip.Lease_No).subscribe(
      (deptSuspension) => {
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );

        this.leaseForm = false;
        this.addnew = false;

        if (this.SelectedPlot) {
          this.getleaseOwnerShip(this.leaseOwnerShip.Plot_ID);
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
  }
  //});
  //}

  async add() {
    const maxAreaDifferences =
      environment.Totalareatolerance * this.serviceService.currentplotsize;
    let totalpoltsize =
      this.leaseOwnerShip.Lease_Hold_M2 + this.leaseOwnerShip.Free_Hold_M2;
    const areaDifferences = Math.abs(
      totalpoltsize - parseFloat(localStorage.getItem("PolygonAreaname"))
    );
    console.log(maxAreaDifferences, areaDifferences);
    if (
      this.leaseOwnerShip.To_Do_ID == null ||
      this.leaseOwnerShip.To_Do_ID == undefined
    ) {
      this.leaseOwnerShip.To_Do_ID = this.todoidcurrent;
    }

    let totalsize =
      parseFloat(this.leaseOwnerShip.Free_Hold_M2) +
      parseFloat(this.leaseOwnerShip.Lease_Hold_M2);

    console.log("totalsize", totalsize);

    this.serviceService
      .getAll(this.leaseOwnerShip.Plot_ID)
      .subscribe((CertificateVersion: any) => {
        let tasks = CertificateVersion;
        tasks = Object.assign([], tasks.list);
        console.log("this.tasks", tasks);

        console.log("leaselist", tasks);
        if (tasks.length > 0) {
          tasks.forEach((element) => {
            if (element.Plot_ID != this.leaseOwnerShip.Plot_ID) {
              let totalsizeeach =
                parseFloat(element.Free_Hold_M2) +
                parseFloat(element.Lease_Hold_M2);

              this.totalsizeofleaseeach += totalsizeeach;
            }
          });
          this.totalsizeoflease =
            parseFloat(localStorage.getItem("PolygonAreaname")) -
            this.totalsizeofleaseeach;
        } else {
          this.totalsizeoflease = parseFloat(
            localStorage.getItem("PolygonAreaname")
          );
        }
      });
    if (this.totalsizeoflease < totalsize) {
      const toast = this.notificationsService.warn(
        "the sum of Leasehold and Freehold is must not greater than total  plot size/የሊዝ ይዞታ እና ነፃ ይዞታ ድምር ከጠቅላላ የቦታ መጠን መብለጥ የለበትም"
      );
      return;
    } else {
      if (this.language == "amharic") {
        this.leaseOwnerShip.Date_of_final_lease_payment =
          await this.getEthiopianToGregorian(
            this.leaseOwnerShip.Date_of_final_lease_payment
          );
      }
      this.leaseOwnerShipService.Add(this.leaseOwnerShip).subscribe(
        async (deptSuspension) => {
          console.log("deptSuspension", deptSuspension);
          const toast = this.notificationsService.success(
            "Sucess",
            deptSuspension
          );

          this.serviceService.Totalarea =
            parseFloat(this.leaseOwnerShip.Lease_Hold_M2) +
            parseFloat(this.leaseOwnerShip.Free_Hold_M2);
          this.getleaseOwnerShip(this.leaseOwnerShip.Plot_ID);
          const maxAreaDifferences =
            environment.Totalareatolerance * this.serviceService.Totalarea;

          const areaDifferences = Math.abs(
            totalsize - parseFloat(localStorage.getItem("PolygonAreaname"))
          );

          if (areaDifferences <= maxAreaDifferences) {
            this.serviceService.plotsizenotequal = false;
          } else {
            this.serviceService.plotsizenotequal = true;
            const toast = this.notificationsService.warn(
              `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
          በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት
           ${Math.abs(
             totalsize - parseInt(localStorage.getItem("PolygonAreaname"))
           )}`
            );
          }

          if (this.language == "amharic") {
            this.leaseOwnerShip.Date_of_final_lease_payment =
              await this.getgregorianToEthiopianDate(
                this.leaseOwnerShip.Date_of_final_lease_payment
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
            this.leaseOwnerShip.Date_of_final_lease_payment =
              await this.getgregorianToEthiopianDate(
                this.leaseOwnerShip.Date_of_final_lease_payment
              );
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
            this.leaseOwnerShip.Date_of_final_lease_payment =
              await this.getgregorianToEthiopianDate(
                this.leaseOwnerShip.Date_of_final_lease_payment
              );
          }
        }
      );
      console.log("saveing....");
    }
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }
  visible;
  closeModal(customer) {
    this.visible = false;
    this.leaseOwnerShip.Customer_ID = customer.customer_ID;
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

class LeaseOwnerShip {
  public ID: string;
  public Type_ID: string;
  public Lease_No: string;
  public Lease_Price: string;
  public Free_Hold_M2: any;
  public Lease_Hold_M2: any;
  public Customer_ID: string;
  public Plot_ID: string;
  public Status;
  public SDP_ID;
  public To_Do_ID;
  public Is_Deleted;
  public Application_No;
  public Total_lease_amount_to_be_paid;
  public Amount_of_down_payment;
  public Amount_of_the_annual_lease_payment;
  public Lease_period_in_Year;
  public Date_of_final_lease_payment;
}
