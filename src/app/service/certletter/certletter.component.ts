import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { environment } from "../../../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { ServiceService } from "../service.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import { NotificationsService } from "angular2-notifications";
import { CertificateVersionService } from "../certificate-version/certificate-version.service";
import { ServiceComponent } from "../service.component";
import { ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-certletter",
  templateUrl: "./certletter.component.html",
  styleUrls: ["./certletter.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CertletterComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Input() AppNo;
  highlighted;
  @Input() certCode;
  @Input() disable;
  @Input() licenceData;
  certReportPath;
  LetterReportPath;
  isnew;
  public cerltter: Cerltter;
  cerlettrformList;
  cerlettrform = false;

  SelectedBase;
  BaseTable;
  Selectedcert;
  certltrview;
  DeedTableview;
  CertificateVersion;
  Saved = false;
  urlParams: any;
  language: string;
  disable_new: boolean;
  loadingPreDoc = false;
  yourQRCodeDatacert: string;
  yourQRCodeDataLetter: string;
  printtasktskID: any;
  isprintedtask: boolean;
  maxWidth: string = "1800px";
  isMaximized: boolean;
  Isfrompprinttask: Boolean = true;
  isshow: boolean = false;
  basefinal;
  PlotManagementList = [];
  PlotManagementListfinal = [];
  prepareCertificateFields = {
    FIELD_ONE: "Branch name",
  };
  plotRegistrationFields = {
    FIELD_ONE: "Plot id",
  };
  isThem: boolean;
  isdept: boolean;

  isNewformat: boolean = false;
  constructor(
    private sanitizer: DomSanitizer,
    public serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private certificateVersionService: CertificateVersionService,
    public serviceComponent: ServiceComponent,
    private routerService: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {
    this.cerltter = new Cerltter();
  }
  isCertifcatePrintforConfirmation: boolean;
  isLetterPrintingConfirmation: boolean;
  ngOnChanges() {
    console.log(
      "🚀 ~ file: cert.component.ts:82 ~ CertComponent ~ ngOnChanges ~ Service_ID:",
      this.serviceService.Service_ID
    );
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
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    if (
      this.serviceService.Service_ID ===
      "05db54fc-e388-4e5e-aaaa-bd6141c8e533".toLocaleLowerCase()
    ) {
      this.isNewformat = true;
    } else {
      this.isNewformat = true;
    }
    // this.completed.emit();
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
      console.log("this.urlParams", this.urlParams);
      this.printtasktskID = this.urlParams.tskID;
      console.log("PlotManagementList", this.licenceData);
    });
    this.BaseTable = [];
    this.basefinal = [];
    if (this.licenceData.Parcel_ID) {
      this.getplotlist(this.licenceData.Parcel_ID);
    }
    if (this.licenceData.Plot_Merge_1) {
      this.getplotlist(this.licenceData.Plot_Merge_1);
    }
    if (this.licenceData.Plot_Merge_2) {
      this.getplotlist(this.licenceData.Plot_Merge_2);
    }
    if (this.licenceData.Plot_Merge_3) {
      this.getplotlist(this.licenceData.Plot_Merge_3);
    }
    if (this.licenceData.Plot_Merge_4) {
      this.getplotlist(this.licenceData.Plot_Merge_4);
    }
  }
  getplotlist(plotid) {
    console.log("PlotManagementList", plotid);
    this.serviceService.getPlotManagementApi(plotid).subscribe(
      async (PlotManagementLists: any) => {
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;
        if (PlotManagementList.length > 0) {
          if (PlotManagementList[0].plot_Status == 1) {
            this.getBase(plotid);

            this.PlotManagementList = this.removeDuplicates(PlotManagementList);
          }
        }
        console.log("PlotManagementList", this.PlotManagementList);
        if (this.PlotManagementList.length > 0) {
          this.PlotManagementListfinal.push(this.PlotManagementList[0]);
          this.PlotManagementListfinal = this.removeDuplicatesplot(
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

          if (BaseTable.length > 0) {
            this.BaseTable = BaseTable;
            this.BaseTable = this.removeDuplicates(this.BaseTable);
          }

          console.log("BaseTable", this.BaseTable);
          if (this.BaseTable.length > 0) {
            this.basefinal.push(this.BaseTable[0]);
            this.basefinal = this.removeDuplicates(this.basefinal);
            console.log("BaseTablefinal", this.basefinal);
          }
        }
        // this.BaseTable = (Object.assign([], this.BaseTable));
      },
      (error) => {
        console.log("error");
      }
    );
  }
  removeDuplicatesplot(data) {
    const uniqueArray = data.filter(
      (item, index, self) =>
        self.findIndex((i) => i.plot_ID === item.plot_ID) === index
    );

    return uniqueArray;
  }
  removeDuplicates(data) {
    const uniqueArray = data.filter(
      (item, index, self) =>
        self.findIndex((i) => i.Title_Deed_No === item.Title_Deed_No) === index
    );

    return uniqueArray;
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
    console.log(
      "🚀 ~ CertletterComponent ~ getgregorianToEthiopianDate ~ date:",
      date
    );

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
      this.cerltter.regstration_Date =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
  }
  Selectversion(certver) {
    if (this.serviceService.ishavetitleDeedRegistrationList) {
      this.isprintedtask = true;
      this.completed.emit();
      //his.serviceService.disablefins = false;
    } else {
      this.serviceService.disablefins = false;
    }
    console.log("SelectedcertSelectedcert", this.Selectedcert);

    this.Selectedcert = certver;
    this.certltrview = true;
    this.getDocmentArcive();
    if (this.Selectedcert) {
      // this.yourQRCodeDatacert =
      //   environment.certReportPath + "/" + this.Selectedcert.title_Deed_No;
      // this.yourQRCodeDataLetter =
      //   environment.LetterReportPath + "/" + this.Selectedcert.title_Deed_No;
      this.certReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.certReportPath + "/" + this.Selectedcert.title_Deed_No
      );

      this.LetterReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.LetterReportPath + "/" + this.Selectedcert.title_Deed_No
      );
    }

    console.log("certver", certver);
    console.log("certReportPath", this.certReportPath);
    console.log("certver", this.LetterReportPath);
  }
  openFullModal() {
    this.isMaximized = true;
    this.maxWidth = "2000px"; // Set the max width for full modal
  }

  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "1000px"; // Set the max width for mini modal
  }

  SelectBase(base) {
    this.DeedTableview = true;
    this.SelectedBase = base;
    this.getCertificateVersion(base);
    console.log("base", base);

    this.getDocmentArcive();
  }

  getCertificateVersion(Base) {
    this.loadingPreDoc = true;
    this.serviceService.getCertificateVersion1(Base.Title_Deed_No).subscribe(
      (CertificateVersion: any) => {
        if (CertificateVersion) {
          this.loadingPreDoc = false;
          this.CertificateVersion = CertificateVersion.procCertificate_Versions;
          this.CertificateVersion = this.CertificateVersion.filter(
            (x) => x.is_Active == 1
          );
          console.log("CertificateVersion1", this.CertificateVersion);

          // this.CertificateVersion = Object.assign(
          //   [],
          //   this.CertificateVersion.list
          // );
          /*if (this.CertificateVersion.length > 1) {
        this.SelectcertVer(this.CertificateVersion[0]);
      }*/
          console.log("CertificateVersion", CertificateVersion);
        }
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getDocmentArcive() {
    console.log("this.cerlettrformList", this.SelectedBase.Title_Deed_No);
    let a;
    if (this.SelectedBase != undefined) {
      this.serviceService
        .getDocmentArcive(this.SelectedBase.Title_Deed_No)
        .subscribe(
          async (cerltter: any) => {
            a = cerltter;

            this.cerlettrformList = a.procDocument_Archives;
            console.log("this.cerlettrformList", this.cerlettrformList);
            this.cerlettrformList = this.cerlettrformList.filter(
              (x) => x.title_Deed_No == this.SelectedBase.Title_Deed_No
            );

            // if (this.cerlettrformList != undefined) {
            //   if (this.language == "amharic") {
            //     if ((this.cerlettrformList[0].Regstration_Date! = null)) {
            //       this.cerlettrformList[0].Regstration_Date =
            //         await this.getgregorianToEthiopianDate(
            //           this.cerlettrformList[0].Regstration_Date
            //         );
            //     }
            //   }
            // }

            if (this.cerlettrformList.length > 0) {
              this.disable_new = true;
            } else {
              this.disable_new = false;
            }
            console.log("this.cerlettrformList", this.cerlettrformList);
            console.log("this.cerltter", this.cerltter);
            /* if (a.list.length) {
         this.isnew = false;
       } else {
         this.isnew = true;
         this.cerltter.Title_Deed_No = this.certCode;
       }*/
          },
          (error) => {
            console.log("error");
          }
        );
    }
  }

  async save() {
    this.cerltter.application_No = this.AppNo;
    if (this.language == "amharic") {
      this.cerltter.regstration_Date = await this.getEthiopianToGregorian(
        this.cerltter.regstration_Date
      );
    }
    this.serviceService.UpdateDocmentArcive(this.cerltter).subscribe(
      async (message) => {
        console.log("message", message);
        this.serviceService.disablefins = false;
        if (!this.Saved) {
          this.completed.emit();
          this.Saved = true;
        }
        if (this.language == "amharic") {
          this.cerltter.regstration_Date =
            await this.getgregorianToEthiopianDate(
              this.cerltter.regstration_Date
            );
        }
        const toast = this.notificationsService.success("Sucess");
      },
      async (error) => {
        console.log(error);
        if (error.status == "400") {
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Errors[0].message
          );
          if (this.language == "amharic") {
            this.cerltter.regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.regstration_Date
              );
          }
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
          if (this.language == "amharic") {
            this.cerltter.regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.regstration_Date
              );
          }
        }
      }
    );
    console.log("saveing....");
  }

  async add() {
    if (this.language == "amharic") {
      this.cerltter.regstration_Date = await this.getEthiopianToGregorian(
        this.cerltter.regstration_Date
      );
    }
    this.serviceService.CreateDocmentArcive(this.cerltter).subscribe(
      async (message) => {
        console.log("message", message);
        this.serviceService.disablefins = false;
        if (!this.Saved) {
          this.completed.emit();
          this.Saved = true;
        }
        const toast = this.notificationsService.success("Sucess");
        this.getDocmentArcive();
        this.cerlettrform = false;
      },
      async (error) => {
        console.log(error);
        if (error.status == "400") {
          if (this.language == "amharic") {
            this.cerltter.regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.regstration_Date
              );
          }
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Errors[0].message
          );
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
          if (this.language == "amharic") {
            this.cerltter.regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.regstration_Date
              );
          }
        }
      }
    );
    console.log("saveing....");
  }

  addcerltter() {
    this.cerlettrform = true;
    this.isnew = true;
    this.cerltter = new Cerltter();
    //this.cerltter.Title_Deed_No = this.certCode;
    this.cerltter.application_No = this.AppNo;
    this.cerltter.title_Deed_No = this.SelectedBase.Title_Deed_No;
  }

  async selectcerltter(cerltter) {
    this.isnew = false;
    this.cerlettrform = true;
    this.cerltter = cerltter;

    if (this.cerltter.regstration_Date) {
      if (this.language == "amharic") {
        this.cerltter.regstration_Date = await this.getgregorianToEthiopianDate(
          this.cerltter.regstration_Date
        );
      } else {
        this.cerltter.regstration_Date =
          this.cerltter.regstration_Date.split("T")[0];
      }
    }
    // if (this.cerltter.created_Date) {
    //   this.cerltter.created_Date = this.cerltter.created_Date.split("T")[0];
    // }
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }
  closeModal(modal) {
    this.ngxSmartModalService.getModal(modal).close();
    // this.ngxSmartModalService.close('Letter');
  }
}

export class Cerltter {
  public document_Number;
  public title_Deed_No;
  public application_No;
  public room;
  public site;
  public block_Floor;
  public shelf_NO;
  public shelf_Raw;
  public shelf_Column;
  public sreated_Date;
  public regstration_Date;
}
