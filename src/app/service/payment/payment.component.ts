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
  yourQRCodeDataPayment: string;
  ismodaEnable: boolean = false;
  isMaximized: boolean;
  maxWidth: string = "1800px";
  identifiers = [
    "1b30e6d6-0ade-443e-be18-22de948bfd1e",
    "2145F90D-E911-42F2-9AD7-C2455A4D9DCD".toLocaleLowerCase(),
    "de4937d8-bdcd-46d6-8749-dc31c9f3adcf"
  ];
  iscasher: boolean;
  rolesToCheck = ['4728621A-4E75-4E81-8C92-012E9EF19A45', '4AA43499-05F3-49CC-86FD-D9D2A15F8328'];
  userRoles: UserRole[] = [];
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
   
    this.getPaymentManagement(this.AppNo);
    this.yourQRCodeDataPayment =
      environment.PaymentReportPath + "/" + this.AppNo;
    this.PaymentProcessPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.PaymentReportPath + "/" + this.AppNo
    );
    console.log(" this.PaymentProcessPath", this.PaymentProcessPath);
  }
  isInIdentifiers(taskId: string): boolean {
    return this.identifiers.includes(taskId);
  }
  getPaymentManagement(AppNo) {
    console.log("AAppNo", this.AppNo);
    if (this.isInIdentifiers(this.serviceService.Service_ID) ){
      this.serviceService.disablefins=false
    }
    this.serviceService.getPayment(this.AppNo).subscribe(
      (PaymentList) => {
        this.PaymentList = PaymentList;
        this.PaymentList = Object.assign([], this.PaymentList.list);
        if (this.PaymentList) {
          this.Amount = this.PaymentList[0].Amount;
        }
     
        console.log("PaymentList", PaymentList);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  isNew: boolean = false;
  SelectPayment(Payment) {
    this.completed.emit();
    this.currpayment = Payment;
    this.serviceService.getPaymentDetail(Payment.PID).subscribe(
      (PaymentDetailList) => {
        this.PaymentDetailList = PaymentDetailList;
        this.PaymentDetailList = Object.assign([], this.PaymentDetailList.list);
        this.completed.emit()
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
  openFullModal() {
    this.isMaximized = true;
    this.maxWidth = "2000px"; // Set the max width for full modal
  }

  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "1000px"; // Set the max width for mini modal
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
    PaymentDetail.Is_Paid=false
    console.log("PaymentDetail", PaymentDetail);
    
    this.serviceService.addPaymentDetail(PaymentDetail).subscribe(
      (message) => {
        const toast = this.notificationsService.success("Sucess", message);
        this.SelectPayment(this.currpayment);
        this.payedit = false;
        if (this.isNew && this.PaymentDetail.Is_Paid) {
          this.Amount = this.Amount + this.PaymentDetail.Price;
        }
        this.getPaymentManagement(this.AppNo);
        this.SaveePaymentDetail(PaymentDetail);
        if (!this.Saved) {
          this.completed.emit();
          this.serviceService.disablefins = false;
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
    this.serviceService.getUserRole().subscribe((response: UserRole[]) => {
      this.userRoles = response;

      const hasRequiredRoles = this.userRoles.some(userRole => 
        this.rolesToCheck.includes(userRole.RoleId.toUpperCase())
      );
      if (hasRequiredRoles) {
    if(PaymentDetail.Is_Paid==true){
     
      
      PaymentDetail.Updated_By= this.userRoles[0].UserId
  
    }
    this.serviceService.savePaymentDetail(PaymentDetail).subscribe(
      (message) => {
       
        const toast = this.notificationsService.success("Sucess", message);
        this.payedit = false;
        this.getPaymentManagement(this.AppNo)
        if (!this.Saved) {
          //this.completed.emit();
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
      
  }
    else {
      const toast = this.notificationsService.error(
        "Error",
        "you don't have cashier role"
      );
    }
  })
    // Payment.Date_Paid = Payment.Date_Paid.split('T')[0];
  }

  
  SaveePaymentDetail(PaymentDetail) {
    this.serviceService.savePaymentDetail(PaymentDetail).subscribe(
      (message) => {
        const toast = this.notificationsService;
        this.getPaymentManagement(this.AppNo);
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
  closeModal(modal) {
    this.ngxSmartModalService.getModal(modal).close();
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

interface UserRole {
  UserId: string;
  RoleId: string;
}