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
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-cert",
  templateUrl: "./cert.component.html",
  styleUrls: ["./cert.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CertComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  ismodaEnable;
  @Input() licenceData;
  @Input() todoid;
  @Input() Certificate_Code;
  @Input() disable;
  @Input() AppNo;
  @Input() Fields;
  @Input() Isfrompprinttask;
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
  PlotManagementList = [];
  PlotManagementListfinal = [];
  BaseTablefinal = [];
  DocumentArc: any;
  isnotprint: boolean;
  isnew: boolean;
  isnews: boolean;
  ceertform: any;

  constructor(
    private serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private certificateVersionService: CertificateVersionService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService
  ) {}

  ngOnChanges() {
    console.log(
      "🚀 ~ file: cert.component.ts:82 ~ CertComponent ~ ngOnChanges ~ Service_ID:",
      this.serviceService.Service_ID
    );
    this.serviceService.getUserRole().subscribe((response: any) => {
      if (response) {
        console.log(
          "🚀 ~ CertComponent ~ this.serviceService.getUserRole ~ response:",
          response
        );
        for (let index = 0; index < response.length; index++) {
          const element = response[index];

          if (
            element.RoleId ==
            "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase()
          ) {
            this.isnotprint = false;
            break;
          } else {
            console.log("responseresponseresponse", element);
            this.isnotprint = true;
          }
          if (
            element.RoleId ==
              "C8E6C4E6-564F-40B9-B672-B8B6D2049777".toLocaleLowerCase() ||
            "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase()
          ) {
            this.isThem = true;
            this.isdept = true;
          } else {
            if (
              this.serviceService.Service_ID ==
                "7d256139-858b-48e7-a298-cae5438e526c" ||
              this.serviceService.Service_ID ===
                "05DB54FC-E388-4E5E-AAAA-BD6141C8E533".toLocaleLowerCase() ||
              this.serviceService.Service_ID ===
                "1c3d5a79-350e-4214-a343-d79e92a86e0f".toLocaleLowerCase()
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
                "7d256139-858b-48e7-a298-cae5438e526c".toLocaleLowerCase() ||
              this.serviceService.Service_ID ===
                "d1a3b83a-aa39-4269-90e4-da551715baef".toLocaleLowerCase()
            ) {
              this.isdept = true;
            } else {
              this.isdept = false;
            }
          }
        }
      }
    });

    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    console.log("this.licenceData", this.licenceData);

    this.BaseTable = [];
    this.noadds = 0;
    this.plotList = [];
    this.PlotManagementList = [];
    this.PlotManagementListfinal = [];
    if (this.licenceData.Parcel_ID) {
      this.noadds++;
      this.getplotlist(this.licenceData.Parcel_ID);
      //  this.plotList.push({ ID: this.licenceData.Parcel_ID });
      console.log("this.plotList", this.plotList);
      //this.getBase(this.licenceData.Parcel_ID);
    }
    if (this.licenceData.Plot_Merge_1) {
      this.noadds++;
      this.getplotlist(this.licenceData.Plot_Merge_1);
      //  this.plotList.push({ ID: this.licenceData.Plot_Merge_1 });
      console.log("this.plotList", this.plotList);
      //this.getBase(this.licenceData.Plot_Merge_1);
    }
    if (this.licenceData.Plot_Merge_2) {
      this.noadds++;
      this.getplotlist(this.licenceData.Plot_Merge_2);
      // this.plotList.push({ ID: this.licenceData.Plot_Merge_2 });
      console.log("this.plotList", this.plotList);
      //this.getBase(this.licenceData.Plot_Merge_2);
    }
    if (this.licenceData.Plot_Merge_3) {
      this.noadds++;
      this.getplotlist(this.licenceData.Plot_Merge_3);
      //this.plotList.push({ ID: this.licenceData.Plot_Merge_3 });
      console.log("this.plotList", this.plotList);
      //this.getBase(this.licenceData.Plot_Merge_3);
    }
    if (this.licenceData.Plot_Merge_4) {
      this.noadds++;
      this.getplotlist(this.licenceData.Plot_Merge_4);
      //this.plotList.push({ ID: this.licenceData.Plot_Merge_4 });
      console.log("this.plotList", this.plotList);
      //this.getBase(this.licenceData.Plot_Merge_4);
    }

    //this.getDeed();
  }
  toggleBlink() {
    var button = document.getElementById("myButton");
    button.classList.toggle("blinking");
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
  getplotlist(plotid) {
    this.serviceService.getPlotManagementApi(plotid).subscribe(
      async (PlotManagementLists: any) => {
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;
        if (PlotManagementList.length > 0) {
          if (PlotManagementList[0].plot_Status == 1) {
            this.getBase(plotid);

            this.PlotManagementList = this.removeDuplicates(PlotManagementList);
          }
        }
        console.log("PlotManagementList", this.PlotManagementListfinal);
        if (this.PlotManagementList.length > 0) {
          this.PlotManagementListfinal.push(this.PlotManagementList[0]);
          this.PlotManagementListfinal = this.removeDuplicates(
            this.PlotManagementListfinal
          );

          console.log("PlotManagementList", this.PlotManagementListfinal);
        }
        for (
          let index = 0;
          index < this.PlotManagementListfinal.length;
          index++
        ) {
          const element = this.PlotManagementListfinal[index];
          if (element.plot_Status == 1) {
            this.PlotManagementListfinal = this.PlotManagementListfinal.filter(
              (x) => x.plot_Status == 1
            );
          }
        }
      },
      (error) => {
        console.log("error");
      }
    );
  }
  removeDuplicates(data) {
    const uniqueArray = data.filter(
      (item, index, self) =>
        self.findIndex((i) => i.plot_ID === item.plot_ID) === index
    );

    return uniqueArray;
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
      (DeedTable: any) => {
        this.DeedTable = DeedTable;
        // console.log(
        //   "DeedTable =>> plaot id " + plotID + "  //  DeedTable" + DeedTable
        // );
        console.log("🚀 ~ CertComponent ~ getDeed ~ DeedTable:", DeedTable);
        // if (this.DeedTable != undefined || this.DeedTable != null) {
        //   for (let i = 0; i < this.DeedTable.length; i++) {
        //     for (let j = 0; j < this.BaseTable.length; j++) {
        //       if (
        //         this.DeedTable[i].Title_Deed_No ==
        //         this.BaseTable[j].Title_Deed_No
        //       ) {
        //         this.DeedTable.splice(i, 1);
        //       }
        //     }
        //   }
        // }
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
          if (!uniqueJobMatchIDs[item.Ownership_ID]) {
            uniqueJobMatchIDs[item.Ownership_ID] = true;
            return true;
          }
          return false;
        });
        this.BaseTable = uniqueData;
        if (this.BaseTable.length > 0) {
          this.BaseTablefinal.push(this.BaseTable[0]);
          this.BaseTablefinal = this.BaseTablefinal.filter(
            (item, index, self) =>
              self.findIndex((i) => i.Ownership_ID === item.Ownership_ID) ===
              index
          );
          console.log("BaseTable", this.BaseTablefinal);
        }
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
        this.serviceService
          .getLicencebyid(this.licenceData.Licence_Service_ID)
          .subscribe((rec: any) => {
            if (rec.procLicense_Services.length > 0) {
              const RID = rec.procLicense_Services[0].RecordNo;
              this.serviceService
                .getDocumentArcbyid(RID)
                .subscribe((DocumentArc: any) => {
                  if (DocumentArc) {
                    this.DocumentArc = DocumentArc.procDocument_Archives;
                    this.DocumentArc[0].title_Deed_No =
                      certafcateCode[0].title_Deed_No;
                    this.serviceService
                      .UpdateDocmentArcive(this.DocumentArc[0])
                      .subscribe(
                        (Licence) => {},
                        (error) => {
                          const toast = this.notificationsService.error(
                            "Error",
                            error.error
                          );
                        }
                      );
                  }
                });
            }
          });

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
  loading2(cert) {
    // this.load=true
    this.ceertform = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.location +
        environment.city +
        "/" +
        environment.Lang_code +
        "/edit_certificate/" +
        cert.title_Deed_No
    );
    // this.load=false
    console.log("ceertform", this.ceertform);
  }
  Selectversion(certver) {
    console.log(
      "city",
      environment.city,
      environment.Lang_code,
      environment.appbase,
      environment.location
    );
    this.serviceService
      .getCertificateVersion1(certver.title_Deed_No)
      .subscribe((CertificateVersion: any) => {
        this.CertificateVersion = CertificateVersion.procCertificate_Versions;
        var img = this.CertificateVersion.filter((x) => x.is_Active == true);
        if (img.length > 0) {
          console.log("img", img[0].certificate_Image);
          if (img[0].certificate_Image) {
            this.Selectedcert = certver;
            this.certverForm = true;
            this.disableTab = false;
            this.displayGIS = false;
            if (certver.is_Active) {
              this.serviceService.disablefins = false;
            } else {
              this.serviceService.disablefins = true;
            }
          } else {
            this.isnew = true;
            this.isnews = true;
          }
        }
      });
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
    this.SelectedBase = base;
    this.DeedTableview = true;
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
