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
import { ConfirmationService } from "primeng/api";
import { Guid } from "guid-typescript";
import { PlotComponent } from "../plot/plot.component";
import { Regions } from "../plot-managment/regions";
import { ServiceService } from "../service.service";
import { environment } from "src/environments/environment";

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
  islease: boolean;
  isfreehole: boolean;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private leaseOwnerShipService: LeaseOwnerShipService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService,
    public serviceService: ServiceService
  ) {
    this.leaseOwnerShip = new LeaseOwnerShip();
    this.leaseOwnerShip.ID = Guid.create().toString();
  }
  highlighted;
  ngOnChanges() {
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    console.log("haha lease", this.SelectedPlot);
    if (this.SelectedPlot) {
      this.getleaseOwnerShip(this.SelectedPlot.Plot_ID);
      if (this.addnew) {
        this.leaseOwnerShip.Plot_ID = this.SelectedPlot.Plot_ID;
        console.log("lease select", this.SelectedPlot);
        console.log("lease plot id", this.leaseOwnerShip.Plot_ID);

        this.leaseOwnerShip.SDP_ID =
          this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
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
      this.isfreehole = false;
      this.leaseOwnerShip.Lease_Hold_M2 = 0;
    } else if (value == 1) {
      this.islease = false;
      this.isfreehole = true;
      this.leaseOwnerShip.Lease_Hold_M2 = null;
      this.leaseOwnerShip.Free_Hold_M2 = 0;
    } else {
      this.islease = false;
      this.isfreehole = false;
      this.leaseOwnerShip.Lease_Hold_M2 = 0;
      this.leaseOwnerShip.Free_Hold_M2 = 0;
    }
  }
  getcustomer(globvar) {
    console.log(globvar);
    this.serviceService.getcustomer(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;
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
    this.leaseOwnerShip.Plot_ID = this.SelectedPlot.Plot_ID;
    this.leaseOwnerShip.todoid = this.todoid;
    this.leaseOwnerShip.applicationo = this.applicationo;
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
    this.leaseOwnerShipService.getAll(plotID).subscribe(
      (CertificateVersion) => {
        this.tasks = CertificateVersion;
        this.tasks = Object.assign([], this.tasks.list);
        console.log("tasks", this.tasks);
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

  async save() {
    if (this.leaseOwnerShip.Lease_Hold_M2 < 75) {
      const toast = this.notificationsService.warn(
        "Lease Hold is not less than 75/የሊዝ ይዞታ ከ 75 መብለጥ የለበትም"
      );
      return;
    }
    this.leaseOwnerShip.Date_of_final_lease_payment =
      await this.getEthiopianToGregorian(
        this.leaseOwnerShip.Date_of_final_lease_payment
      );
    this.leaseOwnerShipService.save(this.leaseOwnerShip).subscribe(
      async (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );
        this.serviceService.disablefins = false;
        this.leaseOwnerShip.Date_of_final_lease_payment =
          await this.getgregorianToEthiopianDate(
            this.leaseOwnerShip.Date_of_final_lease_payment
          );
        this.getleaseOwnerShip(this.SelectedPlot.Plot_ID);

        if (!this.Saved) {
          this.completed.emit();
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
          this.getleaseOwnerShip(this.SelectedPlot.Plot_ID);
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
    if (this.leaseOwnerShip.Lease_Hold_M2 < 75) {
      const toast = this.notificationsService.warn(
        "Lease Hold is not less than 75/የሊዝ ይዞታ ከ 75 መብለጥ የለበትም"
      );
      return;
    }
    this.leaseOwnerShip.Date_of_final_lease_payment =
      await this.getEthiopianToGregorian(
        this.leaseOwnerShip.Date_of_final_lease_payment
      );
    this.leaseOwnerShipService.Add(this.leaseOwnerShip).subscribe(
      async (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );
        this.leaseOwnerShip.Date_of_final_lease_payment =
          await this.getgregorianToEthiopianDate(
            this.leaseOwnerShip.Date_of_final_lease_payment
          );
        this.serviceService.disablefins = false;
        this.getleaseOwnerShip(this.SelectedPlot.Plot_ID);
        this.leaseForm = false;
        this.serviceService.isleaseForm = false;
        if (!this.Saved) {
          this.addnew = false;
          this.completed.emit();
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
  public todoid;
  public Is_Deleted;
  public applicationo;
  public Total_lease_amount_to_be_paid;
  public Amount_of_down_payment;
  public Amount_of_the_annual_lease_payment;
  public Lease_period_in_Year;
  public Date_of_final_lease_payment;
}
