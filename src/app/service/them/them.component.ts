import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { ThemService } from "./them.service";
import { NotificationsService } from "angular2-notifications";
import { ServiceComponent } from "../service.component";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ConfirmationService } from "primeng/api";
import { ServiceService } from "../service.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-them",
  templateUrl: "./them.component.html",
  styleUrls: [],
})
export class ThemComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  public themCertificateVersion: ThemCertificateVersion;
  @Input() Selectedcert;
  @Input() licenceData;
  @Input() todoid;
  @Input() disable;
  themCertificateVersionList;
  themform = false;
  isnew = false;
  Saved = false;
  customerdata: any;
  language: string;
  Customerthem: boolean;
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private themService: ThemService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService,
    private serviceService: ServiceService
  ) {
    this.themCertificateVersion = new ThemCertificateVersion();
  }

  ngOnChanges() {
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    this.themform = false;
    console.log("hahaha22", this.Selectedcert, this.licenceData);
    this.getThem(this.Selectedcert.version_ID);
  }
  getcustomer(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerlease(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;
    });
  }
  getThem(Version_ID) {
    this.themService.getAll(Version_ID).subscribe(
      (themCertificateVersionList) => {
        let a;
        a = themCertificateVersionList;
        this.themCertificateVersionList = Object.assign([], a.list);
        console.log(
          "this.titleDeedRegistration",
          this.themCertificateVersionList
        );
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
    this.themCertificateVersion.Licence_Service_ID =
      this.licenceData.Licence_Service_ID;
    this.themCertificateVersion.Application_No =
      this.licenceData.Application_No;
    this.themCertificateVersion.To_Do_ID = this.todoid;
    this.themService.save(this.themCertificateVersion).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );

        if (!this.Saved) {
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
      message: "Are you sure u want to delete this Them?",
      accept: () => {
        this.themCertificateVersion.Licence_Service_ID =
          this.licenceData.Licence_Service_ID;
        this.themCertificateVersion.Application_No =
          this.licenceData.Application_No;
        this.themCertificateVersion.To_Do_ID = this.todoid;
        this.themCertificateVersion.Is_Deleted = true;
        this.themService.save(this.themCertificateVersion).subscribe(
          (deptSuspension) => {
            console.log("deptSuspension", deptSuspension);
            const toast = this.notificationsService.success(
              "Sucess",
              deptSuspension
            );

            this.themform = false;
            const index: number = this.themCertificateVersionList.indexOf(
              this.themCertificateVersion
            );
            if (index !== -1) {
              this.themCertificateVersionList.splice(index, 1);
            }
            if (!this.Saved) {
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
      },
    });
  }

  add() {
    this.themCertificateVersion.Licence_Service_ID =
      this.licenceData.Licence_Service_ID;
    this.themCertificateVersion.Application_No =
      this.licenceData.Application_No;
    this.themCertificateVersion.To_Do_ID = this.todoid;
    this.themService.Add(this.themCertificateVersion).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );
        // this.isnew = false;
        this.themform = false;
        this.getThem(this.themCertificateVersion.Certificate_Version_ID);
        if (!this.Saved) {
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

  addThem() {
    this.themform = true;
    this.isnew = true;
    this.themCertificateVersion = new ThemCertificateVersion();
    this.themCertificateVersion.Certificate_Version_ID =
      this.Selectedcert.version_ID;
  }

  selectThem(them) {
    this.isnew = false;
    this.themform = true;
    this.themCertificateVersion = them;
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(customer) {
    console.log("closeing.....", customer);
    this.themCertificateVersion.Them_Customer_ID = customer.customer_ID;
    console.log("closeing.....", customer.customer_ID);
    //this.ngxSmartModalService.getModal(modal).close();
  }
}

class ThemCertificateVersion {
  public Certificate_Version_ID: string;
  public Them_Customer_ID: string;
  public Remark: string;
  public Date: string;
  public Is_Ative: boolean;
  public Is_Deleted: boolean;
  public Licence_Service_ID;
  public Application_No;
  public To_Do_ID;
}
