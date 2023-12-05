import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from "@angular/core";
import { ServiceService } from "../service.service";
import { ServiceComponent } from "../service.component";
import { NgxSmartModalService } from "ngx-smart-modal";
import { NotificationsService } from "angular2-notifications";
import { CertificateVersionService } from "../certificate-version/certificate-version.service";
import { ViewEncapsulation } from "@angular/core";
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-cert",
  templateUrl: "./cert.component.html",
  styleUrls: ["./cert.component.css"],
  encapsulation: ViewEncapsulation.None,
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
  displayGIS;
  disableTab = false;
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
  language: string;
  isThem: boolean;
  isdept: boolean;

  constructor(
    private serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private modalService: BsModalService,
    private certificateVersionService: CertificateVersionService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService
  ) {}

  ngOnChanges() {
    console.log(
      "🚀 ~ file: cert.component.ts:82 ~ CertComponent ~ ngOnChanges ~ Service_ID:",
      this.serviceService.Service_ID
    );
    if (
      this.serviceService.Service_ID ==
        "7d256139-858b-48e7-a298-cae5438e526c" ||
      this.serviceService.Service_ID ==
        "d1a3b83a-aa39-4269-90e4-da551715baef" ||
      this.serviceService.Service_ID ===
        "05DB54FC-E388-4E5E-AAAA-BD6141C8E533".toLocaleLowerCase()
    ) {
      this.isThem = true;
    } else {
      this.isThem = false;
    }

    if (
      this.serviceService.Service_ID ==
        "1c3d5a79-350e-4214-a343-d79e92a86e0f" ||
      this.serviceService.Service_ID ===
        "05DB54FC-E388-4E5E-AAAA-BD6141C8E533".toLocaleLowerCase() ||
      this.serviceService.Service_ID ===
        "7d256139-858b-48e7-a298-cae5438e526c".toLocaleLowerCase()
    ) {
      this.isdept = true;
    } else {
      this.isdept = false;
    }

    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    console.log("this.licenceData", this.licenceData);

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
  async getEthiopianToGregorian(date) {
    console.log("checkingdate", date);
    if (date) {
      var datenow = await this.serviceService
        .getEthiopianToGregorian(date)
        .toPromise();
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
    if (selecter == 1) {
      this.Base.Registration_Date =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
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
        if (this.DeedTable != undefined || this.DeedTable != null) {
          for (let i = 0; i < this.DeedTable.length; i++) {
            for (let j = 0; j < this.BaseTable.length; j++) {
              if (
                this.DeedTable[i].Title_Deed_No ==
                this.BaseTable[j].Title_Deed_No
              ) {
                this.DeedTable.splice(i, 1);
              }
            }
          }
        }
        const uniqueJobMatchIDs = {};
        const uniqueData = this.DeedTable.filter((item) => {
          if (!uniqueJobMatchIDs[item.Property_ID]) {
            uniqueJobMatchIDs[item.Property_ID] = true;
            return true;
          }
          return false;
        });
        this.DeedTable = uniqueData;
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
      async (BaseTable: any) => {
        if (BaseTable) {
          if (this.language == "amharic") {
            BaseTable[0].Registration_Date =
              await this.getgregorianToEthiopianDate(
                BaseTable[0].Registration_Date
              );
          }
        }
        // this.BaseTable = (Object.assign([], this.BaseTable));
        const uniqueJobMatchIDs = {};
        const uniqueData = BaseTable.filter((item) => {
          if (!uniqueJobMatchIDs[item.Title_Deed_No]) {
            uniqueJobMatchIDs[item.Title_Deed_No] = true;
            return true;
          }
          return false;
        });
        this.BaseTable = uniqueData;
        console.log("BaseTable", BaseTable);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  modalRef: BsModalRef;
  openModall(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }
  closeModall() {
    // console.log('closeing.....');
    this.modalRef.hide();
  }
  async SaveBase(modal) {
    if (this.language == "amharic") {
      this.Base.Registration_Date = await this.getEthiopianToGregorian(
        this.Base.Registration_Date
      );
      console.log("saveing.....", this.Base.Registration_Date);
    }
    this.serviceService.SaveBase(this.Base).subscribe(
      (certafcateCode) => {
        console.log("certafcateCode", certafcateCode);
        this.notificationsService.success("Sucess", "suceesfully created");
        this.displayGIS = false;
        // this.closeModall();
        this.getBase(this.Base.Plot_ID);
      },
      async (error) => {
        console.log(error);
        // if (error.status == "400") {
        if (this.language == "amharic") {
          this.Base.Registration_Date = await this.getgregorianToEthiopianDate(
            this.Base.Registration_Date
          );
        }
        const toast = this.notificationsService.error(
          "Error",
          error.error.InnerException.Errors[0].message
        );
        // } else {
        //   if (this.language == "amharic") {
        //     this.Base.Registration_Date =
        //       await this.getgregorianToEthiopianDate(
        //         this.Base.Registration_Date
        //       );
        //   }
        //   const toast = this.notificationsService.error(
        //     "Error",
        //     "SomeThing Went Wrong"
        //   );
        // }
      }
    );
  }

  async EditBase(modal) {
    console.log("saveing.....");
    if (this.language == "amharic") {
      this.Base.Registration_Date = await this.getEthiopianToGregorian(
        this.Base.Registration_Date
      );
    }
    this.serviceService.EditBase(this.Base).subscribe(
      (certafcateCode) => {
        console.log("certafcateCode", certafcateCode);
        this.notificationsService.success("Sucess", "suceesfully edited");
        this.displayGIS = false;
        // this.closeModall();
        this.getBase(this.Base.Plot_ID);
      },
      async (error) => {
        console.log(error);

        if (this.language == "amharic") {
          this.Base.Registration_Date = await this.getgregorianToEthiopianDate(
            this.Base.Registration_Date
          );
        }
        const toast = this.notificationsService.error("Error", error);
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
    this.disableTab = false;
    this.displayGIS = false;
    if (certver.is_Active) {
      this.serviceService.disablefins = false;
    } else {
      this.serviceService.disablefins = true;
    }

    console.log("certver", certver);
  }

  addversion() {
    this.disableTab = false;
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
    this.serviceService.getCertificateVersion1(Base.Title_Deed_No).subscribe(
      (CertificateVersion: any) => {
        this.CertificateVersion = CertificateVersion.procCertificate_Versions;
        const uniqueJobMatchIDs = {};
        const uniqueData = this.CertificateVersion.filter((item) => {
          if (!uniqueJobMatchIDs[item.version_ID]) {
            uniqueJobMatchIDs[item.version_ID] = true;
            return true;
          }
          return false;
        });
        this.CertificateVersion = uniqueData;
        console.log("CertificateVersion", this.CertificateVersion);

        // this.CertificateVersion = Object.assign(
        //   [],
        //   this.CertificateVersion.list
        // );
        /*if (this.CertificateVersion.length > 1) {
        this.SelectcertVer(this.CertificateVersion[0]);
      }*/
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
    this.displayGIS = true;
    // this.openModall(modal);
  }

  EditBaseView(modal, Base) {
    this.Base = Base;
    this.Base.Registration_Date = this.Base.Registration_Date.split("T")[0];
    this.isnewBase = false;
    this.displayGIS = true;
    this.showFullForm = false;
    // this.openModall(modal);
  }

  closeModal(modal) {
    this.ngxSmartModalService.getModal(modal).close();
  }

  closedeedModal(deed, modal) {
    this.Base.Ownership_ID = deed.Ownership_ID;
    this.Base.Title_Deed_No = deed.Property_ID;
    console.log("closeingdeed.....");
    this.displayDeed = false;
  }

  EnableFins() {
    this.disableTab = true;
    if (!this.Saved) {
      this.completed.emit();
      this.Saved = true;
    }
    this.serviceService.disablefins = false;
    this.certverForm = true;
    this.getCertificateVersion(this.SelectedBase);
  }
}
