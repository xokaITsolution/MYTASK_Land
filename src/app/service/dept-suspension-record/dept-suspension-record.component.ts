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
  }
  selectOption(e) {
    if (e == "suspended") {
      this.deptSuspensionRecord.is_Suspended = true;
      this.deptSuspensionRecord.is_Released = false;
    } else {
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
  save() {
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
    console.log("saveing....");
  }

  add() {
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
    console.log("saveing....");
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
    if (this.deptSuspensionRecord.suspend_Start_Date != null) {
      this.deptSuspensionRecord.suspend_Start_Date =
        this.deptSuspensionRecord.suspend_Start_Date.split("T")[0];
    }
    if (this.deptSuspensionRecord.is_Suspended) {
      this.selectOption("suspended");
    }
    if (this.deptSuspensionRecord.is_Released) {
      this.selectOption("released");
    }
    //  if(){
    //    this.deptSuspensionRecord.Letter_Ref_Date =
    //     this.deptSuspensionRecord.Letter_Ref_Date.split("T")[0];
    //   this.deptSuspensionRecord.Suspend_End_Date =
    //     this.deptSuspensionRecord.Suspend_End_Date.split("T")[0];
    //   this.deptSuspensionRecord.Suspend_Start_Date =
    //     this.deptSuspensionRecord.Suspend_Start_Date.split("T")[0];
    //  }
    this.getcustomer(this.deptSuspensionRecord.suspended_By);
    this.deptForm = true;
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(customer) {
    this.deptSuspensionRecord.suspended_By = customer.customer_ID;
    console.log("closeing.....");
    console.log("closeing.....", customer.customer_ID);
    // this.ngxSmartModalService.getModal(modal).close();
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
}
