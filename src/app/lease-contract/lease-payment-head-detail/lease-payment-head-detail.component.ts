import { Component, OnInit, Input, Output } from "@angular/core";
import { LeasePaymentHeadDetail } from "../model/LeasePaymentHeadDetail";
import { Router } from "@angular/router";
import { EventEmitter } from "@angular/core";
import { NotificationsService } from "angular2-notifications";
import { getDate } from "ngx-bootstrap/chronos/utils/date-getters";
import { LeaseContractService } from "../lease-contract.service";
import { ServiceService } from "src/app/service/service.service";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "src/environments/environment";


@Component({
  selector: "app-lease-payment-head-detail",
  templateUrl: "./lease-payment-head-detail.component.html",
  styleUrls: ["./lease-payment-head-detail.component.css"],
})
export class LeasePaymentHeadDetailComponent {
  // @Output() completed = new EventEmitter();
  leasePaymentHeadDetail: LeasePaymentHeadDetail = new LeasePaymentHeadDetail();
  @Input() AppNo;
  isNumberInserted: boolean = false;
  disablegen: boolean = true;
  previousInputValue1: number = 0;
  previousInputValue: number = 0;
  isCertifcatePrintforConfirmation: boolean;
  // Create a subject to track the input changes
  inputChange = new Subject<string>();
  ReportPath: any;
  enablepaymentreport: boolean;
  Enable: boolean;
  updated: boolean;
  disable: any;
  forcheck_0_payment: number;
  is_disabled: boolean;
  merged: any;
  constructor(
    private router: Router,
    private _service: LeaseContractService,
    private notificationsService: NotificationsService,
    private ServiceService: ServiceService,
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit(): void {
    this.disable = this.ServiceService.disable;
  }
  personalInformation: any;
  submitted: boolean = false;
  @Output() functionCall = new EventEmitter();
  PrvPage() {
    this.functionCall.emit("a");
  }
  checkIfNumberInserted(value: any) {
    // Parse the input value to a float
    let numericValue = parseFloat(value) || 0; // Default to 0 if parsing fails

    // Calculate the difference from the previous value
    let difference = numericValue - this.previousInputValue;

    // Check if the difference would result in a negative Plot_Size_By_Lease_Bid_Price
    if (this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price - difference < 0) {
      // Show a message to the user
      // alert("The value of Plot_size_By_Lease_Price cannot be greater than Plot_Size_By_Lease_Bid_Price");
      this.notificationsService.warn("warning", "The value of Plot size By Lease Price cannot be greater than Plot Size By Lease Bid Price");
      // Revert the value to the previous one
      this.leasePaymentHeadDetail.Plot_size_By_Lease_Price = this.previousInputValue;
      // Exit the method to prevent further processing
      return;
    }

    // If the difference is negative, the user has removed a digit
    if (difference < 0) {
      // Add the absolute value of the difference back to Plot_Size_By_Lease_Bid_Price
      this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price += Math.abs(difference);
      let Plot_Size_By_Lease_Price = numericValue;
      let lease_price = this.leasePaymentHeadDetail.Current_lease_Price * Plot_Size_By_Lease_Price;
      let bid_price = this.leasePaymentHeadDetail.Current_lease_bid_price * this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price
      const totalLeaseAmount = bid_price + lease_price;
      const roundedAmount = +totalLeaseAmount.toFixed(3);
      this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = roundedAmount;

      const Amount_of_down_payment = this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid * this._service.lease_payment_advance_per;
      const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
      this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1
      this.leasePaymentHeadDetail.Amount_of_down_payment_display = roundedAmount1.toLocaleString();

      this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid_display = roundedAmount.toLocaleString();

    } else {
      // Subtract the difference from Plot_Size_By_Lease_Bid_Price
      this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price -= difference;
      let Plot_Size_By_Lease_Price = numericValue;
      let lease_price = this.leasePaymentHeadDetail.Current_lease_Price * Plot_Size_By_Lease_Price;
      let bid_price = this.leasePaymentHeadDetail.Current_lease_bid_price * this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price
      const totalLeaseAmount = bid_price + lease_price;
      const roundedAmount = +totalLeaseAmount.toFixed(3);
      this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = roundedAmount;


      const Amount_of_down_payment = this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid * this._service.lease_payment_advance_per;
      const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
      this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1
      this.leasePaymentHeadDetail.Amount_of_down_payment_display = roundedAmount1.toLocaleString();

      this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid_display = roundedAmount.toLocaleString();

      // this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid= bid_price+lease_price
    }
    // Update the previousInputValue for the next change
    this.previousInputValue = numericValue;
  }

  checkIfNumberInserted1(value: any) {

    // Parse the input value to a float
    let numericValue = parseFloat(value) || 0; // Default to 0 if parsing fails
    this.forcheck_0_payment = numericValue;
    // Calculate the difference from the previous value
    let difference = numericValue - this.previousInputValue1;
    let added = this.leasePaymentHeadDetail.Amount_of_down_payment + difference;
    parseInt(added)
    parseInt(this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid)

    // Check if the difference would result in a negative Plot_Size_By_Lease_Bid_Price
    if (this._service.Service_ID != "86997006-53c7-4bbd-9f56-e79721b4561e" && this._service.Service_ID != "05db54fc-e388-4e5e-aaaa-bd6141c8e533") {
      debugger
      if (added > this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid) {
        // Show a message to the user
        // alert("The value of Plot_size_By_Lease_Price cannot be greater than Plot_Size_By_Lease_Bid_Price");
        this.notificationsService.warn("Warninig", "The value of Amount of down payment cannot be greater than Total lease amount to be paid");
        // Revert the value to the previous one
        // this.leasePaymentHeadDetail.Amount_of_down_payment = this.previousInputValue;
        // Exit the method to prevent further processing
        return;
      }
      else if (added == this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid) {
        this.disablegen = false;
        return;
      }
    }
    // If the difference is negative, the user has removed a digit
    if (difference < 0) {
      // Add the absolute value of the difference back to Plot_Size_By_Lease_Bid_Price
      this.leasePaymentHeadDetail.Amount_of_down_payment -= Math.abs(difference);

      const Amount_of_down_payment = this.leasePaymentHeadDetail.Amount_of_down_payment;
      const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
      this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1
      this.leasePaymentHeadDetail.Amount_of_down_payment_display = roundedAmount1.toLocaleString();

    } else {
      // Subtract the difference from Plot_Size_By_Lease_Bid_Price
      this.leasePaymentHeadDetail.Amount_of_down_payment += difference;

      const Amount_of_down_payment = this.leasePaymentHeadDetail.Amount_of_down_payment;
      const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
      this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1
      this.leasePaymentHeadDetail.Amount_of_down_payment_display = roundedAmount1.toLocaleString();

    }
    // Update the previousInputValue for the next change
    this.previousInputValue1 = numericValue;
  }

  updateleaserPaymentHeadDetail() {
    // debugger
    if (this.forcheck_0_payment == 0) {
      this.leasePaymentHeadDetail.Amount_of_down_payment = this.forcheck_0_payment;
    }
    this._service.updateleaserPaymentHeadDetail(this.leasePaymentHeadDetail).subscribe(
      (response) => {
        // itHasError = false;
        this.notificationsService.success("Success", "Successfully Updated");
        this.updated = true;
        this.getpayment_plan()
        this.getLeasPaymentHeadDataDetail()
        this._service.completed.emit();
      },
      (error) => {
        this.notificationsService.error("Error", "Something Went Wrong");
        // itHasError = false;
      }
    );
  }
  Generate_lease_plan() {
    // debugger
    this._service.Generate_lease_plan(this.leasePaymentHeadDetail.Lease_code,
      this.leasePaymentHeadDetail.PlotID,
      this._service.Lease_Payment_grace_Period,
      this._service.Lease_Payment_Year,
      this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid,
      this.leasePaymentHeadDetail.Amount_of_down_payment,
      this._service.contract_date,
      this._service.Service_ID,
      this.ServiceService.tskID,
    this._service.is_inter_free,
    this._service.Is_old,
  this._service.with_penality).subscribe(data => {

        this.Enable = false
        this.updated = true;
        this.enablepaymentreport = false
        this._service.completed.emit();
        this.ServiceService.disablefins = false;
        this.notificationsService.success("Success", "Lease plan Genereted successfully");
      },
        (error) => {
          this.notificationsService.error("Error", `unable to genetrate!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        }
      )
  }
  getpayment_plan() {
    this._service.get_payment_plan(this._service.lease_code).subscribe(data => {
      if (data["proc_Payment_Plans"].length > 0) {
        if (this.updated) {
          this.ServiceService.disablefins = false;
        }
        this.Enable = false
        this.enablepaymentreport = false
      }
      else {
        this.Enable = true
        this.enablepaymentreport = true
      }
      // 
    })
  }
  getLeasPaymentHeadDataDetail() {
    this.ReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.Lease_contract + 1 + "/" + this._service.lease_code
    );
    console.log("ReportPath", this.ReportPath);

    this.getpayment_plan();
    this.leasePaymentHeadDetail = new LeasePaymentHeadDetail();
    this.previousInputValue = 0
    debugger
    if (this._service.Service_ID == "e9a61e6a-d580-4cfa-921d-36e751d87a05" || this._service.Service_ID == "8a8588ae-0267-48b7-88ac-f3f18ac02167") {
      this._service.getDataByleasecode(this._service.parent_lease_code).subscribe(data => {
        debugger
        this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid=data["proc_Leas_Payment_Head_Details"][0].remaining_lease_payment;
        let plotsize_prev=data["proc_Leas_Payment_Head_Details"][0].total_Plot_Size
        let amount_of_one_care=this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid/plotsize_prev;
        this._service.getDataByleasecode(this._service.lease_code).subscribe(
          (response) => {
            debugger
            this.is_disabled=true;
            let data = response.proc_Leas_Payment_Head_Details[0];
            this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid=data.total_Plot_Size*amount_of_one_care;
            this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price = 0
              this.leasePaymentHeadDetail.Amount_of_down_payment = data.amount_of_down_payment;
            const totalLeaseAmount = this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid;
            const roundedAmount = +totalLeaseAmount.toFixed(3);
            this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = roundedAmount;
            this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid_display = roundedAmount.toLocaleString();
            if(this.leasePaymentHeadDetail.Amount_of_down_payment!=null){
            const Amount_of_down_payment = this.leasePaymentHeadDetail.Amount_of_down_payment;
            const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
            this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1
            this.leasePaymentHeadDetail.Amount_of_down_payment_display = roundedAmount1.toLocaleString();
            }
            this.leasePaymentHeadDetail.Lease_code = data.lease_code;
            this.leasePaymentHeadDetail.PlotID = data.plotID;
            this.leasePaymentHeadDetail.Total_Plot_Size = data.total_Plot_Size;
            this.leasePaymentHeadDetail.Current_lease_bid_price =
              data.current_lease_bid_price;

            this.leasePaymentHeadDetail.Current_lease_Price =
              data.current_lease_Price;
            this.leasePaymentHeadDetail.Plot_size_By_Lease_Price =
              data.plot_size_By_Lease_Price;
            this.leasePaymentHeadDetail.Remaining_lease_payment =
              data.remaining_lease_payment;
            this.leasePaymentHeadDetail.Updated_By_userid = data.updated_By_userid;
            this.leasePaymentHeadDetail.Updated_date = data.updated_date;
          },
          (error) => {
            this.notificationsService.error("Error", "Something Went Wrong");
          }
        );
      })
    }
    else if(this._service.Service_ID == "793b8814-f845-429e-a472-dc47e797d3fe"){
      this._service.getDataByleasecode(this._service.lease_code).subscribe(
        (response) => {
          this.is_disabled=true;
          let data = response.proc_Leas_Payment_Head_Details[0];
          this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price = data.total_Plot_Size

          this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = this._service.AVG_remaining_lease_payment
          const totalLeaseAmount = this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid;
          const roundedAmount = +totalLeaseAmount.toFixed(3);
          this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = roundedAmount;
          this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid_display = roundedAmount.toLocaleString();
          this.leasePaymentHeadDetail.Amount_of_down_payment = data.amount_of_down_payment;
          // // if(this.leasePaymentHeadDetail.Amount_of_down_payment!=0){
          // const Amount_of_down_payment = this.leasePaymentHeadDetail.Amount_of_down_payment;
          // const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
          // this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1
          // this.leasePaymentHeadDetail.Amount_of_down_payment_display = roundedAmount1.toLocaleString();
          // // }
          this.leasePaymentHeadDetail.Lease_code = data.lease_code;
          this.leasePaymentHeadDetail.PlotID = data.plotID;
          this.leasePaymentHeadDetail.Total_Plot_Size = data.total_Plot_Size;
          this.leasePaymentHeadDetail.Current_lease_bid_price =
            data.current_lease_bid_price;

          this.leasePaymentHeadDetail.Current_lease_Price =
            data.current_lease_Price;
          this.leasePaymentHeadDetail.Plot_size_By_Lease_Price =
            data.plot_size_By_Lease_Price;
          this.leasePaymentHeadDetail.Remaining_lease_payment =
            data.remaining_lease_payment;
          this.leasePaymentHeadDetail.Updated_By_userid = data.updated_By_userid;
          this.leasePaymentHeadDetail.Updated_date = data.updated_date;

          // this.leasePaymentHeadDetail.Time = data.Time;
        },
        (error) => {
          this.notificationsService.error("Error", "Something Went Wrong");
        }
      );
    }
    else {
      this._service.getDataByleasecode(this._service.lease_code).subscribe(
        (response) => {
          debugger
          let data = response.proc_Leas_Payment_Head_Details[0];
          this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price = data.total_Plot_Size
          if (data.plot_size_By_Lease_Price == 0 && data.plot_Size_By_Lease_Bid_Price == 0) {
            this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price = data.total_Plot_Size
            const bid_price = data.total_Plot_Size * data.current_lease_bid_price;
            const lease_prce = data.plot_size_By_Lease_Price * data.current_lease_Price;
            this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = bid_price + lease_prce;
            this.leasePaymentHeadDetail.Amount_of_down_payment =
              this._service.lease_payment_advance_per * this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid;
          }
          else {
            //  this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price = data.plot_Size_By_Lease_Bid_Price
            this.checkIfNumberInserted(data.plot_size_By_Lease_Price)
            this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = data.total_lease_amount_to_be_paid
            this.leasePaymentHeadDetail.Amount_of_down_payment = data.amount_of_down_payment;
          }
          // Setting display values
          if (this._service.Is_old) {
            this.is_disabled=true
            this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = this._service.Old_Lease_Amount
          }
          const totalLeaseAmount = this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid;
          const roundedAmount = +totalLeaseAmount.toFixed(3);
          this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = roundedAmount;
          this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid_display = roundedAmount.toLocaleString();
          // if(this.leasePaymentHeadDetail.Amount_of_down_payment!=0){
          const Amount_of_down_payment = this.leasePaymentHeadDetail.Amount_of_down_payment;
          const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
          this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1
          this.leasePaymentHeadDetail.Amount_of_down_payment_display = roundedAmount1.toLocaleString();
          // }
          this.leasePaymentHeadDetail.Lease_code = data.lease_code;
          this.leasePaymentHeadDetail.PlotID = data.plotID;
          this.leasePaymentHeadDetail.Total_Plot_Size = data.total_Plot_Size;
          this.leasePaymentHeadDetail.Current_lease_bid_price =
            data.current_lease_bid_price;

          this.leasePaymentHeadDetail.Current_lease_Price =
            data.current_lease_Price;
          this.leasePaymentHeadDetail.Plot_size_By_Lease_Price =
            data.plot_size_By_Lease_Price;
          this.leasePaymentHeadDetail.Remaining_lease_payment =
            data.remaining_lease_payment;
          this.leasePaymentHeadDetail.Updated_By_userid = data.updated_By_userid;
          this.leasePaymentHeadDetail.Updated_date = data.updated_date;

          // this.leasePaymentHeadDetail.Time = data.Time;
        },
        (error) => {
          this.notificationsService.error("Error", "Something Went Wrong");
        }
      );
    }
  }
}
