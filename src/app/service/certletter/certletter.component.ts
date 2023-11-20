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
  basefinal;
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
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    // this.completed.emit();
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
      console.log("this.urlParams", this.urlParams);
      this.printtasktskID = this.urlParams.tskID;
      if (
        "EFCDA235-2B2B-4B77-AFDD-1443FEF7D823".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "BD5FDEC1-3E68-4719-A3C3-1C0D951225A5".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "A4B2A168-F4A3-4E13-94DF-1F325B85A115".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "66EB2750-1710-438E-8F9B-2190BB03651D".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "DF21EA5E-9CAA-473A-A4F5-361E319A0919".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "FF63AE6D-7B09-443D-AAA0-62C36B16DBE3".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "409AAC9A-A49B-4E7A-9BBB-6DB20D4FED54".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "C3C6F487-744C-480D-9994-79975E3786B0".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "C795E41E-5CA7-4D54-9FC0-7E7BC406641A".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "3781CCDD-B1C8-4B86-8B09-A731DFCFCC8F".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "FECC04B0-C33D-4FD2-A89B-A97523857C1D".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "E1CD24F0-3905-4FA2-B758-B2B0F0977BE6".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "27BE4E00-14CA-45BD-B0E8-B87307127363".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "B6E1235A-D1AD-4B7B-B2D4-CD5A042C8432".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "AF89F3BD-A2B0-4EC5-A93A-D1DC55574CE1".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "B131DA74-17E6-415A-BD0A-DAD1A636036E".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "53D146B9-B110-4FC6-8E17-DF70438E2183".toLowerCase() ===
          this.printtasktskID.toLowerCase() ||
        "C6373566-C31A-4429-A95A-FD81C1D37367".toLowerCase() ===
          this.printtasktskID.toLowerCase()
      ) {
        this.isprintedtask = true;
      }
    });
    this.BaseTable = [];
    this.basefinal = [];
    if (this.licenceData.Parcel_ID) {
      this.getBase(this.licenceData.Parcel_ID);
    }
    if (this.licenceData.Parcel_mearge1) {
      this.getBase(this.licenceData.Parcel_mearge1);
    }
    if (this.licenceData.Parcel_mearge2) {
      this.getBase(this.licenceData.Parcel_mearge2);
    }
    if (this.licenceData.Parcel_mearge3) {
      this.getBase(this.licenceData.Parcel_mearge3);
    }
    if (this.licenceData.Plot_Merge_4) {
      this.getBase(this.licenceData.Plot_Merge_4);
    }
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
            this.BaseTable.push(BaseTable[0]);
          }

          console.log("BaseTable", this.BaseTable);
          if (this.BaseTable.length > 0) {
            this.basefinal.push(this.BaseTable[0]);
            this.basefinal = this.removeDuplicates(this.basefinal);
            console.log("BaseTable", this.BaseTable[0]);
          }
        }
        // this.BaseTable = (Object.assign([], this.BaseTable));
      },
      (error) => {
        console.log("error");
      }
    );
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
      this.cerltter.Regstration_Date =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
  }
  Selectversion(certver) {
    if (
      "EFCDA235-2B2B-4B77-AFDD-1443FEF7D823".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "BD5FDEC1-3E68-4719-A3C3-1C0D951225A5".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "A4B2A168-F4A3-4E13-94DF-1F325B85A115".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "66EB2750-1710-438E-8F9B-2190BB03651D".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "DF21EA5E-9CAA-473A-A4F5-361E319A0919".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "FF63AE6D-7B09-443D-AAA0-62C36B16DBE3".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "409AAC9A-A49B-4E7A-9BBB-6DB20D4FED54".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "C3C6F487-744C-480D-9994-79975E3786B0".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "C795E41E-5CA7-4D54-9FC0-7E7BC406641A".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "3781CCDD-B1C8-4B86-8B09-A731DFCFCC8F".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "FECC04B0-C33D-4FD2-A89B-A97523857C1D".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "E1CD24F0-3905-4FA2-B758-B2B0F0977BE6".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "27BE4E00-14CA-45BD-B0E8-B87307127363".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "B6E1235A-D1AD-4B7B-B2D4-CD5A042C8432".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "AF89F3BD-A2B0-4EC5-A93A-D1DC55574CE1".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "B131DA74-17E6-415A-BD0A-DAD1A636036E".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "53D146B9-B110-4FC6-8E17-DF70438E2183".toLowerCase() ===
        this.printtasktskID.toLowerCase() ||
      "C6373566-C31A-4429-A95A-FD81C1D37367".toLowerCase() ===
        this.printtasktskID.toLowerCase()
    ) {
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
    this.serviceService
      .getDocmentArcive(this.SelectedBase.Title_Deed_No)
      .subscribe(
        async (cerltter: any) => {
          a = cerltter;
          console.log("this.cerlettrformList", a);

          this.cerlettrformList = a.list;
          if (this.cerlettrformList.length > 0) {
            if (this.language == "amharic") {
              if ((this.cerlettrformList[0].Regstration_Date! = null)) {
                this.cerlettrformList[0].Regstration_Date =
                  await this.getgregorianToEthiopianDate(
                    this.cerlettrformList[0].Regstration_Date
                  );
              }
            }
          }

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

  async save() {
    this.cerltter.Application_No = this.AppNo;
    if (this.language == "amharic") {
      this.cerltter.Regstration_Date = await this.getEthiopianToGregorian(
        this.cerltter.Regstration_Date
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
          this.cerltter.Regstration_Date =
            await this.getgregorianToEthiopianDate(
              this.cerltter.Regstration_Date
            );
        }
        const toast = this.notificationsService.success("Sucess", message);
      },
      async (error) => {
        console.log(error);
        if (error.status == "400") {
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Errors[0].message
          );
          if (this.language == "amharic") {
            this.cerltter.Regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.Regstration_Date
              );
          }
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
          if (this.language == "amharic") {
            this.cerltter.Regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.Regstration_Date
              );
          }
        }
      }
    );
    console.log("saveing....");
  }

  async add() {
    if (this.language == "amharic") {
      this.cerltter.Regstration_Date = await this.getEthiopianToGregorian(
        this.cerltter.Regstration_Date
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
        const toast = this.notificationsService.success("Sucess", message);
        this.getDocmentArcive();
        this.cerlettrform = false;
      },
      async (error) => {
        console.log(error);
        if (error.status == "400") {
          if (this.language == "amharic") {
            this.cerltter.Regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.Regstration_Date
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
            this.cerltter.Regstration_Date =
              await this.getgregorianToEthiopianDate(
                this.cerltter.Regstration_Date
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
    this.cerltter.Application_No = this.AppNo;
    this.cerltter.Title_Deed_No = this.SelectedBase.Title_Deed_No;
  }

  selectcerltter(cerltter) {
    this.isnew = false;
    this.cerlettrform = true;
    this.cerltter = cerltter;
    if (this.cerltter.Regstration_Date) {
      this.cerltter.Regstration_Date =
        this.cerltter.Regstration_Date.split("T")[0];
    }
    if (this.cerltter.Created_Date) {
      this.cerltter.Created_Date = this.cerltter.Created_Date.split("T")[0];
    }
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
  public Document_Number;
  public Title_Deed_No;
  public Application_No;
  public Room;
  public Site;
  public Block_Floor;
  public Shelf_NO;
  public Shelf_Raw;
  public Shelf_Column;
  public Created_Date;
  public Regstration_Date;
}
