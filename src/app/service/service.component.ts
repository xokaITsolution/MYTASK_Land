import {
  Component,
  Input,
  OnInit,
  Renderer2,
  ElementRef,
  TemplateRef,
  ViewEncapsulation,
  Pipe, PipeTransform ,
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

import { ConfirmationService, DialogService, DynamicDialogConfig } from "primeng/api";
import { FilePreviewDialogComponent } from "./file-preview-dialog/file-preview-dialog.component";
import { NetworkMonitoringService } from "./network-database-monitoring-tool/network-monitoring.service";
import { format } from "util";
import { formatDate } from "@angular/common";
import { MyLibService } from 'my-lib';  

export * from "./qrcode.directive";
type AOA = any[][];
@Component({
  selector: "app-service",
  templateUrl: "./service.component.html",
  styleUrls: ["./demo/demo.component.scss"],
  encapsulation: ViewEncapsulation.None,
})

export class ServiceComponent implements OnInit  {
  maxChars;
  postintnot: boolean = false;
  aaa;
  isAccountVisible: boolean = false;
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
  searchTextapplication:any
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
  isconfirmseller: boolean = false;
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
    "image/tiff": {
      extension: "tiff",
      previewable: true,
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
  displayTab: boolean;
  RequerdDocspreeach: any;
  taskList: any;
  showdWhenNoTodo: boolean;
  PreAppDataa: any;
  PreAppDataaa: any;
  hid: boolean;
  procView_RecordAppNoAndDocIdByAppNo: any;
  selectedeachapp: any;
  eid: any;
  SuperviedUsers: any;
  isSuperviedUsers: boolean;
  backbuttonviable: boolean;
  documents: any;
  documentss: boolean = false;
  mimeTypes: any;
  mimeTypee: any;
  messageAppNo;
  messageCache = [];
  messageObj = {
    userName: null,
    currentMessage: null,
    currentMessageIndex: 0,
    messages: null,
  };
  direction = {
    NEXT: "d00",
    PREV: "d01",
  };
  loadingMessage = false;
  user_name: string;
  isAccountVisiblemessage: boolean;
  AppNumber: any;
  issavenote: boolean;
  issendnote: boolean;
  attachedBY: any;
  binaryData: any;
  dar: boolean;
  RID: null;
  userName: any;
  Customer: any;
  blocked: boolean=false;
  isconfirmsaveAR: boolean;
  rule_Code: any;
  task_rules_code: any;
  isconfirmsaveplot: boolean;
  itcanntupdate: boolean;
  docid: any;
  propertyid: any;
  customerdata: Person[] = [];
  iscustomerdata: boolean;
  sellerkebeleid: string = '';
  userNameForLib: string;
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
    private dialogService: DialogService,
    private networkService: NetworkMonitoringService ,
    private confirmationService: ConfirmationService ,private myLibService: MyLibService,
  ) {
  
  }
  
  
  hide = true;
  saveFormmjson(formData) {
    
    this.validated = true;
    if ("de4937d8-bdcd-46d6-8749-dc31c9f3adcf" == this.SDP_ID ||
      "2145F90D-E911-42F2-9AD7-C2455A4D9DCD".toLocaleLowerCase()  == this.SDP_ID ||
      "1b30e6d6-0ade-443e-be18-22de948bfd1e".toLocaleLowerCase()  == this.SDP_ID  ||
      "14b073b2-27b0-441c-ade0-1cd1eb49e42c".toLocaleLowerCase() == this.SDP_ID
    ) {

      this.serviceService.getcertbytitledeedall(formData.Title).subscribe(data=>{
        // data.length >0
         if(1==1){
      if (environment.subcity == "arada") {
        this.AppNo = "6921d772-3a1c-4641-95a0-0ab320bac3e2";
      } else if (environment.subcity == "bole") {
        this.AppNo = "89eb1aec-c875-4a08-aaf6-2c36c0864979";
      } else if (environment.subcity == "nifass") {
        this.AppNo = "f8ea62db-05bc-4f1a-ab30-4e926d43e3fb";
      } else if (environment.subcity == "gullele") {
        this.AppNo = "6a8c042f-a3e1-4375-9769-54d94c2312c6";
      } else if (environment.subcity == "addisk") {
        this.AppNo = "7101d44d-97d5-41aa-957d-82f36d928c07";
      } else if (environment.subcity == "lideta") {
        this.AppNo = "e4d8219e-51f9-40cb-9d53-883c6ca9aaa3";
      } else if (environment.subcity == "lemik") {
        this.AppNo = "f02e9467-1b7d-4350-bee7-9844d4f56da0";
      } else if (environment.subcity == "yeka") {
        this.AppNo = "8222f028-5fe3-4047-9a50-b52bfa64c851";
      } else if (environment.subcity == "akakyk") {
        this.AppNo = "08f9c927-6366-467a-ba99-c837c5add427";
      } else if (environment.subcity == "kirkos") {
        this.AppNo = "aaa5094c-8899-4708-9f7b-d8ff634a3540";
      } else if (environment.subcity == "kolfek") {
        this.AppNo = "930d1c20-9e0e-4a50-9eb2-e542fafbad68";
      } else if (environment.subcity == "central") {
        this.AppNo = "1EFB0336-26C6-4BF1-AEB8-8DA0D4F7DBBB";
      }
      if (this.Licence_Service_ID == undefined) {
        this.Licence_Service_ID = "00000000-0000-0000-0000-000000000000";
        this.DocID = "00000000-0000-0000-0000-000000000000";
        this.todoID = "00000000-0000-0000-0000-000000000000";
        this.Service_ID = this.SDP_ID;
      }
      //let doc_id = this.serviceService.docId ? this.serviceService.docId : '00000000-0000-0000-0000-000000000000';
      // this.serviceService.saveForm(this.Licence_Service_ID, this.Service_ID, this.tskID, this.SDP_ID, JSON.stringify(formData), this.DocID, this.todoID).subscribe(message => {
      this.serviceService
        .saveFormObj(
          this.Licence_Service_ID,
          this.Service_ID,
          this.tskID,
          this.AppNo,
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
      }else{
        const toast = this.notificationsService.error(
          "Error",
          "Title deed you insert not correct/ያስገቡት የባለቤትነት ሰነድ ትክክል አይደለም"
        );
        return
      }
      }, error => {
        // Optionally handle the error case if the request fails
        console.error('Error fetching certificate by title deed', error);
        this.notificationsService.error(
          "Error",
          "An error occurred while fetching the data/መረጃውን በመግኘት ጊዜ ስህተት አጋጥሟል"
        );
      })
    } else {
      console.log("save-form", JSON.stringify(formData));
      this.serviceService
        .saveFormObj(
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
            //this.todoID = response[2];
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
  }
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      return item.application_number.toLowerCase().includes(searchText);
    });
  }
  saveFormm(formData) {
    if ("de4937d8-bdcd-46d6-8749-dc31c9f3adcf" == this.SDP_ID) {
      if (environment.subcity == "arada") {
        this.AppNo = "6921d772-3a1c-4641-95a0-0ab320bac3e2";
      } else if (environment.subcity == "bole") {
        this.AppNo = "89eb1aec-c875-4a08-aaf6-2c36c0864979";
      } else if (environment.subcity == "nifasS") {
        this.AppNo = "f8ea62db-05bc-4f1a-ab30-4e926d43e3fb";
      } else if (environment.subcity == "gullele") {
        this.AppNo = "6a8c042f-a3e1-4375-9769-54d94c2312c6";
      } else if (environment.subcity == "addisK") {
        this.AppNo = "7101d44d-97d5-41aa-957d-82f36d928c07";
      } else if (environment.subcity == "lideta") {
        this.AppNo = "e4d8219e-51f9-40cb-9d53-883c6ca9aaa3";
      } else if (environment.subcity == "lemiK") {
        this.AppNo = "f02e9467-1b7d-4350-bee7-9844d4f56da0";
      } else if (environment.subcity == "yeka") {
        this.AppNo = "8222f028-5fe3-4047-9a50-b52bfa64c851";
      } else if (environment.subcity == "akakyK") {
        this.AppNo = "08f9c927-6366-467a-ba99-c837c5add427";
      } else if (environment.subcity == "kirkos") {
        this.AppNo = "aaa5094c-8899-4708-9f7b-d8ff634a3540";
      } else if (environment.subcity == "kolfeK") {
        this.AppNo = "930d1c20-9e0e-4a50-9eb2-e542fafbad68";
      } else if (environment.subcity == "central") {
        this.AppNo = "275619f2-69c2-4fb7-a053-938f0b62b088";
      }
      if (this.Licence_Service_ID == undefined) {
        this.Licence_Service_ID = "00000000-0000-0000-0000-000000000000";
        this.DocID = "00000000-0000-0000-0000-000000000000";
        this.todoID = "00000000-0000-0000-0000-000000000000";
        this.Service_ID = this.SDP_ID;
      }
      //let doc_id = this.serviceService.docId ? this.serviceService.docId : '00000000-0000-0000-0000-000000000000';
      // this.serviceService.saveForm(this.Licence_Service_ID, this.Service_ID, this.tskID, this.SDP_ID, JSON.stringify(formData), this.DocID, this.todoID).subscribe(message => {
      this.serviceService
        .saveForm(
          this.Licence_Service_ID,
          this.Service_ID,
          this.tskID,
          this.AppNo,
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
    } else {
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
            //this.todoID = response[2];
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
  }
  saveFormmplot(formData) {
    if ("de4937d8-bdcd-46d6-8749-dc31c9f3adcf" == this.SDP_ID ||
      "2145F90D-E911-42F2-9AD7-C2455A4D9DCD".toLocaleLowerCase()  == this.SDP_ID ||
      "1b30e6d6-0ade-443e-be18-22de948bfd1e".toLocaleLowerCase()  == this.SDP_ID
    ) {
      if (environment.subcity == "arada") {
        this.AppNo = "6921d772-3a1c-4641-95a0-0ab320bac3e2";
      } else if (environment.subcity == "bole") {
        this.AppNo = "89eb1aec-c875-4a08-aaf6-2c36c0864979";
      } else if (environment.subcity == "nifasS") {
        this.AppNo = "f8ea62db-05bc-4f1a-ab30-4e926d43e3fb";
      } else if (environment.subcity == "gullele") {
        this.AppNo = "6a8c042f-a3e1-4375-9769-54d94c2312c6";
      } else if (environment.subcity == "addisK") {
        this.AppNo = "7101d44d-97d5-41aa-957d-82f36d928c07";
      } else if (environment.subcity == "lideta") {
        this.AppNo = "e4d8219e-51f9-40cb-9d53-883c6ca9aaa3";
      } else if (environment.subcity == "lemiK") {
        this.AppNo = "f02e9467-1b7d-4350-bee7-9844d4f56da0";
      } else if (environment.subcity == "yeka") {
        this.AppNo = "8222f028-5fe3-4047-9a50-b52bfa64c851";
      } else if (environment.subcity == "akakyK") {
        this.AppNo = "08f9c927-6366-467a-ba99-c837c5add427";
      } else if (environment.subcity == "kirkos") {
        this.AppNo = "aaa5094c-8899-4708-9f7b-d8ff634a3540";
      } else if (environment.subcity == "kolfeK") {
        this.AppNo = "930d1c20-9e0e-4a50-9eb2-e542fafbad68";
      } else if (environment.subcity == "central") {
        this.AppNo = "1EFB0336-26C6-4BF1-AEB8-8DA0D4F7DBBB";
      }
      if (this.Licence_Service_ID == undefined) {
        this.Licence_Service_ID = "00000000-0000-0000-0000-000000000000";
        this.DocID = "00000000-0000-0000-0000-000000000000";
        this.todoID = "00000000-0000-0000-0000-000000000000";
        this.Service_ID = this.SDP_ID;
      }
      //let doc_id = this.serviceService.docId ? this.serviceService.docId : '00000000-0000-0000-0000-000000000000';
      // this.serviceService.saveForm(this.Licence_Service_ID, this.Service_ID, this.tskID, this.SDP_ID, JSON.stringify(formData), this.DocID, this.todoID).subscribe(message => {
      this.serviceService
        .saveForm(
          this.Licence_Service_ID,
          this.Service_ID,
          this.tskID,
          this.AppNo,
          JSON.stringify(formData),
          this.DocID,
          this.todoID
        )
        .subscribe(
          (message) => {
            // this.serviceService.disablefins = false;
            this.AppCode = message[0];
            this.DocID = message[1];
            this.todoID = message[2];
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
    } else {
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

            // this.serviceService.disablefins = false;
            this.AppNo = response[0];
            this.DocID = response[1];
            //this.todoID = response[2];
            this.getAll(this.AppNo);
            const toast = this.notificationsService.success("Success", "Saved");
            this.validated = true;
            if (
              "5de49606-4dc6-4fb1-8f37-0cfc948fdc83".toLocaleLowerCase() ===
                this.serviceService.Service_ID ||
              "81f8770b-2c1e-4255-8be1-341089703fa1".toLocaleLowerCase() ===
                this.serviceService.Service_ID ||
              "8a8588ae-0267-48b7-88ac-f3f18ac02167".toLocaleLowerCase() ===
                this.serviceService.Service_ID ||
              "1c3d5a79-350e-4214-a343-d79e92a86e0f".toLocaleLowerCase() ===
                this.serviceService.Service_ID
            ) {
              this._opened = true;
            } else {
              this.serviceService.disablefins = false;
            }
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
    // debugger
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
// debugger
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
    
    this.userNameForLib=environment.username
    this.myLibService.setUsername(environment.username);
    this.myLibService.setSubcity(environment.subcity);

    //console.log("🚀 ~ ngOnInit ~ formattedDate:", formattedDate)
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
      if (response) {
        for (let index = 0; index < response.length; index++) {
          const element = response[index];

          if (
            element.RoleId == "8e759c69-1ed6-445b-b7f8-32c3fd44e8be" ||
            element.RoleId == "3ba734c5-d75a-44c7-8c47-5233431372ba"
          ) {
            this.eid = element.UserId;
            this.hideit = true;
            break;
          } else {
            this.eid = element.UserId;
            console.log("responseresponseresponse", element);
            this.hideit = false;
          }
        }
      }
    });
    this.serviceService.getUserRole().subscribe((response: any) => {
      if (response) {
        for (let index = 0; index < response.length; index++) {
          const element = response[index];

          if (
            element.RoleId ===
            "B59EA343-65EF-4C41-95A8-02D9AD81BFCD".toLocaleLowerCase()
          ) {
            this.serviceService.backbuttonviable = true;
            break;
          } else {
            this.serviceService.backbuttonviable = false;
          }
        }
      }
    });
    this.serviceService.getUserRole().subscribe((response: any) => {
      if (response) {
        for (let index = 0; index < response.length; index++) {
          const element = response[index];

          if (
            element.RoleId ==
              "8C133397-587E-456F-AB31-9CF5358BE8D2".toLocaleLowerCase() ||
            element.RoleId ==
              "270F762A-5393-4971-83BA-C7FF7D560BDA".toLocaleLowerCase() ||
            element.RoleId ==
              "B59EA343-65EF-4C41-95A8-02D9AD81BFCD".toLocaleLowerCase()
          ) {
            this.eid = element.UserId;
            this.serviceService.isRecordDocumentationManager = true;
            console.log("responseresponseresponserole", element);
            break;
          } else {
            this.eid = element.UserId;
            console.log("responseresponseresponse", element);
            this.serviceService.isRecordDocumentationManager = false;
          }
        }
      }
    });

    this.serviceService.GetSuperviedUsers().subscribe((SuperviedUsers) => {
      this.SuperviedUsers = SuperviedUsers;
      this.SuperviedUsers = Object.assign([], this.SuperviedUsers);
      this.SuperviedUsers = SuperviedUsers;
      if (this.SuperviedUsers != undefined || this.SuperviedUsers != null) {
        if (this.SuperviedUsers.length > 0) {
          this.isSuperviedUsers = true;
        } else {
          this.isSuperviedUsers = false;
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
      this.docid =params["docid"];
      this.formcode = params["formcode"];
      this.AppNo = params["AppNo"];
      this.SDP_ID = params["SDP_ID"];
      this.Service_ID = this.SDP_ID;
      this.getAll(this.AppNo);
      this.tskTyp = params["tskTyp"];
      this.tskID = params["tskID"];
// debugger
      // if (this.serviceService.propertytaskslist != undefined) {
      //   let filterpropertyid = this.serviceService.propertytaskslist.filter(
      //     (x: any) => x.id.toLocaleLowerCase() === this.tskID
      //   );
      //   console.log(
      //     "🚀 ~ this.activatedRoute.params.subscribe ~ filterpropertyid:",
      //     filterpropertyid,
      //     this.serviceService.propertytaskslist,
      //     this.tskID
      //   );
      //   if (filterpropertyid.length > 0) {
      //     this.serviceService.backbuttonviable = true;
      //   } else {
      //     this.serviceService.backbuttonviable = false;
      //   }
      // }

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
    }
    else if (this.formcode == "2300be8b-6b60-4161-be6b-1d8d9767acb9") {
      //this.serviceService.disablefins = false;
      this.ID = 25;
    }
    else if (this.formcode == "a0f4df42-5216-4c03-b286-35866c47a866") {
      this.ID = 7;
    } else if (this.formcode == "10e401e1-4ba3-40c8-b16a-773f61907a54") {
      this.ID = 8;
    } else if (this.formcode == "da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1ff") {
      this.ID = 9;
    } else if (this.formcode == "da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1f") {
      this.ID = 10;
    } else if (this.formcode == "cc71e78d-ef6f-4b93-8d8e-3996f1043fba") {
      this.serviceService.disablefins = false;
      this.ID = 12;
    } 
    else if (this.formcode == "ee892362-98c4-4321-a3fe-40c5a8205a54") {
      // this.serviceService.disablefins = false;
      this.ID = 13;
    }else if (this.formcode == "ee892362-98c4-4321-a3fe-40c5a8205a55") {
      // this.serviceService.disablefins = false;
      this.ID = 14;
    }
    else if (this.formcode == "f449993c-e422-46c9-b74c-fbc81c443071") {
 
      this.ID = 15;
    }
    else if (this.formcode == "2e7cedd2-3d65-440a-9418-71943297c52b") {
      // this.serviceService.disablefins = false;
      this.ID = 16;
    }
    else if (this.formcode == "23c35b01-5d81-41f0-b0dc-262d82554804") {
      // this.serviceService.disablefins = false;
      this.ID = 17;
    }
    else if (this.formcode == "ee892362-98c4-4321-a3fe-40c5a8205a54") {
      // this.serviceService.disablefins = false;
      this.ID = 13;
    }else if (this.formcode == "ee892362-98c4-4321-a3fe-40c5a8205a55") {
      // this.serviceService.disablefins = false;
      this.ID = 14;
    }
    else if (this.formcode == "cc71e78d-ef6f-4b93-8d8e-3996f1043faa") {
      //this.serviceService.disablefins = false;
      this.ID = 20;
    } 
    else if (this.formcode == "2147653b-9b53-4eb9-b4d6-4e5cce749d46") {
      //this.serviceService.disablefins = false;
      this.ID = 21;
    } 
    else if (this.formcode == "0bb23867-4952-420e-a03b-0badaf02320e") {
      //this.serviceService.disablefins = false;
      this.ID = 22;
    } 
    else if (this.formcode == "37ad67c7-5c48-4c09-a832-ac397c3fc739") {
      //this.serviceService.disablefins = false;
      this.ID = 23;
    } 
    // else if (this.formcode == "ef941f1f-0adc-42ce-9cfe-161795bc70e7") {
    //   //this.serviceService.disablefins = false;
    //   this.ID = 24;
    // }
    else if (this.formcode == "ef941f1f-0adc-42ce-9cfe-161795bc70e7") {
      //this.serviceService.disablefins = false;
      this.ID = 18;
    }
    else {
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
  generateApplication(data){
    this.AppCode = data.appno;
    this.DocID = data.docid;
    this.todoID = data.todo_id;
    this.Service_ID=data.service_id
    this.Licence_Service_ID=data.appno
    console.log('datafromlibrary',data,this.Service_ID);
    this.getAll(data.appno);

    
  }
  saveFormmLib(formData){
    this.serviceService
    .saveFormm(
      formData.appno,
      formData.service_id,
      this.tskID,
      formData.SDP_ID,
      JSON.stringify({}),
      this.DocID || "00000000-0000-0000-0000-000000000000",
      this.todoID || "00000000-0000-0000-0000-000000000000"
    )
    .subscribe(
      (response) => {
        console.log("save-from-response", response);

        this.serviceService.disablefins = false;
        this.AppNo = response[0];
        this.DocID = response[1];
        //this.todoID = response[2];
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
        if (this.RequerdDocspre != null || this.RequerdDocspre != undefined) {
          this.showProgressBar = false;
          for (let i = 0; i < this.RequerdDocspre.length; i++) {
            console.log("pdf file", this.RequerdDocspre[i]);
            for (let j = 0; j < SavedFiles.length; j++) {
              if (
                this.RequerdDocspre[i].requirement_code ==
                SavedFiles[j].requirement_code
              ) {
                try {
                  if (
                    this.RequerdDocspre[i].description_en.indexOf("DAR") !== -1
                  ) {
                    this.RequerdDocspre[i].dar=true
                    const binaryData = atob(SavedFiles[j].document);
                    this.binaryData=atob(SavedFiles[j].document);
                    const arrayBuffer = new ArrayBuffer(this.binaryData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    
                    for (let i = 0; i < this.binaryData.length; i++) {
                        uint8Array[i] = this.binaryData.charCodeAt(i);
                    }
                    
                    // Create Blob
                    const blob = new Blob([uint8Array], {
                        type: "application/pdf",
                    });
                    
                    // Set Blob URL as iframe source
                    this.RequerdDocspre[i].dar=true
                    this.RequerdDocspre[i].mimeType = "application/pdf";
                    this.RequerdDocspre[i].File = this.sanitizer.bypassSecurityTrustResourceUrl(
                        URL.createObjectURL(blob)
                    );
                 this.dar=true
                  } else {
                    this.RequerdDocspre[i].dar=false
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
                  }
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
        }
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
          this.Close();
        }
      },
      (error) => {
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
        this.Close();
      }
    );
  }

  getPost(appno) {
    this.serviceService.getPostit_user(appno).subscribe(
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
      this.saveForm3("{}");
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
  isvalidateds(todoID, tskID, plotid, proid, DocID) {
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
  EnableFinss() {
    //  this.serviceService.disablefins = false;
    // console.log("enableningggg....", this.validated);
    this.validated = true;
    // this.saveForm(this.jsonempty);
    this.validated = true;
    this.isvalidateds(
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
    //this.NoteObj.postit_note_code = this.todoID;
    this.serviceService
      .addNote(this.AppNo, this.NoteObj.remarks, this.todoID)
      .subscribe(
        (message) => {
          const toast = this.notificationsService.success("Sucess", "Saved");
          this.issendnote = true;
          if(this.ID==12){
            this.saveFormm('{}')
          }
         
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
    //this.NoteObj.postit_note_code = this.todoID;
    this.serviceService.saveNote(this.NoteObj.remarks, this.todoID).subscribe(
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
    // this.NoteObj.postit_note_code = this.todoID;
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
          this.serviceService
            .sendNoteApi(
              this.NoteObj.remarks,
              this.AppNo,
              this.todoID,
              this.todoID,
              this.SDP_ID
            )
            .subscribe((message) => {});
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
    // this.NoteObj.postit_note_code = this.todoID;
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
          this.serviceService
            .sendNoteApi(
              this.NoteObj.remarks,
              this.AppNo,
              this.todoID,
              this.todoID,
              this.SDP_ID
            )
            .subscribe((message) => {});

          this.GetNote(message);
        },
        (error) => {
          // const toast = this.notificationsService.error(
          //   "Error",
          //   "SomeThing Went Wrong"
          // );
          this.Close();
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
          this.serviceService
            .sendNoteApi(
              this.NoteObj.remarks,
              this.AppNo,
              this.todoID,
              this.todoID,
              this.SDP_ID
            )
            .subscribe((message) => {});
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
            this.NoteObj = note;
            if (note.postit_note_code === message) {
              return true;
            } else {
              // this.NoteObj = { remarks: "", postit_note_code: "" };
              return false;
            }
          });
        } else {
          // this.NoteObj = { remarks: "", postit_note_code: "" };
        }
      },
      (error) => {
        // const toast = this.notificationsService.error(
        //   "Error",
        //   "SomeThing Went Wrong"
        // );
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
              this.serviceService.disablefins = false;
              fild.clear();
              const toast = this.notificationsService.success(
                "Success",
                "Uploaded successfully"
              );
              for (let i = 0; i < this.RequerdDocs.length; i++) {
                if (
                  this.RequerdDocs[i].requirement_code ==
                  RequiredDoc.requirement_code
                ) {
                  this.RequerdDocs[i].mimeType = type;
                  this.RequerdDocs[i].File =
                    "data:" + type + ";base64, " + base64file;

                  this.RequerdDocs[i].File =
                    this.sanitizer.bypassSecurityTrustResourceUrl(
                      this.RequerdDocspreeach[i].File
                    );
                }
              }

              //this.updated.emit({ docs: this.RequerdDocs });
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

  async getPriveysLicenceeach(value) {
    try {
      this.AppN = null;

      const PriveLicence = await this.serviceService
        .getPriveys(value)
        .toPromise();

      this.PriveLicence = PriveLicence;
      this.PriveLicence = Object.assign([], this.PriveLicence.list);
      this.AppNoList = [];

      for (let i = 0; i < this.PriveLicence.length; i++) {
        this.AppNoList[i] = {};
        this.AppNoList[i].Application_No = this.PriveLicence[i].Application_No;
      }

      if (this.AppNoList.length > 0) {
        this.pendclose(this.AppNoList[0]["Application_No"]);
      } else {
        this.se.emit(this.eventTypes.JSONFOUND);
      }

      this.PriveAppNoList = Object.assign([], this.AppNo);
      this.ifAppNo = true;

      return this.PriveLicence; // Return the data
    } catch (error) {
      console.error("Error:", error);
      this.se.emit(this.eventTypes.JSONFOUND);
      return null; // Return null or handle the error accordingly
    }
  }
  getRequiredDocspreeach(tskID) {
    this.serviceService.getRequerdDocs(tskID).subscribe((res) => {
      this.RequerdDocspreeach = res;
      this.displayTab = false;
      console.log(
        "taskresponsessssdd",
        res,
        tskID,
        this.RequerdDocspreeach.length
      );
      for (let i = 0; i < this.RequerdDocspreeach.length; i++) {
        if (this.RequerdDocspreeach[i].description_en == "Dummy") {
          this.RequerdDocspreeach.splice(i, 1);
          break;
        }
        this.RequerdDocspreeach.forEach((item) => {
          item.previewed = false; // Add a new property to track preview status, initialized to false
        });
      }
      this.serviceService
        .getDocIdByAppNo(this.selectedeachapp)
        .subscribe((DocIdByAppNo: any) => {
          this.procView_RecordAppNoAndDocIdByAppNo =
            DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
          console.log(
            "DocIdByAppNo90",
            this.procView_RecordAppNoAndDocIdByAppNo
          );
          // this.getAllDocumentpreforeach(
          //   this.procView_RecordAppNoAndDocIdByAppNo[0].application_code,
          //   this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id
          // );
          this.getAllDocumentpreforeachh(
            this.procView_RecordAppNoAndDocIdByAppNo[0].application_code,
            this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id
          );
        });
    });
  }
  getdatadoc(doc) {
    this.documentss = false;
    this.serviceService.getAllDocumentt(doc).subscribe((r) => {
      let fileData = JSON.parse(atob(r[0].document));

      let { type, data } = fileData;

      this.mimeTypee = type;
      console.log("mimeTypeemimeTypee", this.mimeTypee);
      let file = "data:" + type + ";base64, " + data;

      this.documents = this.sanitizer.bypassSecurityTrustResourceUrl(file);
      this.documentss = true;
      this.attachedBY=r[0].attachedBY;
      console.log("responceses", r[0].document);
    });
    console.log("documentsdoc");
  }
  getAllDocumentpreforeachh(Licence_Service_ID, DocID) {
    let updatedArray: any[] = [];
    this.loadingPreDoc = true;
    console.log("this.RequerdDocspre", this.RequerdDocspreeach);
    this.serviceService.getAllDocuments(Licence_Service_ID, DocID).subscribe(
      (SavedFiles) => {
        console.log("SavedFiiiilessssffff", SavedFiles);
        if (SavedFiles.length > 0) {
          this.loadingPreDoc = false;
          this.SavedFilespre = SavedFiles;
          for (let j = 0; j < SavedFiles.length; j++) {
            if (SavedFiles[j].attachedBY.trim() != environment.username) {
              this.hid = false;
            } else {
              this.hid = true;
            }
            let updatedObject = {
              // Copy the existing properties from the original object
              is_hidde: this.hid,
            };

            updatedArray.push(updatedObject);
          }

          this;
          if (
            this.RequerdDocspreeach != null ||
            this.RequerdDocspreeach != undefined
          )
            this.showProgressBar = false;
          console.log("pdf fileeee", this.RequerdDocspreeach);
          for (let i = 0; i < this.RequerdDocspreeach.length; i++) {
            for (let j = 0; j < SavedFiles.length; j++) {
              if (
                this.RequerdDocspreeach[i].requirement_code ==
                SavedFiles[j].requirement_code
              ) {
                console.log("updatedArray", updatedArray[j]);
                try {
                  //  let fileData = JSON.parse(atob(SavedFiles[j].document));

                  // let { type, data } = fileData;

                  // this.RequerdDocspreeach[i].mimeType = type;
                  // this.RequerdDocspreeach[i].File =
                  //   "data:" + type + ";base64, " + data;
                  console.log(
                    "this.RequerdDocspre[i].File"
                    // SavedFiles[j].document
                  );
                  this.RequerdDocspreeach[i].hidden = updatedArray[j].is_hidde;
                  console.log(
                    "updatedArrayyyyy",
                    this.RequerdDocspreeach[i].hidden
                  );

                  // this.RequerdDocspreeach[i].File =
                  //   this.sanitizer.bypassSecurityTrustResourceUrl(
                  //     this.RequerdDocspreeach[i].File
                  //   );

                  this.RequerdDocspreeach[i].document_code =
                    SavedFiles[j].document_code;
                  this.RequerdDocspreeach = this.RequerdDocspreeach;
                } catch (e) {
                  console.error(e);
                }
              }
            }
          }

          console.log("RequerdDocspre", this.RequerdDocspreeach);
          this.RequerdDocspreeach.forEach((item, index) => {
            this.PreviewshowdialogeArray[index] = false; // Initialize all dialog variables to false
          });
        } else {
        }
      },
      (error) => {
        this.loadingPreDoc = false;
        console.log("error");
      }
    );
  }

  getAllDocumentpreforeach(Licence_Service_ID, DocID) {
    let updatedArray: any[] = [];
    this.loadingPreDoc = true;
    console.log("this.RequerdDocspre", this.RequerdDocspreeach);
    this.serviceService.getAllDocument(Licence_Service_ID, DocID).subscribe(
      (SavedFiles) => {
        if (SavedFiles.length > 0) {
          console.log("SavedFiiiilessssffff", SavedFiles.length);

          this.loadingPreDoc = false;
          this.SavedFilespre = SavedFiles;
          for (let j = 0; j < SavedFiles.length; j++) {
            if (SavedFiles[j].AttachedBY.trim() != environment.username) {
              this.hid = false;
            } else {
              this.hid = true;
            }
            let updatedObject = {
              // Copy the existing properties from the original object
              is_hidde: this.hid,
            };

            updatedArray.push(updatedObject);
          }

          this;
          if (
            this.RequerdDocspreeach != null ||
            this.RequerdDocspreeach != undefined
          )
            this.showProgressBar = false;
          console.log("pdf fileeee", this.RequerdDocspreeach);
          for (let i = 0; i < this.RequerdDocspreeach.length; i++) {
            for (let j = 0; j < SavedFiles.length; j++) {
              if (
                this.RequerdDocspreeach[i].requirement_code ==
                SavedFiles[j].requirement_code
              ) {
                console.log("updatedArray", updatedArray[j]);
                try {
                  let fileData = JSON.parse(atob(SavedFiles[j].document));

                  let { type, data } = fileData;

                  this.RequerdDocspreeach[i].mimeType = type;
                  this.RequerdDocspreeach[i].File =
                    "data:" + type + ";base64, " + data;
                  console.log(
                    "this.RequerdDocspre[i].File",
                    SavedFiles[j].document
                  );
                  this.RequerdDocspreeach[i].hidden = updatedArray[j].is_hidde;
                  console.log(
                    "updatedArrayyyyy",
                    this.RequerdDocspreeach[i].hidden
                  );

                  this.RequerdDocspreeach[i].File =
                    this.sanitizer.bypassSecurityTrustResourceUrl(
                      this.RequerdDocspreeach[i].File
                    );

                  this.RequerdDocspreeach[i].document_code =
                    SavedFiles[j].document_code;
                  this.RequerdDocspreeach = this.RequerdDocspreeach;
                } catch (e) {
                  console.error(e);
                }
              }
            }
          }

          console.log("RequerdDocspre", this.RequerdDocspreeach);
          this.RequerdDocspreeach.forEach((item, index) => {
            this.PreviewshowdialogeArray[index] = false; // Initialize all dialog variables to false
          });
        } else {
        }
      },
      (error) => {
        this.loadingPreDoc = false;
        console.log("error");
      }
    );
  }

  async getappdataForeach(appNO) {
    const result = await this.getPriveysLicenceeach(appNO);
    console.log("PriveLicenceeach", result);
    this.selectedeachapp = appNO;
    if (result.length > 0) {
      this.PriveLicence = result;
      this.serviceService.getTodandAppNo(appNO).subscribe(
        async (PreAppData) => {
          console.log("🚀 ~ PreAppData:", PreAppData);
          this.PreAppData = PreAppData;
          if (this.PreAppData.Table.length == 0) {
            this.serviceService
              .getTasks(result[0].Service_ID)
              .subscribe((ress: any) => {
                this.taskList = ress;
                console.log("taskresponsess", this.taskList);
                this.showdWhenNoTodo = true;
              });
          } else {
            this.showdWhenNoTodo = false;
          }
          // this.PreAppData = PreAppData;
          // if (appNO != this.Application_No) {
          //const result = await this.getPriveysLicenceeach(appNO);
          // }

          //  console.log("PriveLicenceeach", result);
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
                    // console.log(
                    //   "task :: ",
                    //   task["step_no"],
                    //   " & ",
                    //   task["todo_comment"],
                    //   " app number :: ",
                    //   this.AppNo
                    // );
                    if (task["todo_comment"] == this.AppNo && this.AppNo) {
                      applicationFound = true;
                      this.PreAppData.find((appData) => {
                        if (appData.tasks_task_code == this.tskID) {
                          // console.warn("found already saved task :: ", appData);
                          // console.log("nnn", appData.form_code);
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
  }

  getAppData(appNO) {
    this.preAppID = 0;
    this.serviceService.getTodandAppNo(appNO).subscribe(
      async (PreAppData) => {
        this.PreAppData = PreAppData;
        // this.PreAppData = PreAppData;
        // if (appNO != this.Application_No) {
        //const result = await this.getPriveysLicenceeach(appNO);
        // }

        //  console.log("PriveLicenceeach", result);
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
                  // console.log(
                  //   "task :: ",
                  //   task["step_no"],
                  //   " & ",
                  //   task["todo_comment"],
                  //   " app number :: ",
                  //   this.AppNo
                  // );
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
    this.serviceService.appnoForRecord =task.todo_comment
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
    } else if (task.form_code == "cc71e78d-ef6f-4b93-8d8e-3996f1043fba") {
      this.preAppID = 12;
    } 
    else if (task.form_code == "ee892362-98c4-4321-a3fe-40c5a8205a54") {
      this.preAppID = 13;
    }
    else if (task.form_code == "ee892362-98c4-4321-a3fe-40c5a8205a55") {
      this.preAppID = 14;
    }
    else if (task.form_code == "f449993c-e422-46c9-b74c-fbc81c443071") {
      this.preAppID = 15;
    }
    else if (task.form_code == "") {
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
  saveForm3(formData) {
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
          // this.serviceService.disablefins = false;
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
            if (
              "5de49606-4dc6-4fb1-8f37-0cfc948fdc83".toLocaleLowerCase() ===
                this.serviceService.Service_ID ||
              "81f8770b-2c1e-4255-8be1-341089703fa1".toLocaleLowerCase() ===
                this.serviceService.Service_ID ||
              "8a8588ae-0267-48b7-88ac-f3f18ac02167".toLocaleLowerCase() ===
                this.serviceService.Service_ID ||
              "1c3d5a79-350e-4214-a343-d79e92a86e0f".toLocaleLowerCase() ===
                this.serviceService.Service_ID
            ) {
              this._opened = true;
            } else {
              this.serviceService.disablefins = false;
            }
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
    this.NoteObj = { remarks: "", postit_note_code: "" };
    let to_to_code;
    this.serviceService.taskrul = data;
    if (name == "R  ") {
      this.showdialoge = true;
    } else {
      if (this.ID == 12) {
        this.serviceService.CheckFileUpload(this.AppNo).subscribe(r=>{
          console.log('rrrrrrrr',r);
          
       if(r!=undefined){
        let isuploaded = r
        // await this.checkDocumentIsAvailable();
        console.log("🚀 ~ showdialog ~ isuploaded:", isuploaded);

        if (isuploaded == true) {
         
          this.SubmitAR(data);
          // const toast = this.notificationsService.success(
          //   `This folder does  have any files.`
          // );
        } else {
console.log('2222222222222222');

          //this.SubmitAR(data);
          const toast = this.notificationsService.error(
            `This folder does not have any files.`
          );
          return;
        }} }) 
      } else {
        this.SubmitAR(data);
      }
      this.serviceService.getUserRole().subscribe((response: any) => {
        for (let index = 0; index < response.length; index++) {
          const element = response[index];
          if (
            element.RoleId ==
              "F8DDA85E-F967-4AC5-BF79-4D989ECFB863".toLocaleLowerCase() ||
            element.RoleId ==
              "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase ||
            element.RoleId ==
              "FE7BE2E0-E717-4230-B732-5B810A8BB875".toLocaleLowerCase() ||
            element.RoleId ==
              "8ACA5AE9-7CE3-4964-AF89-F92A9DF3C2E2".toLocaleLowerCase() ||
            element.RoleId ==
              "8FF2B096-78E0-44A8-AB14-DA4CEB40D095".toLocaleLowerCase()
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
        if (
          this.serviceService.Service_ID ==
            "7D256139-858B-48E7-A298-CAE5438E526C".toLocaleLowerCase() &&
          this.licenceData.Parcel_ID == null
        ) {
          this.DropDownList = this.DropDownList.filter(
            (x) =>
              x.task_rules_code !=
                "266E16BA-0D84-44D1-9CCE-4ACCA4947E12".toLocaleLowerCase() &&
              x.task_rules_code !=
                "7D84E859-23F2-478B-815B-94197F420906".toLocaleLowerCase()
          );
        } else if (
          this.serviceService.Service_ID ==
            "7D256139-858B-48E7-A298-CAE5438E526C".toLocaleLowerCase() &&
          this.licenceData.Parcel_ID != null
        ) {
          this.DropDownList = this.DropDownList.filter(
            (x) =>
              x.task_rules_code !=
              "624F38E1-676C-4C5B-B232-AE3DAFAFF4BF".toLocaleLowerCase()
          );
        }
        console.log("DropDownList", this.DropDownList);
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
            this.blocked=false;
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
            "FE7BE2E0-E717-4230-B732-5B810A8BB875".toLocaleLowerCase() ||
          element.RoleId ==
            "8ACA5AE9-7CE3-4964-AF89-F92A9DF3C2E2".toLocaleLowerCase() ||
          element.RoleId ==
            "8FF2B096-78E0-44A8-AB14-DA4CEB40D095".toLocaleLowerCase()
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
  getSDPID(plotId: string): string | null {
    const letters = plotId.match(/^[A-Za-z_-]+/g)[0] || '';
    console.log("🚀 ~ getSDPID ~ letters:", letters)
    

    switch (letters) {
      case 'AR':
        return '6921D772-3A1C-4641-95A0-0AB320BAC3E2'.toLocaleLowerCase();
      case 'BL':
        return '89EB1AEC-C875-4A08-AAF6-2C36C0864979'.toLocaleLowerCase();
      case 'MCIT-NDC':
        return '1809E356-D00F-42F9-8425-41A149DFD60F'.toLocaleLowerCase();
      case 'NL':
        return 'F8EA62DB-05BC-4F1A-AB30-4E926D43E3FB'.toLocaleLowerCase();
      case 'GU':
        return '6A8C042F-A3E1-4375-9769-54D94C2312C6'.toLocaleLowerCase();
      case 'CN_01':
        return '5EF1475C-2B66-4087-B1B7-63E6C6CD7CA1'.toLocaleLowerCase();
      case 'AD':
        return '7101D44D-97D5-41AA-957D-82F36D928C07'.toLocaleLowerCase();
      case 'LD':
        return 'E4D8219E-51F9-40CB-9D53-883C6CA9AAA3'.toLocaleLowerCase();
      case 'AACALDMBTPSP':
        return '1EFB0336-26C6-4BF1-AEB8-8DA0D4F7DBBB'.toLocaleLowerCase();
      case 'AACA':
        return '275619F2-69C2-4FB7-A053-938F0B62B088'.toLocaleLowerCase();
      case 'LMK':
        return 'F02E9467-1B7D-4350-BEE7-9844D4F56DA0'.toLocaleLowerCase();
      case 'MCIT':
        return '3D26A10C-9BE9-4261-BF97-AB6F39455ED3'.toLocaleLowerCase();
      case 'YK':
        return '8222F028-5FE3-4047-9A50-B52BFA64C851'.toLocaleLowerCase();
      case 'AK':
        return '08F9C927-6366-467A-BA99-C837C5ADD427'.toLocaleLowerCase();
      case 'KS':
        return 'AAA5094C-8899-4708-9F7B-D8FF634A3540'.toLocaleLowerCase();
      case 'KK':
        return '930D1C20-9E0E-4A50-9EB2-E542FAFBAD68'.toLocaleLowerCase();
      default:
        return this.serviceService.currentsdpid
    }
  }

  getplotlist(plotid) {
    this.serviceService.getPlotManagementApi(plotid).subscribe(
      async (PlotManagementLists: any) => {
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;
        console.log("🚀 ~ PlotManagementList:", PlotManagementList)
       
        if (PlotManagementList.length > 0) {
          let ploteid=PlotManagementList[0].plot_ID
          this.serviceService.plotSdpid=this.getSDPID(ploteid)
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
                      if (ress.procProporty_Locations ) {
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
        }else{
          this.serviceService.plotSdpid=this.serviceService.currentsdpid
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
            this.blocked=false;
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
              // for (let index = 0; index < response.length; index++) {
              //   const element = response[index];
              //   if (
              //     element.RoleId ==
              //       "F8DDA85E-F967-4AC5-BF79-4D989ECFB863".toLocaleLowerCase() ||
              //     element.RoleId ==
              //       "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase ||
              //     element.RoleId ==
              //       "FE7BE2E0-E717-4230-B732-5B810A8BB875".toLocaleLowerCase() ||
              //     element.RoleId ==
              //       "8ACA5AE9-7CE3-4964-AF89-F92A9DF3C2E2".toLocaleLowerCase()
              //   ) {
              //     if (this.licenceData.Parcel_ID) {
              //       this.getplotlist(this.licenceData.Parcel_ID);
              //     }
              //     if (this.licenceData.Plot_Merge_1) {
              //       this.getplotlist(this.licenceData.Plot_Merge_1);
              //     }
              //     if (this.licenceData.Plot_Merge_2) {
              //       this.getplotlist(this.licenceData.Plot_Merge_2);
              //     }
              //     if (this.licenceData.Plot_Merge_3) {
              //       this.getplotlist(this.licenceData.Plot_Merge_3);
              //     }
              //     if (this.licenceData.Plot_Merge_4) {
              //       this.getplotlist(this.licenceData.Plot_Merge_4);
              //     }
              //   } else {
              //     console.log("responseresponseresponse", element);
              //   }
              // }
              for (let index = 0; index < response.length; index++) {
                const element = response[index];
                if (
                  element.RoleId ==
                    "F8DDA85E-F967-4AC5-BF79-4D989ECFB863".toLocaleLowerCase() ||
                  element.RoleId ==
                    "5B3B5DD4-3CEF-4696-AC19-442BA531A7DD".toLocaleLowerCase ||
                  element.RoleId ==
                    "FE7BE2E0-E717-4230-B732-5B810A8BB875".toLocaleLowerCase() ||
                  element.RoleId ==
                    "8ACA5AE9-7CE3-4964-AF89-F92A9DF3C2E2".toLocaleLowerCase()
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
  GetApplicationNumberByUser(username, orgcode,AppNo) {
    this.serviceService.getCustomerByCols(username).subscribe((user: any) => {
      this.userName = user.procCustomers;
      console.log("this.userName", this.userName);

      if (this.userName.length > 0) {
        this.serviceService
          .getByCustomerId(this.userName[0].customer_ID)
          .subscribe((customer: any) => {
            console.log("customerrrr", customer.length);
            this.Customer = customer;
         
            if (customer.length > 0) {
            } else {
              this.Customer = [];
            }
          });
        // this.userName=this.userName
        console.log("getUsernme", this.userName[0]);

        // console.log('environment',environment.subcity);s
      } else {
        this.Customer = [];
      }
    });
    this.serviceService
    .getLicencebyid(this.serviceService.LicenceserviceID)
    .subscribe(async (rec: any) => {
    console.log("🚀 ~ .subscribe ~ rec:", rec)
    this.serviceService
      .GetApplicationNumberByUsers(username, orgcode ,AppNo)
      .subscribe((ApplicationNumber: any) => {
        this.ApplicationNumberlist = ApplicationNumber;
        
        let RID;
        if (rec.procLicense_Services.length > 0) {
          RID = rec.procLicense_Services[0].recordNo;
          this.RID=rec.procLicense_Services[0].recordNo;
        }
     
          //console.log("🚀 ~ .subscribe ~ ApplicationNumber:", ApplicationNumber ,this.RID);
          
        //console.log("🚀 ~ .subscribe ~ Parcel_ID:", this.licenceData.Parcel_ID);
        if (this.licenceData.Parcel_ID != null) {
          this.serviceService
            .GetpreviousApplicationNumberByUsers(
              username,
              this.licenceData.Parcel_ID
            )
            .subscribe((PriveLicence: any) => {
              console.log("🚀 ~ .subscribe ~ PriveLicence:", PriveLicence);
              if (PriveLicence.length > 0) {
                this.sellerkebeleid=PriveLicence[0].previousUserName
                this.getcustomer()
                this.serviceService
                  .GetApplicationNumberByprevious(
                    PriveLicence[0].title_Deed_No,
                    PriveLicence[0].previousUserName,
                    PriveLicence[0].organization_code
                  )
                  .subscribe((ApplicationNumber: any) => {
                    console.log(
                      "🚀 ~ .subscribe ~ ApplicationNumber:",
                      ApplicationNumber
                    );

                    ApplicationNumber.forEach((element) => {
                      this.ApplicationNumberlist.push(element);
                    });
                  });
                 
                console.log(
                  "🚀 ~ .subscribe ~ ApplicationNumberlist:",
                  this.ApplicationNumberlist
                );
              }

            });
        }

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
        this.ApplicationNumberlist.sort((a, b) => {
          if (a.application_Date > b.application_Date) {
            // console.log("sttatattgs", this.ApplicationNumberlist);
            return -1;
          } else if (a.application_Date < b.application_Date) {
            //  console.log("sttatattgs", this.ApplicationNumberlist);
            return 1;
          } else {
            return 0;
          }

        });
        if(this.Customer !=undefined ){

          if (this.Customer.length > 0 ){
  
            if(this.Customer[0].customer_Type_ID !=3102 || this.Customer[0].customer_Type_ID !=4120){
            if(this.RID !=null){
              this.ApplicationNumberlist =this.ApplicationNumberlist.filter(x=>x.
                recordNo
                == this.RID)
              }
            }
          }
        }
      });
    })
  }
  getcustomer(): void {
 
    //this.sellerkebeleid = globvar;
    console.log("🚀 ~ this.serviceService.getcustomerAll ~ customerdata:", this.sellerkebeleid);
    this.serviceService.getcustomerAll(this.sellerkebeleid).subscribe(
      (resp: any) => {
        this.customerdata = resp.procCustomers || [];
        if( this.sellerkebeleid  != this.custmerInformation.tin && this.customerdata[0].customer_ID!='00000000-0000-0000-0000-000000000000' ) {
            
          this.serviceService.salesFrominformat=true
          this.serviceService.sellerCustomerId=this.customerdata[0].customer_ID
        }else {
          this.serviceService.salesFrominformat=false

        }
        console.log("🚀 ~ this.serviceService.getcustomerAll ~ customerdata:", this.customerdata[0]);
      },
      (error) => {
        console.error("Error fetching customer data:", error);
        this.customerdata = [];
        this.serviceService.salesFrominformat=false
      }
    );
  }
  isDialogVisible(): boolean {
    this.getcustomer()
    return this.isconfirmseller =true
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
        this.PropertyTypeLookUP.unshift({
          Property_Type_ID: null,
          Property_Type: "select",
        });
        console.log("PropertyTypeLookUP", this.PropertyTypeLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getPropertyStatusLookUP() {
    this.serviceService.getPropertyStatusLookUP().subscribe(
      (PropertyStatusLookUP:any) => {
        this.PropertyStatusLookUP = PropertyStatusLookUP;
        this.PropertyStatusLookUP = Object.assign(
          [],
          this.PropertyStatusLookUP.list
        );
        // if(this.serviceService.Service_ID != '05DB54FC-E388-4E5E-AAAA-BD6141C8E533'.toLocaleLowerCase()){
        //   this.PropertyStatusLookUP=  this.PropertyStatusLookUP.filter(x=>x.P_Status_ID != 3049)
        // }
        // this.PropertyStatusLookUP.unshift({
        //   P_Status_ID: null,
        //   Property_Status: "select",
        // });
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
               if (this.serviceService.currentsdpid == '1efb0336-26c6-4bf1-aeb8-8da0d4f7dbbb' || 
                this.serviceService.currentsdpid == 'aedfabde-b0b3-466a-92f0-913bde031bbf'
               ){
                
                this.ServiceDeliveryUnitLookUP =
                this.ServiceDeliveryUnitLookUP.filter(
                  (value) => value.organization_code 
                );
               }else{
                this.ServiceDeliveryUnitLookUP =
                this.ServiceDeliveryUnitLookUP.filter(
                  (value) => value.organization_code == this.serviceService.currentsdpid
                );
               }
             
                
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
        // if(  this.serviceService.Service_ID != '449A14BD-E0C0-4EDA-92F5-68B3FCF83433'.toLocaleLowerCase()
        //   || this.serviceService.Service_ID != 'DE330170-550B-4BF2-9908-DC557F92A7CC'.toLocaleLowerCase()
        //   || this.serviceService.Service_ID != '05BF5DE7-7170-43CE-8320-C747748D40E5'.toLocaleLowerCase()
        //   || this.serviceService.Service_ID != '5FE58D7F-6E9F-452E-B85B-8CD501F020BE'.toLocaleLowerCase()
        //   || this.serviceService.Service_ID != '05DB54FC-E388-4E5E-AAAA-BD6141C8E533'.toLocaleLowerCase()
        //   ){
        //   this.serviceService.PlotStutusLook=this.serviceService.PlotStutusLook.filter(x=>x.Plot_Status_ID != 2019)
        // }
         console.log('PlotStutusLookUP' ,this.serviceService.PlotStutusLook);
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
  killtodo() {
    this.showdialoge = true;
    this.serviceService
      .killtodo(this.AppNo, this.eid, this.todoID, environment.username, "K")
      .subscribe((message) => {
        // this.Close();
      });
  }
  Reopentodo() {
    this.showdialoge = true;
    this.serviceService
      .Reopentodo(this.AppNo, this.eid, this.todoID, environment.username, "O")
      .subscribe((message) => {
        // this.Close();
      });
  }

  public getAll(AppNo) {
    this.serviceService.getAll(AppNo).subscribe(
      (res:any) => {
        if (res.list.length > 0) {
        let licenceServiceeach = res.list[0];
        this.myLibService.setLicense(licenceServiceeach.Licence_Service_ID);
    //   console.log("🚀 ~ getAll ~ licenceService:", licenceServiceeach)
       this
     console.log("🚀 ~ getAll ~ licenceService:",licenceServiceeach.Service_ID)
    if (licenceServiceeach.Service_ID === '2145F90D-E911-42F2-9AD7-C2455A4D9DCD'.toLocaleLowerCase() || 
    licenceServiceeach.Service_ID === 'DE4937D8-BDCD-46D6-8749-DC31C9F3ADCF'.toLocaleLowerCase()){ 
      this.serviceService.getAll(AppNo).subscribe(
        (re:any) => {
          if (re.list.length > 0) {
          let licenceService = re.list[0];
          console.log("🚀 ~ getAll ~ licenceService:", licenceService)
          this.serviceService.errorservices=licenceService.Service_ID
          this.serviceService.getPlotManagementApi(licenceService.Parcel_ID).subscribe(
            async (PlotManagementLists: any) => {
              let PlotManagementList = PlotManagementLists.procPlot_Registrations;
              if (PlotManagementList.length > 0) {
                 console.log("🚀 ~ PlotManagementList:", PlotManagementList)
                 const AppNolist=PlotManagementList[0].application_No
                 this.serviceService.appnoForRecorderror=AppNolist
                 this.serviceService
                 .GetApplicationNumberByUserInfo(AppNolist)
                 .subscribe((licenceService) => {
                   this.custmerInformation = licenceService[0];
                   console.log(
                     "🚀 ~ .subscribe ~ custmerInformation:",
                     this.custmerInformation
                   );
                   
                 });
               
               this.serviceService.getAll(AppNo).subscribe(
                 (licenceService) => {
                   this.licenceService = licenceService;
                   console.log("Licence Service", this.licenceService);
                   if (this.licenceService.list.length > 0) {
                     this.licenceData = this.licenceService.list[0];
           
                     this.serviceService.licenceData = this.licenceData;
                     this.SDP_ID = this.licenceData.SDP_ID;
                     this.getplotlist(this.licenceData.Parcel_ID);
                     this.serviceService.currentsdpid = this.SDP_ID;
                    //  
                     this.Service_ID = this.licenceData.Service_ID;
                     this.getServiceDeliveryUnitLookUP();
                     this.serviceService.Service_ID = this.licenceData.Service_ID;
                     this.serviceService.serviceDP = this.SDP_ID;
                     this.Licence_Service_ID = this.licenceData.Licence_Service_ID;
                     this.AppCode = this.licenceData.Licence_Service_ID; //
                     this.AppNo = this.licenceData.Application_No; //
                     this.serviceService.appnoForRecord = this.licenceData.Application_No;
                     this.serviceService.LicenceserviceID = this.Licence_Service_ID;
                      if (this.Service_ID =='2a513f83-221c-4cba-b497-a437417f3c69'){
                       this.serviceService.itcanntupdate=true
                      }
                      
                     console.log("licenceData", this.licenceData);
                     this.getuserName(AppNolist);
                     if (this.licenceData.Certificate_Code > 0) {
                       this.getPriveysLicence(this.licenceData.Certificate_Code);
                     } else {
                       this.getPriveysLicence(this.licenceData.Application_No);
                     }
                   }
                   this.loading = false;
                 },
                 (error) => {
                   console.log(error);
                   this.se.emit(this.eventTypes.JSONFOUND);
                 }
               );
               }else{
                this.serviceService
                .GetApplicationNumberByUserInfo(AppNo)
                .subscribe((licenceService) => {
                  this.custmerInformation = licenceService[0];
                  console.log(
                    "🚀 ~ .subscribe ~ custmerInformation:",
                    this.custmerInformation
                  );
                  
                });
              console.log("appppppp", AppNo);
              this.serviceService.getAll(AppNo).subscribe(
                (licenceService) => {
                  this.licenceService = licenceService;
                  console.log("Licence Service", this.licenceService);
                  if (this.licenceService.list.length > 0) {
                    this.licenceData = this.licenceService.list[0];
          
                    this.serviceService.licenceData = this.licenceData;
                    this.SDP_ID = this.licenceData.SDP_ID;
                    this.serviceService.currentsdpid = this.SDP_ID;
                    this.Service_ID = this.licenceData.Service_ID;
                
                    this.serviceService.Service_ID = this.licenceData.Service_ID;
                    this.serviceService.serviceDP = this.SDP_ID;
                    this.Licence_Service_ID = this.licenceData.Licence_Service_ID;
                    this.AppCode = this.licenceData.Licence_Service_ID; //
                    this.AppNo = this.licenceData.Application_No; //
                    this.serviceService.appnoForRecord = this.licenceData.Application_No;
                    this.propertyid=this.licenceData.Property_ID
                    this.serviceService.recordno=this.licenceData.recordNo
                    this.serviceService.LicenceserviceID = this.Licence_Service_ID;
                     if (this.Service_ID =='2a513f83-221c-4cba-b497-a437417f3c69'){
                      this.serviceService.itcanntupdate=true
                     }
                    console.log("licenceData", this.licenceData);
                    this.getuserName(this.AppNo);
                    if (this.licenceData.Certificate_Code > 0) {
                      this.getPriveysLicence(this.licenceData.Certificate_Code);
                    } else {
                      this.getPriveysLicence(this.licenceData.Application_No);
                    }
                  }
                  this.loading = false;
                },
                (error) => {
                  console.log(error);
                  this.se.emit(this.eventTypes.JSONFOUND);
                }
              );
               }
                         
                  
              
            })
          }else{
            this.serviceService
            .GetApplicationNumberByUserInfo(AppNo)
            .subscribe((licenceService) => {
              this.custmerInformation = licenceService[0];
              console.log(
                "🚀 ~ .subscribe ~ custmerInformation:",
                this.custmerInformation
              );
              
            });
          console.log("appppppp", AppNo);
          this.serviceService.getAll(AppNo).subscribe(
            (licenceService) => {
              this.licenceService = licenceService;
              console.log("Licence Service", this.licenceService);
              if (this.licenceService.list.length > 0) {
                this.licenceData = this.licenceService.list[0];
      
                this.serviceService.licenceData = this.licenceData;
                this.SDP_ID = this.licenceData.SDP_ID;
                this.serviceService.currentsdpid = this.SDP_ID;
                this.Service_ID = this.licenceData.Service_ID;
            
                this.serviceService.Service_ID = this.licenceData.Service_ID;
                this.serviceService.serviceDP = this.SDP_ID;
                this.Licence_Service_ID = this.licenceData.Licence_Service_ID;
                this.AppCode = this.licenceData.Licence_Service_ID; //
                this.AppNo = this.licenceData.Application_No; //
                this.serviceService.appnoForRecord = this.licenceData.Application_No;
                this.propertyid=this.licenceData.Property_ID
                this.serviceService.recordno=this.licenceData.recordNo
                this.serviceService.LicenceserviceID = this.Licence_Service_ID;
                 if (this.Service_ID =='2a513f83-221c-4cba-b497-a437417f3c69'){
                  this.serviceService.itcanntupdate=true
                 }
                console.log("licenceData", this.licenceData);
                this.getuserName(this.AppNo);
                if (this.licenceData.Certificate_Code > 0) {
                  this.getPriveysLicence(this.licenceData.Certificate_Code);
                } else {
                  this.getPriveysLicence(this.licenceData.Application_No);
                }
              }
              this.loading = false;
            },
            (error) => {
              console.log(error);
              this.se.emit(this.eventTypes.JSONFOUND);
            }
          );
          }
        })

    }else{
 this.serviceService
      .GetApplicationNumberByUserInfo(AppNo)
      .subscribe((licenceService) => {
        this.custmerInformation = licenceService[0];
        console.log(
          "🚀 ~ .subscribe ~ custmerInformation:",
          this.custmerInformation
        );
        
      });
    console.log("appppppp", AppNo);
    this.serviceService.getAll(AppNo).subscribe(
      (licenceService) => {
        this.licenceService = licenceService;
        console.log("Licence Service", this.licenceService);
        if (this.licenceService.list.length > 0) {
          this.licenceData = this.licenceService.list[0];

          this.serviceService.licenceData = this.licenceData;
          this.SDP_ID = this.licenceData.SDP_ID;
          this.serviceService.currentsdpid = this.SDP_ID;
          this.Service_ID = this.licenceData.Service_ID;
          this.getplotlist(this.licenceData.Parcel_ID);
          this.serviceService.Service_ID = this.licenceData.Service_ID;
          this.serviceService.serviceDP = this.SDP_ID;
          this.Licence_Service_ID = this.licenceData.Licence_Service_ID;
          this.AppCode = this.licenceData.Licence_Service_ID; //
          this.AppNo = this.licenceData.Application_No; //
          this.serviceService.appnoForRecord = this.licenceData.Application_No;
          this.propertyid=this.licenceData.Property_ID
          this.serviceService.currentproprtyID=this.licenceData.Property_ID
          this.serviceService.recordno=this.licenceData.recordNo
          this.serviceService.LicenceserviceID = this.Licence_Service_ID;
           if (this.Service_ID =='2a513f83-221c-4cba-b497-a437417f3c69'){
            this.serviceService.itcanntupdate=true
           }
          console.log("licenceData", this.licenceData);
          this.getuserName(this.AppNo);
          if (this.licenceData.Certificate_Code > 0) {
            //this.getPriveysLicence(this.licenceData.Certificate_Code);
            this.getPriveysLicence(this.licenceData.Application_No);
          } else {
            this.getPriveysLicence(this.licenceData.Application_No);
          }
        }
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.se.emit(this.eventTypes.JSONFOUND);
      }
    );
    }
  }else{
    this.serviceService
    .GetApplicationNumberByUserInfo(AppNo)
    .subscribe((licenceService) => {
      this.custmerInformation = licenceService[0];
      console.log(
        "🚀 ~ .subscribe ~ custmerInformation:",
        this.custmerInformation
      );
      
    });
  console.log("appppppp", AppNo);
  this.serviceService.getAll(AppNo).subscribe(
    (licenceService) => {
      this.licenceService = licenceService;
      console.log("Licence Service", this.licenceService);
      if (this.licenceService.list.length > 0) {
        this.licenceData = this.licenceService.list[0];

        this.serviceService.licenceData = this.licenceData;
        this.SDP_ID = this.licenceData.SDP_ID;
        this.serviceService.currentsdpid = this.SDP_ID;
        this.Service_ID = this.licenceData.Service_ID;
    
        this.serviceService.Service_ID = this.licenceData.Service_ID;
        this.serviceService.serviceDP = this.SDP_ID;
        this.Licence_Service_ID = this.licenceData.Licence_Service_ID;
        this.AppCode = this.licenceData.Licence_Service_ID; //
        this.AppNo = this.licenceData.Application_No; //
        this.serviceService.appnoForRecord = this.licenceData.Application_No;
        this.propertyid=this.licenceData.Property_ID
        this.serviceService.recordno=this.licenceData.recordNo
        this.serviceService.LicenceserviceID = this.Licence_Service_ID;
         if (this.Service_ID =='2a513f83-221c-4cba-b497-a437417f3c69'){
          this.serviceService.itcanntupdate=true
         }
        console.log("licenceData", this.licenceData);
        this.getuserName(this.AppNo);
        if (this.licenceData.Certificate_Code > 0) {
          this.getPriveysLicence(this.licenceData.Certificate_Code);
        } else {
          this.getPriveysLicence(this.licenceData.Application_No);
        }
      }
      this.loading = false;
    },
    (error) => {
      console.log(error);
      this.se.emit(this.eventTypes.JSONFOUND);
    }
  );
  }

})
  }
  getuserName(AppNo) {
    this.serviceService.getuserName(AppNo).subscribe((res: any) => {
      this.useNamelist = res;
      this.serviceService.currentApplicationUsers = this.useNamelist[0];
      console.log("useNamelist", this.useNamelist[0], AppNo);
      if (this.useNamelist.length > 0) {
        this.GetApplicationNumberByUser(
          this.useNamelist[0].userName,
          this.useNamelist[0].organization_code ,
          AppNo
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
  triggerHeaderInitialization() {
    this.isAccountVisible = true;
    this.networkService.notifyHeaderChange();
  }

  showMessage(appNo) {
    this.messageAppNo = appNo;
    let messageInCache = false;
    // this.loadingMessage = true;
    this.isAccountVisiblemessage = true;
    this.messageObj.currentMessage = null;
    this.messageObj.currentMessageIndex = 0;
    this.messageObj.messages = null;

    this.messageCache.some((message) => {
      if (message["appNo"] == appNo) {
        messageInCache = true;
        this.messageObj.messages = message["messages"];
        if (this.messageObj.messages) {
          this.messageObj.currentMessage =
            this.messageObj.messages[0]["remarks"];
        }
        this.loadingMessage = false;
        return true;
      }
      return false;
    });

    if (!messageInCache) {
      this.user = [];
      this.user_name = null;
      this.serviceService.GetNote(appNo).subscribe(
        (result) => {
          console.log("messagesss", result);

          this.messageObj.messages = result;

          if (this.messageObj.messages) {
            console.log(
              "this.messageObj.messages",
              this.messageObj.messages[0].remarks
            );

            this.messageCache.push({
              appNo: this.messageAppNo,
              messages: result,
            });
            this.AppNumber = appNo;
            this.serviceService
              .getViewAspNetUsersWorkInfoDetaill(appNo)
              .subscribe((res) => {
                console.log("this.messageObj.userName+i", res);

                this.user = res;
                this.user_name = "Massage From: " + this.user[0].userName;
                this.messageObj.userName = this.user[0].userName;
                console.log("userrrr", this.messageObj.userName);
                this.messageObj.currentMessage =
                  this.messageObj.messages[0]["remarks"];
              });
          }
          this.loadingMessage = false;
        },
        (error) => {
          this.loadingMessage = false;
          console.error("message error :: ", error);
        }
      );
    }
  }
  canGo(where) {
    if (this.messageObj.messages) {
      if (where == this.direction.NEXT) {
        return (
          this.messageObj.currentMessageIndex <
          this.messageObj.messages.length - 1
        );
      } else if (where == this.direction.PREV) {
        return this.messageObj.currentMessageIndex > 0;
      }
      return false;
    } else {
      return false;
    }
  }

  navigateMessage(direction) {
    if (
      this.messageObj.messages ? this.messageObj.messages.length > 0 : false
    ) {
      if (
        direction == this.direction.NEXT &&
        this.messageObj.currentMessageIndex < this.messageObj.messages.length
      ) {
        this.messageObj.currentMessageIndex += 1;
        this.messageObj.currentMessage =
          this.messageObj.messages[this.messageObj.currentMessageIndex][
            "remarks"
          ];
        console.log(
          "this.messageObj.currentMessageIndex",
          this.messageObj.currentMessageIndex
        );

        this.user_name =
          "Massage From: " +
          this.user[this.messageObj.currentMessageIndex].userName;
        this.messageObj.userName =
          this.user[this.messageObj.currentMessageIndex].userName;
      } else if (
        direction == this.direction.PREV &&
        this.messageObj.currentMessageIndex > 0
      ) {
        this.messageObj.currentMessageIndex -= 1;
        this.messageObj.currentMessage =
          this.messageObj.messages[this.messageObj.currentMessageIndex][
            "remarks"
          ];

        this.user_name =
          "Massage From: " +
          this.user[this.messageObj.currentMessageIndex].userName;
        this.messageObj.userName =
          this.user[this.messageObj.currentMessageIndex].userName;
      }
    }
  }
  previewdar(i){
    const arrayBuffer = new ArrayBuffer(this.binaryData.length);
 const uint8Array = new Uint8Array(arrayBuffer);
 
 for (let i = 0; i < this.binaryData.length; i++) {
     uint8Array[i] = this.binaryData.charCodeAt(i);
 }
 
 // Create Blob
 const blob = new Blob([uint8Array], {
     type: "application/pdf",
 });
 
 // Set Blob URL as iframe source
 this.RequerdDocspre[i].mimeType = "application/pdf";
 this.RequerdDocspre[i].File = this.sanitizer.bypassSecurityTrustResourceUrl(
     URL.createObjectURL(blob)
 );}
 previewnotdar(i){
   let fileData = JSON.parse(this.binaryData);
   let { type, data } = fileData;
 
   this.RequerdDocspre[i].mimeType = type;
   this.RequerdDocspre[i].File = "data:" + type + ";base64, " + data;
   
 
   this.RequerdDocspre[i].File = this.sanitizer.bypassSecurityTrustResourceUrl(
       this.RequerdDocspre[i].File
   );}
   async checkDocumentIsAvailable(){
    return false;
   }
  // async checkDocumentIsAvailable() {
  //   let counter = 0;
  //   let applicationLength = 0;
  //   let isfolderhave = false;
  //   const res: any = await this.serviceService
  //     .getuserName(this.AppNo)
  //     .toPromise();
  //   let useNamelist = res;
  //   if (useNamelist.length > 0) {
  //     const user: any = await this.serviceService
  //       .getCustomerByCols(useNamelist[0].userName)
  //       .toPromise();
  //     let userName = user.procCustomers;
  //     if (userName.length > 0) {
  //       const AppbyUserId: any = await this.serviceService
  //         .getAppbyUserid(userName[0].customer_ID)
  //         .toPromise();
  //       let ApplicationNumberlist = AppbyUserId.procApplicationLoadByUserIds;
  //       this.serviceService
  //       .getLicencebyid(this.serviceService.LicenceserviceID)
  //       .subscribe(async (rec: any) => {
         
  //         let RID;
  //         if (rec.procLicense_Services.length > 0) {
  //           RID = rec.procLicense_Services[0].recordNo;
  //           this.RID=rec.procLicense_Services[0].recordNo;
  //         }
  //           if(this.RID !=null){
  //             this.ApplicationNumberlist =
  //             AppbyUserId.procApplicationLoadByUserIds.filter(x=>x.recordNo == this.RID)
  //           }

          

  //       if (ApplicationNumberlist.length > 0) {
  //         applicationLength = ApplicationNumberlist.length;
  //         for (let index = 0; index < ApplicationNumberlist.length; index++) {
  //           const element = ApplicationNumberlist[index];
  //           const DocIdByAppNo: any = await this.serviceService
  //             .getDocIdByAppNo(element.application_number)
  //             .toPromise();
  //           let procView_RecordAppNoAndDocIdByAppNo =
  //             DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
  //           if (procView_RecordAppNoAndDocIdByAppNo.length > 0) {
  //             let application_code =
  //               procView_RecordAppNoAndDocIdByAppNo[0].application_code;
  //             let application_detail_id =
  //               procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id;
  //             const SavedFiles: any = await this.serviceService
  //               .getAllDocuments(application_code, application_detail_id)
  //               .toPromise();

  //             if (SavedFiles.length === 0) {
  //               isfolderhave = true;
  //               const toast = this.notificationsService.warn(
  //                 `This folder does not have any files. Please upload files for application number: ${element.application_number}`
  //               );
  //             } else {
  //               counter++;
  //             }
  //             console.log(
  //               "🚀 ~ checkDocumentIsAvailable ~ SavedFiles:",
  //               counter,
  //               applicationLength,
  //               SavedFiles
  //             );
  //           }
  //         }
  //       }
  //     })
  //     }
  //   }

  //   return isfolderhave; //counter  === applicationLength;
  // }
  confirm1() {
   
          this.blocked=true;
            const toast = this.notificationsService.success('You have accepted')
           this.Submit('00000000-0000-0000-0000-000000000000')
       
}
confirm2(task_rules_code, rule_Code) {
  this.isconfirmsaveAR=true
this.task_rules_code=task_rules_code,
 this.rule_Code=rule_Code
          this.blocked=true;
            const toast = this.notificationsService.success('You have accepted')
          
      
}
confirm3(){
  this.showdialog(this.task_rules_code, this.rule_Code)
}

  closeModalme(id) {
    // this.modal.getModal(id).close();
    this.isAccountVisiblemessage = false;
  }
}

interface Person {
   customer_ID: any;
   applicant_First_Name_AM: any;
   applicant_First_Name_EN: any;
   applicant_Middle_Name_AM: any;
   applicant_Middle_Name_En: any;
   applicant_Last_Name_AM: any;
   applicant_Last_Name_EN: any;
   applicant_Mother_Name_AM: any;
   applicant_Mother_Name_EN: any;
   tin: any;
   gender: any;
   sdP_ID: any;
   wereda_ID: any;
   email: any;
   mobile_No: any;
   photo: any;
   home_Telephone: any;
   house_No: any;
   address: any;
   kebele: any;
   nationality: any;
   residence_Country: any;
   state_Region: any;
   city: any;
   passport_ID: any;
   is_Active: any;
   is_Represented: any;
   parent_Customer_ID: any;
   is_them: any;
   customer_Type_ID: any;
   is_Representative: any;
   customer_Status: any;
   created_By: any;
   updated_By: any;
   deleted_By: any;
   is_Deleted: any;
   created_Date: any;
   updated_Date: any;
   deleted_Date: any;
}
