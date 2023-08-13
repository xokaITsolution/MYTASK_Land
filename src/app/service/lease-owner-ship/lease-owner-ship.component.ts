import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from "@angular/core";
import { LeaseOwnerShipService } from "./lease-owner-ship.service";
import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ConfirmationService } from "primeng/api";
import { Guid } from "guid-typescript";
import { PlotComponent } from "../plot/plot.component";

@Component({
  selector: 'app-lease-owner-ship',
  templateUrl: './lease-owner-ship.component.html',
  styleUrls: ['./lease-owner-ship.component.css']
})
export class LeaseOwnerShipComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  tasks;
  leaseForm = false;
  addnew = true;
  @Input() SelectedPlot;
  @Input() disable;
  @Input() todoid;
  @Input() applicationo;
  @Input() LicenceData;
  @Input() plotId;
  public leaseOwnerShip: LeaseOwnerShip;
  Saved= false;


  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private leaseOwnerShipService: LeaseOwnerShipService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {
    this.leaseOwnerShip = new LeaseOwnerShip();
    this.leaseOwnerShip.ID = Guid.create().toString();
  }

  ngOnChanges() {
    console.log("haha lease", this.SelectedPlot);
    if (this.SelectedPlot) {
      this.getleaseOwnerShip(this.SelectedPlot.Plot_ID);
      if (this.addnew) {
        this.leaseOwnerShip.Plot_ID = this.SelectedPlot.Plot_ID;
        console.log("lease select", this.SelectedPlot);
        console.log("lease plot id", this.leaseOwnerShip.Plot_ID);
        
      }
    }

    this.leaseForm = false;
    // this.plotManagment = this.SelectedPlot;
  }

  selectLease(task) {
    this.addnew = false;
    this.leaseForm = true;
    this.leaseOwnerShip = task;
  }

  addLease() {
    this.leaseOwnerShip = new LeaseOwnerShip();
    this.leaseOwnerShip.todoid = this.todoid;
    this.leaseOwnerShip.applicationo = this.applicationo;
    this.leaseOwnerShip.SDP_ID = this.LicenceData.SDP_ID;
    this.addnew = true;
    this.leaseForm = true;
    this.leaseOwnerShip.Plot_ID = this.SelectedPlot.Plot_ID;
  }

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

  save() {
    this.leaseOwnerShipService.save(this.leaseOwnerShip).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );
        this.getleaseOwnerShip(this.SelectedPlot.Plot_ID);

        if(!this.Saved){
          this.completed.emit();
          this.Saved = true;
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
    console.log("saveing....");
  }

  Delete() {
    this.confirmationService.confirm({
      message: "Are you sure u want to delete this Lease?",
      accept: () => {
        this.leaseOwnerShip.Is_Deleted = true;
        this.leaseOwnerShipService.Delete(this.leaseOwnerShip.Lease_No).subscribe(
          (deptSuspension) => {
            const toast = this.notificationsService.success(
              "Sucess",
              deptSuspension
            );

            this.leaseForm = false;

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
      },
    });
  }

  add() {
    this.leaseOwnerShipService.Add(this.leaseOwnerShip).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );
        this.getleaseOwnerShip(this.SelectedPlot.Plot_ID);
        this.leaseForm = false;
        if(!this.Saved){
          this.completed.emit();
          this.Saved = true;
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
    console.log("saveing....");
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(customer, modal) {
    this.leaseOwnerShip.Customer_ID = customer.Customer_ID;
    console.log("closeing.....");
    this.ngxSmartModalService.getModal(modal).close();
  }
}

class LeaseOwnerShip {
  public ID: string;
  public Type_ID: string;
  public Lease_No: string;
  public Lease_Price: string;
  public Free_Hold_M2: string;
  public Lease_Hold_M2: string;
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
