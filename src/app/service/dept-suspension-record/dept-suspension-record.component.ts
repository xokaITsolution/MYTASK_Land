import {
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

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private deptSuspensionRecordService: DeptSuspensionRecordService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private serviceService: ServiceService
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
      this.deptSuspensionRecord.Is_Suspended = true;
      this.deptSuspensionRecord.Is_Released = false;
    } else {
      this.deptSuspensionRecord.Is_Suspended = false;
      this.deptSuspensionRecord.Is_Released = true;
    }
    console.log(
      this.deptSuspensionRecord.Is_Suspended,
      this.deptSuspensionRecord.Is_Released
    );
  }
  getdeed(Version_ID) {
    this.deptSuspensionRecordService.getAll(Version_ID).subscribe(
      (deptSuspension) => {
        let a;
        a = deptSuspension;
        this.deptSuspensionRecordList = Object.assign([], a.list);
        console.log("this.deptSuspensionRecord", this.deptSuspensionRecordList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkRelease() {
    this.deptSuspensionRecord.Is_Suspended = false;
    this.deptSuspensionRecord.Is_Released = true;
  }

  checkSuspended() {
    this.deptSuspensionRecord.Is_Suspended = true;
    this.deptSuspensionRecord.Is_Released = false;
  }
  save() {
    this.deptSuspensionRecordService.save(this.deptSuspensionRecord).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );

        this.getdeed(this.deptSuspensionRecord.Certificate_Version_No);
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
    this.deptSuspensionRecordService.Add(this.deptSuspensionRecord).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );

        this.getdeed(this.deptSuspensionRecord.Certificate_Version_No);
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
  getcustomer(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerlease(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;
    });
  }
  adddeed() {
    this.deptForm = true;
    this.deptSuspensionRecord = new DeptSuspensionRecord();
    this.deptSuspensionRecord.Certificate_Version_No =
      this.Selectedcert.version_ID;

    this.deptSuspensionRecord.SDP_ID = this.licenceData.SDP_ID;
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

  selectdeed(dept) {
    console.log("deptdept", dept);

    this.deptSuspensionRecord = dept;
    if (this.deptSuspensionRecord.Suspend_Start_Date != null) {
      this.deptSuspensionRecord.Suspend_Start_Date =
        this.deptSuspensionRecord.Suspend_Start_Date.split("T")[0];
    }
    if (this.deptSuspensionRecord.Is_Suspended) {
      this.selectOption("suspended");
    }
    if (this.deptSuspensionRecord.Is_Released) {
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
    this.getcustomer(this.deptSuspensionRecord.Suspended_By);
    this.deptForm = true;
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(customer) {
    this.deptSuspensionRecord.Suspended_By = customer.customer_ID;
    console.log("closeing.....");
    console.log("closeing.....", customer.customer_ID);
    // this.ngxSmartModalService.getModal(modal).close();
  }
}

class DeptSuspensionRecord {
  public ID: string;
  public Certificate_Version_No: string;
  public Suspended_By: string;
  public Suspend_Start_Date: any;
  public Suspend_End_Date: any;
  public Suspend_Reason: string;
  public Letter_Ref_No: string;
  public Letter_Ref_Date: any;
  public Remark: string;
  public Is_Suspended: boolean;
  public Is_Released: boolean;
  public SDP_ID;
  public Title_Deed_No;
}
