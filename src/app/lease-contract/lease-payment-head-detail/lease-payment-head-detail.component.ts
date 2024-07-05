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


@Component({
  selector: "app-lease-payment-head-detail",
  templateUrl: "./lease-payment-head-detail.component.html",
  styleUrls: ["./lease-payment-head-detail.component.css"],
})
export class LeasePaymentHeadDetailComponent {
  @Output() completed = new EventEmitter();
  leasePaymentHeadDetail: LeasePaymentHeadDetail = new LeasePaymentHeadDetail();
  @Input() AppNo;
  isNumberInserted: boolean = false;
  disablegen: boolean = true;
  previousInputValue: number = 0;
  // Create a subject to track the input changes
  inputChange = new Subject<string>();
  constructor(
    private router: Router,
    private _service: LeaseContractService,
    private notificationsService: NotificationsService,
    private ServiceService: ServiceService,

  ) {

  }


  Enable = true;

  ngOnInit(): void {

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
    } else {
      // If the difference is positive, the user has added a digit
      // Subtract the difference from Plot_Size_By_Lease_Bid_Price
      this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price -= difference;
    }
    // Update the previousInputValue for the next change
    this.previousInputValue = numericValue;
  }

  checkIfNumberInserted1(value: any) {
    // Parse the input value to a float
    let numericValue = parseFloat(value) || 0; // Default to 0 if parsing fails
   debugger
    // Calculate the difference from the previous value
    let difference = numericValue - this.previousInputValue;
    let added = this.leasePaymentHeadDetail.Amount_of_down_payment + difference;
    parseInt(added)
    parseInt(this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid)
    // Check if the difference would result in a negative Plot_Size_By_Lease_Bid_Price
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
    // If the difference is negative, the user has removed a digit
    if (difference < 0) {
      // Add the absolute value of the difference back to Plot_Size_By_Lease_Bid_Price
      this.leasePaymentHeadDetail.Amount_of_down_payment -= Math.abs(difference);
    } else {
      // If the difference is positive, the user has added a digit
      // Subtract the difference from Plot_Size_By_Lease_Bid_Price
      this.leasePaymentHeadDetail.Amount_of_down_payment += difference;
    }
    // Update the previousInputValue for the next change
    this.previousInputValue = numericValue;
  }

  updateleaserPaymentHeadDetail() {

    this._service.updateleaserPaymentHeadDetail(this.leasePaymentHeadDetail).subscribe(
      (response) => {
        // 
        // itHasError = false;
        this.notificationsService.success("Success", "Successfully Updated");
        this.ServiceService.disablefins = false;
        this.completed.emit();
      },
      (error) => {
        this.notificationsService.error("Error", "Something Went Wrong");
        // itHasError = false;
      }
    );
  }
  Generate_lease_plan() {
    debugger
    this._service.Generate_lease_plan(this.leasePaymentHeadDetail.Lease_code,
      this.leasePaymentHeadDetail.PlotID,
      this._service.Lease_Payment_grace_Period,
      this._service.Lease_Payment_Year,
      this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid).subscribe(data => {
        debugger
        this.Enable = false;
        this.notificationsService.success("Success", "Lease plan Genereted successfully");
      },
        (error) => {
          this.notificationsService.error("Error", `unable to genetrate!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        }
      )
  }
  getLeasPaymentHeadDataDetail() {
    this._service.getDataByleasecode(this._service.lease_code).subscribe(
      (response) => {
        
        let data = response.proc_Leas_Payment_Head_Details[0];
        this.leasePaymentHeadDetail.Plot_Size_By_Lease_Bid_Price = data.total_Plot_Size
        const bid_price = data.total_Plot_Size * data.current_lease_Price;
        const lease_prce = data.plot_size_By_Lease_Price * data.current_lease_Price;
        this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = bid_price + lease_prce;
         
        const totalLeaseAmount = this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid;
        const roundedAmount = +totalLeaseAmount.toFixed(3);
        this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = roundedAmount;
        this.leasePaymentHeadDetail.Amount_of_down_payment =
          this._service.lease_payment_advance_per * this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid;
          this.leasePaymentHeadDetail.Total_lease_amount_to_be_paid = roundedAmount.toLocaleString();
        const Amount_of_down_payment = this.leasePaymentHeadDetail.Amount_of_down_payment;
        const roundedAmount1 = +Amount_of_down_payment.toFixed(3);
        
        this.leasePaymentHeadDetail.Amount_of_down_payment = roundedAmount1.toLocaleString();
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
