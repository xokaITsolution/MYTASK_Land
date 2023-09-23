import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { ServiceService } from "../service.service";
import { ServiceComponent } from "../service.component";
import { environment } from "../../../environments/environment";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { DomSanitizer } from "@angular/platform-browser";
import { ViewEncapsulation } from "@angular/core";
import { Guid } from "guid-typescript";
import { EventEmitter as E } from "events";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Output() send = new EventEmitter();
  @Input() AppNo;
  @Input() tskID;
  @Input() todoid;
  @Input() disable;

  Amount;
  PaymentList;
  PaymentDetailList;
  PaymentDetail;
  SelectedPayment;
  aa;
  PaymentForm;
  totalPrice = 0;
  payedit = false;
  isnew = false;
  currpayment;
  PaymentProcessPath;
  Saved = false;
  Save = false;
  piid;
  payment: any;
  el = new E();

  constructor(
    private sanitizer: DomSanitizer,
    private serviceService: ServiceService,
    private serviceComponent: ServiceComponent,
    public notificationsService: NotificationsService,
    private ngxSmartModalService: NgxSmartModalService
  ) {
    console.log("guid", this.piid);
  }

  ngOnChanges() {
    console.log("disable", this.disable);
    this.getPaymentManagement();

    this.PaymentProcessPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.PaymentReportPath +
        "/?UserName=" +
        environment.username +
        "&ApplicatioNo=" +
        this.AppNo
    );
  }

  getPaymentManagement() {
    this.serviceService.getPayment(this.AppNo).subscribe(
      (PaymentList) => {
        this.PaymentList = PaymentList;
        this.PaymentList = Object.assign([], this.PaymentList.list);
        this.Amount = this.PaymentList[0].Amount;
        console.log("PaymentList", PaymentList);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  isNew: boolean = false;
  SelectPayment(Payment) {
    this.currpayment = Payment;
    this.serviceService.getPaymentDetail(Payment.PID).subscribe(
      (PaymentDetailList) => {
        this.PaymentDetailList = PaymentDetailList;
        this.PaymentDetailList = Object.assign([], this.PaymentDetailList.list);

        this.PaymentForm = true;

        for (let i = 0; i < this.PaymentDetailList.length; i++) {
          console.log(this.PaymentDetailList);
          if (this.PaymentDetailList[i].length > 0) {
            if (this.PaymentDetailList[i].Is_Paid) {
              this.totalPrice =
                this.totalPrice + this.PaymentDetailList[i].Price;
            }
          }
        }
      },
      (error) => {
        console.log("error");
      }
    );
    // Payment.Date_Paid = Payment.Date_Paid.split('T')[0];
  }

  // SaveBoth(payment, PaymentDetail){
  //  this.el.on('spd', data => {
  //    console.log(data);
  //    this.SaveePayment(payment)
  //   })
  //   AddnewPaymentDetail(PaymentDetail)
  // }

  // SavePayment(PaymentDetail) {

  // this.serviceService.savePaymentDetail(PaymentDetail).subscribe(message => {
  //     const toast = this.notificationsService.success('Sucess', message);
  //     this.getPaymentManagement();
  //     if(!this.Saved){
  //       this.completed.emit();
  //       this.Saved = true;
  //       this.el.emit('spd', 'done');
  //     }
  //   }, error => {
  //     console.log('error');
  //     const toast = this.notificationsService.error('Error', 'please edit or add before Save');
  //   });
  //   // Payment.Date_Paid = Payment.Date_Paid.split('T')[0];
  // }

  AddnewPaymentDetail(PaymentDetail) {
    console.log("PaymentDetail", PaymentDetail);
    this.serviceService.addPaymentDetail(PaymentDetail).subscribe(
      (message) => {
        const toast = this.notificationsService.success("Sucess", message);
        this.SelectPayment(this.currpayment);
        this.payedit = false;
        if (this.isNew && this.PaymentDetail.Is_Paid) {
          this.Amount = this.Amount + this.PaymentDetail.Price;
        }
        this.getPaymentManagement();
        this.SaveePaymentDetail(PaymentDetail);
        if (!this.Saved) {
          this.completed.emit();
          this.Saved = true;
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
    //Payment.Date_Paid = Payment.Date_Paid.split('T')[0];
  }
  SavePayment(Payment) {
    Payment.todoid = this.todoid;
    this.serviceService.savePayment(Payment).subscribe(
      (message) => {
        const toast = this.notificationsService.success("Sucess", message);

        if (!this.Saved) {
          this.completed.emit();
          this.Saved = true;
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
    // Payment.Date_Paid = Payment.Date_Paid.split('T')[0];
  }
  SavePaymentDetail(PaymentDetail) {
    this.serviceService.savePaymentDetail(PaymentDetail).subscribe(
      (message) => {
        const toast = this.notificationsService.success("Sucess", message);
        this.getPaymentManagement();
        if (!this.Saved) {
          this.completed.emit();
          this.Saved = true;
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
    // Payment.Date_Paid = Payment.Date_Paid.split('T')[0];
  }
  SaveePaymentDetail(PaymentDetail) {
    this.serviceService.savePaymentDetail(PaymentDetail).subscribe(
      (message) => {
        const toast = this.notificationsService;
        this.getPaymentManagement();
        if (!this.Saved) {
          this.completed.emit();
          this.Saved = true;
        }
      },
      (error) => {
        console.log("error");
        const toast = this.notificationsService;
      }
    );
    // Payment.Date_Paid = Payment.Date_Paid.split('T')[0];
  }
  SelectPaymentDetail(PaymentDetail) {
    this.PaymentDetail = PaymentDetail;
    this.payedit = true;
    this.isnew = false;
  }

  AddPaymentDetail() {
    this.piid = GnewGuid.newGuid();
    this.isNew = true;
    this.PaymentDetail = {};
    this.PaymentDetail.PID = this.currpayment.PID;
    this.PaymentDetail.Task_ID = this.tskID;
    this.PaymentDetail.PIDDID = this.piid;
    this.PaymentDetail.Price = this.PaymentDetail.Price;
    this.payedit = true;
    this.isnew = true;
  }

  EnableFins() {
    if (!this.Saved) {
      this.completed.emit();
      this.Saved = true;
    }
  }

  prossesPayment(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }
}
class GnewGuid {
  static newGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
