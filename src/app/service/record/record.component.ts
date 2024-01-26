import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import {
  FormControl,
  FormGroup,
  FormsModule,
  FormBuilder,
} from "@angular/forms";
import { JsonPipe, formatDate } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { NotificationsService } from "angular2-notifications";
import { ServiceService } from "../service.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { HttpEvent, HttpEventType, HttpParams } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { BehaviorSubject, empty } from "rxjs";
@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.css"],
})
export class RecordComponent implements OnChanges {
  @Input() useNamelist;
  bsConfig: Partial<BsDatepickerConfig>;
  model: NgbDateStruct;
  modalRef: BsModalRef;
  activeTab = "tab1";
  addnew: boolean;
  search: boolean;
  public Task: any;
  Service: any;
  Org: any;
  hideNeww: boolean;
  appno: any;
  Woreda: any;
  selectedService: any;
  date: any;
  SDP: any;
  Plot: any;
  Deed: any;
  AppNo: any;
  Licence_ID;
  AppCodeFromFile: any;
  DocIdFromFile: any;
  DocID: any;
  Appcode: any;
  CustomerLookUP: any;
  FullName_AM: any;
  issave: any;
  shouldGetTasks: any;
  btnDisable: boolean;
  displayTab: boolean;
  Application_Number: any;
  response: any;
  licenceService: any;
  licenceData: any;
  isEnvironmentalConsideration: boolean;
  displayGIS = true;
  public users: any;
  userName: any;
  taskList: any;
  requiredDoc: any;
  public mimeExtension = {
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
  language = "english";
  dislpayFile = true;
  loadingPreDoc: boolean;
  public RequerdDocspre: any;
  SavedFilespre: any;
  showProgressBar: boolean;
  tskTyp: string;
  mimeType: any;
  fileupload: string;
  uploadedDocumnet: boolean;
  uploadcontract: boolean;
  documentupload: any;
  selectedTask: any;
  SavedFiles: any;
  recordDocumnet: RecordDocumnet;
  disable: boolean;
  documentAddress: boolean;
  documentArc: any;
  RequiredDocs: any;
  public ApplicationNumberlist: any;
  selectedAppno: any;
  DocumentArc: any;
  PreAppData;
  taskdisable = true;
  openArchive: boolean = false;
  Attachments: any;
  isDisabled: boolean;
  procView_RecordAppNoAndDocIdByAppNo: any;
  disableBtn = true;
  disableForm = true;
  getData = true;
  disableDoc: boolean;
  addRecord: AddRecord;
  PriveLicence: any;
  PreAppDataa: any;
  customer: any;
  PreAppDataaa: any;
  pictoShow: any;
  Customer: any;
  PreviewshowdialogeArray: boolean[] = [];
  hide: any;
  hid: boolean;
  taskEnable: boolean;
  disableDate: boolean;
  hideNew: boolean;
  DocumentArc1: any;
  record_date: any;
  selectedDate: string;
  public archive = "Document Location";
  globalDeed: any;
  switchTab(tab: string) {
    this.activeTab = tab;
  }
  constructor(
    private notificationsService: NotificationsService,
    private service: ServiceService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {
    this.recordDocumnet = new RecordDocumnet();
    this.addRecord = new AddRecord();
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log(
  //     "this.serviceService.currentApplicationUsers",
  //     this.useNamelist
  //   );
  // }
  record = this.formBuilder.group({
    task: new FormControl(),
    appno: new FormControl(),
    FullName_AM: new FormControl(),
    Deed: new FormControl(),
    SDP: new FormControl(),
    date: new FormControl(new Date().toISOString().substr(0, 10)),
    Org: new FormControl(),
    Woreda: new FormControl(),
    selectedService: new FormControl(),
  });
  ngOnChanges() {
    console.log("this.AppCodeFromFile1", this.AppCodeFromFile);

    if (
      this.AppCodeFromFile != null ||
      (this.AppCodeFromFile != undefined && this.DocIdFromFile != null) ||
      this.DocIdFromFile != undefined
    ) {
      // this.getAllDocumentpre(this.AppCodeFromFile,this.DocIdFromFile)
      console.log("this.AppCodeFromFile", this.AppCodeFromFile);
    }
    console.log("language", environment.Lang_code);
    if (
      environment.Lang_code === "am-et" ||
      environment.Lang_code === "am-ET"
    ) {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    if (environment.subcity == "arada") {
      this.record.patchValue({
        SDP: "6921d772-3a1c-4641-95a0-0ab320bac3e2",
      });
    } else if (environment.subcity == "bole") {
      this.record.patchValue({
        SDP: "89eb1aec-c875-4a08-aaf6-2c36c0864979",
      });
    } else if (environment.subcity == "nifasS") {
      this.record.patchValue({
        SDP: "f8ea62db-05bc-4f1a-ab30-4e926d43e3fb",
      });
    } else if (environment.subcity == "gullele") {
      this.record.patchValue({
        SDP: "6a8c042f-a3e1-4375-9769-54d94c2312c6",
      });
    } else if (environment.subcity == "addisK") {
      this.record.patchValue({
        SDP: "7101d44d-97d5-41aa-957d-82f36d928c07",
      });
    } else if (environment.subcity == "lideta") {
      this.record.patchValue({
        SDP: "e4d8219e-51f9-40cb-9d53-883c6ca9aaa3",
      });
    } else if (environment.subcity == "lemiK") {
      this.record.patchValue({
        SDP: "f02e9467-1b7d-4350-bee7-9844d4f56da0",
      });
    } else if (environment.subcity == "yeka") {
      this.record.patchValue({
        SDP: "8222f028-5fe3-4047-9a50-b52bfa64c851",
      });
    } else if (environment.subcity == "akakyK") {
      this.record.patchValue({
        SDP: "08f9c927-6366-467a-ba99-c837c5add427",
      });
    } else if (environment.subcity == "kirkos") {
      this.record.patchValue({
        SDP: "aaa5094c-8899-4708-9f7b-d8ff634a3540",
      });
    } else if (environment.subcity == "kolfeK") {
      this.record.patchValue({
        SDP: "930d1c20-9e0e-4a50-9eb2-e542fafbad68",
      });
    } else if (environment.subcity == "central") {
      this.record.patchValue({
        SDP: "275619f2-69c2-4fb7-a053-938f0b62b088",
      });
    }
    //  else  if(environment.subcity=='Arada'){
    //   this.record.patchValue({
    //     SDP:'6921d772-3a1c-4641-95a0-0ab320bac3e2'
    //   })
    //  }else {
    //   this.record.patchValue({
    //     SDP:'6921d772-3a1c-4641-95a0-0ab320bac3e2'
    //   })
    //  }

    console.log(
      "this.serviceService.currentApplicationUsers",
      this.useNamelist
    );
    if (this.useNamelist) {
      this.getCustomerLookUP();
      this.gettask();
      //  this.Tasks('')
      this.getservice();
      this.getorg();
      this.SEARCH(this.useNamelist[0].userName);
    }

    this.addnew = true;
    this.displayTab = true;

    const dateString = new Date();
    const date = new Date(dateString);

    // Get year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Create the formatted date string in the "year-month-day" format
    const formattedDate = `${day}${month}${year}`;

    console.log(formattedDate); // Output: 2023-10-02
    //  this.record.patchValue({
    //   // SDP: generateGuid(),
    //   // appno:"BL-"+formattedDate+"-"+randomNumber(1,99999999999999999)
    //  })
  }
  addNew() {
    this.getData = true;
    this.displayTab = true;
    this.disableDoc = false;
    this.recordDocumnet = {
      Certificate_Base: "",
      document_Number: "",
      title_Deed_No: "",
      regstration_Date: "",
      application_No: "",
      room: "",
      site: "",
      block_Floor: "",
      shelf_NO: "",
      shelf_Raw: "",
      shelf_Column: "",
      created_By: "",
      updated_By: "",
      deleted_By: "",
      is_Deleted: "",
      created_Date: "",
      updated_Date: "",
      deleted_Date: "",
      is_all_hardcopy_uploaded: "",
    };
    console.log("ADD NEW button clicked!");
    this.addnew = false;
    this.isDisabled = true;
    this.btnDisable = true;
    this.taskdisable = false;
    this.openArchive = true;

    this.record.patchValue({
      appno: "",
      selectedService: "",
      // date: "",
      Woreda: "",
      // Woreda:this.licenceData.Wereda_ID,
      Deed: "",
    });
  }

  clear() {
    this.getData = true;
    this.displayTab = true;
    this.disableDoc = false;
    this.recordDocumnet = {
      Certificate_Base: "",
      document_Number: "",
      title_Deed_No: "",
      regstration_Date: "",
      application_No: "",
      room: "",
      site: "",
      block_Floor: "",
      shelf_NO: "",
      shelf_Raw: "",
      shelf_Column: "",
      created_By: "",
      updated_By: "",
      deleted_By: "",
      is_Deleted: "",
      created_Date: "",
      updated_Date: "",
      deleted_Date: "",
      is_all_hardcopy_uploaded: "",
    };
    console.log("ADD NEW button clicked!");
    // this.addnew=false
    this.isDisabled = true;
    // this.btnDisable=true
    // this.taskdisable = true;
    this.openArchive = true;
    this.record.patchValue({
      appno: "",
      selectedService: "",
      date: "",
      Woreda: "",
      // FullName_AM: "",
      // Woreda:this.licenceData.Wereda_ID,
      Deed: "",
    });
  }
  SEARCH(data) {
    console.log("search", data);
    if (data != "") {
      console.log("null values");
      //this.isEnvironmentalConsideration = true;
      this.service.getCustomerByCols(data).subscribe((user: any) => {
        this.userName = user.procCustomers;
        console.log("this.userName", this.userName);

        if (this.userName.length > 0) {
          this.service
            .getByCustomerId(this.userName[0].customer_ID)
            .subscribe((customer: any) => {
              console.log("customerrrr", customer.length);
              this.Customer = customer;
              console.log("customerrrruser", this.Customer[0].userName);
              this.onRowSelect(this.Customer[0]);
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
    }
    this.getData = true;
    this.displayTab = true;
    this.disableDoc = false;
    this.recordDocumnet = {
      Certificate_Base: "",
      document_Number: "",
      title_Deed_No: "",
      regstration_Date: "",
      application_No: "",
      room: "",
      site: "",
      block_Floor: "",
      shelf_NO: "",
      shelf_Raw: "",
      shelf_Column: "",
      created_By: "",
      updated_By: "",
      deleted_By: "",
      is_Deleted: "",
      created_Date: "",
      updated_Date: "",
      deleted_Date: "",
      is_all_hardcopy_uploaded: "",
    };
    console.log("ADD NEW button clicked!");
    // this.addnew=false
    this.isDisabled = true;
    // this.btnDisable=true
    // this.taskdisable = true;

    this.record.patchValue({
      appno: "",
      selectedService: "",
      date: "",
      Woreda: "",
      FullName_AM: "",
      // Woreda:this.licenceData.Wereda_ID,
      Deed: "",
    });
  }
  onRowSelect(event) {
    console.log("customer_ID", event);
    this.addnew = false;
    this.service;
    // this.isEnvironmentalConsideration=false

    this.service
      .getByCustomerId(event.customer_ID)
      .subscribe((customer: any) => {
        this.customer = customer;
        console.log("this.customer", this.customer);
        this.service
          .getAppbyUserid(event.customer_ID)
          .subscribe((AppbyUserId: any) => {
            console.log("AppbyUserId", AppbyUserId);
            this.ApplicationNumberlist =
              AppbyUserId.procApplicationLoadByUserIds.filter(
                (x) =>
                  x.application_number == this.useNamelist[0].application_number
              );
            this.selectedAppno = this.ApplicationNumberlist[0];
            this.handleSelectionChange();
          });
        this.service
          .getDeedByCustId(event.customer_ID)
          .subscribe((CustId: any) => {
            console.log("CustId", CustId.length);
            if (CustId.length > 0) {
              console.log("there is data");
              // this.GetApplicationNumberByUser(this.customer[0].userName);
            } else {
              console.log("there is no data");
            }
          });

        this.record.patchValue({
          // SDP: generateGuid(),
          // appno:"BL-"+formattedDate+"-"+randomNumber(1,99999999999999999)
          // FullName_AM:event.data.applicant_First_Name_EN
          FullName_AM: this.customer[0].userName,
        });
      });
  }
  getservice() {
    this.service.getservice().subscribe((service) => {
      this.Service = service;
      this.Service = this.Service;
      console.log("service", this.Service);
    });
  }
  handleSelectionChange(): void {
    this.openArchive = true;
    this.addnew = false;
    this.procView_RecordAppNoAndDocIdByAppNo = [""];
    this.record.patchValue({
      task: "",
    });
    this.disableDate = true;
    this.btnDisable = false;
    this.RequerdDocspre = [""];
    console.log("this.selectedAppno111111", this.selectedAppno);
    this.service
      .getTodandAppNo(this.selectedAppno.application_number)
      .subscribe((PreAppData) => {
        if (PreAppData) {
          this.hideNew = true;
        } else {
          this.hideNew = false;
        }
        this.PreAppData = PreAppData;
        if (this.PreAppData.Table.length === 0) {
          this.taskEnable = true;
        } else {
          this.taskEnable = false;
        }
        console.log("this.PreAppDataaa", this.PreAppData.Table.length);
      });

    this.service
      .getDocIdByAppNo(this.selectedAppno.application_number)
      .subscribe((DocIdByAppNo: any) => {
        this.procView_RecordAppNoAndDocIdByAppNo =
          DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
        console.log("DocIdByAppNo90", this.procView_RecordAppNoAndDocIdByAppNo);
        // ? this.AppNo=this.procView_RecordAppNoAndDocIdByAppNo[0].application_code;
        // this.DocID=this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id;
      });

    this.service
      .getLicenceService(this.selectedAppno.application_number)
      .subscribe((licenceService) => {
        this.licenceService = licenceService;
        this.licenceData = this.licenceService.list[0];
        this.getPriveysLicence(this.licenceData.Application_No);
        console.log("Licence Service", this.licenceService);
        this.service.getDocumentArc().subscribe((DocumentArc: any) => {
          if (DocumentArc) {
            this.DocumentArc = DocumentArc.procDocument_Archives;
            console.log("this.DocumentArc", DocumentArc);

            this.disableForm = true;
            // this.DocumentArc1 = this.DocumentArc.filter(
            //   (value) =>
            //   value.application_No == this.selectedAppno.application_number
            //   );
            //   console.log(
            //     "this.selectedAppno.application_number",
            //     this.DocumentArc1, this.DocumentArc
            //   );

            if (this.DocumentArc.length < 0) {
              this.getData = false;
              this.record.patchValue({
                appno: this.licenceData.Application_No,
                selectedService: this.licenceData.Service_ID,
                date: formatDate(
                  this.licenceData.Created_Date,
                  "yyyy-MM-dd",
                  "en"
                ),
                SDP: this.licenceData.SDP_ID,
                Woreda: this.userName[0].wereda_ID,
                // Woreda:this.licenceData.Wereda_ID,
                Deed: this.DocumentArc[0].title_Deed_No,
              });
              this.getDocmentArcive(this.DocumentArc[0].title_Deed_No);
            } else {
              this.service
                .getDeedByApp(this.selectedAppno.application_number)
                .subscribe((DeedByApp: any) => {
                  console.log("DeedByApp", DeedByApp.length);
                  if (DeedByApp.length > 0) {
                    this.getData = false;
                    this.record.patchValue({
                      appno: this.licenceData.Application_No,
                      selectedService: this.licenceData.Service_ID,
                      date: formatDate(
                        this.licenceData.Created_Date,
                        "yyyy-MM-dd",
                        "en"
                      ),
                      SDP: this.licenceData.SDP_ID,
                      Woreda: this.userName[0].wereda_ID,
                      // Woreda:this.licenceData.Wereda_ID,
                      Deed: DeedByApp[0].title_Deed_No,
                    });
                    this.getDocmentArcive(DeedByApp[0].title_Deed_No);
                  } else {
                    this.getData = false;
                    this.record.patchValue({
                      appno: this.licenceData.Application_No,
                      selectedService: this.licenceData.Service_ID,
                      date: formatDate(
                        this.licenceData.Created_Date,
                        "yyyy-MM-dd",
                        "en"
                      ),
                      SDP: this.licenceData.SDP_ID,
                      Woreda: this.userName[0].wereda_ID,
                      // Woreda:this.licenceData.Wereda_ID,
                      Deed: "",
                    });
                  }
                });
            }

            this.service
              .getTasks(this.licenceData.Service_ID)
              .subscribe((ress: any) => {
                if (ress) {
                  this.taskList = ress;
                  this.taskdisable = true;

                  console.log("taskresponsess", this.taskList);
                }
              });
          } else {
            this.openArchive = true;
          }
        });

        // console.log("DocIDD", this.DocIDlist, this.licenceData);
        // this.getRequiredDocs(
        //   this.DocIDlist.task_code,
        //   this.DocIDlist.application_detail_id
        // );
      });
    // You can access the selected item here and perform further actions
  }
  getPriveysLicence(value) {
    // this.AppN = null;
    this.service.getPriveys(value).subscribe((PriveLicence) => {
      this.PriveLicence = PriveLicence;
      console.log("this.PriveLicence", this.PriveLicence);

      this.PriveLicence = Object.assign([], this.PriveLicence.list);

      // this.AppNoList = [];
      // for (let i = 0; i < this.PriveLicence.length; i++) {
      //   this.AppNoList[i] = {};
      //   this.AppNoList[i].Application_No =
      //     this.PriveLicence[i].Application_No;
      // }
      // if (this.AppNoList.length > 0) {
      //   this.pendclose(this.AppNoList[0]["Application_No"]);
      // } else {
      //   this.se.emit(this.eventTypes.JSONFOUND);
      // }

      // this.PriveAppNoList = Object.assign([], this.AppNo);
      // // console.log('this.AppNoList', this.AppNoList);
      // // console.log('PriveLicence', PriveLicence);
      // this.ifAppNo = true;
    });
  }
  GetApplicationNumberByUser(username) {
    this.service
      .GetApplicationNumberByUsers(username)
      .subscribe((ApplicationNumber: any) => {
        if (ApplicationNumber != null) {
          console.log("finalystatuslist", ApplicationNumber);
          this.ApplicationNumberlist = ApplicationNumber;
          this.ApplicationNumberlist = this.ApplicationNumberlist.filter(
            (value) => value.organization_code == this.record.get("SDP").value
          );

          // this.AppNoList;
        } else {
          this.RequerdDocspre = [""];
          this.taskList = [""];
          this.ApplicationNumberlist = [""];
        }
      });
  }
  getorg() {
    this.service.getorg().subscribe((org) => {
      this.Org = org;
      this.Org = this.Org;

      console.log("this.Org", this.Org);
      console.log("this.Org", org);
    });
  }
  // add(){
  //   console.log('recprds',this.record.get('task').value);

  // }

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
      console.log("this.DocID", this.DocID);
      this.service
        .saveFile(
          base64FileData,
          File.type,
          this.Application_Number,
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
              // console.log(`Uploaded! ${this.progress}%`);

              fild.clear();
              const toast = this.notificationsService.success(
                "Success",
                "Uploaded successfully" + RequiredDoc.description_en
              );
              // this.updated.emit({ docs: this.RequerdDocs });
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
    console.log("this.RequerdDocs", this.RequerdDocspre);
  }
  previewdocumnet(file) {
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
  upload(event, RequiredDoc, fild) {
    this.Uploader(event.files[0], RequiredDoc, fild);
    console.log("event", event);
    console.log("RequiredDoc", RequiredDoc);
    console.log("this.RequerdDocs", this.RequerdDocspre);
    for (let i = 0; i < this.RequerdDocspre.length; i++) {
      if (
        RequiredDoc.requirement_code === this.RequerdDocspre[i].requirement_code
      ) {
        this.RequerdDocspre[i].uploded = 1;
      }
    }
    console.log("files", event.files);
  }
  passdata(code: any) {
    console.log("this.selectedTask1", code);
    this.getRequiredDocspre(code);
    console.log("this.PreAppData", this.PreAppData.Table);
  }
  getRequiredDocspre(tskID) {
    this.service.getRequerdDocs(tskID).subscribe((res) => {
      this.RequerdDocspre = res;
      this.displayTab = false;
      console.log("taskresponsessssdd", res, tskID, this.RequerdDocspre.length);
      for (let i = 0; i < this.RequerdDocspre.length; i++) {
        if (this.RequerdDocspre[i].description_en == "Dummy") {
          this.RequerdDocspre.splice(i, 1);
          break;
        }
      }

      console.log("checklength", this.PreAppData.Table.length);

      this.PreAppDataa = this.PreAppData.Table;
      this.PreAppDataaa = this.PreAppData.Table;
      console.log("this.PreAppDataaaatttt", this.PreAppDataaa);
      this.selectedTask = this.PreAppDataa.filter(
        (value) => value.tasks_task_code == tskID
      );
      console.log("this.selectedTaskhh", this.selectedTask);
      if (this.PreAppDataa.length > 1) {
        console.log("this.selectedAppno1", this.licenceData.Service_ID);
        console.log("this.PreAppDataaaa1", this.PreAppDataaa[0]);

        this.AppNo = this.selectedAppno.application_number;
        this.DocID = this.selectedTask[0].docId;
        console.log(
          "gfghuiuyhgfdghjhg",
          this.selectedAppno,
          this.AppNo,
          this.DocID
        );

        // this.getAllDocument(
        //   this.licenceData.Service_ID,
        //   this.selectedTask[0].docId
        // );
        this.getAll(
          this.selectedAppno.application_code,
          this.selectedTask[0].docId
        );
      } else if (this.PreAppDataaa.length == 1) {
        console.log("this.selectedAppno12", this.licenceData.Service_ID);
        console.log("this.PreAppDataaaa12", this.PreAppDataaa[0]);
        this.AppNo = this.selectedAppno.application_code;
        this.DocID = this.PreAppDataaa[0].docId;
        // this.getAllDocument(
        //   this.licenceData.Service_ID,
        //   this.PreAppDataaa[0].docId
        // );
        this.getAll(
          this.selectedAppno.application_code,
          this.PreAppDataaa[0].docId
        );
      } else if (this.PreAppDataaa.length == 0) {
        this.AppNo =
          this.procView_RecordAppNoAndDocIdByAppNo[0].application_code;
        this.DocID =
          this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id;

        // this.getAllDocument(
        //   this.licenceData.Service_ID,
        //   this.PreAppDataaa[0].docId
        // );
        this.getAll(
          this.procView_RecordAppNoAndDocIdByAppNo[0].application_code,
          this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id
        );
      }
      // else
      // if(this.procView_RecordAppNoAndDocIdByAppNo.length>0){
      //   this.AppNo=this.procView_RecordAppNoAndDocIdByAppNo[0].application_code;
      //   this.DocID=this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id;
      //       this.getAllDocument(this.licenceData.Service_ID, this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id)
      //       this.getAll(this.procView_RecordAppNoAndDocIdByAppNo[0].application_code, this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id);

      // }else{

      // }
    });
  }

  // previewDoc(File) {
  //   console.log('fileeee',File);

  //   // this.dislpayFile=false
  //   let base64file;
  //   const reader = new FileReader();
  //   reader.readAsDataURL(File);
  //   reader.addEventListener("loadend", (e) => {
  //     base64file = reader.result;
  //     this.pictoShow = base64file;
  //     this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
  //       this.pictoShow
  //     );

  //   });
  //   let fileData = JSON.parse(atob(this.SavedFilespre[File].document));

  //   let { type, data } = fileData;

  //   this.RequerdDocspre[i].mimeType = type;
  //   this.RequerdDocspre[i].File =
  //     "data:" + type + ";base64, " + data;
  //   console.log("this.RequerdDocspre[i].File", SavedFiles[j]);

  //   this.RequerdDocspre[i].File =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(
  //       this.RequerdDocspre[i].File
  //     );
  // }

  previewDoc(file) {
    console.log("filleeee", file);
    try {
      // let fileData = JSON.parse(atob(SavedFiles[j].document));

      let fileData = JSON.parse(atob(this.SavedFilespre[file].document));
      let { type, data } = fileData;
      this.mimeType = type;
      this.fileupload = "data:" + type + ";base64, " + data;
      // this.uploadedDocumnet=true
      // this.uploadcontract=false

      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.fileupload
      );
      console.log(this.pictoShow);
    } catch (e) {
      console.error(e);
    }
  }

  getAllDocument(appNo, docid) {
    console.log("dataaaaaaa");

    this.service.getAllDocument(appNo, docid).subscribe((res: any) => {
      this.SavedFiles = res;
      console.log("responsssss", res);
    });
  }
  async add() {
    if (this.language == "amharic") {
      this.recordDocumnet.regstration_Date = await this.getEthiopianToGregorian(
        this.recordDocumnet.regstration_Date
      );
    }
    this.service.CreateDocmentArcive(this.recordDocumnet).subscribe(
      async (message) => {
        console.log("message", message);
        // this.serviceService.disablefins = false;
        // if (!this.Saved) {
        //   this.completed.emit();
        //   this.Saved = true;
        // }
        // this.documentAddress=false
        const toast = this.notificationsService.success(
          "Sucess",
          "create archive successfully"
        );
        this.documentAddress = false;
        // this.cerlettrform = false;
      },
      async (error) => {
        console.log("logggggggggg", error.status, error.error);
        if (error.status == "400") {
          // if (this.language == "amharic") {
          //   this.recordDocumnet.Regstration_Date =
          //     await this.getgregorianToEthiopianDate(
          //       this.recordDocumnet.Regstration_Date
          //     );
          // }
          const toast = this.notificationsService.error(error.error);
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
          // if (this.language == "amharic") {
          //   this.recordDocumnet.Regstration_Date =
          //     await this.getgregorianToEthiopianDate(
          //       this.recordDocumnet.Regstration_Date
          //     );
          // }
        }
      }
    );
    console.log("saveing....");
  }
  getDocmentArcive(Title_Deed_No) {
    this.globalDeed = Title_Deed_No;
    console.log("deddddddddd", Title_Deed_No);

    let a;
    this.service.getDocmentArcive(Title_Deed_No).subscribe(
      async (documentArc: any) => {
        this.documentArc = documentArc.procDocument_Archives;
        this.documentArc = this.documentArc.filter(
          (value) => value.title_Deed_No == Title_Deed_No
        );
        console.log("documentArc777", this.documentArc);
        if (this.documentArc[0]) {
          if (this.DocumentArc != null || this.DocumentArc != undefined) {
            this.openArchive = true;
            this.archive = "Document Location";
          }
          this.recordDocumnet = this.documentArc[0];
          this.disableBtn = false;
          this.disableDoc = true;
        } else {
          this.openArchive = true;
          // this.archive='Create Document Location'
          this.recordDocumnet = {
            Certificate_Base: "",
            document_Number: "",
            title_Deed_No: Title_Deed_No,
            regstration_Date: "",
            application_No: "",
            room: "",
            site: "",
            block_Floor: "",
            shelf_NO: "",
            shelf_Raw: "",
            shelf_Column: "",
            created_By: "",
            updated_By: "",
            deleted_By: "",
            is_Deleted: "",
            created_Date: "",
            updated_Date: "",
            deleted_Date: "",
            is_all_hardcopy_uploaded: "",
          };
        }
        // if (this.language == "amharic") {
        //   a.list[0].Regstration_Date = await this.getgregorianToEthiopianDate(
        //     a.list[0].Regstration_Date
        //   );
        // }
        // this.cerlettrformList = Object.assign([], a.list);
        // if (this.cerlettrformList.length > 0) {
        //   this.disable_new = true;
        // } else {
        //   this.disable_new = false;
        // }
        // console.log("recordDocumnet", recordDocumnet);
        // console.log("this.recordDocumnet", this.recordDocumnet);
        /* if (a.list.length) {
         this.isnew = false;
       } else {
         this.isnew = true;
         this.recordDocumnet.title_Deed_No = this.certCode;
       }*/
      },
      (error) => {
        console.log("error");
      }
    );
  }
  Archive() {
    this.recordDocumnet.title_Deed_No = this.record.get("Deed").value;
  }
  async save() {
    if (this.language == "amharic") {
      this.record_date = await this.getEthiopianToGregorian(this.selectedDate);
      this.record.patchValue({
        date: this.record_date,
      });

      // console.log("saveing.....", this.Base.Registration_Date);
    }
    this.btnDisable = false;
    // this.displayTab = false;
    this.taskdisable = true;
    this.documentAddress = true;
    this.recordDocumnet.title_Deed_No = this.record.get("Deed").value;
    this.getDocmentArcive(this.record.get("Deed").value);
    this.GetApplicationNumberByUser(this.record.get("FullName_AM").value);
    // this.Application_Number=this.record.get('appno').value;
    // console.log('loggggg',this.Application_Number);
    this.record.patchValue({
      appno: "00000000-0000-0000-0000-000000000000",
    });
    this.service.saveRecord(this.record.value).subscribe(
      (res: any) => {
        this.service
          .getTasks(this.record.get("selectedService").value)
          .subscribe((ress: any) => {
            this.taskList = ress;
            console.log("taskresponsess", this.taskList);
          });

        this.recordDocumnet.application_No = this.response = res.split("/");
        console.log("this.response", this.response[0]);
        this.AppNo = this.response[0];
        this.DocID = this.response[1];
        this.getAll(this.AppNo, this.DocID);
        this.getAllDocumentpre(this.AppNo, this.DocID);
        const toast = this.notificationsService.success("Success", "Saved");
      },
      (error) => {
        console.log("save-form-error", error);
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );

    this.addnew = true;
    // this.displayGIS=false
  }
  UpdateAttachments(Attachments) {
    console.log("Attachments", Attachments.docs);
    this.Attachments = Attachments.docs;
    let a = true;
    for (let i = 0; i < this.Attachments.length; i++) {
      console.log(
        "this.Attachments[i].required && !this.Attachments[i].File",
        this.Attachments[i].required && !this.Attachments[i].File
      );
      if (this.Attachments[i].required && !this.Attachments[i].File) {
        a = false;
        break;
      }
    }

    // this.nxtfromfile = a;
    // this.Upload(Attachments.File);
  }
  async update() {
    if (this.language == "amharic") {
      this.recordDocumnet.regstration_Date = await this.getEthiopianToGregorian(
        this.recordDocumnet.regstration_Date
      );
    }
    this.documentAddress = false;
    this.service.UpdateDocmentArcive(this.recordDocumnet).subscribe(
      async (message) => {
        // console.log("message", message);
        // this.serviceService.disablefins = false;
        // if (!this.Saved) {
        //   this.completed.emit();
        //   this.Saved = true;
        // }
        // if (this.language == "amharic") {
        //   this.recordDocumnet.Regstration_Date =
        //     await this.getgregorianToEthiopianDate(
        //       this.recordDocumnet.Regstration_Date
        //     );
        // }
        const toast = this.notificationsService.success("Sucess", message);
      },
      (error) => {
        console.log("gogogog", error);
        if (error.status == "400") {
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Errors[0].message
          );
          // if (this.language == "amharic") {
          //   this.recordDocumnet.Regstration_Date =
          //     await this.getgregorianToEthiopianDate(
          //       this.recordDocumnet.Regstration_Date
          //     );
          // }
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
          // if (this.language == "amharic") {
          //   this.recordDocumnet.Regstration_Date =
          //     await this.getgregorianToEthiopianDate(
          //       this.recordDocumnet.Regstration_Date
          //     );
          // }
        }
      }
    );
  }
  async getEthiopianToGregorian(date) {
    console.log("checkingdate", date);
    if (date) {
      var datenow = await this.service
        .getEthiopianToGregorian(date)
        .toPromise();
      return datenow.nowTime;
    }
  }
  async getgregorianToEthiopianDate(date) {
    if (date != "0001-01-01T00:00:00") {
      var datenow = await this.service
        .getgregorianToEthiopianDate(date)
        .toPromise();
      console.log(datenow);
      return datenow.nowTime;
    }
  }
  selectedDateTime1(dates: any, selecter) {
    if (selecter == 1) {
      this.selectedDate =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
  }
  selectedDateTime(dates: any, selecter) {
    if (selecter == 1) {
      this.recordDocumnet.regstration_Date =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
  }
  getAllDocumentpre(Licence_Service_ID, DocID) {
    let updatedArray: any[] = [];
    this.loadingPreDoc = true;
    console.log("this.RequerdDocspre", this.RequerdDocspre);
    this.service.getAllDocument(Licence_Service_ID, DocID).subscribe(
      (SavedFiles) => {
        if (SavedFiles.length > 0) {
          console.log("SavedFiiiilessssffff", SavedFiles, SavedFiles.length);

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

          this.hide = updatedArray;

          this;
          if (this.RequerdDocspre != null || this.RequerdDocspre != undefined)
            this.showProgressBar = false;
          for (let i = 0; i < this.RequerdDocspre.length; i++) {
            console.log("pdf fileeee", this.RequerdDocspre[i]);

            for (let j = 0; j < SavedFiles.length; j++) {
              if (
                this.RequerdDocspre[i].requirement_code ==
                SavedFiles[j].requirement_code
              ) {
                console.log("updatedArray", updatedArray[j]);
                try {
                  let fileData = JSON.parse(atob(SavedFiles[j].document));

                  let { type, data } = fileData;

                  this.RequerdDocspre[i].mimeType = type;
                  this.RequerdDocspre[i].File =
                    "data:" + type + ";base64, " + data;
                  console.log(
                    "this.RequerdDocspre[i].File",
                    SavedFiles[j].document
                  );
                  this.RequerdDocspre[i].hidden = updatedArray[j].is_hidde;
                  console.log(
                    "updatedArrayyyyy",
                    this.RequerdDocspre[i].hidden
                  );

                  this.RequerdDocspre[i].File =
                    this.sanitizer.bypassSecurityTrustResourceUrl(
                      this.RequerdDocspre[i].File
                    );

                  this.RequerdDocspre[i].document_code =
                    SavedFiles[j].document_code;
                  this.RequiredDocs = this.RequerdDocspre;
                } catch (e) {
                  console.error(e);
                }
              }
            }
          }

          console.log("SavedFileeeees", updatedArray);
          console.log("RequerdDocspre", this.RequerdDocspre);
          this.RequerdDocspre.forEach((item, index) => {
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
  public getAll(AppNo, DocID) {
    console.log("appppppp", DocID, AppNo);

    this.service.getAll(AppNo).subscribe(
      (licenceService) => {
        this.licenceService = licenceService;
        console.log("Licence Servicesss", this.licenceService);
        if (this.licenceService.list.length > 0) {
          this.licenceData = this.licenceService.list[0];
          // this.SDP_ID = this.licenceData.SDP_ID;
          // this.Service_ID = this.licenceData.Service_ID;
          // this.serviceService.Service_ID = this.licenceData.Service_ID;
          // this.Licence_Service_ID = this.licenceData.Licence_Service_ID;
          // this.AppCode = this.licenceData.Licence_Service_ID; //
          this.record.patchValue({
            // SDP: generateGuid(),
            appno: this.licenceData.Application_No,
          });
          this.Application_Number = this.licenceData.Application_No;
          this.recordDocumnet.application_No = this.licenceData.Application_No;
          //
          console.log("licenceData", this.licenceData.Licence_Service_ID);
          this.getAllDocumentpre(this.licenceData.Licence_Service_ID, DocID);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  gettask() {
    if (this.shouldGetTasks) {
      const selectedServiceCode = this.selectedService;
      this.service.gettask(selectedServiceCode).subscribe((tasks) => {
        this.Task = tasks;
        this.Task = this.Task;
        console.log("weeee", this.Task);
        console.log("weeee", tasks);
      });
      this.shouldGetTasks = false;
    }
  }
  getCustomerLookUP() {
    this.service.getcustomerby().subscribe(
      (CustomerLookUP: any) => {
        this.CustomerLookUP = CustomerLookUP.procCustomers;
        for (let i = 0; i < this.CustomerLookUP.length; i++) {
          this.CustomerLookUP[i].FullName_AM =
            this.CustomerLookUP[i].applicant_First_Name_AM +
            " " +
            this.CustomerLookUP[i].applicant_Middle_Name_AM +
            " " +
            this.CustomerLookUP[i].applicant_Last_Name_AM;
          this.CustomerLookUP[i].FullName_EN =
            this.CustomerLookUP[i].applicant_First_Name_EN +
            " " +
            this.CustomerLookUP[i].applicant_Middle_Name_En +
            " " +
            this.CustomerLookUP[i].applicant_Last_Name_EN;
          const customerID = this.CustomerLookUP[i].customer_ID;
        }
        console.log("CustomerLookUP", this.CustomerLookUP[0].customer_ID);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }
  closeModal(customer) {
    console.log("customer", customer);

    // this.record = customer.customer_ID;
    console.log("closeing.....");
    this.record = customer.FullName_AM;
    this.modalRef.hide();
  }
}
function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
export class RecordDocumnet {
  public Certificate_Base;
  public document_Number;
  public title_Deed_No;
  public regstration_Date;
  public application_No;
  public room;
  public site;
  public block_Floor;
  public shelf_NO;
  public shelf_Raw;
  public shelf_Column;
  public created_By;
  public updated_By;
  public deleted_By;
  public is_Deleted;
  public created_Date;
  public updated_Date;
  public deleted_Date;
  public is_all_hardcopy_uploaded;
}
export class AddRecord {
  public task;
  public appno;
  public FullName_AM;
  public Deed;
  public SDP;
  public date;
  public Org;
  public Woreda;
  public selectedService;
}
