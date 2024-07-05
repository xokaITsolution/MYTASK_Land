import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { DeptSuspensionRecordService } from "./dept-suspension-record.service";
import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ServiceService } from "../service.service";
import { DateFormatter } from "ngx-bootstrap";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dept-suspension-record",
  templateUrl: "./dept-suspension-record.component.html",
  styleUrls: [],
})
export class DeptSuspensionRecordComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  public deptSuspensionRecord: DeptSuspensionRecord;
  deptSuspensionRecordList;
  deptForm = false;
  currntDate = new Date();
  @Input() Selectedcert;
  @Input() disable;
  @Input() licenceData;
  customerdata: any;
  Customerdept: boolean;
  isBank: boolean = false;
  language: string;
  isdeleted: boolean;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private deptSuspensionRecordService: DeptSuspensionRecordService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private serviceService: ServiceService,
    private cdr: ChangeDetectorRef
  ) {
    this.deptSuspensionRecord = new DeptSuspensionRecord();
  }

  ngOnChanges() {
    console.log("hahaha2", this.Selectedcert);
    this.getdeed(this.Selectedcert.version_ID);
    this.deptForm = false;
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
  }
  selectOption(e) {
    if (e == "suspended") {
      this.deptSuspensionRecord.is_Suspended = true;
      this.deptSuspensionRecord.is_Released = false;
    }else if(e == "is_Deleted"){
      this.serviceService.getUserRole().subscribe((response: any) => {
      this.deptSuspensionRecord.is_Deleted = true;
      this.deptSuspensionRecord.deleted_By = response[0].UserId;;
      })
    }
     else {
      this.deptSuspensionRecord.is_Suspended = false;
      this.deptSuspensionRecord.is_Released = true;
    }
    console.log(
      this.deptSuspensionRecord.is_Suspended,
      this.deptSuspensionRecord.is_Released
    );
  }
  getdeed(Version_ID) {
    this.deptSuspensionRecordService.getAllapi(Version_ID).subscribe(
      (deptSuspension) => {
        let a;
        a = deptSuspension;
        this.deptSuspensionRecordList = Object.assign(
          [],
          a.procDebt_Suspension_Records
        );
        console.log("this.deptSuspensionRecord", this.deptSuspensionRecordList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkRelease() {
    this.deptSuspensionRecord.is_Suspended = false;
    this.deptSuspensionRecord.is_Released = true;
  }

  checkSuspended() {
    this.deptSuspensionRecord.is_Suspended = true;
    this.deptSuspensionRecord.is_Released = false;
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
  save() {
    this.serviceService.getUserRole().subscribe(async (response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.deptSuspensionRecord.updated_By = response[0].UserId;
      this.deptSuspensionRecord.updated_Date = new Date();
      if (this.language == "amharic") {
        this.deptSuspensionRecord.letter_Ref_Date =
          await this.getEthiopianToGregorian(
            this.deptSuspensionRecord.letter_Ref_Date
          );
        this.deptSuspensionRecord.suspend_Start_Date =
          await this.getEthiopianToGregorian(
            this.deptSuspensionRecord.suspend_Start_Date
          );
      }
    this.deptSuspensionRecordService
      .saveapi(this.deptSuspensionRecord)
      .subscribe(
        (deptSuspension) => {
          console.log("deptSuspension", deptSuspension);
          const toast = this.notificationsService.success("Sucess");

          this.getdeed(this.deptSuspensionRecord.certificate_Version_No);
          this.deptForm = false;
          this.completed.emit();
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
    })
   // console.log("saveing....");
  }

  add() {
    this.deptSuspensionRecord.id=this.serviceService.LicenceserviceID 
    this.serviceService.getUserRole().subscribe((response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.deptSuspensionRecord.created_By = response[0].UserId;
      this.deptSuspensionRecord.created_Date = new Date();
    this.deptSuspensionRecordService
      .Addapi(this.deptSuspensionRecord)
      .subscribe(
        (deptSuspension) => {
          console.log("deptSuspension", deptSuspension);
          const toast = this.notificationsService.success("Sucess");

          this.getdeed(this.deptSuspensionRecord.certificate_Version_No);
          this.deptForm = false;
          this.completed.emit();
        },
        (error) => {
          console.log(error);
          if (error.status == "400") {
            const toast = this.notificationsService.error("Error", error.error);
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }
        }
      );
    })
   // console.log("saveing....");
  }
  getcustomer(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerlease(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;
    });
  }
  adddeed() {
    console.log("this.Selectedcert", this.Selectedcert);

    this.deptForm = true;
    this.deptSuspensionRecord = new DeptSuspensionRecord();
    this.deptSuspensionRecord.certificate_Version_No =
      this.Selectedcert.version_ID;
    this.deptSuspensionRecord.title_Deed_No = this.Selectedcert.title_Deed_No;

    this.deptSuspensionRecord.sDP_ID = this.licenceData.SDP_ID;

    // this.deptSuspensionRecord.Suspend_Start_Date = formatDate(
    //   new Date(),
    //   "MM/dd/yyyy",
    //   "en"
    // );
    // console.log(
    //   "🚀 ~ file: dept-suspension-record.component.ts:157 ~ DeptSuspensionRecordComponent ~ adddeed ~ this.deptSuspensionRecord.Suspend_Start_Date:",
    //   this.deptSuspensionRecord.Suspend_Start_Date
    // );
  }
  onOptionsSelected(e) {
    if (e == 2) {
      this.isBank = true;
      this.cdr.detectChanges();
    } else {
      this.isBank = false;
    }
  }

  selectdeed(dept) {
    console.log("deptdept", dept);

    this.deptSuspensionRecord = dept;
    console.log(
      "🚀 ~ DeptSuspensionRecordComponent ~ selectdeed ~ deptSuspensionRecord:",
      this.deptSuspensionRecord
    );
     if(this.deptSuspensionRecord.id == this.serviceService.Licence_Service_ID){
      this.isdeleted=true
     }else{
      this.isdeleted=false
     }
    if (this.deptSuspensionRecord.suspend_Start_Date != null) {
      this.deptSuspensionRecord.suspend_Start_Date =
        this.deptSuspensionRecord.suspend_Start_Date.split("T")[0];
    }
    if (this.deptSuspensionRecord.letter_Ref_Date != null) {
      this.deptSuspensionRecord.letter_Ref_Date =
        this.deptSuspensionRecord.letter_Ref_Date.split("T")[0];
    }
    if (this.deptSuspensionRecord.is_Suspended) {
      this.selectOption("suspended");
    }
    if (this.deptSuspensionRecord.is_Released) {
      this.selectOption("released");
    }

    this.serviceService
      .getcustomerbycusid(this.deptSuspensionRecord.suspended_By)
      .subscribe((res: any) => {
        this.customerdata = res.procCustomers;
        console.log(
          "🚀 ~ DeptSuspensionRecordComponent ~ .subscribe ~ res:",
          this.customerdata
        );
      });
    // this.getcustomer(this.deptSuspensionRecord.suspended_By);

    this.deptForm = true;
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(customer) {
    if (
      customer.customer_ID == '00000000-0000-0000-0000-000000000000' && this.isBank
    ) {
      const toast = this.notificationsService.warn(
        "warn",
        "you must enter existing customer with account . you must enter different customer "
      );
      return;
    }
      else{

        this.deptSuspensionRecord.suspended_By = customer.customer_ID;
        console.log("closeing.....");
        console.log("closeing.....", customer.customer_ID);
        // this.ngxSmartModalService.getModal(modal).close();
      }
  }
}

class DeptSuspensionRecord {
  public id: string;
  public certificate_Version_No: string;
  public suspended_By: string;
  public suspend_Start_Date: any;
  public suspend_End_Date: any;
  public suspend_Reason: string;
  public letter_Ref_No: string;
  public letter_Ref_Date: any;
  public remark: string;
  public is_Suspended: boolean;
  public is_Released: boolean;
  public debt_Suspend_Amount: any;
  public sDP_ID;
  public title_Deed_No; 
  public created_Date;
  public updated_Date ;
  public created_By ;
  public updated_By ;
  public deleted_By ;
  public is_Deleted ;
  public grade ;
}
