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
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-certversionupgrade",
  templateUrl: "./certversionupgrade.component.html",
  styleUrls: ["./certversionupgrade.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CertversionupgradeComponent implements OnChanges {
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
  // certletter

  highlighted;

  certReportPath;
  LetterReportPath;

  public cerltter: Cerltter;
  cerlettrformList;
  cerlettrform = false;

  urlParams: any;

  disable_new: boolean;
  loadingPreDoc = false;
  yourQRCodeDatacert: string;
  yourQRCodeDataLetter: string;
  printtasktskID: any;
  isprintedtask: boolean;
  maxWidth: string = "1800px";
  isMaximized: boolean;

  isshow: boolean = false;
  basefinal;

  prepareCertificateFields = {
    FIELD_ONE: "Branch name",
  };
  plotRegistrationFields = {
    FIELD_ONE: "Plot id",
  };

  isNewformat: boolean = false;
  certltrview: boolean;
  printenable: boolean;
  multipleplotcanbeadd: boolean = true;
  AppNonumber: any;
  BaseTablefinalALL=[];
  cuurentversionselected: any;
  constructor(
    public serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private certificateVersionService: CertificateVersionService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private activatedRoute: ActivatedRoute
  ) {}
  isCertifcatePrintforConfirmation: boolean;
  isLetterPrintingConfirmation: boolean;
  ngOnChanges() {
    console.log(
      "🚀 ~ file: cert.component.ts:82 ~ CertComponent ~ ngOnChanges ~ Service_ID:",
      this.serviceService.Service_ID
    );
    this.activatedRoute.params.subscribe(async (params: Params) => {
      this.AppNonumber = params["AppNo"];
    });
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
              "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase() ||
            element.RoleId ==
              "C8E6C4E6-564F-40B9-B672-B8B6D2049777".toLocaleLowerCase() ||
              element.RoleId ==
              "4E10B26B-B722-444F-90B2-1E138A1C9ECA".toLocaleLowerCase() 
          
          ) {
            if (
              this.serviceService.Service_ID ==
                "7D256139-858B-48E7-A298-CAE5438E526C".toLocaleLowerCase() &&
              this.licenceData.Parcel_ID == null
            ) {
              this.isnotprint = true;
              break;
            } else {
              this.isnotprint = false;
              break;
            }
          } else {
            console.log("responseresponseresponse", element);
            this.isnotprint = true;
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
    this.BaseTablefinalALL=[];
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
    // debugger
    this.DeedTable = [];
  
    this.certificateVersionService.getDeedTable(plotID).subscribe(
      (DeedTable: any) => {
        this.DeedTable = DeedTable;
        // console.log(
        //   "DeedTable =>> plaot id " + plotID + "  //  DeedTable" + DeedTable
        // );
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
        this.DeedTable = this.DeedTable.filter((x) => x.Is_Active == true);
        console.log(
          "🚀 ~ CertComponent ~ getDeed ~ DeedTable:",
          this.DeedTable
        );
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

  // getBase(ploat) {
  //   this.serviceService.getBaseTable(ploat).subscribe(
  //     async (BaseTable: any) => {
  //       if (BaseTable) {
  //         if (this.language == "amharic") {
  //           BaseTable[0].Registration_Date =
  //             await this.getgregorianToEthiopianDate(
  //               BaseTable[0].Registration_Date
  //             );
  //         }
  //       }
  //       // this.BaseTable = (Object.assign([], this.BaseTable));
  //       const uniqueJobMatchIDs = {};
  //       const uniqueData = BaseTable.filter((item) => {
  //         if (!uniqueJobMatchIDs[item.title_Deed_No]) {
  //           uniqueJobMatchIDs[item.title_Deed_No] = true;
  //           return true;
  //         }
  //         return false;
  //       });
  //       this.BaseTable = uniqueData;
  //       if (this.BaseTable.length > 0) {
  //         this.BaseTablefinal.push(this.BaseTable[0])
  //         this.BaseTablefinal = this.BaseTablefinal.filter(
  //           (item, index, self) =>
  //             self.findIndex((i) => i.Ownership_ID === item.Ownership_ID && i.title_Deed_No === item.title_Deed_No) ===
  //             index
  //         );
  //         console.log("BaseTable", this.BaseTablefinal);
  //       }
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }
  getBase(ploat) {
    this.serviceService.getBaseTable(ploat).subscribe(
      async (BaseTable: any) => {
        if (BaseTable.length > 0) {
          const newUniqueItems = this.getUniqueItems(BaseTable, ['Ownership_ID', 'Plot_ID', 'Title_Deed_No']);
          this.BaseTablefinal = []; // Clear existing data before updating
          this.mergeUniqueItems(newUniqueItems);
          console.log("BaseTable", this.BaseTablefinal);
        }
      },
      (error) => {
        console.log("error");
      }
    );
  }
  
  getUniqueItems(data, keys) {
    const uniqueSet = new Set();
    const uniqueArray = [];
  
    data.forEach(item => {
      const combination = keys.map(key => item[key]).join('|');
      if (!uniqueSet.has(combination)) {
        uniqueSet.add(combination);
        uniqueArray.push(item);
      }
    });
  
    return uniqueArray;
  }
  
  mergeUniqueItems(newItems) {

    const uniqueJobMatchIDs = {};
        const uniqueData = newItems.filter((item) => {
          if (!uniqueJobMatchIDs[item.Title_Deed_No]) {
            uniqueJobMatchIDs[item.Title_Deed_No] = true;
            return true;
          }
          return false;
        });
        this.BaseTablefinalALL.push([...uniqueData]);
    
  
  
    console.log("🚀 ~ CertComponent ~ mergeUniqueItems ~ BaseTablefinalALL:", this.BaseTablefinalALL);
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
    console.log("🚀 ~ CertversionupgradeComponent ~ Selectversion ~ certver:", certver)
   this.cuurentversionselected=certver.version_ID
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
        console.log("🚀 ~ CertversionupgradeComponent ~ .subscribe ~ CertificateVersion:", this.CertificateVersion)
       
        var img = this.CertificateVersion.filter((x) => x.is_Active == true);
        if (img.length > 0) {
          //console.log("img", img[0].certificate_Image);
          this.getDocmentArcive();
          if (img[0].certificate_Image) {
            this.Selectedcert = certver;
            this.certverForm = true;
            this.disableTab = false;
            this.displayGIS = false;
            if (certver.is_Active) {
              if (this.serviceService.isRecordDocumentationManager === true) {
                //   this.completed.emit();
                // this.serviceService.disablefins = false;
                this.addcerltter();
              } else {
            
                this.serviceService
                  .GetCertficate_ver_Validation(
                    this.serviceService.LicenceserviceID,
                    this.cuurentversionselected                   
                  )
                  .subscribe((message: any) => {
                    if (message.Message == "1") {
                      this.serviceService.disablefins = false;

                      this.completed.emit();
                    } else {
                      const toast = this.notificationsService.error(
                        "Error",
                        message.Message
                      );
                    }
                  });
              }
            } else {
              this.serviceService.disablefins = true;
            }
          } else {
            this.isnew = true;
            this.isnews = true;
          }
        }
        if (this.serviceService.ishavetitleDeedRegistrationList) {
          this.isprintedtask = true;
          if (this.serviceService.isRecordDocumentationManager === false) {
             
            this.serviceService
              .GetCertficate_ver_Validation(
                this.serviceService.LicenceserviceID,
                    this.cuurentversionselected
              )
              .subscribe((message: any) => {
                if (message.Message == "1") {
                  this.completed.emit();
                } else {
                  const toast = this.notificationsService.error(
                    "Error",
                    message
                  );
                }
              });
          }
          //his.serviceService.disablefins = false;
        } else {
          //this.serviceService.disablefins = false;
        }

        console.log("SelectedcertSelectedcert", this.Selectedcert);

        this.Selectedcert = certver;
        this.certltrview = true;

        if (this.Selectedcert) {
          // this.yourQRCodeDatacert =
          //   environment.certReportPath + "/" + this.Selectedcert.title_Deed_No;
          // this.yourQRCodeDataLetter =
          //   environment.LetterReportPath + "/" + this.Selectedcert.title_Deed_No;
          this.certReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
            environment.certReportPath + "/" + this.Selectedcert.title_Deed_No
          );

          console.log("🚀 ~ CertversionupgradeComponent ~ .subscribe ~ certReportPath:", this.certReportPath)
          
          this.LetterReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
            environment.LetterReportPath + "/" + this.AppNonumber
          );
          // + "/"+this.Selectedcert.title_Deed_No
          this.printenable = true;
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
        this.CertificateVersion = CertificateVersion.procCertificate_Versions
        .sort((a, b) => {
          // If a's is_Active is true and b's is_Active is false, a comes first
          if (a.is_Active && !b.is_Active) {
            return -1;
          }
          // If a's is_Active is false and b's is_Active is true, b comes first
          else if (!a.is_Active && b.is_Active) {
            return 1;
          }
          // For all other cases, maintain the current order
          else {
            return 0;
          }
        });

        const uniqueJobMatchIDs = {};
        const uniqueData = this.CertificateVersion.filter((item) => {
          if (!uniqueJobMatchIDs[item.version_No]) {
            uniqueJobMatchIDs[item.version_No] = true;
            return true;
          }
          return false;
        });
        this.CertificateVersion = uniqueData;
        let fitlercert=this.CertificateVersion.filter(x=>x.is_Active == true)
        console.log("CertificateVersion", this.CertificateVersion ,this.serviceService.Service_ID);
        if ("de4937d8-bdcd-46d6-8749-dc31c9f3adcf".toString() == this.serviceService.Service_ID || fitlercert.length==0){
          this.completed.emit();
        }

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
    // if (!this.Saved) {
    //   this.completed.emit();
    //   this.Saved = true;
    // }
    // this.serviceService.disablefins = false;
    if ("DE4937D8-BDCD-46D6-8749-DC31C9F3ADCF".toString() == this.serviceService.Service_ID){
      this.completed.emit();
    }else{
    this.serviceService
      .GetCertficate_ver_Validation(
        this.serviceService.LicenceserviceID,
        this.cuurentversionselected
      )
      .subscribe((message: any) => {
        if (message.Message == "1") {
          this.serviceService.disablefins = false;

          this.completed.emit();
        } else {
          const toast = this.notificationsService.error("Error", message.Message);
        }
      });
    this.certverForm = true;
    this.getCertificateVersion(this.SelectedBase);
    }
  }
  //cetr letter

  // getplotlist(plotid) {
  //   console.log("PlotManagementList", plotid);
  //   this.serviceService.getPlotManagementApi(plotid).subscribe(
  //     async (PlotManagementLists: any) => {
  //       let PlotManagementList = PlotManagementLists.procPlot_Registrations;
  //       if (PlotManagementList.length > 0) {
  //         if (PlotManagementList[0].plot_Status == 1) {
  //           this.getBase(plotid);

  //           this.PlotManagementList = this.removeDuplicates(PlotManagementList);
  //         }
  //       }
  //       console.log("PlotManagementList", this.PlotManagementList);
  //       if (this.PlotManagementList.length > 0) {
  //         this.PlotManagementListfinal.push(this.PlotManagementList[0]);
  //         this.PlotManagementListfinal = this.removeDuplicatesplot(
  //           this.PlotManagementListfinal
  //         );
  //         console.log("PlotManagementList", this.PlotManagementListfinal);
  //       }
  //       for (
  //         let index = 0;
  //         index < this.PlotManagementListfinal.length;
  //         index++
  //       ) {
  //         const element = this.PlotManagementListfinal[index];
  //         if (element.plot_Status == 1) {
  //           this.PlotManagementListfinal = this.PlotManagementListfinal.filter(
  //             (x) => x.plot_Status == 1
  //           );
  //         }
  //       }
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }

  // getBase(ploat) {
  //   this.serviceService.getBaseTable(ploat).subscribe(
  //     async (BaseTable: any) => {
  //       if (BaseTable) {
  //         if (this.language == "amharic") {
  //           BaseTable[0].Registration_Date =
  //             await this.getgregorianToEthiopianDate(
  //               BaseTable[0].Registration_Date
  //             );
  //         }

  //         if (BaseTable.length > 0) {
  //           this.BaseTable = BaseTable;
  //           this.BaseTable = this.removeDuplicates(this.BaseTable);
  //         }

  //         console.log("BaseTable", this.BaseTable);
  //         if (this.BaseTable.length > 0) {
  //           this.basefinal.push(this.BaseTable[0]);
  //           this.basefinal = this.removeDuplicates(this.basefinal);
  //           console.log("BaseTablefinal", this.basefinal);
  //         }
  //       }
  //       // this.BaseTable = (Object.assign([], this.BaseTable));
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }
  removeDuplicatesplot(data) {
    const uniqueArray = data.filter(
      (item, index, self) =>
        self.findIndex((i) => i.plot_ID === item.plot_ID) === index
    );

    return uniqueArray;
  }
  // removeDuplicates(data) {
  //   const uniqueArray = data.filter(
  //     (item, index, self) =>
  //       self.findIndex((i) => i.Title_Deed_No === item.Title_Deed_No) === index
  //   );

  //   return uniqueArray;
  // }
  // async getEthiopianToGregorian(date) {
  //   if (date) {
  //     var datenow = await this.serviceService
  //       .getEthiopianToGregorian(date)
  //       .toPromise();
  //     console.log(datenow);
  //     return datenow.nowTime;
  //   }
  // }
  // async getgregorianToEthiopianDate(date) {
  //   console.log(
  //     "🚀 ~ CertletterComponent ~ getgregorianToEthiopianDate ~ date:",
  //     date
  //   );

  //   if (date != "0001-01-01T00:00:00") {
  //     var datenow = await this.serviceService
  //       .getgregorianToEthiopianDate(date)
  //       .toPromise();
  //     console.log(datenow);
  //     return datenow.nowTime;
  //   }
  // }
  // selectedDateTime(dates: any, selecter) {
  //   if (selecter == 1) {
  //     this.cerltter.regstration_Date =
  //       dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
  //   }
  // }
  // Selectversion(certver) {
  //   if (this.serviceService.ishavetitleDeedRegistrationList) {
  //     this.isprintedtask = true;
  //     this.completed.emit();
  //     //his.serviceService.disablefins = false;
  //   } else {
  //     this.serviceService.disablefins = false;
  //   }
  //   console.log("SelectedcertSelectedcert", this.Selectedcert);

  //   this.Selectedcert = certver;
  //   this.certltrview = true;
  //   this.getDocmentArcive();
  //   if (this.Selectedcert) {
  //     // this.yourQRCodeDatacert =
  //     //   environment.certReportPath + "/" + this.Selectedcert.title_Deed_No;
  //     // this.yourQRCodeDataLetter =
  //     //   environment.LetterReportPath + "/" + this.Selectedcert.title_Deed_No;
  //     this.certReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
  //       environment.certReportPath + "/" + this.Selectedcert.title_Deed_No
  //     );

  //     this.LetterReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
  //       environment.LetterReportPath + "/" + this.Selectedcert.title_Deed_No
  //     );
  //   }

  //   console.log("certver", certver);
  //   console.log("certReportPath", this.certReportPath);
  //   console.log("certver", this.LetterReportPath);
  // }
  openFullModal() {
    this.isMaximized = true;
    this.maxWidth = "2000px"; // Set the max width for full modal
  }

  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "1000px"; // Set the max width for mini modal
  }

  // SelectBase(base) {
  //   this.DeedTableview = true;
  //   this.SelectedBase = base;
  //   this.getCertificateVersion(base);
  //   console.log("base", base);

  //   this.getDocmentArcive();
  // }

  // getCertificateVersion(Base) {
  //   this.loadingPreDoc = true;
  //   this.serviceService.getCertificateVersion1(Base.Title_Deed_No).subscribe(
  //     (CertificateVersion: any) => {
  //       if (CertificateVersion) {
  //         this.loadingPreDoc = false;
  //         this.CertificateVersion = CertificateVersion.procCertificate_Versions;
  //         this.CertificateVersion = this.CertificateVersion.filter(
  //           (x) => x.is_Active == 1
  //         );
  //         console.log("CertificateVersion1", this.CertificateVersion);

  //         // this.CertificateVersion = Object.assign(
  //         //   [],
  //         //   this.CertificateVersion.list
  //         // );
  //         /*if (this.CertificateVersion.length > 1) {
  //       this.SelectcertVer(this.CertificateVersion[0]);
  //     }*/
  //         console.log("CertificateVersion", CertificateVersion);
  //       }
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }

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

            if (this.cerlettrformList != undefined) {
              // if (this.language == "amharic") {
              //   if ((this.cerlettrformList[0].Regstration_Date! = null)) {
              //     this.cerlettrformList[0].Regstration_Date =
              //       await this.getgregorianToEthiopianDate(
              //         this.cerlettrformList[0].Regstration_Date
              //       );
              //   }
              //}
              if (this.cerlettrformList.length > 0) {
                this.selectcerltter(this.cerlettrformList[0]);
                this.serviceService
                  .GetCertficate_ver_Validation(
                    this.serviceService.LicenceserviceID,
                    this.cuurentversionselected
                  )
                  .subscribe((message: any) => {
                    if (message.Message == "1") {
                      this.serviceService.disablefins = false;

                      this.completed.emit();
                    } else {
                      const toast = this.notificationsService.error(
                        "Error",
                        message.Message
                      );
                    }
                  });
              }
            }
            if (this.PlotManagementListfinal.length > 0) {
              if (this.serviceService.multipleplotcanbeadd) {
                let filterservice =
                  this.serviceService.multipleplotcanbeadd.filter(
                    (x) => x.id === this.serviceService.Service_ID
                  );
                if (filterservice.length > 0) {
                  this.multipleplotcanbeadd = true;
                } else {
                  this.multipleplotcanbeadd = false;
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
        this.serviceService
          .GetCertficate_ver_Validation(
            this.serviceService.LicenceserviceID,
            this.cuurentversionselected
          )
          .subscribe((message: any) => {
            if (message.Message == "1") {
              this.serviceService.disablefins = false;

              this.completed.emit();
            } else {
              const toast = this.notificationsService.error("Error", message);
            }
          });
        if (!this.Saved) {
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
        this.serviceService
          .GetCertficate_ver_Validation(
            this.serviceService.LicenceserviceID,
            this.cuurentversionselected
          )
          .subscribe((message: any) => {
            if (message.Message == "1") {
              this.serviceService.disablefins = false;

              this.completed.emit();
            } else {
              const toast = this.notificationsService.error("Error", message);
            }
          });
        if (!this.Saved) {
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
    this.highlighted = cerltter;
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

  // openModal(modal) {
  //   this.ngxSmartModalService.getModal(modal).open();
  // }
  // closeModal(modal) {
  //   this.ngxSmartModalService.getModal(modal).close();
  //   // this.ngxSmartModalService.close('Letter');
  // }
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
