import {
  Component,
  Input,
  OnInit,
  Renderer2,
  ElementRef,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ServiceService } from "./service.service";
import { NotificationsService } from "angular2-notifications";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { EventEmitter } from "events";
import { NgxSmartModalService } from "ngx-smart-modal";
import { environment } from "src/environments/environment";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { HttpEvent, HttpEventType, HttpParams } from "@angular/common/http";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
//import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DialogService, DynamicDialogConfig } from "primeng/api";
import { FilePreviewDialogComponent } from "./file-preview-dialog/file-preview-dialog.component";

export * from "./qrcode.directive";
type AOA = any[][];
@Component({
  selector: "app-service",
  templateUrl: "./service.component.html",
  styleUrls: ["./demo/demo.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceComponent implements OnInit {
  maxChars;
  aaa;
  jsonempty = {};
  ApplicationNumberlist;
  useNamelist;
  data: AOA = [
    [1, 2],
    [3, 4],
  ];
  PreviewshowdialogeArray: boolean[] = [];
  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
  fileName: string = "SheetJS.xlsx";
  @Input("isDisabled") isDisabled: boolean;
  _opened = false;
  public ID = 0;
  loading = true;
  licenceService;
  documentupload: any;
  uploadedDocumnet: boolean;
  licenceData: any = {};
  AppNo;
  tskTyp;
  DropDownList;
  disablefins = true;
  DocID;
  todoID;
  tskID;
  SDP_ID;
  Service_ID;
  Licence_Service_ID;
  FormData;
  PriveLicence;
  AppNoList;
  PriveAppNoList;
  PreAppData;
  PreTaskData;
  AppN;
  TaskN;
  SDP;
  hideit: boolean = false;
  isDownloading = false;

  preAppID;
  note_popup;
  formcode;
  selectedTask;
  progress: number = 0;
  ifAppNo = false;
  ifTask = false;
  ifTaskDetail = false;
  selectedpreTask;
  showdialoge: boolean;

  Application_No: string;
  Service_Name: string;
  AppCode;
  RequerdDocs;
  validated = false;
  NoteObj = { remarks: "", postit_note_code: "" };
  taskLevel = 1;
  certef;
  alue;
  se = new EventEmitter();
  aa = null;
  intervalId: any;
  showProgressBar = false;
  user: any;
  public CustomerTypeLookUP;
  public CustomerLookUP;
  public CustomerBankLookUP;
  public SuspendedReasonLookUP;
  public PropertyTypeLookUP;
  public PropertyStatusLookUP;
  public ServiceDeliveryUnitLookUP;
  public orginizationlookup;
  public WoredaLookUP;
  public PlotStutusLookUP;
  public PlotLandUseLookUP;
  public TransferTypeLookUP;
  public Lease_Type_Lookup;
  public Plot_Land_Grade_lookup;
  public Lease_Stuts_Lookup;
  modalRef: BsModalRef;
  CurrentForm = "1";
  currentRemark;
  uid;
  public RequerdDocspre;
  public SavedFilespre;
  public SavedFiles;
  public SelectedpreApp;
  public preNoteObj = { remarks: "", postit_note_code: "" };
  public notes = [];
  Saved = false;
  Save = false;
  language = "english";

  eventTypes = {
    JSONFOUND: "ev001",
    ALREADYAPPLIED: "ev002",
  };
  errorType = {
    APPLICATIONCOMPLETED: 1,
    TASKCOMPLETED: 2,
  };
  isAlreadyApplied = false;
  loadingPreDoc = false;
  showOverlay = false;
  appliedNow = false;
  countDownString = "";
  warnMessage = "";
  mimeExtension = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      extension: "xlsx",
      previewable: false,
    },
    "application/vnd.ms-excel": {
      extension: "xls",
      previewable: false,
    },
    "text/csv": {
      extension: "csv",
      previewable: false,
    },
    "application/pdf": {
      extension: "pdf",
      previewable: true,
    },
    "image/jpeg": {
      extension: "jpg",
      previewable: true,
    },
    "image/png": {
      extension: "png",
      previewable: true,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      extension: "docx",
      previewable: false,
    },
    "application/msword": {
      extension: "doc",
      previewable: false,
    },
    "image/gif": {
      extension: "gif",
      previewable: true,
    },
    "application/geojson": {
      extension: "geojson",
      previewable: false,
    },
    "application/x-zip-compressed": {
      extension: "zip",
      previewable: false,
    },
  };
  prepareCertificateFields = {
    FIELD_ONE: "Branch name",
  };
  plotRegistrationFields = {
    FIELD_ONE: "Plot id",
  };
  okdb: boolean = true;
  moreDetail = {
    toggle: false,
  };
  disDocument: boolean;
  mimeType: any;
  fileupload: string;
  uploadcontract: boolean;
  updated: any;
  custmerInformation: any;
  issucess: boolean;
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    public serviceService: ServiceService,
    private router: Router,
    private notificationsService: NotificationsService,
    private sanitizer: DomSanitizer,
    public ngxModal: NgxSmartModalService,
    private renderer: Renderer2,
    private el: ElementRef,
    private dialogService: DialogService
  ) {}

  hide = true;

  saveFormm(formData) {
    console.log("save-form", JSON.stringify(formData));
    this.serviceService
      .saveFormm(
        this.licenceData
          ? this.licenceData.Licence_Service_ID
          : this.Service_ID,
        this.licenceData
          ? this.licenceData.Service_ID
          : "00000000-0000-0000-0000-000000000000",
        this.tskID,
        this.SDP_ID,
        JSON.stringify(formData),
        this.DocID || "00000000-0000-0000-0000-000000000000",
        this.todoID || "00000000-0000-0000-0000-000000000000"
      )
      .subscribe(
        (response) => {
          console.log("save-from-response", response);

          this.serviceService.disablefins = false;
          this.AppNo = response[0];
          this.DocID = response[1];
          //  this.todoID = response[2];
          this.getAll(this.AppNo);
          const toast = this.notificationsService.success("Success", "Saved");
          this.validated = true;
        },
        (error) => {
          console.log("save-form-error", error);
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }
  moreDetailToggle() {
    this.moreDetail.toggle = !this.moreDetail.toggle;
    // if (this.moreDetail.toggle) {
    //   this.moreDetail.buttonText = "Less";
    // } else {
    //   this.moreDetail.buttonText = "More";
    // }
  }
  saveFormm2(formData) {
    console.log("save-form", JSON.stringify(formData));
    this.serviceService
      .saveFormm(
        this.licenceData
          ? this.licenceData.Licence_Service_ID
          : this.Service_ID,
        this.licenceData
          ? this.licenceData.Service_ID
          : "00000000-0000-0000-0000-000000000000",
        this.tskID,
        this.SDP_ID,
        JSON.stringify(formData),
        this.DocID || "00000000-0000-0000-0000-000000000000",
        this.todoID || "00000000-0000-0000-0000-000000000000"
      )
      .subscribe(
        (response) => {
          console.log("save-from-response", response);

          this.serviceService.disablefins = false;
          this.AppNo = response[0];
          this.DocID = response[1];
          //  this.todoID = response[2];
          this.getAll(this.AppNo);
          const toast = this.notificationsService.success("Success", "Saved");
          this.validated = true;
        },
        (error) => {
          console.log("save-form-error", error);
          // const toast = this.notificationsService.error(
          //   "Error",
          //   "SomeThing Went Wrong"
          // );
        }
      );
  }
  startDownload() {}
  downloadDocument(document: any) {
    console.log("dddddd", document);

    const link = document.createElement("a");
    link.href = document.File;
    link.target = "_blank"; // Open the download in a new tab/window
    link.setAttribute(
      "download",
      `${document.description_en}.${this.getFileExtension(document.mimeType)}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  getFileExtension(mimeType: string): string {
    const mimeExtensions = {
      "application/pdf": "pdf",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
    };
    const extension = mimeExtensions[mimeType];
    return mimeExtensions[mimeType] || "file";
  }
  ngOnInit() {
    // setInterval(() => {
    //   this.serviceService
    //     .getdbstatus("00000000-0000-0000-0000-000000000000")
    //     .subscribe((response: any) => {
    //       console.log("response", response);
    //       if (response == true) {
    //         this.okdb = true;
    //       } else {
    //         this.okdb = false;
    //       }
    //     });
    // }, 1000);
    this.serviceService.getUserRole().subscribe((response: any) => {
      for (let index = 0; index < response.length; index++) {
        const element = response[index];

        if (
          element.RoleId == "8e759c69-1ed6-445b-b7f8-32c3fd44e8be" ||
          element.RoleId == "3ba734c5-d75a-44c7-8c47-5233431372ba"
        ) {
          this.hideit = true;
          break;
        } else {
          console.log("responseresponseresponse", element);
          this.hideit = false;
        }
      }
    });
    // this.preback();
    if (
      environment.Lang_code === "am-et" ||
      environment.Lang_code === "am-ET"
    ) {
      this.language = "amharic";
    } else {
      this.language = "english";
    }

    console.log("Servicesssssssss");
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log("leaseappppppp", params);
      // this.ID = params['id'];
      this.formcode = params["formcode"];
      this.AppNo = params["AppNo"];
      this.SDP_ID = params["SDP_ID"];
      this.getAll(this.AppNo);
      this.tskTyp = params["tskTyp"];
      this.tskID = params["tskID"];
      if (this.tskTyp == "c800fb16-f961-e111-95d6-00e04c05559b") {
        this.getTaskRule(params["tskID"]);
      }
      this.DocID = params["docid"];
      //  this.getFormData(params['docid']);
      this.todoID = params["todoID"];
      this.formcode = params["formcode"];
    });

    this.hideBackButton();
    this.getLookups();
    this.getRequiredDocs();
    this.GetPlot_Land_Grade_lookup();
    this.getLease_Stuts_Lookup();

    if (this.formcode == "a7a1e05e-32c2-4f44-ad58-306572c64593") {
      if (this.tskID == "2d9d02f7-ab7d-4ab2-bf0e-495cd8067558") {
        this.plotRegistrationFields.FIELD_ONE = "Well id";
      }
      this.ID = 2;
    } else if (
      this.formcode == "b1a9c82a-9553-4055-a6cf-cd42d72cbe87" ||
      this.formcode == "39d82943-6633-4df8-bb7a-6aa0933135e2" ||
      this.formcode == "fa3720f6-28f3-41a3-8867-426df29f4d76"
    ) {
      this.ID = 5;
    } else if (
      this.formcode == "9c286262-ee30-4b63-b356-e140d85b6499" ||
      this.formcode == "9e0834e9-7ec2-460c-a5ed-7ade1204c7ee"
    ) {
      if (this.tskID == "d3465fc3-e54f-4b8e-ba40-a084bd713bd0") {
        this.prepareCertificateFields.FIELD_ONE = "Issued by";
      }
      this.ID = 6;
    } else if (this.formcode == "a0f4df42-5216-4c03-b286-35866c47a866") {
      this.ID = 7;
    } else if (this.formcode == "10e401e1-4ba3-40c8-b16a-773f61907a54") {
      this.ID = 8;
    } else if (this.formcode == "da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1ff") {
      this.ID = 9;
    } else if (this.formcode == "da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1f") {
      this.ID = 10;
    } else {
      this.ID = 0;

      if (this.AppNo != undefined || this.AppNo != null) {
        this.se.on(this.eventTypes.JSONFOUND, () => {
          this.serviceService.getFormData(this.formcode).subscribe(
            (success) => (this.ID = 1),
            (error) => (this.ID = 404)
          );
          console.log("display form");
          console.log("ddd", this.formcode);
        });
      } else {
        this.serviceService.getFormData(this.formcode).subscribe(
          (success) => (this.ID = 1),
          (error) => (this.ID = 404)
        );
      }
    }
    if (this.RequerdDocs) {
      for (let i = 0; i < this.RequerdDocs.length; i++) {
        console.log(
          "this.RequerdDocs[i].description_en.indexOf('*')",
          this.RequerdDocs[i].description_en.indexOf("*")
        );
        if (this.RequerdDocs[i].description_en.indexOf("*") !== -1) {
          this.RequerdDocs[i].required = true;
        }
      }
      this.updated.emit({ docs: this.RequerdDocs });
    }
  }
  openPreviewDialog(RequerdDocpre: any) {
    // Pass the content to the dialog
    const dialogConfig = {
      data: {
        header: "File Preview",
        content: this.getDialogContent(RequerdDocpre),
        baseZIndex: 10001,
      },
    };
    console.log("dialogConfig", dialogConfig);

    // Open the dialog with the specified component and config
    this.dialogService.open(FilePreviewDialogComponent, dialogConfig);
  }
  getDialogContent(RequerdDocpre: any): SafeHtml {
    if (this.mimeExtension[RequerdDocpre.mimeType].extension === "pdf") {
      // Display a PDF using an iframe
      const iframeContent = `<iframe width="100%" src="${RequerdDocpre.File}" alt="FileUploaded" class="pdf-iframe"></iframe>`;
      return this.sanitizer.bypassSecurityTrustHtml(iframeContent);
    } else if (
      ["jpg", "png", "gif"].includes(
        this.mimeExtension[RequerdDocpre.mimeType].extension
      )
    ) {
      // Display an image
      const imageContent = `<img width="100%" src="${RequerdDocpre.File}" alt="FileUploaded" />`;
      return this.sanitizer.bypassSecurityTrustHtml(imageContent);
    } else {
      // Handle other file types if needed
      return "Unsupported file type";
    }
  }

  countDown(seconds: number) {
    let countDownStart = 0;
    let intervalHolder = null;
    if (seconds > 0) {
      countDownStart = Math.floor(seconds);
      intervalHolder = setInterval(() => {
        this.countDownString = countDownStart.toString();
        countDownStart--;
        if (countDownStart < 0) {
          this.Close();
          clearInterval(intervalHolder);
        }
      }, 1000);
    }
  }
  //   print(){

  //     document.location.reload()

  //  }
  hideBackButton() {
    console.log("ttt", this.formcode);
    if (this.formcode == "bc52101a-f679-46ee-a16c-601bc04e6be9") {
      this.hideit = true;
    } else {
      this.hideit = false;
    }
  }
  // preback(){
  //window.history.forward();
  // setTimeout("preback()",0);
  //window.onunload=function(){null};
  //}
  openPoopup(id) {
    this.ngxModal.getModal(id).open();
  }

  closePopup(id) {
    this.ngxModal.getModal(id).close();
  }

  getAllDocument() {
    this.serviceService
      .getAllDocument(this.licenceData.Licence_Service_ID, this.DocID)
      .subscribe(
        (SavedFiles) => {
          this.SavedFiles = SavedFiles;
          if (this.RequerdDocs != null)
            for (let i = 0; i < this.RequerdDocs.length; i++) {
              for (let j = 0; j < SavedFiles.length; j++) {
                if (
                  this.RequerdDocs[i].requirement_code ==
                  SavedFiles[j].requirement_code
                ) {
                  this.RequerdDocs[i].File =
                    "data:image/jpg;base64, " + SavedFiles[j].document;
                  this.RequerdDocs[i].File =
                    this.sanitizer.bypassSecurityTrustResourceUrl(
                      this.RequerdDocs[i].File
                    );
                  this.RequerdDocs[i].document_code =
                    SavedFiles[j].document_code;
                }
              }
            }
          console.log("SavedFiles", this.SavedFiles);
        },
        (error) => {
          console.log("error");
        }
      );
  }

  getRequiredDocspre(tskID) {
    this.serviceService.getRequerdDocs(tskID).subscribe(
      (RequerdDocs: any) => {
        console.log("getRequiredDocspre", RequerdDocs);

        this.RequerdDocspre = RequerdDocs;
        if (this.RequerdDocs != null) this.showProgressBar = false;

        for (let i = 0; i < this.RequerdDocs.length; i++) {
          if (this.RequerdDocs[i].description_en == "Dummy") {
            this.RequerdDocs.splice(i, 1);
            break;
          }
        }
        this.getAllDocument();
        // console.log('RequerdDocs', this.RequerdDocs);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  signatures = {
    JVBERi0: "application/pdf",
    R0lGOD: "image/gif",
    iVBORw0KGgo: "image/png",
    "/9j/4Q": "image/jpeg",
  };

  detectMimeType(b64) {
    for (var s in this.signatures) {
      if (b64.indexOf(s) === 0) {
        return this.signatures[s];
      }
    }
  }

  previewableType() {}

  getAllDocumentpre(Licence_Service_ID, DocID) {
    this.loadingPreDoc = true;
    this.serviceService.getAllDocument(Licence_Service_ID, DocID).subscribe(
      (SavedFiles) => {
        this.loadingPreDoc = false;
        console.log("pdf file", SavedFiles, this.RequerdDocspre);
        this.SavedFilespre = SavedFiles;
        if (this.RequerdDocspre != null || this.RequerdDocspre != undefined)
          this.showProgressBar = false;
        for (let i = 0; i < this.RequerdDocspre.length; i++) {
          console.log("pdf file", this.RequerdDocspre[i]);
          for (let j = 0; j < SavedFiles.length; j++) {
            if (
              this.RequerdDocspre[i].requirement_code ==
              SavedFiles[j].requirement_code
            ) {
              try {
                let fileData = JSON.parse(atob(SavedFiles[j].document));

                let { type, data } = fileData;

                this.RequerdDocspre[i].mimeType = type;
                this.RequerdDocspre[i].File =
                  "data:" + type + ";base64, " + data;
                console.log("this.RequerdDocspre[i].File", SavedFiles[j]);

                this.RequerdDocspre[i].File =
                  this.sanitizer.bypassSecurityTrustResourceUrl(
                    this.RequerdDocspre[i].File
                  );

                this.RequerdDocspre[i].document_code =
                  SavedFiles[j].document_code;
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
        console.log("SavedFiles", this.SavedFiles);
        console.log("RequerdDocspre", this.RequerdDocspre);

        this.RequerdDocspre.forEach((item, index) => {
          this.PreviewshowdialogeArray[index] = false; // Initialize all dialog variables to false
        });
      },
      (error) => {
        this.loadingPreDoc = false;
        console.log("error");
      }
    );
  }
  // getUserRoles(): void {
  //   const params = new HttpParams().set("UserName", environment.username);

  //   this.appService.getAppointmentByApp(params).subscribe((result) => {
  //     this.userRoles =
  //       result.aspnet_UsersInRoles == null ? [] : result.aspnet_UsersInRoles;

  //     console.log("this.userRoles", this.userRoles);
  //   });
  // }

  Back() {
    this.serviceService.Back(this.AppNo, this.todoID).subscribe(
      (message) => {
        if (message == true) {
          const toast = this.notificationsService.success(
            "Success",
            "The process was backed to the priveyes stage successfully"
          );
          this.Close();
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      },
      (error) => {
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );
  }

  getPost(appno) {
    this.serviceService.getPostit_user().subscribe(
      (note) => {
        this.user = note.filter((value) => value.application_number == appno);
        console.log("userrrr", this.user);
        if (note) {
          this.notes = this.user as Array<any>;
          console.log("notesss", appno);
        }
        let num = 1;
        (this.notes as Array<any>).map((task) => (task["number"] = num++));
        console.log("my note = ", note);
      },
      (error) => {
        console.error("unable to get note");
      }
    );
    this.serviceService.GetNote(appno).subscribe((note) => {
      //   if (note) {
      //     this.notes = note as Array<any>;
      //     console.log('notesss',appno);
      //   }
      //   let num = 1;
      //   (this.notes as Array<any>).map((task) => (task["number"] = num++));
      //   console.log("my note = ", note);
      // },
      // (error) => {
      //   console.error("unable to get note");
    });
  }
  plot() {
    if (!this.Saved) {
      this.saveForm2("{}");
      this.Saved = true;
    }
    //this.serviceService.disablefins = true;
  }
  property() {
    console.log("this.Saved", this.Saved);

    this.saveForm2("{}");
    this.Saved = true;

    //this.serviceService.disablefins = true;
  }
  payment() {
    if (
      this.Submit("00000000-0000-0000-0000-000000000000") ===
      this.Submit("00000000-0000-0000-0000-000000000000")
    ) {
      this.Close();
    }
  }
  selectNote(value) {
    this.currentRemark = this.notes[value]["remarks"];
    this.uid = this.notes[value]["UserId"];
  }

  isvalidated(todoID, tskID, plotid, proid, DocID) {
    this.serviceService
      .isvalidated(todoID, tskID, plotid, proid, DocID)
      .subscribe(
        (Validated) => {
          // const toast = this.notificationsService.success("success", "successfull");
          console.log("validateing.... => " + Validated);

          if (Validated == "Validated") {
            this.validated = true;
          } else {
            this.validated = true;

            // this.disablefins = true;
            // this.validated = false;
            // const toast = this.notificationsService.warn("Warning", Validated);
          }
          // this.RequerdDocs = RequerdDocs;

          // this.getAllDocument();
          // console.log('RequerdDocs', this.RequerdDocs);
        },
        (error) => {
          console.log("error");
        }
      );
  }

  EnableFins() {
    this.serviceService.disablefins = false;
    console.log("enableningggg....", this.validated);

    // this.saveForm(this.jsonempty);
    this.validated = true;
    this.isvalidated(
      this.todoID,
      this.tskID,
      "00000000-0000-0000-0000-000000000000",
      "00000000-0000-0000-0000-000000000000",
      this.DocID
    );

    // this.disablefins = false;
  }

  changeForm(event) {
    this.CurrentForm = event;
  }

  getLease_Stuts_Lookup() {
    this.serviceService.getLease_Stuts_Lookup().subscribe(
      (Lease_Stuts_Lookup) => {
        this.Lease_Stuts_Lookup = Lease_Stuts_Lookup;
        this.Lease_Stuts_Lookup = Object.assign(
          [],
          this.Lease_Stuts_Lookup.list
        );
        console.log("Lease_Stuts_Lookup", Lease_Stuts_Lookup);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  getorganizationLookUP() {
    this.serviceService.getServiceDeliveryUnitLookUP().subscribe(
      (orginizationlookup) => {
        this.orginizationlookup = orginizationlookup;
        this.orginizationlookup = Object.assign([], this.orginizationlookup);
        // this.orginizationlookup = this.orginizationlookup.filter(value => value['organization_code'] == '24d45c72-8088-4591-810a-bc674f9f0a57');
        console.log("orginizationlookup mmmmm", orginizationlookup);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  GetPlot_Land_Grade_lookup() {
    this.serviceService.GetPlot_Land_Grade_lookup().subscribe(
      (Plot_Land_Grade_lookup) => {
        this.Plot_Land_Grade_lookup = Plot_Land_Grade_lookup;
        this.Plot_Land_Grade_lookup = Object.assign(
          [],
          this.Plot_Land_Grade_lookup
        );
        console.log("Plot_Land_Grade_lookup", this.Plot_Land_Grade_lookup);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  addNote() {
    //this.NoteObj.postit_note_code = this.DocID;
    this.serviceService
      .addNote(this.AppNo, this.NoteObj.remarks, this.NoteObj.postit_note_code)
      .subscribe(
        (message) => {
          const toast = this.notificationsService.success("Sucess", "Saved");
          this.GetNote(message);
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }
  saveNote() {
    // this.NoteObj.postit_note_code = this.DocID;
    this.serviceService
      .saveNote(this.NoteObj.remarks, this.NoteObj.postit_note_code)
      .subscribe(
        (message) => {
          const toast = this.notificationsService.success(
            "Sucess",
            "Edited sucessfully"
          );
          this.GetNote(message);
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }

  DeleteNote() {
    this.serviceService
      .DeleteNote(this.AppNo, this.NoteObj.postit_note_code)
      .subscribe(
        (message) => {
          const toast = this.notificationsService.success(
            "Sucess",
            "Deleted sucessfully"
          );
          this.GetNote(message);
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }
  sendNote() {
    //this.NoteObj.postit_note_code = this.DocID;
    //this.SubmitAR(this.serviceService.taskrul)
    this.serviceService
      .sendNote(
        this.NoteObj.remarks,
        this.AppNo,
        this.NoteObj.postit_note_code,
        this.todoID,
        this.SDP_ID
      )
      .subscribe(
        (message) => {
          const toast = this.notificationsService.success(
            "Sucess",
            "Sent Sucessfully"
          );
          this.GetNote(message);
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }
  sendNotte() {
    this.SubmitAR(this.serviceService.taskrul);
    this.serviceService
      .sendNote(
        this.NoteObj.remarks,
        this.AppNo,
        this.NoteObj.postit_note_code,
        this.todoID,
        this.SDP_ID
      )
      .subscribe(
        (message) => {
          const toast = this.notificationsService.success(
            "Sucess",
            "Sent Sucessfully"
          );
          this.GetNote(message);
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }
  sendNottte() {
    this.Back();
    this.serviceService
      .sendNote(
        this.NoteObj.remarks,
        this.AppNo,
        this.NoteObj.postit_note_code,
        this.todoID,
        this.SDP_ID
      )
      .subscribe(
        (message) => {
          const toast = this.notificationsService.success(
            "Sucess",
            "Sent Sucessfully"
          );
          this.GetNote(message);
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }

  GetNote(message) {
    this.serviceService.GetNote(this.AppNo).subscribe(
      (Notes) => {
        if (Notes) {
          console.log("NoteObj", Notes);
          (Notes as Array<any>).some((note) => {
            if (note.postit_note_code === message) {
              this.NoteObj = note;
              return true;
            } else {
              this.NoteObj = { remarks: "", postit_note_code: "" };
              return false;
            }
          });
        } else {
          this.NoteObj = { remarks: "", postit_note_code: "" };
        }
      },
      (error) => {
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );
  }

  public _toggleOpened(): void {
    this._opened = !this._opened;
  }

  openModal(template: TemplateRef<any>) {
    console.log("template", template);

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }

  closeModal() {
    // console.log('closeing.....');
    this.modalRef.hide();
  }

  getRequiredDocs() {
    this.serviceService.getRequerdDocs(this.tskID).subscribe(
      (RequerdDocs) => {
        this.RequerdDocs = RequerdDocs;

        console.log("RequerdDocs", this.RequerdDocs);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  extractExtensionFromFileName(fileName) {
    if (fileName) {
      let fileNameSegment = (fileName as string).split(".");
      return `application/${fileNameSegment[fileNameSegment.length - 1]}`;
    }
    return "";
  }

  Uploader(File, RequiredDoc, fild) {
    let taskType =
      this.tskTyp === "c800fb16-f961-e111-95d6-00e04c05559b"
        ? "Decision"
        : "Complete";
    console.log("RequiredDoc", RequiredDoc);
    console.log("File ", File);
    let base64file;
    let fullbase64;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      fullbase64 = base64file;
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      base64file = base64file.split(";")[1];
      let type =
        File.type != ""
          ? File.type
          : this.extractExtensionFromFileName(File.name);
      let base64FileData = btoa(
        JSON.stringify({
          type,
          data: base64file,
        })
      );

      this.documentupload = base64FileData;
      this.previewdocumnet(base64FileData);
      console.log("this.DocID", base64file);
      this.serviceService
        .saveFile(
          base64FileData,
          File.type,
          this.AppNo,
          RequiredDoc.requirement_code,
          taskType,
          RequiredDoc.description_en,
          this.DocID
        )
        .subscribe(
          (message: HttpEvent<any>) => {
            if (message) {
              // var eventTotal = message.total ? message.total : 0;
              // this.progress = Math.round(
              //   (message.loaded / message.total) * 100
              // );
              console.log(`Uploaded! ${this.progress}%`);

              fild.clear();
              const toast = this.notificationsService.success(
                "Success",
                "Uploaded successfully"
              );
              this.updated.emit({ docs: this.RequerdDocs });
            } else {
              console.log("error");
              const toast = this.notificationsService.error(
                "Error",
                "SomeThing Went Wrong"
              );
            }
          },
          (error) => {
            console.log("error");
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }
        );
    });
    console.log("this.RequerdDocs", this.RequerdDocs);
  }

  upload(event, RequiredDoc, fild) {
    this.Uploader(event.files[0], RequiredDoc, fild);
    console.log("event", event);
    console.log("RequiredDoc", RequiredDoc);
    console.log("this.RequerdDocs", this.RequerdDocs);
    for (let i = 0; i < this.RequerdDocs.length; i++) {
      if (
        RequiredDoc.requirement_code === this.RequerdDocs[i].requirement_code
      ) {
        this.RequerdDocs[i].uploded = 1;
      }
    }
    console.log("files", event.files);
  }

  removeUpload(RequiredDoc) {
    this.serviceService.RemoveDoc(RequiredDoc.document_code).subscribe(
      (message) => {
        const toast = this.notificationsService.success("Sucess", message);

        for (let i = 0; i < this.RequerdDocs.length; i++) {
          if (
            this.RequerdDocs[i].requirement_code == RequiredDoc.requirement_code
          ) {
            this.RequerdDocs[i].File = null;
            this.RequerdDocs[i].document_code = null;
          }
        }
        console.log("RequerdDocs", this.RequerdDocs);
      },
      (error) => {
        console.log("error");
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );
  }
  previewdocumnet(file) {
    if (file == "" || file == null) {
      this.disDocument = true;
    } else {
      this.disDocument = false;
    }
    try {
      let fileData = JSON.parse(window.atob(file));
      let { type, data } = fileData;
      this.mimeType = type;
      this.fileupload = "data:" + type + ";base64, " + data;
      this.uploadedDocumnet = true;
      this.uploadcontract = false;

      this.documentupload = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.fileupload
      );
      console.log(this.documentupload);
    } catch (e) {
      console.error(e);
    }
  }
  pendclose(appNO) {
    this.getAppData(appNO);
  }

  getAppData(appNO) {
    this.preAppID = 0;
    this.serviceService.getTodandAppNo(appNO).subscribe(
      (PreAppData) => {
        this.PreAppData = PreAppData;
        // this.PreAppData = PreAppData;
        console.log("PriveLicence", this.PriveLicence);
        for (let i = 0; i < this.PriveLicence.length; i++) {
          if (this.PriveLicence[i].Application_No == appNO) {
            this.SelectedpreApp = this.PriveLicence[i];
            console.log("this.SelectedpreApp", this.SelectedpreApp);
          }
        }
        this.PreAppData = Object.assign([], this.PreAppData.Table);
        this.PreAppData.sort((a, b) => {
          if (a.level < b.level) {
            return -1;
          } else if (a.level > b.level) {
            return 1;
          } else {
            return 0;
          }
        });

        this.PreAppData.find((appData) => {
          if (appData.form_code === this.formcode) {
            this.FormData = appData.JsonData;
            console.log("json data pend and close :: ", appData.JsonData);

            return true;
          }

          return false;
        });
        this.se.emit(this.eventTypes.JSONFOUND);

        let allTasks = [];

        if (!this.appliedNow) {
          this.serviceService
            .getMytasks("24d45c72-8088-4591-810a-bc674f9f0a57")
            .subscribe((tasks) => {
              let applicationFound = false;
              let isPickable = true;
              let warningData = {
                message: "",
                type: 0,
              };
              if (tasks["Table1"]) {
                allTasks = tasks["Table1"];

                allTasks.find((task) => {
                  console.log(
                    "task :: ",
                    task["step_no"],
                    " & ",
                    task["todo_comment"],
                    " app number :: ",
                    this.AppNo
                  );
                  if (task["todo_comment"] == this.AppNo && this.AppNo) {
                    applicationFound = true;
                    this.PreAppData.find((appData) => {
                      if (appData.tasks_task_code == this.tskID) {
                        console.warn("found already saved task :: ", appData);
                        console.log("nnn", appData.form_code);
                        if (task["tasks_id"] != this.tskID) {
                          console.warn("found already passed task");
                          isPickable = false;
                          warningData.message =
                            "you already have gone through this task! redirecting to my task";
                          warningData.type = this.errorType.TASKCOMPLETED;
                          return true;
                        }
                        return true;
                      }
                      return false;
                    });
                  }
                  return false;
                });
                if (!applicationFound) {
                  isPickable = false;
                  warningData.message =
                    "you have completed the application! redirecting to my task";
                  warningData.type = this.errorType.TASKCOMPLETED;
                }

                if (!isPickable) {
                  this.se.emit(this.eventTypes.ALREADYAPPLIED, warningData);
                }
              }
            });
        }

        // this.PreAppData = (Object.assign({}, this.PreAppData.Table));
        console.log("PreAppData", this.PreAppData);
        this.ifTask = true;
        this.GetNotePrevius(appNO);
        if (this.TaskN) {
          this.getTaskData(this.TaskN);
        }
      },
      (error) => {
        console.log("error");
        this.se.emit(this.eventTypes.JSONFOUND);
      }
    );
  }

  getTaskData(task) {
    console.log("task", task);

    this.preAppID = 0;
    this.PreTaskData = [];
    for (let i = 0; i < this.PreAppData.length; i++) {
      if (this.PreAppData[i].tasks_task_code == task) {
        console.log("this.PreAppData[i]", this.PreAppData[i]);
        this.PreTaskData.push(this.PreAppData[i]);
      }
    }
    console.log("PreTaskData", this.PreTaskData);
  }

  SelectTask(task) {
    console.log("tasksssss", task);
    this.showProgressBar = true;
    this.selectedpreTask = task;
    this.selectedTask = task;
    this.taskLevel = task.level;
    this.getPost(task.todo_comment);
    this.getRequiredDocspre(task.tasks_task_code);
    this.getAllDocumentpre(this.SelectedpreApp.Licence_Service_ID, task.docId);

    // this.getAllDocumentpre(this.SelectedpreApp.Licence_Service_ID, task.docId);
    if (task.form_code == "a7a1e05e-32c2-4f44-ad58-306572c64593") {
      this.preAppID = 2;
    } else if (
      task.form_code == "b1a9c82a-9553-4055-a6cf-cd42d72cbe87" ||
      task.form_code == "39d82943-6633-4df8-bb7a-6aa0933135e2" ||
      task.form_code == "fa3720f6-28f3-41a3-8867-426df29f4d76"
    ) {
      this.preAppID = 5;
    } else if (
      task.form_code == "9c286262-ee30-4b63-b356-e140d85b6499" ||
      task.form_code == "9e0834e9-7ec2-460c-a5ed-7ade1204c7ee"
    ) {
      this.preAppID = 6;
    } else if (task.form_code == "a0f4df42-5216-4c03-b286-35866c47a866") {
      this.preAppID = 7;
    } else if (task.form_code == "10e401e1-4ba3-40c8-b16a-773f61907a54") {
      this.preAppID = 8;
    } else if (task.form_code == "da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1ff") {
      this.preAppID = 9;
    } else if (task.form_code == "da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1f") {
      this.preAppID = 10;
    } else {
      this.preAppID = 1;
      // console.log('to', 1);
    }
    this.ifTaskDetail = true;
  }

  saveForm(formData) {
    console.log("formDataformData", this.Licence_Service_ID);

    if (this.Licence_Service_ID == undefined) {
      this.Licence_Service_ID = "00000000-0000-0000-0000-000000000000";
      this.DocID = "00000000-0000-0000-0000-000000000000";
      this.todoID = "00000000-0000-0000-0000-000000000000";
      this.Service_ID = this.AppNo;
    }
    //let doc_id = this.serviceService.docId ? this.serviceService.docId : '00000000-0000-0000-0000-000000000000';
    // this.serviceService.saveForm(this.Licence_Service_ID, this.Service_ID, this.tskID, this.SDP_ID, JSON.stringify(formData), this.DocID, this.todoID).subscribe(message => {
    this.serviceService
      .saveFormObj(
        this.Licence_Service_ID,
        this.Service_ID,
        this.tskID,
        this.SDP_ID,
        JSON.stringify(formData),
        this.DocID,
        this.todoID
      )
      .subscribe(
        (message) => {
          this.serviceService.disablefins = false;
          this.AppCode = message[0];
          this.DocID = message[1];
          //this.todoID = message[2];
          this.getAll(message[0]);

          if (formData == "{}") {
            const toast = this.notificationsService;
          } else {
            const toast = this.notificationsService.success(
              "Success",
              "Successfully Saved"
            );
          }
          this.validated = true;
        },

        (error) => {
          if (formData == "{}") {
            const toast = this.notificationsService;
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }
        }
      );
  }
  saveForm2(formData) {
    if (this.Licence_Service_ID == undefined) {
      this.Licence_Service_ID = "00000000-0000-0000-0000-000000000000";
      this.DocID = "00000000-0000-0000-0000-000000000000";
      this.todoID = "00000000-0000-0000-0000-000000000000";
      this.Service_ID = this.AppNo;
    }
    //let doc_id = this.serviceService.docId ? this.serviceService.docId : '00000000-0000-0000-0000-000000000000';
    // this.serviceService.saveForm(this.Licence_Service_ID, this.Service_ID, this.tskID, this.SDP_ID, JSON.stringify(formData), this.DocID, this.todoID).subscribe(message => {
    this.serviceService
      .saveFormObj(
        this.Licence_Service_ID,
        this.Service_ID,
        this.tskID,
        this.SDP_ID,
        JSON.stringify(formData),
        this.DocID,
        this.todoID
      )
      .subscribe(
        (message) => {
          this.serviceService.disablefins = false;
          this.AppCode = message[0];
          this.DocID = message[1];
          this.todoID = message[2];
          this.getAll(message[0]);

          if (formData == "{}") {
            //this.serviceService.disablefins = true;
            const toast = this.notificationsService;
          } else {
            const toast = this.notificationsService.success(
              "Success",
              "Successfully Saved"
            );
          }
          this.validated = true;
        },

        (error) => {
          if (formData == "{}") {
            const toast = this.notificationsService;
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }
        }
      );
  }

  getSaveData(event) {
    this.AppNo = event.appCode;
    this.DocID = event.docId;
    this.todoID = event.todoId;
    this.serviceService.ApplicationNo = event.licenceData["Application_No"];
    this.serviceService.Service_Name = event.licenceData["Service_Name"];
    this.getPriveysLicence(this.AppNo);
    console.log("datas from somewhere :: ", event);
    console.log("application :: ", this.serviceService.ApplicationNo);
    console.log("service name :: ", this.serviceService.Service_Name);
  }

  getFormData(DocID) {
    this.serviceService.GetForm(DocID).subscribe(
      (FormData) => {
        this.FormData = FormData;

        this.FormData = JSON.parse(this.FormData);
        // this.FormData = (Object.assign({}, this.FormData));
        // console.log('FormData', FormData);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  async showdialog(data, name) {
    console.log("vvvvvv", data);
    let to_to_code;
    this.serviceService.taskrul = data;
    if (name == "R  ") {
      this.showdialoge = true;
    } else {
      this.SubmitAR(data);
      this.serviceService.getUserRole().subscribe((response: any) => {
        for (let index = 0; index < response.length; index++) {
          const element = response[index];
          if (
            element.RoleId ==
              "F8DDA85E-F967-4AC5-BF79-4D989ECFB863".toLocaleLowerCase() ||
            element.RoleId ==
              "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase ||
            element.RoleId ==
              "FE7BE2E0-E717-4230-B732-5B810A8BB875".toLocaleLowerCase()
          ) {
            this.serviceService
              .getPropertyLists(this.licenceData.Parcel_ID)
              .subscribe((res: any) => {
                const PropertyList = res.procProperty_Registrations;
                if (PropertyList.length > 0) {
                  let parentproperty = PropertyList.filter(
                    (x) => parseInt(x.property_Parent_ID) === 0
                  );
                  console.log(parentproperty);
                  parentproperty.forEach((element) => {
                    this.serviceService
                      .getPropertyListsfromcenteral(element.property_ID)
                      .subscribe((ress: any) => {
                        if (ress.procProporty_Locations) {
                          this.serviceService
                            .postplotTopostgres(
                              this.licenceData.Parcel_ID,
                              element.property_ID
                            )
                            .subscribe((res) => {});
                        }
                      });
                  });
                }
              });
          } else {
            console.log("responseresponseresponse", element);
          }
        }
      });
      // if (
      //   "466A3ADF-CCE5-4FF4-A466-16425D6FBE5E".toLowerCase() === this.tskID ||
      //   "6036FB05-FFCD-4724-9FED-07893ABCF7D7".toLowerCase() === this.tskID ||
      //   "1923579E-1E4C-456B-A988-3ACC5FEC5D23".toLowerCase() === this.tskID ||
      //   "41A08235-8C74-4DC0-918F-353316117B28".toLowerCase() === this.tskID ||
      //   "EC01C6AF-DE39-4CBB-A20E-28A727C6C4D4".toLowerCase() === this.tskID ||
      //   "416ED07E-4D3C-4786-A982-44498BCB0768".toLowerCase() === this.tskID ||
      //   "266365D1-00D4-4843-9AFB-4013CC309047".toLowerCase() === this.tskID ||
      //   "F515DAB5-45CD-43EB-8967-A5F072A49938".toLowerCase() === this.tskID ||
      //   "269CBEDA-9357-4930-82F6-9CEF39F54AC1".toLowerCase() === this.tskID ||
      //   "A8F34D89-7FA1-41E2-9D91-A20941E24C4B".toLowerCase() === this.tskID ||
      //   "41F3777B-4525-4CA7-A5D1-DF8CEABB232A".toLowerCase() === this.tskID ||
      //   "83EE7239-D109-4036-8B50-D34093AAA500".toLowerCase() === this.tskID ||
      //   "E9DC66E7-DD83-46F3-9C48-BB4FD29C7748".toLowerCase() === this.tskID ||
      //   "A4E830F1-AB5F-47A6-BE56-CCDBB649C45C".toLowerCase() === this.tskID
      // ) {

      // }
    }
  }
  showdialogee;
  showdialogg() {
    this.showdialogee = true;
  }
  sendNotttte() {
    this.Back();
  }
  getTaskRule(tasksId) {
    this.serviceService.getTaskRule(tasksId).subscribe(
      (DropDownList) => {
        this.DropDownList = DropDownList;
        this.DropDownList = Object.assign([], this.DropDownList);
        console.log("DropDownList", DropDownList);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  Close() {
    this.router.navigate(["/task/MyTask"]);
  }
  Submit(ruleid) {
    this.serviceService.disablefins = true;

    this.serviceService
      .Submit(this.AppNo, this.DocID, this.todoID, ruleid)
      .subscribe(
        (message) => {
          // console.log('message', message);
          if (message) {
            const toast = this.notificationsService.success(
              "Sucess",
              "sucesss"
            );
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }

          this.Close();
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
    this.serviceService.getUserRole().subscribe((response: any) => {
      for (let index = 0; index < response.length; index++) {
        const element = response[index];
        if (
          element.RoleId ==
            "F8DDA85E-F967-4AC5-BF79-4D989ECFB863".toLocaleLowerCase() ||
          element.RoleId ==
            "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase ||
          element.RoleId ==
            "FE7BE2E0-E717-4230-B732-5B810A8BB875".toLocaleLowerCase()
        ) {
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
        } else {
          console.log("responseresponseresponse", element);
        }
      }
    });

    // if (
    //   "466A3ADF-CCE5-4FF4-A466-16425D6FBE5E".toLowerCase() === this.tskID ||
    //   "6036FB05-FFCD-4724-9FED-07893ABCF7D7".toLowerCase() === this.tskID ||
    //   "1923579E-1E4C-456B-A988-3ACC5FEC5D23".toLowerCase() === this.tskID ||
    //   "41A08235-8C74-4DC0-918F-353316117B28".toLowerCase() === this.tskID ||
    //   "EC01C6AF-DE39-4CBB-A20E-28A727C6C4D4".toLowerCase() === this.tskID ||
    //   "416ED07E-4D3C-4786-A982-44498BCB0768".toLowerCase() === this.tskID ||
    //   "266365D1-00D4-4843-9AFB-4013CC309047".toLowerCase() === this.tskID ||
    //   "F515DAB5-45CD-43EB-8967-A5F072A49938".toLowerCase() === this.tskID ||
    //   "269CBEDA-9357-4930-82F6-9CEF39F54AC1".toLowerCase() === this.tskID ||
    //   "A8F34D89-7FA1-41E2-9D91-A20941E24C4B".toLowerCase() === this.tskID ||
    //   "41F3777B-4525-4CA7-A5D1-DF8CEABB232A".toLowerCase() === this.tskID ||
    //   "83EE7239-D109-4036-8B50-D34093AAA500".toLowerCase() === this.tskID ||
    //   "E9DC66E7-DD83-46F3-9C48-BB4FD29C7748".toLowerCase() === this.tskID ||
    //   "A4E830F1-AB5F-47A6-BE56-CCDBB649C45C".toLowerCase() === this.tskID
    // ) {

    //   if (this.licenceData.Parcel_ID) {
    //     this.getplotlist(this.licenceData.Parcel_ID);
    //   }
    //   if (this.licenceData.Plot_Merge_1) {
    //     this.getplotlist(this.licenceData.Plot_Merge_1);
    //   }
    //   if (this.licenceData.Plot_Merge_2) {
    //     this.getplotlist(this.licenceData.Plot_Merge_2);
    //   }
    //   if (this.licenceData.Plot_Merge_3) {
    //     this.getplotlist(this.licenceData.Plot_Merge_3);
    //   }
    //   if (this.licenceData.Plot_Merge_4) {
    //     this.getplotlist(this.licenceData.Plot_Merge_4);
    //   }
    // }
  }
  getplotlist(plotid) {
    this.serviceService.getPlotManagementApi(plotid).subscribe(
      async (PlotManagementLists: any) => {
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;
        if (PlotManagementList.length > 0) {
          this.serviceService
            .getPropertyLists(PlotManagementList[0].plot_ID)
            .subscribe((res: any) => {
              const PropertyList = res.procProperty_Registrations;
              if (PropertyList.length > 0) {
                let parentproperty = PropertyList.filter(
                  (x) => parseInt(x.property_Parent_ID) === 0
                );
                console.log(parentproperty);
                parentproperty.forEach((element) => {
                  this.serviceService
                    .getPropertyListsfromcenteral(element.property_ID)
                    .subscribe((ress: any) => {
                      if (ress.procProporty_Locations) {
                        this.serviceService
                          .postplotTopostgres(
                            this.licenceData.Parcel_ID,
                            element.property_ID
                          )
                          .subscribe((res) => {});
                      }
                    });
                });
              }
            });
        }
      },
      (error) => {
        console.log("error");
      }
    );
  }

  async SubmitAR(ruleid) {
    this.serviceService.disablefins = true;
    this.serviceService
      .SubmitAR(this.AppNo, this.DocID, this.todoID, ruleid)
      .subscribe(
        (message) => {
          if (message) {
            console.log(
              "🚀 ~ file: service.component.ts:1615 ~ SubmitAR ~ message:",
              message
            );
            const toast = this.notificationsService.success(
              "Sucess",
              "sucesss"
            );
            // if (
            //   "466A3ADF-CCE5-4FF4-A466-16425D6FBE5E".toLowerCase() ===
            //     this.tskID ||
            //   "6036FB05-FFCD-4724-9FED-07893ABCF7D7".toLowerCase() ===
            //     this.tskID ||
            //   "1923579E-1E4C-456B-A988-3ACC5FEC5D23".toLowerCase() ===
            //     this.tskID ||
            //   "41A08235-8C74-4DC0-918F-353316117B28".toLowerCase() ===
            //     this.tskID ||
            //   "EC01C6AF-DE39-4CBB-A20E-28A727C6C4D4".toLowerCase() ===
            //     this.tskID ||
            //   "416ED07E-4D3C-4786-A982-44498BCB0768".toLowerCase() ===
            //     this.tskID ||
            //   "266365D1-00D4-4843-9AFB-4013CC309047".toLowerCase() ===
            //     this.tskID ||
            //   "F515DAB5-45CD-43EB-8967-A5F072A49938".toLowerCase() ===
            //     this.tskID ||
            //   "269CBEDA-9357-4930-82F6-9CEF39F54AC1".toLowerCase() ===
            //     this.tskID ||
            //   "A8F34D89-7FA1-41E2-9D91-A20941E24C4B".toLowerCase() ===
            //     this.tskID ||
            //   "41F3777B-4525-4CA7-A5D1-DF8CEABB232A".toLowerCase() ===
            //     this.tskID ||
            //   "83EE7239-D109-4036-8B50-D34093AAA500".toLowerCase() ===
            //     this.tskID ||
            //   "E9DC66E7-DD83-46F3-9C48-BB4FD29C7748".toLowerCase() ===
            //     this.tskID ||
            //   "A4E830F1-AB5F-47A6-BE56-CCDBB649C45C".toLowerCase() ===
            //     this.tskID
            // ) {
            //   if (this.licenceData.Parcel_ID) {
            //     this.getplotlist(this.licenceData.Parcel_ID);
            //   }
            //   if (this.licenceData.Plot_Merge_1) {
            //     this.getplotlist(this.licenceData.Plot_Merge_1);
            //   }
            //   if (this.licenceData.Plot_Merge_2) {
            //     this.getplotlist(this.licenceData.Plot_Merge_2);
            //   }
            //   if (this.licenceData.Plot_Merge_3) {
            //     this.getplotlist(this.licenceData.Plot_Merge_3);
            //   }
            //   if (this.licenceData.Plot_Merge_4) {
            //     this.getplotlist(this.licenceData.Plot_Merge_4);
            //   }
            // }
            this.serviceService.getUserRole().subscribe((response: any) => {
              for (let index = 0; index < response.length; index++) {
                const element = response[index];
                if (
                  element.RoleId ==
                    "F8DDA85E-F967-4AC5-BF79-4D989ECFB863".toLocaleLowerCase() ||
                  element.RoleId ==
                    "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase ||
                  element.RoleId ==
                    "FE7BE2E0-E717-4230-B732-5B810A8BB875".toLocaleLowerCase()
                ) {
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
                } else {
                  console.log("responseresponseresponse", element);
                }
              }
            });

            this.issucess = true;
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }
          this.Close();
        },
        (error) => {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
  }

  getLookups() {
    this.getCustomerTypeLookUP();
    this.getSuspendedReasonLookUP();
    this.getPropertyTypeLookUP();
    this.getPropertyStatusLookUP();
    this.getServiceDeliveryUnitLookUP();
    this.getorganizationLookUP();
    this.getWoredaLookUP();
    this.getPlotStutusLookUP();
    this.getPlotLandUseLookUP();
    //this.getCustomerLookUP();
    this.getTransferTypeLookUP();
    this.getLease_Type_Lookup();
    this.getLease_Stuts_Lookup();
    this.GetPlot_Land_Grade_lookup();
  }

  getPriveysLicence(value) {
    this.AppN = null;
    this.serviceService.getPriveys(value).subscribe(
      (PriveLicence) => {
        this.PriveLicence = PriveLicence;
        this.PriveLicence = Object.assign([], this.PriveLicence.list);
        this.AppNoList = [];
        for (let i = 0; i < this.PriveLicence.length; i++) {
          this.AppNoList[i] = {};
          this.AppNoList[i].Application_No =
            this.PriveLicence[i].Application_No;
        }
        if (this.AppNoList.length > 0) {
          this.pendclose(this.AppNoList[0]["Application_No"]);
        } else {
          this.se.emit(this.eventTypes.JSONFOUND);
        }

        this.PriveAppNoList = Object.assign([], this.AppNo);
        // console.log('this.AppNoList', this.AppNoList);
        // console.log('PriveLicence', PriveLicence);
        this.ifAppNo = true;
      },
      (error) => {
        console.log("error");
        this.se.emit(this.eventTypes.JSONFOUND);
      }
    );
  }

  getCustomerTypeLookUP() {
    this.serviceService.getCustomerTypeLookUP().subscribe(
      (CustomerTypeLookUP) => {
        this.CustomerTypeLookUP = CustomerTypeLookUP;
        this.CustomerTypeLookUP = Object.assign(
          [],
          this.CustomerTypeLookUP.list
        );
        console.log("CustomerTypeLookUP", this.CustomerTypeLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  GetApplicationNumberByUser(username, orgcode) {
    this.serviceService
      .GetApplicationNumberByUser(username, orgcode)
      .subscribe((ApplicationNumber: any) => {
        this.ApplicationNumberlist = ApplicationNumber;
        this.ApplicationNumberlist.sort((a, b) => {
          if (a.application_Date > b.application_Date) {
            console.log("sttatattgs", this.ApplicationNumberlist);
            return -1;
          } else if (a.application_Date < b.application_Date) {
            console.log("sttatattgs", this.ApplicationNumberlist);
            return 1;
          } else {
            return 0;
          }
        });

        //this.AppNoList;
        const uniqueJobMatchIDs = {};
        const uniqueData = this.ApplicationNumberlist.filter((item) => {
          if (!uniqueJobMatchIDs[item.application_number]) {
            uniqueJobMatchIDs[item.application_number] = true;
            return true;
          }
          return false;
        });
        this.ApplicationNumberlist = uniqueData;
        console.log("finalystatuslist", this.ApplicationNumberlist);
      });
  }

  getSuspendedReasonLookUP() {
    this.serviceService.getSuspendedReasonLookUP().subscribe(
      (SuspendedReasonLookUP) => {
        this.SuspendedReasonLookUP = SuspendedReasonLookUP;
        this.SuspendedReasonLookUP = Object.assign(
          [],
          this.SuspendedReasonLookUP.list
        );
        // console.log('SuspendedReasonLookUP', SuspendedReasonLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getPropertyTypeLookUP() {
    this.serviceService.getPropertyTypeLookUP().subscribe(
      (PropertyTypeLookUP) => {
        this.PropertyTypeLookUP = PropertyTypeLookUP;
        this.PropertyTypeLookUP = Object.assign(
          [],
          this.PropertyTypeLookUP.list
        );
        // console.log('PropertyTypeLookUP', PropertyTypeLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getPropertyStatusLookUP() {
    this.serviceService.getPropertyStatusLookUP().subscribe(
      (PropertyStatusLookUP) => {
        this.PropertyStatusLookUP = PropertyStatusLookUP;
        this.PropertyStatusLookUP = Object.assign(
          [],
          this.PropertyStatusLookUP.list
        );
        // console.log('PropertyStatusLookUP', PropertyStatusLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getServiceDeliveryUnitLookUP() {
    this.serviceService.getServiceDeliveryUnitLookUP().subscribe(
      (ServiceDeliveryUnitLookUP) => {
        this.ServiceDeliveryUnitLookUP = ServiceDeliveryUnitLookUP;
        console.log("appnoooo", this.SDP_ID);
        let counter = 0;
        setTimeout(() => {
          this.intervalId = setInterval(() => {
            if (
              this.ServiceDeliveryUnitLookUP &&
              this.ServiceDeliveryUnitLookUP.length > 0
            ) {
              this.ServiceDeliveryUnitLookUP = Object.assign(
                [],
                this.ServiceDeliveryUnitLookUP
              );
              this.ServiceDeliveryUnitLookUP =
                this.ServiceDeliveryUnitLookUP.filter(
                  (value) => value.organization_code == this.SDP_ID
                );
              console.log(
                "ServiceDeliveryUnitLookUP",
                this.ServiceDeliveryUnitLookUP
              );
              counter++;
              if (counter >= 5) {
                clearInterval(this.intervalId);
              }
            }
          }, 3000);
        }, 6000);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getTransferTypeLookUP() {
    this.serviceService.getTransferTypeLookUP().subscribe(
      (TransferTypeLookUP) => {
        this.TransferTypeLookUP = TransferTypeLookUP;
        this.TransferTypeLookUP = Object.assign(
          [],
          this.TransferTypeLookUP.list
        );
        console.log("TransferTypeLookUP", TransferTypeLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  GetNotePrevius(AppNo) {
    this.serviceService.GetNote(AppNo).subscribe(
      (Notes) => {
        if (Notes) {
          console.log("NoteObj", Notes);
          this.preNoteObj = Notes[0];
        }
      },
      (error) => {
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );
  }
  getLease_Type_Lookup() {
    this.serviceService.getLease_Type_Lookup().subscribe(
      (Lease_Type_Lookup) => {
        this.Lease_Type_Lookup = Lease_Type_Lookup;
        this.Lease_Type_Lookup = Object.assign([], this.Lease_Type_Lookup.list);
        console.log("Lease_Type_Lookup", Lease_Type_Lookup);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getWoredaLookUP() {
    this.serviceService.getWoredaLookUP().subscribe(
      (WoredaLookUP) => {
        this.WoredaLookUP = WoredaLookUP;
        this.WoredaLookUP = Object.assign([], this.WoredaLookUP.list);
        // console.log('WoredaLookUP', WoredaLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  lode;
  // getCustomerLookUP() {
  //   this.serviceService.getcustomer().subscribe(
  //     (CustomerLookUP: any) => {
  //       this.CustomerLookUP = CustomerLookUP.procCustomers;
  //       for (let i = 0; i < this.CustomerLookUP.length; i++) {
  //         this.CustomerLookUP[i].FullName_AM =
  //           this.CustomerLookUP[i].applicant_First_Name_AM +
  //           " " +
  //           this.CustomerLookUP[i].applicant_Middle_Name_AM +
  //           " " +
  //           this.CustomerLookUP[i].applicant_Last_Name_AM;
  //         this.CustomerLookUP[i].FullName_EN =
  //           this.CustomerLookUP[i].applicant_First_Name_EN +
  //           " " +
  //           this.CustomerLookUP[i].applicant_Middle_Name_En +
  //           " " +
  //           this.CustomerLookUP[i].applicant_Last_Name_EN;
  //       }
  //       console.log("CustomerLookUP", this.CustomerLookUP);
  //       this.getCustomerBankLookUP();
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }
  // getCustomerLookUP() {
  //   this.serviceService.getCustomerLookUP().subscribe(CustomerLookUP => {
  //     this.CustomerLookUP = CustomerLookUP;
  //     this.CustomerLookUP = (Object.assign([], this.CustomerLookUP.list));
  //     for (let i = 0; i < this.CustomerLookUP.length; i++) {
  //       this.CustomerLookUP[i].FullName_AM = this.CustomerLookUP[i].Applicant_First_Name_AM + ' ' + this.CustomerLookUP[i].Applicant_Middle_Name_AM + ' ' + this.CustomerLookUP[i].Applicant_Last_Name_AM;
  //       this.CustomerLookUP[i].FullName_EN = this.CustomerLookUP[i].Applicant_First_Name_EN + ' ' + this.CustomerLookUP[i].Applicant_Middle_Name_En + ' ' + this.CustomerLookUP[i].Applicant_Last_Name_EN;
  //     }
  //     this.getCustomerBankLookUP();
  //     console.log('CustomerLookUP', this.CustomerLookUP);
  //   }, error => {
  //     console.log('error');
  //   });
  // }
  getCustomerBankLookUP() {
    this.CustomerBankLookUP = [];
    for (let i = 0; i < this.CustomerLookUP.length; i++) {
      if (
        this.CustomerLookUP[i].Customer_Type_ID == "3" ||
        this.CustomerLookUP[i].Customer_Type_ID == "5"
      ) {
        this.CustomerBankLookUP.push(this.CustomerLookUP[i]);
      }
    }
    console.log("CustomerBankLookUP", this.CustomerBankLookUP);
  }

  getPlotStutusLookUP() {
    this.serviceService.getPlotStutusLookUP().subscribe(
      (PlotStutusLookUP) => {
        this.serviceService.PlotStutusLook = PlotStutusLookUP;
        this.serviceService.PlotStutusLook = Object.assign(
          [],
          this.serviceService.PlotStutusLook.list
        );
        // console.log('PlotStutusLookUP', PlotStutusLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getPlotLandUseLookUP() {
    this.serviceService.getPlotLandUseLookUP().subscribe(
      (PlotLandUseLookUP) => {
        this.PlotLandUseLookUP = PlotLandUseLookUP;
        this.PlotLandUseLookUP = Object.assign([], this.PlotLandUseLookUP.list);
        console.log("PlotLandUseLookUP", PlotLandUseLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  completedTask(event) {
    this.appliedNow = true;
    console.log("static saved :: ", event);
    if (event["licenceService"]["list"].length > 0) {
      this.licenceData = event["licenceService"]["list"][0];
      this.Application_No = this.licenceData["Application_No"];
      this.Service_Name = this.licenceData["Service_Name"];
    }
    this.DocID = event["docId"];
    this.todoID = event["todoId"];
    this.AppNo = event["appCode"];
    this.getPriveysLicence(this.Application_No);
  }

  public getAll(AppNo) {
    this.serviceService
      .GetApplicationNumberByUserInfo(AppNo)
      .subscribe((licenceService) => {
        this.custmerInformation = licenceService[0];
      });
    this.getuserName(this.AppNo);
    console.log("appppppp", AppNo);
    this.serviceService.getAll(AppNo).subscribe(
      (licenceService) => {
        this.licenceService = licenceService;
        console.log("Licence Service", this.licenceService);
        if (this.licenceService.list.length > 0) {
          this.licenceData = this.licenceService.list[0];
          this.SDP_ID = this.licenceData.SDP_ID;
          this.Service_ID = this.licenceData.Service_ID;
          this.serviceService.Service_ID = this.licenceData.Service_ID;
          this.serviceService.serviceDP = this.SDP_ID;
          this.Licence_Service_ID = this.licenceData.Licence_Service_ID;
          this.AppCode = this.licenceData.Licence_Service_ID; //
          this.AppNo = this.licenceData.Application_No; //
          console.log("licenceData", this.licenceData);

          if (this.licenceData.Certificate_Code > 0) {
            this.getPriveysLicence(this.licenceData.Certificate_Code);
          } else {
            this.getPriveysLicence(this.licenceData.Application_No);
          }
        }

        // if (this.ID == 2) {
        //   this.disablefins = false;
        //   this.getPlotManagement();
        // } else if (this.ID == 3) {
        //   this.disablefins = false;
        //   this.getPlotManagement();
        // } else if (this.ID == 4) {
        //   this.disablefins = false;
        //   this.getDeed();
        // }
        // console.log('Licence data2', this.licenceData);
        // this.taskType = this.licenceData.TaskType;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.se.emit(this.eventTypes.JSONFOUND);
      }
    );
  }
  getuserName(AppNo) {
    this.serviceService.getuserName(AppNo).subscribe((res: any) => {
      this.useNamelist = res;
      console.log("useNamelist", this.useNamelist, AppNo);
      if (this.useNamelist.length > 0) {
        this.GetApplicationNumberByUser(
          this.useNamelist[0].userName,
          this.useNamelist[0].organization_code
        );
      }
    });
  }
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log(this.data);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
