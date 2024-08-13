import { Component, OnInit, Input, Output } from "@angular/core";
import { LeaserPaymentHead } from "../model/LeaserPaymentHead";
import { ActivatedRoute, Router } from "@angular/router";

import { NotificationsService } from "angular2-notifications";
import { MenuItem } from "primeng/api";
import { EventEmitter } from "@angular/core";
import { ServiceService } from "src/app/service/service.service";
import { LeaseContractService } from "../lease-contract.service";

@Component({
  selector: "app-lease-payment-head",
  templateUrl: "./lease-payment-head.component.html",
  styleUrls: ["./lease-payment-head.component.css"],
})
export class LeasePaymentHeadComponent implements OnInit {
  @Input() AppNo;
  @Output() completed = new EventEmitter();
  @Output() functionCall = new EventEmitter();
  leaserPaymentHead: LeaserPaymentHead = new LeaserPaymentHead();
  Deed_Transfer_Lookup: any;
  Customer_Type_Lookup: any;
  Proprty_Use: any;
  Application_No: any;
  contractTypearray: any[];
  edityear: boolean = false;
  lease_period_prev: any;
  disable: any;
  contract_date_prev: any;
  disabledate: boolean = false;

  constructor(

    private notificationsService: NotificationsService,
    private _service: LeaseContractService,
    private ServiceService: ServiceService,
    private activatedRoute: ActivatedRoute,
  ) { }

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
    // this.getLeasPaymentHeadData(this.Application_No);
    this.disable = this.ServiceService.disable;

    if (this._service.Service_ID == "86997006-53c7-4bbd-9f56-e79721b4561e" || this._service.Service_ID == "05db54fc-e388-4e5e-aaaa-bd6141c8e533") {
      this.edityear = true;
    }

  }
  getTransferType(id: string) {
    this._service.getTransferType(id).subscribe(
      (response) => {

        this._service.transfer_ID = response["procDeed_Transfer_Lookups"][0].transfer_ID
        // if(response["procDeed_Transfer_Lookups"][0].transfer_ID=="2015" || response["procDeed_Transfer_Lookups"][0].transfer_ID=="2014"
        //  || response["procDeed_Transfer_Lookups"][0].transfer_ID=="2044"
        // ){
        //   this.edityear=true;
        // }
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
        this.Proprty_Use = response["proc_Proprty_Use"][0];
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
        this.Customer_Type_Lookup = response["procCustomer_Type_Lookups"][0]
        // alert(response["procCustomer_Type_Lookups"]);
        // console.log();
        this.leaserPaymentHead.Customer_Type = customer_Type;
      },
      (error) => {
        this.notificationsService.error("Error", "error geting customer Type");
      }
    );
  }
  format_date(date: any) {

    const originalDate = new Date(date);
    // de
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
  // get_contract_type() {
  //   this._service.get_all().subscribe(
  //     (data) => {
  //       const contractTypearray1 = this.json2array(data);
  //       this.contractTypearray = contractTypearray1[0].proc_Lease_Contract_Types;
  //       console.log("contact_Type",this.contractTypearray);
  //     },
  //     (error) => {
  //       this.notificationsService.error('Error fetching contract types:', error);
  //     }
  //   );
  // }
  json2array(json) {
    var result = [];
    result.push(json);

    return result;
  }

  async getLeasPaymentHeadData(appNo: any) {

    if (this._service.Service_ID == "e9a61e6a-d580-4cfa-921d-36e751d87a05" || this._service.Service_ID == "8a8588ae-0267-48b7-88ac-f3f18ac02167") {
      this._service.get_View_cert_for_get_appby_plot_Id(this._service.ploteId).subscribe(data => {
        this._service.getDataById(data[0].application_No).subscribe(async data1 => {
          let data2 = data1["proc_Lease_Payment_Heads"][0];

          this._service.parent_lease_code=data2.lease_code
          var datenow = await this.ServiceService
            .getgregorianToEthiopianDate(new Date().toISOString().split('T')[0])
            .toPromise();

          this.disabledate = true;

          console.log('Ethiopian Date:', datenow);
          const [day, month, year] = datenow.nowTime.split('/');
          const isoDate = `${year}-${month}-${day}`;
          const ethiopianDateObj = new Date(isoDate);
          const contractDateObj = new Date(data2.contract_date);
          const contractYear = contractDateObj.getFullYear();
          const currentyear = ethiopianDateObj.getFullYear();
          const difference = currentyear - contractYear;
          // Check if the contract date has passed
          if (ethiopianDateObj > contractDateObj) {
            console.log('The contract date has passed.');
          } else {
            console.log('The contract date has not passed.');
          }
          this._service.getDataBy_lease_code(appNo).subscribe(
            (response) => {
              let data = response["proc_Lease_Payment_Heads"][0];
              
              if (data2.lease_Payment_Year != data.lease_Payment_Year) {

                this.leaserPaymentHead.Lease_period_in_Year = data.lease_period_in_Year - difference;
                this.leaserPaymentHead.Lease_Payment_Year = data.lease_Payment_Year - difference;

              }
              else {

                this.leaserPaymentHead.Lease_period_in_Year = data.lease_period_in_Year;
                this.leaserPaymentHead.Lease_Payment_Year = data.lease_Payment_Year;

              }
              this.leaserPaymentHead.Lease_code = data.lease_code;
              this.leaserPaymentHead.Application_No = data.application_No;
              this.leaserPaymentHead.Application_code = data.application_code;
              this.leaserPaymentHead.Todolis_ID = data.todolis_ID;
              this.leaserPaymentHead.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;
              this._service.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;
              this.leaserPaymentHead.Total_lease_amount_to_be_paid =
                data.total_lease_amount_to_be_paid;
              this.leaserPaymentHead.Amount_of_the_annual_lease_payment =
                data.amount_of_the_annual_lease_payment;
              this._service.contract_date = this.leaserPaymentHead.Contract_date
              this.leaserPaymentHead.Is_old=data.is_old
              this.leaserPaymentHead.Old_Lease_Amount=data.old_lease_amount
              this.leaserPaymentHead.is_inter_free=data.is_inter_free
              this._service.is_inter_free = this.leaserPaymentHead.is_inter_free;
              this._service.Is_old = this.leaserPaymentHead.Is_old;
              this._service.Old_Lease_Amount = this.leaserPaymentHead.Old_Lease_Amount;
              this.leaserPaymentHead.Date_of_final_lease_payment = data2.date_of_final_lease_payment.split("T")[0]
              this.leaserPaymentHead.Lease_Period_end_date = data2.lease_Period_end_date.split("T")[0];
              this.leaserPaymentHead.Contract_date = data2.contract_date.split("T")[0];
              this.contract_date_prev = data2.contract_date.split("T")[0];
              this._service.contract_date = this.leaserPaymentHead.Contract_date

              this.leaserPaymentHead.Remaining_lease_Payment =
                data.remaining_lease_payment;
              this.leaserPaymentHead.Customer_Type = data.customer_Type;
              this.leaserPaymentHead.Transfer_type = data.transfer_Type;
              this.leaserPaymentHead.Proporty_Use = data.proporty_Use;

              this.lease_period_prev = data.lease_Payment_Year + data.lease_Payment_grace_Period;
              this._service.Lease_Payment_Year = data.lease_Payment_Year;
              // this.lease_period_prev = data.lease_Payment_Year;
              this.leaserPaymentHead.Is_Active = data.is_Active;
              this.leaserPaymentHead.Parent = data.parent;
              this.leaserPaymentHead.lease_payment_advance_per = data.lease_payment_advance_per;
              this._service.lease_payment_advance_per = data.lease_payment_advance_per;
              this.getTransferType(this.leaserPaymentHead.Transfer_type);
              this.getProportyUse(this.leaserPaymentHead.Proporty_Use);
              this.getCustomerType(this.leaserPaymentHead.Customer_Type);
              this.leaserPaymentHead.Contract_date = data2.contract_date.split("T")[0];
            
            })

        })
      })
    }
    else {
      this._service.getDataBy_lease_code(appNo).subscribe(
        (response) => {
          if (response["proc_Lease_Payment_Heads"].length > 0) {
            let data = response["proc_Lease_Payment_Heads"][0];
            this.leaserPaymentHead.Lease_code = data.lease_code;
            this._service.lease_code = data.lease_code;
            this.leaserPaymentHead.Application_No = data.application_No;
            this.leaserPaymentHead.Application_code = data.application_code;
            this.leaserPaymentHead.Todolis_ID = data.todolis_ID;
            this.leaserPaymentHead.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;
            this._service.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;
            this.leaserPaymentHead.Total_lease_amount_to_be_paid =
              data.total_lease_amount_to_be_paid;
            this.leaserPaymentHead.Amount_of_the_annual_lease_payment =
              data.amount_of_the_annual_lease_payment;
              
              this.leaserPaymentHead.Is_old=data.is_old
              this.leaserPaymentHead.Old_Lease_Amount=data.old_lease_amount
              this.leaserPaymentHead.is_inter_free=data.is_inter_free
              this._service.is_inter_free = this.leaserPaymentHead.is_inter_free;
              this._service.Is_old = this.leaserPaymentHead.Is_old;
              this._service.Old_Lease_Amount = this.leaserPaymentHead.Old_Lease_Amount;
            this.leaserPaymentHead.Lease_period_in_Year = data.lease_period_in_Year;
            if (data.date_of_final_lease_payment != null) {
              this.leaserPaymentHead.Date_of_final_lease_payment = data.date_of_final_lease_payment.split("T")[0]
              this.leaserPaymentHead.Lease_Period_end_date = data.lease_Period_end_date.split("T")[0];
              this.leaserPaymentHead.Contract_date = data.contract_date.split("T")[0];
              this.contract_date_prev = data.contract_date.split("T")[0];
              this._service.contract_date = this.leaserPaymentHead.Contract_date
            }
            else {
              this.leaserPaymentHead.Date_of_final_lease_payment = data.date_of_final_lease_payment;
              this.leaserPaymentHead.Lease_Period_end_date = data.lease_Period_end_date;
              this.leaserPaymentHead.Contract_date = null;
              // this.leaserPaymentHead.Contract_date=data.contract_date;
            }
            // this.leaserPaymentHead.Date_of_final_lease_pyment =this.format_date(data.date_of_final_lease_payment)
            this.leaserPaymentHead.Remaining_lease_Payment =
              data.remaining_lease_payment;
            this.leaserPaymentHead.Customer_Type = data.customer_Type;
            this.leaserPaymentHead.Transfer_type = data.transfer_Type;
            this.leaserPaymentHead.Proporty_Use = data.proporty_Use;


            // this.leaserPaymentHead.Lease_Period_end_date =this.format_date(data.lease_Period_end_date)
            this.leaserPaymentHead.Lease_Payment_Year = data.lease_Payment_Year;
            this.lease_period_prev = data.lease_Payment_Year + data.lease_Payment_grace_Period;
            this._service.Lease_Payment_Year = data.lease_Payment_Year;
            // this.lease_period_prev = data.lease_Payment_Year;
            this.leaserPaymentHead.Is_Active = data.is_Active;
            this.leaserPaymentHead.Parent = data.parent;
            this.leaserPaymentHead.lease_payment_advance_per = data.lease_payment_advance_per;
            this._service.lease_payment_advance_per = data.lease_payment_advance_per;
            this.getTransferType(this.leaserPaymentHead.Transfer_type);
            this.getProportyUse(this.leaserPaymentHead.Proporty_Use);
            this.getCustomerType(this.leaserPaymentHead.Customer_Type);
            this.leaserPaymentHead.Contract_date = data.contract_date.split("T")[0];
          }
          else {
            this.ServiceService.getPlotManagementApi(this.ServiceService.Parcel_ID).subscribe(
              async (res: any) => {


                let appno = res["procPlot_Registrations"][0].application_No
                this._service.getDataById(res["procPlot_Registrations"][0].application_No).subscribe(
                  (response) => {
                    let data = response.proc_Lease_Payment_Heads[0];
                    this.leaserPaymentHead.Lease_code = data.lease_code;
                    this._service.lease_code = data.lease_code;
                    this.leaserPaymentHead.Application_No = data.application_No;
                    this.leaserPaymentHead.Application_code = data.application_code;
                    this.leaserPaymentHead.Todolis_ID = data.todolis_ID;
                    this.leaserPaymentHead.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;
                    this._service.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;

                    this.leaserPaymentHead.Total_lease_amount_to_be_paid =
                      data.total_lease_amount_to_be_paid;
                    this.leaserPaymentHead.Amount_of_the_annual_lease_payment =
                      data.amount_of_the_annual_lease_payment;
                      
                      this.leaserPaymentHead.Is_old=data.is_old
                      this.leaserPaymentHead.Old_Lease_Amount=data.old_lease_amount
                      this._service.Is_old = this.leaserPaymentHead.Is_old;
                      this.leaserPaymentHead.is_inter_free=data.is_inter_free
                      this._service.is_inter_free = this.leaserPaymentHead.is_inter_free;
                      this._service.Old_Lease_Amount = this.leaserPaymentHead.Old_Lease_Amount;
                    this.leaserPaymentHead.Lease_period_in_Year = data.lease_period_in_Year;
                    // this.leaserPaymentHead.Date_of_final_lease_payment = data.date_of_final_lease_payment.split("T")[0]

                    if (data.date_of_final_lease_payment != null) {
                      this.leaserPaymentHead.Date_of_final_lease_payment = data.date_of_final_lease_payment.split("T")[0]
                      this.leaserPaymentHead.Lease_Period_end_date = data.lease_Period_end_date.split("T")[0];
                      this.leaserPaymentHead.Contract_date = data.contract_date.split("T")[0];
                      this.contract_date_prev = data.contract_date.split("T")[0];
                      this._service.contract_date = this.leaserPaymentHead.Contract_date
                    }
                    else {
                      this.leaserPaymentHead.Date_of_final_lease_payment = data.date_of_final_lease_payment;
                      this.leaserPaymentHead.Lease_Period_end_date = data.lease_Period_end_date;
                      this.leaserPaymentHead.Contract_date = null;
                      // this.leaserPaymentHead.Contract_date=data.contract_date;
                    }
                    // this.leaserPaymentHead.Date_of_final_lease_pyment =this.format_date(data.date_of_final_lease_payment)

                    this.leaserPaymentHead.Remaining_lease_Payment =
                      data.remaining_lease_payment;
                    this.leaserPaymentHead.Customer_Type = data.customer_Type;
                    this.leaserPaymentHead.Transfer_type = data.transfer_Type;
                    this.leaserPaymentHead.Proporty_Use = data.proporty_Use;
                    // this.leaserPaymentHead.Lease_Period_end_date = data.lease_Period_end_date.split("T")[0];
                    // this.leaserPaymentHead.Lease_Period_end_date =this.format_date(data.lease_Period_end_date)
                    // 
                    this.leaserPaymentHead.Lease_Payment_Year = data.lease_Payment_Year;
                    this.lease_period_prev = data.lease_Payment_Year + data.lease_Payment_grace_Period;
                    this._service.Lease_Payment_Year = data.lease_Payment_Year;
                    this.leaserPaymentHead.Is_Active = data.is_Active;
                    this.leaserPaymentHead.Parent = data.parent;
                    this.leaserPaymentHead.lease_payment_advance_per = data.lease_payment_advance_per;
                    this._service.lease_payment_advance_per = data.lease_payment_advance_per;
                    this.getTransferType(this.leaserPaymentHead.Transfer_type);
                    this.getProportyUse(this.leaserPaymentHead.Proporty_Use);
                    this.getCustomerType(this.leaserPaymentHead.Customer_Type);


                  })
              })
          }

        },
        (error) => {
          this.notificationsService.error("Error", "error geting head data");
        }
      );
    }
  }
  // async getgregorianToEthiopianDate(date) {
  //   if (date != "0001-01-01T00:00:00") {
  //     var datenow = await this.ServiceService
  //       .getgregorianToEthiopianDate(date)
  //       .toPromise();
  //     console.log('Ethiopian Date:',datenow);
  //     const [day, month, year] = datenow.nowTime.split('/');
  //     const isoDate = `${year}-${month}-${day}`;
  //     return isoDate;
  //     // 
  //     // return datenow.nowTime;
  //   }
  // }
  async updateLeasPaymentHeadData() {

    if (this.leaserPaymentHead.Date_of_final_lease_payment == null || this.leaserPaymentHead.Lease_Period_end_date == null) {
      var datenow = await this.ServiceService
        .getgregorianToEthiopianDate(new Date().toISOString().split('T')[0])
        .toPromise();

      console.log('Ethiopian Date:', datenow);
      const [day, month, year] = datenow.nowTime.split('/');
      const isoDate = `${year}-${month}-${day}`;
      const contractDateObj = new Date(this.leaserPaymentHead.Contract_date);
      const ethiopianDateObj = new Date(isoDate);
      const contractYear = contractDateObj.getFullYear();
      const ethiopianYear = ethiopianDateObj.getFullYear();
      const yearDifference = ethiopianYear - contractYear;
      // Create a copy of the contract date for Date_of_final_lease_payment
      const Date_of_final_lease_payment = new Date(contractDateObj);
      // Create a copy of the contract date for Lease_Period_end_date
      const Lease_Period_end_date = new Date(contractDateObj);

      // Adjust Date_of_final_lease_payment by adding lease_period_prev
      Date_of_final_lease_payment.setFullYear(Date_of_final_lease_payment.getFullYear() + this.lease_period_prev);
      this.leaserPaymentHead.Date_of_final_lease_payment = Date_of_final_lease_payment;
      // Adjust Lease_Period_end_date by adding Lease_period_in_Year
      Lease_Period_end_date.setFullYear(Lease_Period_end_date.getFullYear() + this.leaserPaymentHead.Lease_period_in_Year);
      this.leaserPaymentHead.Lease_Period_end_date = Lease_Period_end_date;
      // Update Lease_period_in_Year
      this.leaserPaymentHead.Lease_period_in_Year = this.leaserPaymentHead.Lease_period_in_Year - yearDifference;
    }

    else if (this.contract_date_prev != this.leaserPaymentHead.Contract_date) {

      const contractDateObj = new Date(this.leaserPaymentHead.Contract_date);
      const ethiopianDateObj = new Date(this.contract_date_prev);
      const Lease_Period_end = new Date(this.leaserPaymentHead.Lease_Period_end_date);

      const contractYear = contractDateObj.getFullYear();
      const ethiopianYear = ethiopianDateObj.getFullYear();
      const yearDifference = ethiopianYear - contractYear;

      // Create a copy of the contract date for Date_of_final_lease_payment
      const Date_of_final_lease_payment = new Date(contractDateObj);
      const Lease_Period = new Date(contractDateObj);
      // Create a copy of the contract date for Lease_Period_end_date
      const Lease_Period_end_date = new Date(Lease_Period_end);

      // Adjust Date_of_final_lease_payment by adding lease_period_prev
      Date_of_final_lease_payment.setFullYear(Date_of_final_lease_payment.getFullYear() + this.lease_period_prev);
      this.leaserPaymentHead.Date_of_final_lease_payment = Date_of_final_lease_payment;

      // Adjust Lease_Period_end_date by adding Lease_period_in_Year
      const year = Lease_Period_end_date.getFullYear() - (yearDifference);
      Lease_Period.setFullYear(year);

      this.leaserPaymentHead.Lease_Period_end_date = Lease_Period;
      // Update Lease_period_in_Year
      this.leaserPaymentHead.Lease_period_in_Year = this.leaserPaymentHead.Lease_period_in_Year - yearDifference;
    }
    
    this._service.contract_date = this.leaserPaymentHead.Contract_date
    this._service.Is_old = this.leaserPaymentHead.Is_old;
    this._service.is_inter_free = this.leaserPaymentHead.is_inter_free;
    this._service.Old_Lease_Amount = this.leaserPaymentHead.Old_Lease_Amount;
    this._service.Lease_Payment_Year = this.leaserPaymentHead.Lease_Payment_Year;
    this.leaserPaymentHead.Transfer_type = this.Deed_Transfer_Lookup.transfer_ID;
    this.leaserPaymentHead.Customer_Type = this.Customer_Type_Lookup.customer_Type_ID;
    this.leaserPaymentHead.Proporty_Use = this.Proprty_Use.code;

    this._service.updateData(this.leaserPaymentHead).subscribe(
      (response) => {
        this.notificationsService.success("Success", "Successfully Updated");
        this.completed.emit();
        this._service.updated = true;
        this.getLeasPaymentHeadData(this.leaserPaymentHead.Lease_code);
        this.leaserPaymentHead.Transfer_type = this.Deed_Transfer_Lookup.type;
        this.leaserPaymentHead.Customer_Type = this.Customer_Type_Lookup.customer_Type;
        this.leaserPaymentHead.Proporty_Use = this.Proprty_Use.name;
      },
      (error) => {
        this.notificationsService.error("Error", `error updating head!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
      }
    );
  }

  nextPage() {
    this.functionCall.emit("a");
  }
}