import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { ServiceService } from "../service.service";
import { ServiceComponent } from "../service.component";
import { NgxSmartModalService } from "ngx-smart-modal";
import { NotificationsService } from "angular2-notifications";
import { CertificateVersionService } from "../certificate-version/certificate-version.service";
import { ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-cert",
  templateUrl: "./cert.component.html",
  styleUrls: ["./cert.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class CertComponent implements OnChanges {
  @Output() completed = new EventEmitter();

  @Input() licenceData;
  @Input() todoid;
  @Input() Certificate_Code;
  @Input() disable;
  @Input() AppNo;
  @Input() Fields;
  DeedTable;
  BaseTable;
  // SelectedDeed;
  toLease;
  SelectedBase;
  certForm;
  Selectedcert;
  certverForm;
  CertificateVersion;
  DeedTableview = false;
  noadds = 0;
  isnewBase;
  plotList = [];
  showFullForm = true;
  displayDeed;
  Base = {
    Title_Deed_No: "",
    Registration_Date: "",
    SDP_ID: "",
    Plot_ID: "",
    Ownership_ID: "",
  };
  Saved = false;

  constructor(
    private serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private certificateVersionService: CertificateVersionService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,

  ) { }

  ngOnChanges() {
    this.BaseTable = [];
    this.noadds = 0;
    this.plotList = [];
    if (this.licenceData.Parcel_ID) {
      this.noadds++;
      this.plotList.push({ ID: this.licenceData.Parcel_ID });
      console.log("this.plotList", this.plotList);
      this.getBase(this.licenceData.Parcel_ID);
    }
    if (this.licenceData.Plot_Merge_1) {
      this.noadds++;
      this.plotList.push({ ID: this.licenceData.Plot_Merge_1 });
      console.log("this.plotList", this.plotList);
      this.getBase(this.licenceData.Plot_Merge_1);
    }
    if (this.licenceData.Plot_Merge_2) {
      this.noadds++;
      this.plotList.push({ ID: this.licenceData.Plot_Merge_2 });
      console.log("this.plotList", this.plotList);
      this.getBase(this.licenceData.Plot_Merge_2);
    }
    if (this.licenceData.Plot_Merge_3) {
      this.noadds++;
      this.plotList.push({ ID: this.licenceData.Plot_Merge_3 });
      console.log("this.plotList", this.plotList);
      this.getBase(this.licenceData.Plot_Merge_3);
    }
    if (this.licenceData.Plot_Merge_4) {
      this.noadds++;
      this.plotList.push({ ID: this.licenceData.Plot_Merge_4 });
      console.log("this.plotList", this.plotList);
      this.getBase(this.licenceData.Plot_Merge_4);
    }
    //this.getDeed();
  }

  getDeed(plotID) {
    this.DeedTable = [];
    this.certificateVersionService.getDeedTable(plotID).subscribe(
      (DeedTable) => {
        this.DeedTable = DeedTable;
        console.log(
          "DeedTable =>> plaot id " +
          plotID +
          "  //  DeedTable" +
          this.DeedTable
        );

        for (let i = 0; i < this.DeedTable.length; i++) {
          for (let j = 0; j < this.BaseTable.length; j++) {
            if (
              this.DeedTable[i].Title_Deed_No == this.BaseTable[j].Title_Deed_No
            ) {
              this.DeedTable.splice(i, 1);
            }
          }
        }
        this.showFullForm = false;
        // this.DeedTable = (Object.assign([], this.DeedTable));
        console.log("DeedTable", DeedTable);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getBase(ploat) {
    this.serviceService.getBaseTable(ploat).subscribe(
      (BaseTable) => {
        if (BaseTable) {
          this.BaseTable.push(BaseTable[0]);
        }
        // this.BaseTable = (Object.assign([], this.BaseTable));
        console.log("BaseTable", BaseTable);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  SaveBase(modal) {
    console.log("saveing.....");
    this.serviceService.SaveBase(this.Base).subscribe(
      (certafcateCode) => {
        console.log("certafcateCode", certafcateCode);
        this.notificationsService.success("Sucess", "suceesfully created");
        this.closeModal(modal);
        this.getBase(this.Base.Plot_ID);
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

  EditBase(modal) {
    console.log("saveing.....");
    this.serviceService.EditBase(this.Base).subscribe(
      (certafcateCode) => {
        console.log("certafcateCode", certafcateCode);
        this.notificationsService.success("Sucess", "suceesfully edited");
        this.closeModal(modal);
        this.getBase(this.Base.Plot_ID);
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
            "you have not permission to edit"
          );
        }
      }
    );
  }

  /*
    SelectDeed(Deed) {
      this.SelectedDeed = Deed;
      this.certForm = true;
      this.getCertificateVersion(Deed);
    }*/

  Selectversion(certver) {
    this.Selectedcert = certver;
    this.certverForm = true;
    console.log("certver", certver);
  }

  addversion() {
    this.Selectedcert = {
      Title_Deed_No: this.SelectedBase.Title_Deed_No,
      Ownership_ID: this.SelectedBase.Ownership_ID,
      todoid: this.todoid,
      applicationno: this.AppNo,
      Licence_Service_ID: this.licenceData.Licence_Service_ID,
    };
    this.certverForm = true;
  }

  SelectBase(base) {
    this.DeedTableview = true;
    this.SelectedBase = base;
    this.getCertificateVersion(base);
    console.log("base", base);
  }

  getCertificateVersion(Base) {
    this.serviceService.getCertificateVersion(Base.Title_Deed_No).subscribe(
      (CertificateVersion) => {
        this.CertificateVersion = CertificateVersion;
        this.CertificateVersion = Object.assign(
          [],
          this.CertificateVersion.list
        );
        /*if (this.CertificateVersion.length > 1) {
        this.SelectcertVer(this.CertificateVersion[0]);
      }*/
        console.log("CertificateVersion", CertificateVersion);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  AddNew() {
    this.certForm = true;
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  AddBase(modal) {
    this.Base = {
      Title_Deed_No: "",
      Registration_Date: "",
      SDP_ID: "",
      Plot_ID: "",
      Ownership_ID: "",
    };
    this.Base.SDP_ID = this.licenceData.SDP_ID;
    this.isnewBase = true;
    this.showFullForm = true;
    this.openModal(modal);
  }

  EditBaseView(modal, Base) {
    this.Base = Base;
    this.Base.Registration_Date = this.Base.Registration_Date.split("T")[0];
    this.isnewBase = false;

    this.showFullForm = false;
    this.openModal(modal);
  }

  closeModal(modal) {
    this.ngxSmartModalService.getModal(modal).close();
  }

  closedeedModal(deed, modal) {
    this.Base.Ownership_ID = deed.Ownership_ID;
    console.log("closeingdeed.....");
    this.displayDeed = false;
  }

  EnableFins() {
    if (!this.Saved) {
      this.completed.emit();
      this.Saved = true;
    }
    this.serviceService.disablefins = false;
    this.certverForm = true;
    this.getCertificateVersion(this.SelectedBase);
  }
}
