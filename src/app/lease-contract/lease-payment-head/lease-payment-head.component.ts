import { Component, OnInit, Input, Output } from "@angular/core";
import { LeaserPaymentHead } from "../model/LeaserPaymentHead";
import { ActivatedRoute, Router } from "@angular/router";

import { NotificationsService } from "angular2-notifications";
import { MenuItem } from "primeng/api";
import { EventEmitter } from "@angular/core";
import { LeaseContractService } from "../lease-contract.service";

@Component({
  selector: "app-lease-payment-head",
  templateUrl: "./lease-payment-head.component.html",
  styleUrls: ["./lease-payment-head.component.css"],
})
export class LeasePaymentHeadComponent implements OnInit {
  @Input() AppNo;

  @Output() functionCall = new EventEmitter();
  leaserPaymentHead: LeaserPaymentHead = new LeaserPaymentHead();
  Deed_Transfer_Lookup: any;
  Customer_Type_Lookup: any;
  Proprty_Use: any;
  Application_No:any;
  contractTypearray: any[];

  constructor(

    private notificationsService: NotificationsService,
    private _service: LeaseContractService,
    private activatedRoute: ActivatedRoute,
  ) {}

  personalInformation: any;

  submitted: boolean = false;
  nextPage2() {
    this.submitted = true;

  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((p) => {
      console.log("Observable Params:", p);
      // this.ServiceService.tiltledeed = p["AppNo"];
      this.Application_No = p["AppNo"];
    });
    // this.getAPPdata();
    this.getLeasPaymentHeadData(this.Application_No);
    this.get_contract_type();

  } 
  getTransferType(id: string) {
    this._service.getTransferType(id).subscribe(
      (response) => {
        let Transfer_type = response["procDeed_Transfer_Lookups"][0].type;
        this.Deed_Transfer_Lookup = response["procDeed_Transfer_Lookups"][0];
        this.leaserPaymentHead.Transfer_type = Transfer_type;
        
      },
      (error) => {
        this.notificationsService.error("Error", "error geting transfer type");
      }
    );
  }
  getProportyUse(id: string) {
    this._service.getPropertyUse(id).subscribe(
      (response) => {
        let Proporty_Use = response["proc_Proprty_Use"][0].name;
       this.Proprty_Use=response["proc_Proprty_Use"][0];
        this.leaserPaymentHead.Proporty_Use = Proporty_Use;
      },
      (error) => {
        this.notificationsService.error("Error", "error geting property use");
      }
    );
  }
  getCustomerType(id: string) {
    this._service.getCustomerType(id).subscribe(
      (response) => {
        let customer_Type =
          response["procCustomer_Type_Lookups"][0].customer_Type;
          this.Customer_Type_Lookup=response["procCustomer_Type_Lookups"][0]
        // alert(response["procCustomer_Type_Lookups"]);
        // console.log();
        this.leaserPaymentHead.Customer_Type = customer_Type;
      },
      (error) => {
        this.notificationsService.error("Error", "error geting customer Type");
      }
    );
  }
  format_date(date: any){
    const originalDate = new Date(date);

    // Extract components of the date
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(originalDate.getDate()).padStart(2, '0');
    const hours = String(originalDate.getHours()).padStart(2, '0');
    const minutes = String(originalDate.getMinutes()).padStart(2, '0');
    const seconds = String(originalDate.getSeconds()).padStart(2, '0');
    
    // Create a new Date object with the extracted components
    const formattedDate = `${year}-${month}-${day}`
    // 
    return formattedDate;
   
  }
  get_contract_type() {
    this._service.get_all().subscribe(
      (data) => {
        const contractTypearray1 = this.json2array(data);
        this.contractTypearray = contractTypearray1[0].proc_Lease_Contract_Types;
        console.log("contact_Type",this.contractTypearray);
      },
      (error) => {
        this.notificationsService.error('Error fetching contract types:', error);
      }
    );
  }
  json2array(json) {
    var result = [];
    result.push(json);

    return result;
  }
  getLeasPaymentHeadData(appNo: any) {
    debugger
    this._service.getDataById(appNo).subscribe(
      (response) => {
 
        let data = response.proc_Lease_Payment_Heads[0];
        this.leaserPaymentHead.Lease_code = data.lease_code;
        this._service.lease_code=data.lease_code;
        
        this.leaserPaymentHead.Application_No = data.application_No;
        this.leaserPaymentHead.Application_code = data.application_code;
        this.leaserPaymentHead.Todolis_ID = data.todolis_ID;
        this.leaserPaymentHead.Lease_Payment_grace_Period =data.lease_Payment_grace_Period;
          this._service.Lease_Payment_grace_Period =data.lease_Payment_grace_Period;
          
        this.leaserPaymentHead.Total_lease_amount_to_be_paid =
          data.total_lease_amount_to_be_paid;
        this.leaserPaymentHead.Amount_of_the_annual_lease_payment =
          data.amount_of_the_annual_lease_payment;
        this.leaserPaymentHead.Lease_period_in_Year = data.lease_period_in_Year;
        this.leaserPaymentHead.Date_of_final_lease_pyment =this.format_date(data.date_of_final_lease_payment)
          
        this.leaserPaymentHead.Remaining_lease_Payment =
          data.remaining_lease_payment;
        this.leaserPaymentHead.Customer_Type = data.customer_Type;
        this.leaserPaymentHead.Transfer_type = data.transfer_Type;
        this.leaserPaymentHead.Proporty_Use = data.proporty_Use;
        this.leaserPaymentHead.Lease_Period_end_date =this.format_date(data.lease_Period_end_date)
    //  
        this.leaserPaymentHead.Lease_Payment_Year = data.lease_Payment_Year;
        this._service.Lease_Payment_Year=data.lease_Payment_Year;
        this.leaserPaymentHead.Is_Active = data.is_Active;
        this.leaserPaymentHead.Parent = data.parent;
        this.getTransferType(this.leaserPaymentHead.Transfer_type);
        this.getProportyUse(this.leaserPaymentHead.Proporty_Use);
        this.getCustomerType(this.leaserPaymentHead.Customer_Type);
        this._service.lease_payment_advance_per=data.lease_payment_advance_per;
      },
      (error) => {
        this.notificationsService.error("Error", "error geting head data");
      }
    );
  }

  updateLeasPaymentHeadData() {
    
   this.leaserPaymentHead.Transfer_type=this.Deed_Transfer_Lookup.transfer_ID;
   this.leaserPaymentHead.Customer_Type=this.Customer_Type_Lookup.customer_Type_ID;
   this.leaserPaymentHead.Proporty_Use = this.Proprty_Use.code;

    this._service.updateData(this.leaserPaymentHead).subscribe(
      (response) => {
        // itHasError = false;
        this.notificationsService.success("Success", "Successfully Updated");
        this.leaserPaymentHead.Transfer_type=this.Deed_Transfer_Lookup.type;
        this.leaserPaymentHead.Customer_Type=this.Customer_Type_Lookup.customer_Type;
        this.leaserPaymentHead.Proporty_Use = this.Proprty_Use.name;
      },
      (error) => {
        this.notificationsService.error("Error", `error updating head!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        // itHasError = false;
      }
    );
  }

  nextPage() {
    this.functionCall.emit("a");
  }
}
