import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { MessageService } from "primeng/api";

import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { DomSanitizer } from "@angular/platform-browser";
import { ServiceService } from "../service.service";
import { CertComponent } from "../cert/cert.component";
import { BehaviorSubject } from "rxjs";
import { CertificateVersionService } from "../certificate-version/certificate-version.service";

@Component({
  selector: "app-certificate-version-upgrade",
  templateUrl: "./certificate-version-upgrade.component.html",
  styleUrls: ["./certificate-version-upgrade.component.css"],
  providers: [MessageService],
})
export class CertificateVersionUpgradeComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  public certificateVersion: CertificateVersion;
  ID = 0;
  isnew = false;
  pictoShow;
  pictoShow1;
  DeedTable;

  @Input() licenceData;
  @Input() Selectedcert;
  @Input() SelectedBase;
  @Input() disable;
  Saved = false;
  @Input() Plot_Registration;
  organization: any;
  data: any;
  aa: boolean;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private messageService: MessageService,
    // public CertComponent: CertComponent,
    public serviceService: ServiceService,
    private certificateVersionService: CertificateVersionService,
    private sanitizer: DomSanitizer,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService
  ) {
    this.certificateVersion = new CertificateVersion();
  }

  ngOnChanges() {
    console.log("hahaha2", this.Selectedcert);
    console.log("hahaha1", this.SelectedBase);
    this.certificateVersion = this.Selectedcert;
    console.log("hahaha3", this.certificateVersion, this.licenceData);

    if (this.certificateVersion.Photo) {
      this.pictoShow =
        "data:image/jpg;base64, " + this.certificateVersion.Photo;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
    }
    if (this.certificateVersion.Partner_Photo) {
      this.pictoShow1 =
        "data:image/jpg;base64, " + this.certificateVersion.Partner_Photo;
      this.pictoShow1 = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
    }
    this.getDeed();
    if (!this.certificateVersion.version_ID) {
      this.isnew = true;
    } else {
      this.isnew = false;
    }
    if (this.certificateVersion) {
      console.log(
        " this.serviceService.Service_ID",
        this.serviceService.Service_ID
      );

      this.certificateVersion.issued_By = this.serviceService.serviceDP;
    }
  }
  // getorglokup(){
  //   this.serviceService.getServiceDeliveryUnitLookUP().subscribe(
  //     data=>{

  //     }
  //   )
  // }

  getDeed() {
    this.certificateVersionService
      .getDeedTable(this.SelectedBase.Plot_ID)
      .subscribe(
        (DeedTable) => {
          this.DeedTable = DeedTable;
          // this.DeedTable = (Object.assign([], this.DeedTable));
          console.log("DeedTable", DeedTable);
        },
        (error) => {
          console.log("error");
        }
      );
  }

  Save() {
    console.log("certificateVersion", this.certificateVersion);
    this.serviceService.currentcertID = this.certificateVersion.title_Deed_No;
    this.certificateVersionService
      .SaveCertificate(this.certificateVersion)
      .subscribe(
        (certificateVersion) => {
          console.log("certificateVersion", certificateVersion);
          const toast = this.notificationsService.success("Sucess edited ");
          this.serviceService.disablefins = false;

          if (!this.Saved) {
            console.log(
              "🚀 ~ CertificateVersionUpgradeComponent ~ Save ~ certificateVersion:",
              this.certificateVersion
            );
            this.completed.emit(this.certificateVersion);
            this.Saved = true;
          }
        },
        (error) => {
          console.log(error);

          // if (error.status == "400") {
          const toast = this.notificationsService.error("Error", error);
          // } else {
          //   const toast = this.notificationsService.error(
          //     "Error",
          //     "SomeThing Went Wrong"
          //   );
          // }
        }
      );
    console.log("saveing....");
    /*console.log(this.certificateVersion);
    this.messageService.add({severity: 'error', sticky: true, summary: 'Error Message', detail: 'Validation failed'});
    this.messageService.add({severity: 'success', sticky: true, summary: 'Error Message', detail: 'Validation failed'});
    this.messageService.add({key: 'custom', sticky: true, severity: 'error', summary: 'Custom Toast', detail: 'With a Gradient'});*/
  }

  add() {
    this.certificateVersionService
      .AddCertificate(this.certificateVersion)
      .subscribe(
        (message) => {
          console.log("message", message);
          //this.CertComponent.disableTab = true;
          const toast = this.notificationsService.success("Sucess saved");
          this.serviceService.disablefins = false;
          this.completed.emit();

          if (!this.Saved) {
            this.Saved = true;
          }
        },
        (error) => {
          console.log(error);
          // if (error.status == "400") {
          const toast = this.notificationsService.error("Error", error.error);
          // } else {
          //   const toast = this.notificationsService.error(
          //     "Error",
          //     "SomeThing Went Wrong"
          //   );
          // }
        }
      );
    console.log("saveing....");
  }

  AddNew() {
    this.certificateVersion = new CertificateVersion();
    // this.certificateVersion.Version_ID = this.Selectedcert.building_No;
    this.certificateVersion.ownership_ID = this.Selectedcert.ownership_ID;
    this.certificateVersion.title_Deed_No = this.SelectedBase.title_Deed_No;
    this.isnew = true;
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(organization, modal) {
    this.certificateVersion.issued_By = organization.organization_code;
    console.log("closeing.....");
    console.log("closeing.....", organization.organization_code);
    this.ngxSmartModalService.getModal(modal).close();
  }

  Uploader(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      base64file = base64file.split(";")[1];
      this.certificateVersion.Photo = base64file;
    });
  }

  upload(event) {
    this.Uploader(event.files[0]);
  }
  

  UploaderPartner(File) {
    let base64file;
    const reader = new FileReader();
    
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      base64file = base64file.split(";")[1];
      this.certificateVersion.Partner_Photo = base64file;
    });
  }

  uploadPartner(event) {
    this.Uploader(event.files[0]);
  }
}

export class CertificateVersion {
  [x: string]: any;
  public Application_No: string;
  public Certificate_ID: number;
  public version_ID: number;
  public Deed_ID: number;
  public color: string;
  public Photo: string;
  public serial_No: string;
  public customerType: string;
  public remark: string;
  public issued_By: string;
  public Expired_Date: string;
  public Is_Printed: boolean;
  public IsIssued: boolean;
  public is_Active: boolean;
  public version_No: string;
  public built_Up_Area: string;
  public ownership_ID;
  public full_Name;
  public title_Deed_No;
  public parnter_Full_Name;
  public locationName;
  public compound_Size_M2;
  public property_Status;
  public property_Type;
  public typeOfuse;
  public houseNo;
  public floor_No;
  public building_No;
  public size_In_Proportional;
  public proportional_from_Compound_Size;
  public woreda;
  public block_No;
  public parcel_No;
  public street_No;
  public land_Grade;
  public nortech_No;
  public n_Plot_ID;
  public s_Plot_ID;
  public e_Plot_ID;
  public w_Plot_ID;
  public Partner_Photo;
}
