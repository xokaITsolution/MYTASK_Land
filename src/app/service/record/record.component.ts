import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  Validators,
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
import { jsPDF } from "jspdf";
import { ActivatedRoute, Params } from "@angular/router";
import {TreeNode} from 'primeng/api';

@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.css"],
})
export class RecordComponent implements OnChanges {
  @Input() useNamelist;
  @Input() disable;
  displayu: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  @Output() completed = new EventEmitter();
  model: NgbDateStruct;
  modalRef: BsModalRef;
  activeTab = "tab1";
  addnew: boolean;
  search: boolean;
  public Task: any;
  Service: any;
  Isshow: boolean = false;
  Org: any;
  hideNeww: boolean;
  applicationData:ApplicationData
  appno: any;
  Woreda: any;
  selectedService: any;
  date: any;
  SDP: any;
  Plot: any;
  Deed: any;
  AppNo: any;
  fileCounts: number[] = [];
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
  rolesToCheck = ["AEE24EEB-09B6-4F70-B924-D10CFCF757BA","270F762A-5393-4971-83BA-C7FF7D560BDA","F07A844C-E107-44AB-AA18-9D462BC7CDA3","8C133397-587E-456F-AB31-9CF5358BE8D2", "B59EA343-65EF-4C41-95A8-02D9AD81BFCD"];
  userRoles: UserRole[] = [];
  selectedTask: any;
  SavedFiles: any;
  recordDocumnet: RecordDocumnet;
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
  shownofilesArray: boolean[] = [];
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
  currentlicenceData: any;
  currentTaskelected: any;
  upploadd: any;
  mergedPDFBase64: any;
  Services: any;
  aplicno: any;
  disabledtask: boolean = true;
  invalidUnicode: any;
  selectedAppnoFordelete: any;
  candeletethisapplication: boolean;
  isupdated: boolean;
  Attacheduserid: any;
  nofiles: any;
  RID: any=null;
  itcanaddfolder: boolean;
  appLoading: boolean;
  isrecordofficer: boolean;
  oldtitledeed: any;
  switchTab(tab: string) {
    this.activeTab = tab;
  }

  constructor(
    private notificationsService: NotificationsService,
    private service: ServiceService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute ,
   
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
    SDP: new FormControl({disabled: true}),
    date: new FormControl(new Date().toISOString().substr(0, 10)),
    Org: new FormControl({disabled: true}),
    Woreda: ["", Validators.required],
    selectedService: new FormControl(),
  });
  async ngOnChanges() {
    this.getoldtitledeed()
    this.service.getaspnetuser().subscribe((r) => {
      this.Attacheduserid = r[0].userid;
   
    console.log("language", environment.Lang_code);
    if (
      environment.Lang_code === "am-et" ||
      environment.Lang_code === "am-ET"
    ) {
      this.language = "amharic";
    } else {
      this.language = "english";
    }

    //let havedata = await this.checkDocumentIsAvailable();

    console.log(
      "this.serviceService.currentApplicationUsers",
      this.useNamelist
    );
    if (this.useNamelist.length > 0 && this.useNamelist != undefined) {
      //this.getCustomerLookUP();
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

    console.log("formattedDate", formattedDate); // Output: 2023-10-02
  });
  }

  async addNew() {
   
    if (this.ApplicationNumberlist.length > 0) {
      this.service.getserviceapi().subscribe((service: any) => {
        // const serviceCodes = new Set(
        //   this.ApplicationNumberlist.map(
        //     (application) => application.services_service_code
        //   )
        // );

        // this.Services = service.filter(
        //   (service) => !serviceCodes.has(service.service_code)
        // );
        if(this.Customer[0].customer_Type_ID ==3102 || this.Customer[0].customer_Type_ID ==4120){
          const serviceCounts = {};
          this.ApplicationNumberlist.forEach((application) => {
            const code = application.services_service_code;
            serviceCounts[code] = (serviceCounts[code] || 0) + 1;
          });
  
          this.Services = service.filter((service) => {
            const code = service.service_code;
            return !serviceCounts.hasOwnProperty(code) || serviceCounts[code] < 2;
          });

        }else{
          this.Services = service
        }


        console.log("serviceserviceservicess", service);
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
      is_all_hardcopy_uploaded: true,
      old_title_deed_no:this.oldtitledeed
    };
    console.log("ADD NEW button clicked!");
    this.addnew = false;
    this.isDisabled = true;
    this.btnDisable = true;
    this.taskdisable = false;
    this.openArchive = false;
    if (this.language == "amharic") {
      let regstration_Date;
      const currentDate = new Date();
      const formattedDate =
        currentDate.getFullYear() +
        "-" +
        ("00" + (currentDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + currentDate.getDate()).slice(-2) +
        "T" +
        ("00" + currentDate.getHours()).slice(-2) +
        ":" +
        ("00" + currentDate.getMinutes()).slice(-2) +
        ":" +
        ("00" + currentDate.getSeconds()).slice(-2);
      console.log(formattedDate);

      console.log(formattedDate);
      regstration_Date = await this.getgregorianToEthiopianDate(formattedDate);
      this.selectedDate = regstration_Date;
     
     
      this.record.patchValue({
        appno: "",
        selectedService: "",
        date: regstration_Date,
        Woreda: "",
        // Woreda:this.licenceData.Wereda_ID,
        Deed: "",
        SDP: this.service.currentsdpid,
      });
    } else {
      let regstration_Date;
      regstration_Date = new Date().toISOString().substr(0, 10);
      this.record.patchValue({
        appno: "",
        selectedService: "",
        date: regstration_Date,
        Woreda: "",
        // Woreda:this.licenceData.Wereda_ID,
        Deed: "",
      });
      this.isupdated=false
    }
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
      is_all_hardcopy_uploaded: true,
      old_title_deed_no:this.oldtitledeed,
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
      is_all_hardcopy_uploaded: true,
      old_title_deed_no:this.oldtitledeed,
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
      SDP: this.service.currentsdpid,
      Deed: "",
    });
  }
  async onRowSelect(event) {
    console.log("customer_ID", event);
    this.addnew = false;
    this.service;
    // this.isEnvironmentalConsideration=false
    if (
      this.service.Service_ID ===
        "449A14BD-E0C0-4EDA-92F5-68B3FCF83433".toLocaleLowerCase() ||
      this.service.Service_ID ===
        "5FE58D7F-6E9F-452E-B85B-8CD501F020BE".toLocaleLowerCase() ||
      this.service.Service_ID ===
        "05BF5DE7-7170-43CE-8320-C747748D40E5".toLocaleLowerCase() ||
      this.service.Service_ID ===
        "DE330170-550B-4BF2-9908-DC557F92A7CC".toLocaleLowerCase()
    ) {
      this.disabledtask = false;
    }
    let havedata = await this.checkDocumentIsAvailable();

    this.service
      .getByCustomerId(event.customer_ID)
      .subscribe((customer: any) => {
        this.customer = customer;
        console.log("this.customer", this.customer);
        // this.service
        //   .getAppbyUserid(event.customer_ID)
        //   .subscribe(async (AppbyUserId: any) => {
        //     console.log("AppbyUserId", AppbyUserId);
        //     this.ApplicationNumberlist =
        //       AppbyUserId.procApplicationLoadByUserIds;
        //     console.log(
        //       "🚀 ~ RecordComponent ~ .subscribe ~ ApplicationNumberlist:",
        //       this.ApplicationNumberlist
        //     );
        //     let haveapp = await this.checkDocumentIsAvailable();

        //     this.selectedAppno =
        //       AppbyUserId.procApplicationLoadByUserIds.filter(
        //         (x) =>
        //           x.application_number == this.useNamelist[0].application_number
        //       )[0];

        //     if (this.ApplicationNumberlist.length > 0) {
        //       this.service.getserviceapi().subscribe((service: any) => {
        //         const serviceCounts = {};
        //         this.ApplicationNumberlist.forEach((application) => {
        //           const code = application.services_service_code;
        //           serviceCounts[code] = (serviceCounts[code] || 0) + 1;
        //         });

        //         this.Services = service.filter((service) => {
        //           const code = service.service_code;
        //           return (
        //             !serviceCounts.hasOwnProperty(code) ||
        //             serviceCounts[code] < 2
        //           );
        //         });

        //         console.log("serviceserviceservice", service);
        //       });
        //     }
        //     console.log(
        //       "🚀 ~ RecordComponent ~ .subscribe ~ selectedAppno:",
        //       this.selectedAppno
        //     );
        //     this.handleSelectionChange();
        //   });
        // this.service
        //   .getDeedByCustId(event.customer_ID)
        //   .subscribe((CustId: any) => {
        //     console.log("CustId", CustId.length);
        //     if (CustId.length > 0) {
        //       console.log("there is data");
       // this.GetApplicationNumberByUser(this.customer[0].userName);
        //     } else {
        //       console.log("there is no data");
        //     }
        //   });

        this.record.patchValue({
          SDP: this.service.currentsdpid,
          // appno:"BL-"+formattedDate+"-"+randomNumber(1,99999999999999999)
          // FullName_AM:event.data.applicant_First_Name_EN
          FullName_AM: this.customer[0].userName,
        });
      });
  }
  getservice() {
    this.service.getserviceapi().subscribe((res) => {
      this.Services = res;
      // this.Service = this.Service.filter(
      //   (x) => x.is_published == true && x.is_active == true
      // );
      console.log("service", res);
    });
  }
  getsdp() {
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
  }
  passapp(e) {
    console.log("🚀 ~ RecordComponent ~ passapp ~ e:", e);

    this.getservice();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.aplicno = params["AppNo"];
    });
    console.log("selectedappp", e, this.aplicno);
    if (
      e.services_service_code ===
        "449A14BD-E0C0-4EDA-92F5-68B3FCF83433".toLocaleLowerCase() ||
      e.services_service_code ===
        "5FE58D7F-6E9F-452E-B85B-8CD501F020BE".toLocaleLowerCase() ||
      e.services_service_code ===
        "05BF5DE7-7170-43CE-8320-C747748D40E5".toLocaleLowerCase() ||
      e.services_service_code ===
        "DE330170-550B-4BF2-9908-DC557F92A7CC".toLocaleLowerCase()
    ) {
      this.disabledtask = false;
    } else {
      // if (this.aplicno == e.application_number) {
      //   this.disabledtask = true;
      // } else {
      //   this.disabledtask = false;
      // }
    }
    this.selectedAppnoFordelete = e.application_number;
    this.service
      .getDocIdByAppNo(this.selectedAppnoFordelete)
      .subscribe((DocIdByAppNo: any) => {
        let procView_RecordAppNoAndDocIdByAppNo =
          DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
          if(procView_RecordAppNoAndDocIdByAppNo.length > 0){

          
        let application_code = procView_RecordAppNoAndDocIdByAppNo[0].application_code;
        let application_detail_id = procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id;
        this.service
          .getAllDocuments(application_code, application_detail_id)
          .subscribe((SavedFiles) => {
            console.log(
              "🚀 ~ RecordComponent ~ .subscribe ~ SavedFiles:",
              SavedFiles
            );
            if (SavedFiles.length === 0) {
              this.candeletethisapplication = true;
            } else {
              this.candeletethisapplication = false;
            }
          });
        }else{
          const toast = this.notificationsService.error(
            "error",
            "this application number(folder) have error you have to delete and create again /ይህ የመተግበሪያ ቁጥር(አቃፊ) ስህተት አለብህ መሰረዝ እና እንደገና መፍጠር አለብህ"
          );
          this.candeletethisapplication = true;
        }
      },error=>{
        const toast = this.notificationsService.error(
          "error",
          "this application number(folder) have error you have to delete and create again /ይህ የመተግበሪያ ቁጥር(አቃፊ) ስህተት አለብህ መሰረዝ እና እንደገና መፍጠር አለብህ"
        );
        this.candeletethisapplication = true;
      }
      );
  }
  handleSelectionChange(): void {
  if(this.ApplicationNumberlist.length > 1){
    this.itcanaddfolder=true
  } else{
    this.itcanaddfolder=false
  }
    this.displayTab = true;
    this.openArchive = true;
    this.isupdated=true
    this.addnew = false;
    this.procView_RecordAppNoAndDocIdByAppNo = [""];
    this.record.patchValue({
      task: "",
    });
    this.disableDate = true;
    this.btnDisable = false;
    this.RequerdDocspre = [""];
    console.log("this.selectedAppno111111", this.selectedAppno);
    //this.completed.emit();

    this.service
      .getDocIdByAppNo(this.selectedAppno.application_number)
      .subscribe((DocIdByAppNo: any) => {
        this.procView_RecordAppNoAndDocIdByAppNo =
          DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
        console.log("DocIdByAppNo90", this.procView_RecordAppNoAndDocIdByAppNo);
      });

    this.service
      .getLicenceService(this.selectedAppno.application_number)
      .subscribe((licenceService) => {
        this.licenceService = licenceService;
        this.licenceData = this.licenceService.list[0];
        this.service
        .getTasks(this.licenceData.Service_ID)
        .subscribe((ress: any) => {
          if (ress) {
            this.taskList = ress;
            this.taskdisable = true;

            console.log("taskresponsess", this.taskList);
          }
        });
        this.getPriveysLicence(this.licenceData.Application_No);
        console.log("Licence Service", this.service.licenceData);

        this.service
          .getLicencebyid(this.service.licenceData.Licence_Service_ID)
          .subscribe((rec: any) => {
            console.log(
              "🚀 ~ RecordComponent ~ ).subscribe ~ rec:",
              this.service.licenceData
            );
            let RID;
            if (rec.procLicense_Services.length > 0) {
              RID = rec.procLicense_Services[0].recordNo;
              this.RID=rec.procLicense_Services[0].recordNo;
            }
            console.log("🚀 ~ RecordComponent ~ .subscribe ~ RID:", RID);
            this.service
              .getDocumentArcbyid(RID)
              .subscribe((DocumentArc: any) => {
                if (DocumentArc) {
                  let Document = DocumentArc.procDocument_Archives.filter(
                    (x: any) => x.document_Number == RID
                  );
                  console.log("this.DocumentArc", Document);
                  if (Document.length > 0) {
                    this.itcanaddfolder=true
                    this.recordDocumnet = Document[0];
                    if (this.language == "amharic") {
                      this.recordDocumnet.regstration_Date =
                        this.getgregorianToEthiopianDate(
                          formatDate(
                            this.recordDocumnet.regstration_Date,
                            "yyyy-MM-dd",
                            "en"
                          )
                        );
                    } else {
                      this.recordDocumnet.regstration_Date = formatDate(
                        this.recordDocumnet.regstration_Date,
                        "yyyy-MM-dd",
                        "en"
                      );
                    }
                    this.disableBtn = false;
                    this.disableForm = true;
                  }
                  this.record.patchValue({
                    appno: this.licenceData.Application_No,
                    selectedService: this.licenceData.Service_ID,
                    date: formatDate(
                      this.licenceData.Created_Date,
                      "yyyy-MM-dd",
                      "en"
                    ),
                    SDP: this.licenceData.SDP_ID,
                    Woreda: this.licenceData.wereda_ID,
                    // Woreda:this.licenceData.Wereda_ID,
                    //Deed: Document[0].title_Deed_No,
                  });

                  // if (Document.length < 0) {
                  //   this.getData = false;
                  //   this.record.patchValue({
                  //     appno: this.licenceData.Application_No,
                  //     selectedService: this.licenceData.Service_ID,
                  //     date: formatDate(
                  //       this.licenceData.Created_Date,
                  //       "yyyy-MM-dd",
                  //       "en"
                  //     ),
                  //     SDP: this.licenceData.SDP_ID,
                  //     Woreda: this.userName[0].wereda_ID,
                  //     // Woreda:this.licenceData.Wereda_ID,
                  //     Deed: DocumentArc[0].title_Deed_No,
                  //   });

                  // }
                  //  else {
                  //   this.service
                  //     .getDeedByApp(this.selectedAppno.application_number)
                  //     .subscribe((DeedByApp: any) => {
                  //       console.log("DeedByApp", DeedByApp.length);
                  //       if (DeedByApp.length > 0) {
                  //         this.getData = false;
                  //         this.record.patchValue({
                  //           appno: this.licenceData.Application_No,
                  //           selectedService: this.licenceData.Service_ID,
                  //           date: formatDate(
                  //             this.licenceData.Created_Date,
                  //             "yyyy-MM-dd",
                  //             "en"
                  //           ),
                  //           SDP: this.licenceData.SDP_ID,
                  //           Woreda: this.userName[0].wereda_ID,
                  //           // Woreda:this.licenceData.Wereda_ID,
                  //           Deed: DeedByApp[0].title_Deed_No,
                  //         });
                  //       //  this.getDocmentArcive(DeedByApp[0].title_Deed_No);
                  //       } else {
                  //         this.getData = false;
                  //         this.record.patchValue({
                  //           appno: this.licenceData.Application_No,
                  //           selectedService: this.licenceData.Service_ID,
                  //           date: formatDate(
                  //             this.licenceData.Created_Date,
                  //             "yyyy-MM-dd",
                  //             "en"
                  //           ),
                  //           SDP: this.licenceData.SDP_ID,
                  //           Woreda: this.userName[0].wereda_ID,
                  //           // Woreda:this.licenceData.Wereda_ID,
                  //           Deed: "",
                  //         });
                  //       }
                  //     });
                  // }

               
                } else {
                  this.openArchive = true;
                }
              });
          });
      });
    // You can access the selected item here and perform further actions
  }
  getPriveysLicence(value) {
    // this.AppN = null;
    this.service.getPriveys(value).subscribe((PriveLicence) => {
      this.PriveLicence = PriveLicence;
      console.log("this.PriveLicence", this.PriveLicence);

      this.PriveLicence = Object.assign([], this.PriveLicence.list);
    });
  }

  GetApplicationNumberByUser(username) {
    this.service
      .GetApplicationNumberByUser(username)
      .subscribe(async (ApplicationNumber: any) => {
        if (ApplicationNumber != null) {
          console.log("finalystatuslist", ApplicationNumber);
          this.ApplicationNumberlist = ApplicationNumber;
         

          console.log("🚀 ~ RecordComponent ~ .subscribe ~ ApplicationNumberlist:", this.ApplicationNumberlist)
          this.ApplicationNumberlist = this.ApplicationNumberlist.filter(
            (value) => value.organization_code == this.record.get("SDP").value
          );
          let haveapp = await this.checkDocumentIsAvailable();
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
    if (this.RequerdDocspre) {
      for (let i = 0; i < this.RequerdDocspre.length; i++) {
        if (
          RequiredDoc.requirement_code ===
          this.RequerdDocspre[i].requirement_code
        ) {
          this.RequerdDocspre[i].uploded = 1;
        }
      }
    }
    console.log("files", event.files);
  }
  passdata(code: any) {
    console.log("this.selectedTask1", code);
    this.currentTaskelected = code;
    this.getRequiredDocspre(code);
    //console.log("this.PreAppData", this.PreAppData.Table);
  }
  getRequiredDocspre(tskID) {
    this.service.getRequerdDocs(tskID).subscribe((res) => {
      this.RequerdDocspre = res;

      console.log("taskresponsessssdd", res, tskID, this.RequerdDocspre.length);
      for (let i = 0; i < this.RequerdDocspre.length; i++) {
        if (this.RequerdDocspre[i].description_en == "Dummy") {
          this.RequerdDocspre.splice(i, 1);
          break;
        }
        this.RequerdDocspre.forEach((item) => {
          item.previewed = false; // Add a new property to track preview status, initialized to false
        });
      }
      console.log(
        "🚀 ~ RecordComponent ~ this.service.getRequerdDocs ~ selectedAppno:",
        this.selectedAppno.application_number
      );

      this.service
        .getDocIdByAppNo(this.selectedAppno.application_number)
        .subscribe((DocIdByAppNo: any) => {
          this.procView_RecordAppNoAndDocIdByAppNo =
            DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
          console.log(
            "DocIdByAppNo90",
            this.procView_RecordAppNoAndDocIdByAppNo
          );
          if (this.procView_RecordAppNoAndDocIdByAppNo.length > 0) {
            this.AppNo =
              this.procView_RecordAppNoAndDocIdByAppNo[0].application_code;
            this.DocID =
              this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id;
          }
          this.getAllDocumentpre(
            this.procView_RecordAppNoAndDocIdByAppNo[0].application_code,
            this.procView_RecordAppNoAndDocIdByAppNo[0].application_detail_id,
            tskID
          );
        });
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

  getAllDocument(appNo, docid, currentTaskelected) {
    console.log("dataaaaaaa");
    this.service
      .getDocumentbytaskssURL(appNo, docid, currentTaskelected)
      .subscribe((res) => {
        this.SavedFiles = res;
        console.log("responsssss", res);
      });
  }
  async add() {
    this.service.getUserRole().subscribe(async (response: any) => {
      if (response) {
        for (let index = 0; index < response.length; index++) {
          const element = response[index];

          if (
            element.RoleId ===
            "AEE24EEB-09B6-4F70-B924-D10CFCF757BA".toLocaleLowerCase() ||
            element.RoleId ===
            "270F762A-5393-4971-83BA-C7FF7D560BDA".toLocaleLowerCase() ||
            element.RoleId ===
            "F07A844C-E107-44AB-AA18-9D462BC7CDA3".toLocaleLowerCase()  ||
            element.RoleId ===
            "8C133397-587E-456F-AB31-9CF5358BE8D2".toLocaleLowerCase()  ||
            element.RoleId ===
            "B59EA343-65EF-4C41-95A8-02D9AD81BFCD".toLocaleLowerCase() 
          ) {
            this.isrecordofficer = true;
            break;
          } else {
            this.isrecordofficer = false;
          }
        }
      
    
    if (
      this.recordDocumnet.document_Number === null ||
      this.recordDocumnet.document_Number == ""
    ) {
      const toast = this.notificationsService.error(
        "Error",
        "document number is mandatory/የሰነድ ቁጥር ግዴታ ነው"
      );
      return;
    }
    if (this.language == "amharic") {
      this.recordDocumnet.regstration_Date = await this.getEthiopianToGregorian(
        this.recordDocumnet.regstration_Date
      );
    }

    this.recordDocumnet.application_No = this.service.appnoForRecord;
    this.recordDocumnet.created_By=response[0].RoleId
    this.recordDocumnet.created_Date=new Date()
   if(this.isrecordofficer){
    this.service.CreateDocmentArcive(this.recordDocumnet).subscribe(
      async (message) => {
        console.log("message", message);
        //localStorage.setItem("RID", message[0].document_Number);
        // this.serviceService.disablefins = false;
        // if (!this.Saved) {
        this.completed.emit();
        //   this.Saved = true;
        // }
        // this.documentAddress=false
        console.log(this.service.licenceData);

        this.service.licenceData.RecordNo = this.recordDocumnet.document_Number;
        let applicationData = {
          licence_Service_ID: this.service.licenceData.Licence_Service_ID,
          application_No: this.service.licenceData.Application_No,
          service_ID: this.service.licenceData.Service_ID,
          service_Name: this.service.licenceData.Service_Name,
          property_ID: this.service.licenceData.Property_ID,
          certificate_Code: this.service.licenceData.Certificate_Code,
          parcel_ID: this.service.licenceData.Parcel_ID,
          plot_Merge_1: this.service.licenceData.Plot_Merge_1,
          plot_Merge_2: this.service.licenceData.Plot_Merge_2,
          plot_Merge_3: this.service.licenceData.Plot_Merge_3,
          plot_Merge_4: this.service.licenceData.Plot_Merge_4,
          sdP_ID: this.service.licenceData.SDP_ID,
          wereda_ID: this.service.licenceData.Wereda_ID,
          email: this.service.licenceData.Email,
          cust_Phone_No: this.service.licenceData.Cust_Phone_No,
          cust_Photo: this.service.licenceData.Cust_Photo,
          applicant_First_Name_AM: this.service.licenceData.Applicant_First_Name_AM,
          applicant_First_Name_EN: this.service.licenceData.Applicant_First_Name_EN,
          applicant_Middle_Name_AM: this.service.licenceData.Applicant_Middle_Name_AM,
          applicant_Middle_Name_En: this.service.licenceData.Applicant_Middle_Name_En,
          applicant_Last_Name_AM: this.service.licenceData.Applicant_Last_Name_AM,
          applicant_Last_Name_EN: this.service.licenceData.Applicant_Last_Name_EN,
          applicant_Mother_Name_AM: this.service.licenceData.Applicant_Mother_Name_AM,
          applicant_Mother_Name_EN: this.service.licenceData.Applicant_Mother_Name_EN,
          application_Date: this.service.licenceData.Application_Date,
          cust_TIN_No: this.service.licenceData.Cust_TIN_No,
          is_Revalidated: this.service.licenceData.Is_Revalidated,
          is_Paid: this.service.licenceData.Is_Paid,
          created_By: this.service.licenceData.Created_By,
          updated_By: this.service.licenceData.Updated_By,
          deleted_By: this.service.licenceData.Deleted_By,
          is_Deleted: this.service.licenceData.Is_Deleted,
          created_Date: this.service.licenceData.Created_Date,
          updated_Date: this.service.licenceData.Updated_Date,
          deleted_Date: this.service.licenceData.Deleted_Date,
          customerID: this.service.licenceData.CustomerID,
          number_Of_Copy_Doc: this.service.licenceData.Number_Of_Copy_Doc,
          recordNo: this.service.licenceData.RecordNo
        };
        
        this.service.UpdateLicence(applicationData).subscribe(
          (Licence) => {},
          (error) => {
            const toast = this.notificationsService.error("Error", error.error);
          }
        );
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
  }else{
    const toast = this.notificationsService.error(
      "Error",
      "you don't have record officer role"
    );
    return
  }
    console.log("saveing....");
}
  })
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
            is_all_hardcopy_uploaded: true,
            old_title_deed_no:this.oldtitledeed
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
    //this.recordDocumnet.title_Deed_No = this.record.get("Deed").value;
  }

  delete() {
    this.service.postapplicationdelete(this.selectedAppnoFordelete).subscribe(
      async (res) => {},
      async (error) => {
        if (error.status == "200") {
          const toast = this.notificationsService.success(
            "Your Application is deleted "
          );
          let haveapp = await this.checkDocumentIsAvailable();
        }
      }
    );
  }
   getoldtitledeed() {
    this.service
    .getoldtitledeed(this.service.licenceData.Application_No)
    .subscribe(async (rec: any) => {
this.oldtitledeed=rec[0].old_titie_deed_no
console.log('old_titie_deed_no',this.oldtitledeed)
    })}
  async save() {
    this.service
    .getLicencebyid(this.service.licenceData.Licence_Service_ID)
    .subscribe(async (rec: any) => {
      console.log(
        "🚀 ~ RecordComponent ~ ).subscribe ~ rec:",
        this.service.licenceData
      );
     
      if (rec.procLicense_Services.length > 0) {
       
        this.RID=rec.procLicense_Services[0].recordNo;
      }
    if (this.language == "amharic") {
      this.record_date = await this.getEthiopianToGregorian(this.selectedDate);
      this.record.patchValue({
        date: this.record_date,
        Deed:this.RID
      });

      // console.log("saveing.....", this.Base.Registration_Date);
    }
    this.btnDisable = false;
    // this.displayTab = false;
    this.taskdisable = true;
    this.documentAddress = true;

  

    this.record.patchValue({
      appno: "00000000-0000-0000-0000-000000000000",
      SDP: this.service.currentsdpid,
      FullName_AM: this.customer[0].userName,
      Deed:this.RID
    });
    console.log(
      "🚀 ~ RecordComponent ~ .subscribe ~ record:",
      this.record.value
    );
    this.service.saveRecord(this.record.value).subscribe(
      async (res: any) => {
        this.service
          .getTasks(this.record.get("selectedService").value)
          .subscribe((ress: any) => {
            this.taskList = ress;
            console.log("taskresponsess", this.taskList);
          });
        this.disabledtask = false;
        this.recordDocumnet.application_No = this.service.appnoForRecord;
        // console.log("this.response", this.response[0]);
        // Split the input string by '/'
        const parts = res.split("/");

        // Assign the parts to variables
        this.AppNo = parts[0];
        this.DocID = parts[1];

        this.service
          .getLicencebyid(this.service.licenceData.Licence_Service_ID)
          .subscribe((rec: any) => {
            console.log("🚀 ~ RecordComponent ~ ).subscribe ~ rec:", rec);

            let RID;
            if (rec.procLicense_Services.length > 0) {
              RID = rec.procLicense_Services[0].recordNo;
            }
            //this.getAllDocumentpre(this.AppNo, this.DocID);
            this.service
              .getDocumentArcbyid(RID)
              .subscribe(async (DocumentArc: any) => {
                if (DocumentArc) {
                  this.DocumentArc = DocumentArc.procDocument_Archives.filter(
                    (x) => x.document_Number == RID
                  );
                  console.log("this.DocumentArc", this.DocumentArc);
                  if (this.DocumentArc.length > 0) {
                    this.recordDocumnet = this.DocumentArc[0];
                    this.disableBtn = false;
                    if (this.language == "amharic") {
                      this.recordDocumnet.regstration_Date =
                        this.getgregorianToEthiopianDate(
                          formatDate(
                            this.recordDocumnet.regstration_Date,
                            "yyyy-MM-dd",
                            "en"
                          )
                        );
                    } else {
                      this.recordDocumnet.regstration_Date = formatDate(
                        this.recordDocumnet.regstration_Date,
                        "yyyy-MM-dd",
                        "en"
                      );
                    }
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
          });
        const toast = this.notificationsService.success("Success", "Saved");
        let havada = await this.checkDocumentIsAvailable();
        this.completed.emit();
        this.getAll(this.AppNo, this.DocID);
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
  })
    // this.displayGIS=false
  }
  UpdateAttachments(Attachments) {
    console.log("Attachments", Attachments.docs);
    this.Attachments = Attachments.docs;
    let a = true;
    //this.completed.emit();
    for (let i = 0; i < this.Attachments.length; i++) {
      // console.log(
      //   "this.Attachments[i].required && !this.Attachments[i].File",
      //   this.Attachments[i].required && !this.Attachments[i].File
      // );
      if (this.Attachments[i].required && !this.Attachments[i].File) {
        a = false;
        break;
      }
    }

    // this.nxtfromfile = a;
    // this.Upload(Attachments.File);
  }
  async update() {
    this.service.getUserRole().subscribe(async (response: UserRole[]) => {
      this.userRoles = response;

      const hasRequiredRoles = this.userRoles.some(userRole => 
        this.rolesToCheck.includes(userRole.RoleId.toUpperCase())
      );
      if (hasRequiredRoles) {
    if (
      this.recordDocumnet.document_Number === null ||
      this.recordDocumnet.document_Number == ""
    ) {
      const toast = this.notificationsService.error(
        "Error",
        "document number is mandatory/የሰነድ ቁጥር ግዴታ ነው"
      );
      return;
    }
    if (this.language == "amharic") {
      this.recordDocumnet.regstration_Date = await this.getEthiopianToGregorian(
        this.recordDocumnet.regstration_Date
      );
    }
    this.recordDocumnet.application_No = this.service.appnoForRecord;
    
this.recordDocumnet.updated_By=response[0].UserId
this.recordDocumnet.updated_Date=new Date()
    
    this.documentAddress = false;
    this.service.UpdateDocmentArcive(this.recordDocumnet).subscribe(
      async (message) => {
        this.completed.emit();

        console.log(this.service.licenceData);

        this.service.licenceData.RecordNo = this.recordDocumnet.document_Number;
        let applicationData = {
          licence_Service_ID: this.service.licenceData.Licence_Service_ID,
          application_No: this.service.licenceData.Application_No,
          service_ID: this.service.licenceData.Service_ID,
          service_Name: this.service.licenceData.Service_Name,
          property_ID: this.service.licenceData.Property_ID,
          certificate_Code: this.service.licenceData.Certificate_Code,
          parcel_ID: this.service.licenceData.Parcel_ID,
          plot_Merge_1: this.service.licenceData.Plot_Merge_1,
          plot_Merge_2: this.service.licenceData.Plot_Merge_2,
          plot_Merge_3: this.service.licenceData.Plot_Merge_3,
          plot_Merge_4: this.service.licenceData.Plot_Merge_4,
          sdP_ID: this.service.licenceData.SDP_ID,
          wereda_ID: this.service.licenceData.Wereda_ID,
          email: this.service.licenceData.Email,
          cust_Phone_No: this.service.licenceData.Cust_Phone_No,
          cust_Photo: this.service.licenceData.Cust_Photo,
          applicant_First_Name_AM: this.service.licenceData.Applicant_First_Name_AM,
          applicant_First_Name_EN: this.service.licenceData.Applicant_First_Name_EN,
          applicant_Middle_Name_AM: this.service.licenceData.Applicant_Middle_Name_AM,
          applicant_Middle_Name_En: this.service.licenceData.Applicant_Middle_Name_En,
          applicant_Last_Name_AM: this.service.licenceData.Applicant_Last_Name_AM,
          applicant_Last_Name_EN: this.service.licenceData.Applicant_Last_Name_EN,
          applicant_Mother_Name_AM: this.service.licenceData.Applicant_Mother_Name_AM,
          applicant_Mother_Name_EN: this.service.licenceData.Applicant_Mother_Name_EN,
          application_Date: this.service.licenceData.Application_Date,
          cust_TIN_No: this.service.licenceData.Cust_TIN_No,
          is_Revalidated: this.service.licenceData.Is_Revalidated,
          is_Paid: this.service.licenceData.Is_Paid,
          created_By: this.service.licenceData.Created_By,
          updated_By: this.service.licenceData.Updated_By,
          deleted_By: this.service.licenceData.Deleted_By,
          is_Deleted: this.service.licenceData.Is_Deleted,
          created_Date: this.service.licenceData.Created_Date,
          updated_Date: this.service.licenceData.Updated_Date,
          deleted_Date: this.service.licenceData.Deleted_Date,
          customerID: this.service.licenceData.CustomerID,
          number_Of_Copy_Doc: this.service.licenceData.Number_Of_Copy_Doc,
          recordNo: this.service.licenceData.RecordNo
        };
        
        this.service.UpdateLicence(applicationData).subscribe(
          (Licence) => {},
          (error) => {
            const toast = this.notificationsService.error("Error", error.error);
          }
        );
        const toast = this.notificationsService.success("Sucess", message);
      },
      (error) => {
        console.log("gogogog", error);
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
    );}
    else{
      const toast = this.notificationsService.error(
        "Error",
        "you don't have record officer role"
      );
      return
    }
  })
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
    console.log("checkingdate", date);
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
  // getAllDocumentpre(Licence_Service_ID, DocID, taskid) {
  //   let updatedArray: any[] = [];
  //   this.loadingPreDoc = true;
  //   console.log("this.RequerdDocspre", this.RequerdDocspre);
  //   this.service.getAllDocuments(Licence_Service_ID, DocID).subscribe(
  //     (SavedFiles) => {
  //       SavedFiles = SavedFiles.filter((x) => x.tasks_task_code == taskid);
  //       console.log("SavedFiiiilessssffff", SavedFiles);
  //         if (SavedFiles.length > 0) {
  //       this.loadingPreDoc = false;
  //       this.SavedFilespre = SavedFiles;
  //       for (let j = 0; j < SavedFiles.length; j++) {
  //         if (SavedFiles[j].attachedBY.trim() != environment.username) {
  //           this.hid = false;
  //         } else {
  //           this.hid = true;
  //         }
  //         let updatedObject = {
  //           // Copy the existing properties from the original object
  //           is_hidde: this.hid,
  //         };

  //         updatedArray.push(updatedObject);
  //       }

  //       this.hide = updatedArray;
  //       if (this.RequerdDocspre != null || this.RequerdDocspre != undefined)
  //         this.showProgressBar = false;
  //       for (let i = 0; i < this.RequerdDocspre.length; i++) {
  //         console.log("pdf fileeee", this.RequerdDocspre[i]);

  //         for (let j = 0; j < SavedFiles.length; j++) {
  //           if (
  //             this.RequerdDocspre[i].requirement_code ==
  //             SavedFiles[j].requirement_code
  //           ) {
  //             console.log("updatedArray", updatedArray[j]);
  //             try {

  //               this.RequerdDocspre[i].hidden = SavedFiles[j].UserId;
  //               console.log("updatedArrayyyyy", this.RequerdDocspre[i].hidden);
  //               this.RequerdDocspre[i].document_code =
  //                 SavedFiles[j].document_code;
  //               this.RequiredDocs = this.RequerdDocspre;
  //             } catch (e) {
  //               console.error(e);
  //             }
  //           }
  //         }
  //       }
  //       this.hide = updatedArray;
  //       console.log("SavedFileeeees", updatedArray);
  //       console.log("RequerdDocspre", this.RequerdDocspre);
  //       this.RequerdDocspre.forEach((item, index) => {
  //         this.PreviewshowdialogeArray[index] = false; // Initialize all dialog variables to false
  //       });
  //        }
  //     },
  //     (error) => {
  //       this.loadingPreDoc = false;
  //       console.log("error");
  //     }
  //   );
  // }

  getAllDocumentpre(Licence_Service_ID, DocID, taskid) {
    this.loadingPreDoc = true;
    this.displayTab = false;
    console.log("this.RequerdDocspre", this.RequerdDocspre);
    this.service.getAllDocuments(Licence_Service_ID, DocID).subscribe(
      (SavedFiles) => {
        let SavedFile = SavedFiles.filter((x) => x.tasks_task_code === taskid);
        console.log("SavedFiiiilessssffff", SavedFile);
        if (SavedFile.length > 0) {
          this.processSavedFiles(SavedFile);
        } else {
          this.RequerdDocspre = [""];
          this.service.getRequerdDocs(taskid).subscribe((res) => {
            this.RequerdDocspre = res;
            for (let i = 0; i < this.RequerdDocspre.length; i++) {
              if (this.RequerdDocspre[i].description_en == "Dummy") {
                this.RequerdDocspre.splice(i, 1);
                break;
              }
            }
          });
        }
      },
      (error) => {
        this.loadingPreDoc = false;
        console.log("error");
      }
    );
  }

  processSavedFiles(SavedFiles) {
    let updatedArray: any[] = [];
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
    this.hide = updatedArray;
    if (this.RequerdDocspre != null || this.RequerdDocspre != undefined)
      this.showProgressBar = false;
    for (let i = 0; i < this.RequerdDocspre.length; i++) {
      // console.log("pdf fileeee", this.RequerdDocspre[i]);
      for (let j = 0; j < SavedFiles.length; j++) {
        if (
          this.RequerdDocspre[i].requirement_code ==
          SavedFiles[j].requirement_code
        ) {
          console.log("updatedArray", updatedArray[j]);
          try {
            this.RequerdDocspre[i].hidden = SavedFiles[j].UserId;
            console.log("updatedArrayyyyy", this.RequerdDocspre[i].hidden);
            this.RequerdDocspre[i].document_code = SavedFiles[j].document_code;
            this.RequiredDocs = this.RequerdDocspre;
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
    this.hide = updatedArray;
    console.log("SavedFileeeees", updatedArray);
    console.log("RequerdDocspre", this.RequerdDocspre);
    this.RequerdDocspre.forEach((item, index) => {
      this.PreviewshowdialogeArray[index] = false;
      
      
    });
  }

  onFileDropped($file) {
    // Handle the dropped files here
    console.log("Dropped files:", $file);
    // Perform any necessary operations with the files

    this.uploadedFile($file);
  }
  uploadedFile(event: any) {
    const files: FileList = event.target.files;
    const filePromises: Promise<Uint8Array>[] = [];

    // Read each file and push the promise to the array
    for (let i = 0; i < files.length; i++) {
      const fileReader = new FileReader();
      const filePromise = new Promise<Uint8Array>((resolve, reject) => {
        fileReader.onload = (e: any) =>
          resolve(new Uint8Array(e.target.result));
        fileReader.onerror = (e) => reject(e);
      });

      fileReader.readAsArrayBuffer(files[i]);
      filePromises.push(filePromise);
    }

    // Once all files are read, merge them into a single PDF
    Promise.all(filePromises)
      .then((fileUint8Arrays: Uint8Array[]) => {
        const pdfDoc = new jsPDF(); // Create a new instance of jsPDF

        // Add each file content to the PDF
        for (const uint8Array of fileUint8Arrays) {
          pdfDoc.addPage();
          pdfDoc.addImage({
            imageData: uint8Array,
            x: 0,
            y: 0,
            width: 210, // A4 width in mm
            height: 297, // A4 height in mm
          });
        }

        // Convert the merged PDF to base64 string
        const base64String = pdfDoc.output("datauristring");

        // Now you have the merged PDF as a base64 string
        console.log("Merged PDF Base64:", base64String);
        this.mergedPDFBase64 = pdfDoc.output("datauristring");
        // You can perform further operations with the base64 string if needed
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  }

  downloadPDF() {
    const link = document.createElement("a");
    link.href = this.mergedPDFBase64;
    link.download = "merged_pdf.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          this.selectedAppno.application_number = this.Application_Number;
          this.recordDocumnet.application_No = this.service.appnoForRecord;
          //
          console.log("licenceData", this.licenceData.Licence_Service_ID);
          //this.getAllDocumentpre(this.licenceData.Licence_Service_ID, DocID);
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
  // getCustomerLookUP() {
  //   this.service.getcustomerby().subscribe(
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
  //         const customerID = this.CustomerLookUP[i].customer_ID;
  //       }
  //       console.log("CustomerLookUP", this.CustomerLookUP[0].customer_ID);
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }
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
  unicodeValidator(event: any) {
    console.log("🚀 ~ RecordComponent ~ unicodeValidator ~ event:", event.data);
    const unicodePattern = /^[^\u002F\u005C]+$/; // Regex to allow only Unicode characters
    if (!unicodePattern.test(event.data)) {
      this.invalidUnicode = true;
    } else {
      this.invalidUnicode = false;
    }
  }
  onKeyPress(event: KeyboardEvent) {
    const unicodePattern = /^[^\u002F\u005C]+$/; // Regex to allow only Unicode characters
    const inputChar = event.key;
    if (inputChar === "/" || inputChar === "\\") {
      this.invalidUnicode = true;
      event.preventDefault();
    } else {
      if (!unicodePattern.test(inputChar)) {
        this.invalidUnicode = true;
      } else {
        this.invalidUnicode = false;
      }
    }
  }
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData("text");
    const unicodePattern = /^[^\u002F\u005C]+$/; // Regex to allow only Unicode characters

    if (pastedText.includes("/") || pastedText.includes("\\")) {
      this.invalidUnicode = true;
      event.preventDefault();
    } else {
      if (!unicodePattern.test(pastedText)) {
        this.invalidUnicode = true;
        event.preventDefault();
      } else {
        this.invalidUnicode = false;
      }
    }
  }
  async checkDocumentIsAvailable() {
    console.log("🚀 ~ RecordComponent ~ .subscribe ~ ApplicationNumberlist:", this.ApplicationNumberlist ,this.service.appnoForRecord)
    this.appLoading=true
    return new Promise<boolean>((resolve, reject) => {
      let counter = 0;
      let applicationLength = 0;

      this.activatedRoute.params.subscribe(async (params: Params) => {
        let AppNo = params["AppNo"];
        if (this.service.Service_ID === '2145F90D-E911-42F2-9AD7-C2455A4D9DCD'.toLocaleLowerCase() || 
        this.service.Service_ID === 'DE4937D8-BDCD-46D6-8749-DC31C9F3ADCF'.toLocaleLowerCase()){ 
           AppNo = this.service.appnoForRecorderror
           this.service.appnoForRecord=this.service.appnoForRecorderror
           console.log("🚀 ~ RecordComponent ~ this.service.Service_ID==='DE4937D8-BDCD-46D6-8749-DC31C9F3ADCF'.toLocaleLowerCase ~ AppNo:", AppNo)
        }
        try {
          const res: any = await this.service.getuserName(AppNo).toPromise();
          let useNamelist = res;
          if (useNamelist.length > 0) {
            const user: any = await this.service
              .getCustomerByCols(useNamelist[0].userName)
              .toPromise();
            let userName = user.procCustomers;
            if (userName.length > 0) {
              if(this.disable == true &&  this.service.sellerCustomerId!=undefined ){

                userName[0].customer_ID= this.service.sellerCustomerId
              }
              const AppbyUserId: any = await this.service
                .getAppbyUserid(userName[0].customer_ID , this.service.appnoForRecord )
                .toPromise();
             
                this.service
          .getLicencebyid(this.service.LicenceserviceID)
          .subscribe((rec: any) => {
           
            let RID;
            if (rec.procLicense_Services.length > 0) {
              RID = rec.procLicense_Services[0].recordNo;
              this.RID=rec.procLicense_Services[0].recordNo;
            }
              if(this.RID !=null){
                this.ApplicationNumberlist =
                AppbyUserId.procApplicationLoadByUserIds.filter(x=>x.recordNo == this.RID)
                this.appLoading=false
              }else{

                if(this.Customer[0].customer_Type_ID ==3102 || this.Customer[0].customer_Type_ID ==4120){
                  this.ApplicationNumberlist =
                  AppbyUserId.procApplicationLoadByUserIds;
                }else{
              
                   if (this.disable){
                    this.ApplicationNumberlist = AppbyUserId.procApplicationLoadByUserIds
                   }else{

                     this.ApplicationNumberlist = AppbyUserId.procApplicationLoadByUserIds.filter(x=>x.application_number == this.service.appnoForRecord);
                   }
                  console.log("🚀 ~ RecordComponent ~ this.activatedRoute.params.subscribe ~ ApplicationNumberlist:", this.ApplicationNumberlist)
                
                  
                 }
                 this.appLoading=false
              }
                })


                // this.ApplicationNumberlist.forEach((item, index) => {
                //   this.shownofilesArray[index] = true; 
                // });
              // this.service.getserviceapi().subscribe((service: any) => {
              //   const serviceCounts = {};
              //   this.ApplicationNumberlist.forEach((application) => {
              //     const code = application.services_service_code;
              //     serviceCounts[code] = (serviceCounts[code] || 0) + 1;
              //   });

              //   this.Services = service.filter((service) => {
              //     const code = service.service_code;
              //     return (
              //       !serviceCounts.hasOwnProperty(code) ||
              //       serviceCounts[code] < 2
              //     );
              //   });
              // });
              // if (this.ApplicationNumberlist.length > 0) {
              //   applicationLength = this.ApplicationNumberlist.length;
              //   for (
              //     let index = 0;
              //     index < this.ApplicationNumberlist.length;
              //     index++
              //   ) {
              //     const element = this.ApplicationNumberlist[index];
              //     const DocIdByAppNo: any = await this.service
              //       .getDocIdByAppNo(element.application_number)
              //       .toPromise();
              //     let procView_RecordAppNoAndDocIdByAppNo =
              //       DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
              //     if (procView_RecordAppNoAndDocIdByAppNo.length > 0) {
              //       let application_code =
              //         procView_RecordAppNoAndDocIdByAppNo[0].application_code;
              //       let application_detail_id =
              //         procView_RecordAppNoAndDocIdByAppNo[0]
              //           .application_detail_id;
              //       const SavedFiles: any = await this.service
              //         .getAllDocuments(application_code, application_detail_id)
              //         .toPromise();
              //       this.ApplicationNumberlist[index].nofiles =
              //         SavedFiles.length;
              //       // console.log(
              //       //   "🚀 ~ RecordComponent ~ this.activatedRoute.params.subscribe ~ ApplicationNumberlist:",
              //       //   this.ApplicationNumberlist
              //       // );

              //       counter++;
              //     }
              //   }
              // }
            }
          }
          resolve(counter === applicationLength);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
 async eachfileupload(application_number){
  const DocIdByAppNo: any = await this.service
  .getDocIdByAppNo(application_number)
  .toPromise();
let procView_RecordAppNoAndDocIdByAppNo =
  DocIdByAppNo.procView_RecordAppNoAndDocIdByAppNos;
if (procView_RecordAppNoAndDocIdByAppNo.length > 0) {
  let application_code =
    procView_RecordAppNoAndDocIdByAppNo[0].application_code;
  let application_detail_id =
    procView_RecordAppNoAndDocIdByAppNo[0]
      .application_detail_id;
  const SavedFiles: any = await this.service
    .getAllDocuments(application_code, application_detail_id)
    .toPromise();
  // this.nofiles =
  //   SavedFiles.length;
  this.fileCounts[application_number] =SavedFiles.length == 0 ? 0 :SavedFiles.length;
   
}
 }
  getSDPID(subcity: string): string {
    switch (subcity) {
      case "arada":
        return "6921d772-3a1c-4641-95a0-0ab320bac3e2";
      case "bole":
        return "89eb1aec-c875-4a08-aaf6-2c36c0864979";
      case "nifasS":
        return "f8ea62db-05bc-4f1a-ab30-4e926d43e3fb";
      case "gullele":
        return "6a8c042f-a3e1-4375-9769-54d94c2312c6";
      case "addisK":
        return "7101d44d-97d5-41aa-957d-82f36d928c07";
      case "lideta":
        return "e4d8219e-51f9-40cb-9d53-883c6ca9aaa3";
      case "lemiK":
        return "f02e9467-1b7d-4350-bee7-9844d4f56da0";
      case "yeka":
        return "8222f028-5fe3-4047-9a50-b52bfa64c851";
      case "akakyK":
        return "08f9c927-6366-467a-ba99-c837c5add427";
      case "kirkos":
        return "aaa5094c-8899-4708-9f7b-d8ff634a3540";
      case "kolfeK":
        return "930d1c20-9e0e-4a50-9eb2-e542fafbad68";
      case "central":
        return "275619f2-69c2-4fb7-a053-938f0b62b088";
      default:
        return ""; // Return empty string or handle error based on your requirements
    }
  }
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
  public old_title_deed_no
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

// Define an interface to represent the structure of the provided data
export interface ApplicationData {
  Applicant_First_Name_AM: string | null;
  Applicant_First_Name_EN: string | null;
  Applicant_Last_Name_AM: string | null;
  Applicant_Last_Name_EN: string | null;
  Applicant_Middle_Name_AM: string | null;
  Applicant_Middle_Name_En: string | null;
  Applicant_Mother_Name_AM: string | null;
  Applicant_Mother_Name_EN: string | null;
  Application_Date: string; // Assuming this is always present and in ISO date format
  Application_No: string;
  Certificate_Code: string | null;
  Created_By: string;
  Created_Date: string; // Assuming this is always present and in ISO date format
  Cust_Phone_No: string;
  Cust_Photo: any; // Type could be more specific depending on the actual data type
  Cust_TIN_No: string;
  CustomerID: any; // Type could be more specific depending on the actual data type
  Deleted_By: string | null;
  Deleted_Date: string | null; // Assuming this is always present and in ISO date format
  Email: string | null;
  Is_Deleted: boolean | null;
  Is_Paid: boolean | null;
  Is_Revalidated: boolean | null;
  Licence_Service_ID: string;
  Number_Of_Copy_Doc: number | null;
  Parcel_ID: any; // Type could be more specific depending on the actual data type
  Plot_Merge_1: any; // Type could be more specific depending on the actual data type
  Plot_Merge_2: any; // Type could be more specific depending on the actual data type
  Plot_Merge_3: any; // Type could be more specific depending on the actual data type
  Plot_Merge_4: any; // Type could be more specific depending on the actual data type
  Property_ID: any; // Type could be more specific depending on the actual data type
  RecordNo: string;
  SDP_ID: string;
  Service_ID: string;
  Service_Name: string;
  Updated_By: string | null;
  Updated_Date: string | null; // Assuming this is always present and in ISO date format
  Wereda_ID: number;
 
}
interface UserRole {
  UserId: string;
  RoleId: string;
}
