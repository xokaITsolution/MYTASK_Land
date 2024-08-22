import { Component, OnInit, Input, Output } from "@angular/core";
import { LeaserPaymentHead } from "../model/LeaserPaymentHead";
import { ActivatedRoute, Router } from "@angular/router";

import { NotificationsService } from "angular2-notifications";
import { MenuItem } from "primeng/api";
import { EventEmitter } from "@angular/core";
import { ServiceService } from "src/app/service/service.service";
import { LeaseContractService } from "../lease-contract.service";
import { Observable } from 'rxjs';


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
  merged: any;
  showmeged_plots: boolean;
  proposeList: any[];
  AVG_con_date: any;
  AVG_lease_Period_end_date: any;
  AVG_date_of_final_lease_payment: any;
  AVG_lease_period_in_Year: any;
  AVG_lease_Payment_Year: any;

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
      this.Application_No = p["AppNo"];
    });

    this.disable = this.ServiceService.disable;

    // Check the Service_ID and set edityear accordingly
    if (
      this._service.Service_ID === "86997006-53c7-4bbd-9f56-e79721b4561e" ||
      this._service.Service_ID === "05db54fc-e388-4e5e-aaaa-bd6141c8e533"
    ) {
      this.edityear = false;
    } else {
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
  //  Average_calculate(plot_id){

  //   this._service.get_View_lease_for_get_appby_plot_Id(plot_id).subscribe((data1:any) => {
  //     if (data1 && data1.length > 0) {
  //       // this._service.get_View_lease_for_get_appby_app_no(data[0].application_No).subscribe(async (data1: any) => {
  //         this.proposeList=data1;
  //         
  //         this.merged=true
  //         let AVG_lease_Payment_Year = 0,AVG_lease_period_in_Year = 0,totaldate_of_final_lease_paymentMilliseconds = 0,
  //          AVG_remaining_lease_payment=0
  //          let totalYearsLeaseEnd = 0, totalMonthsLeaseEnd = 0, totalDaysLeaseEnd = 0;
  //          let totalYearscon_date = 0, totalMonthscon_date = 0, totalDayscon_date = 0;
  //          let totalYearsFinalPayment = 0, totalMonthsFinalPayment = 0, totalDaysFinalPayment = 0;
  //         // let AVG_date_of_final_lease_payment,AVG_lease_Period_end_date,AVG_con_date;

  //         if (data1 && data1.length > 0) {
  //           // 
  //             for (let i = 0; i < data1.length; i++) {
  //                 AVG_lease_Payment_Year += data1[i].lease_Payment_Year;
  //                 AVG_lease_period_in_Year += data1[i].lease_period_in_Year;
  //                 AVG_remaining_lease_payment += data1[i].remaining_lease_payment
  //                 if (data1[i].date_of_final_lease_payment) {
  //                   const dateFinalPayment = new Date(data1[i].date_of_final_lease_payment.split("T")[0]);
  //                   totalYearsFinalPayment += dateFinalPayment.getFullYear();
  //                   totalMonthsFinalPayment += dateFinalPayment.getMonth() + 1; // Months are zero-based
  //                   totalDaysFinalPayment += dateFinalPayment.getDate();
  //                   // 
  //               }
  //                 // totaldate_of_final_lease_paymentMilliseconds += new Date(data1[i].date_of_final_lease_payment.split("T")[0]).getTime();
  //                 if (data1[i].lease_Period_end_date) {
  //                   const dateLeaseEnd = new Date(data1[i].lease_Period_end_date.split("T")[0]);
  //                   totalYearsLeaseEnd += dateLeaseEnd.getFullYear();
  //                   totalMonthsLeaseEnd += dateLeaseEnd.getMonth() + 1; // Months are zero-based
  //                   totalDaysLeaseEnd += dateLeaseEnd.getDate();
  //               }
  //               if (data1[i].contract_date) {
  //                 const datecon_date = new Date(data1[i].contract_date.split("T")[0]);
  //                 totalYearscon_date += datecon_date.getFullYear();
  //                 totalMonthscon_date += datecon_date.getMonth() + 1; // Months are zero-based
  //                 totalDayscon_date += datecon_date.getDate();
  //             }
  //                 // 
  //             }
  //             this.AVG_lease_Payment_Year /= data1.length;
  //             this.AVG_lease_period_in_Year /= data1.length;
  //             AVG_remaining_lease_payment /=data1.length
  //             this._service.AVG_remaining_lease_payment=AVG_remaining_lease_payment
  //             const avgYearFinalPayment = Math.floor(totalYearsFinalPayment / data1.length);
  //             const avgMonthFinalPayment = Math.floor(totalMonthsFinalPayment / data1.length);
  //             const avgDayFinalPayment = Math.floor(totalDaysFinalPayment / data1.length);
  //             this.AVG_date_of_final_lease_payment = `${avgYearFinalPayment}-${avgMonthFinalPayment.toString().padStart(2, '0')}-${avgDayFinalPayment.toString().padStart(2, '0')}`;
  //             // AVG_lease_Period_end_date=new Date(totallease_Period_end_date / data1.length);
  //             const avgYearLeaseEnd = Math.floor(totalYearsLeaseEnd / data1.length);
  //             const avgMonthLeaseEnd = Math.floor(totalMonthsLeaseEnd / data1.length);
  //             const avgDayLeaseEnd = Math.floor(totalDaysLeaseEnd / data1.length);
  //             this.AVG_lease_Period_end_date = `${avgYearLeaseEnd}-${avgMonthLeaseEnd.toString().padStart(2, '0')}-${avgDayLeaseEnd.toString().padStart(2, '0')}`;

  //             const avgYearcon_date = Math.floor(totalYearscon_date / data1.length);
  //             const avgMonthcon_date = Math.floor(totalMonthscon_date / data1.length);
  //             const avgDaycon_date = Math.floor(totalDayscon_date / data1.length);
  //             this.AVG_con_date = `${avgYearcon_date}-${avgMonthcon_date.toString().padStart(2, '0')}-${avgDaycon_date.toString().padStart(2, '0')}`;
  //     // 
  //         } else {
  //             console.warn("No data returned for the application number.");
  //         }
  //       // })
  //     } else {
  //       console.warn("No data returned for the Plot_Merge_1.");
  //   }
  //     })
  //  }

  get_arrays(plot_id: string): Observable<void> {
    return new Observable<void>((observer) => {
      this._service.get_View_lease_for_get_appby_plot_Id(plot_id).subscribe((data1: any) => {
        if (data1 && data1.length > 0) {
          
          this.proposeList = this.proposeList || [];
          this.proposeList = [...this.proposeList, ...data1];
          console.log("proposeList",this.proposeList);
          // Notify that the calculation is complete
          observer.next();
          observer.complete();
        } else {
          console.warn("No data returned for the plot.");
          observer.complete();  // Complete the observable even if no data is returned
        }
      });
    });
  }
  Average_calculate(): Observable<void> {
    return new Observable<void>((observer) => {
     
      
      let AVG_lease_Payment_Year = 0, AVG_lease_period_in_Year = 0,
        AVG_remaining_lease_payment = 0;
      let totalYearsLeaseEnd = 0, totalMonthsLeaseEnd = 0, totalDaysLeaseEnd = 0;
      let totalYearscon_date = 0, totalMonthscon_date = 0, totalDayscon_date = 0;
      let totalYearsFinalPayment = 0, totalMonthsFinalPayment = 0, totalDaysFinalPayment = 0;
      for (let i = 0; i < this.proposeList.length; i++) {
        const data1 = this.proposeList;
        
        AVG_lease_Payment_Year += data1[i].lease_Payment_Year;
        AVG_lease_period_in_Year += data1[i].lease_period_in_Year;
        AVG_remaining_lease_payment += data1[i].remaining_lease_payment;
        if (data1[i].date_of_final_lease_payment) {
          const dateFinalPayment = new Date(data1[i].date_of_final_lease_payment.split("T")[0]);
          totalYearsFinalPayment += dateFinalPayment.getFullYear();
          totalMonthsFinalPayment += dateFinalPayment.getMonth() + 1; // Months are zero-based
          totalDaysFinalPayment += dateFinalPayment.getDate();
        }
        if (data1[i].lease_Period_end_date) {
          const dateLeaseEnd = new Date(data1[i].lease_Period_end_date.split("T")[0]);
          totalYearsLeaseEnd += dateLeaseEnd.getFullYear();
          totalMonthsLeaseEnd += dateLeaseEnd.getMonth() + 1; // Months are zero-based
          totalDaysLeaseEnd += dateLeaseEnd.getDate();
        }
        if (data1[i].contract_date) {
          const datecon_date = new Date(data1[i].contract_date.split("T")[0]);
          totalYearscon_date += datecon_date.getFullYear();
          totalMonthscon_date += datecon_date.getMonth() + 1; // Months are zero-based
          totalDayscon_date += datecon_date.getDate();
        }
      }
      this.AVG_lease_Payment_Year = AVG_lease_Payment_Year/this.proposeList.length;
      this.AVG_lease_period_in_Year = AVG_lease_period_in_Year/this.proposeList.length;
      AVG_remaining_lease_payment /= this.proposeList.length;
      console.log("AVG_con_date", this.AVG_lease_Payment_Year, this.AVG_lease_period_in_Year,AVG_remaining_lease_payment);
      this._service.AVG_remaining_lease_payment = AVG_remaining_lease_payment;
      const avgYearFinalPayment = Math.floor(totalYearsFinalPayment / this.proposeList.length);
      const avgMonthFinalPayment = Math.floor(totalMonthsFinalPayment / this.proposeList.length);
      const avgDayFinalPayment = Math.floor(totalDaysFinalPayment / this.proposeList.length);
      this.AVG_date_of_final_lease_payment = `${avgYearFinalPayment}-${avgMonthFinalPayment.toString().padStart(2, '0')}-${avgDayFinalPayment.toString().padStart(2, '0')}`;

      const avgYearLeaseEnd = Math.floor(totalYearsLeaseEnd / this.proposeList.length);
      const avgMonthLeaseEnd = Math.floor(totalMonthsLeaseEnd / this.proposeList.length);
      const avgDayLeaseEnd = Math.floor(totalDaysLeaseEnd / this.proposeList.length);
      this.AVG_lease_Period_end_date = `${avgYearLeaseEnd}-${avgMonthLeaseEnd.toString().padStart(2, '0')}-${avgDayLeaseEnd.toString().padStart(2, '0')}`;

      const avgYearcon_date = Math.floor(totalYearscon_date / this.proposeList.length);
      const avgMonthcon_date = Math.floor(totalMonthscon_date / this.proposeList.length);
      const avgDaycon_date = Math.floor(totalDayscon_date / this.proposeList.length);
      this.AVG_con_date = `${avgYearcon_date}-${avgMonthcon_date.toString().padStart(2, '0')}-${avgDaycon_date.toString().padStart(2, '0')}`;

      observer.next();
      observer.complete();
    })
  }
  // Method to handle the API request
  makeLeaseCodeRequest(appNo: string) {
    this.Average_calculate().subscribe(() => {
      this._service.getDataBy_lease_code(appNo).subscribe((response) => {
        let data = response["proc_Lease_Payment_Heads"][0];
        
        // Assign values to leaserPaymentHead from response data
        this.leaserPaymentHead.Lease_period_in_Year = this.AVG_lease_period_in_Year;
        this.leaserPaymentHead.Lease_Payment_Year = this.AVG_lease_Payment_Year;
        this.leaserPaymentHead.Lease_code = data.lease_code;
        this.leaserPaymentHead.Application_No = data.application_No;
        this.leaserPaymentHead.Application_code = data.application_code;
        this.leaserPaymentHead.Todolis_ID = data.todolis_ID;
        this.leaserPaymentHead.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;
        this._service.Lease_Payment_grace_Period = data.lease_Payment_grace_Period;
        this.leaserPaymentHead.Total_lease_amount_to_be_paid = data.total_lease_amount_to_be_paid;
        this.leaserPaymentHead.Amount_of_the_annual_lease_payment = data.amount_of_the_annual_lease_payment;
        this.leaserPaymentHead.Is_old = data.is_old;
        this.leaserPaymentHead.Old_Lease_Amount = data.old_lease_amount;
        this.leaserPaymentHead.is_inter_free = data.is_inter_free;
        this._service.is_inter_free = this.leaserPaymentHead.is_inter_free;
        this._service.Is_old = this.leaserPaymentHead.Is_old;
        this._service.Old_Lease_Amount = this.leaserPaymentHead.Old_Lease_Amount;
        this.leaserPaymentHead.Date_of_final_lease_payment = this.AVG_date_of_final_lease_payment.split("T")[0];
        this.leaserPaymentHead.Lease_Period_end_date = this.AVG_lease_Period_end_date;
        this.leaserPaymentHead.Contract_date = this.AVG_con_date;
        this._service.contract_date = this.leaserPaymentHead.Contract_date;
        this.leaserPaymentHead.Remaining_lease_Payment = data.remaining_lease_payment;
        this.leaserPaymentHead.Customer_Type = data.customer_Type;
        this.leaserPaymentHead.Transfer_type = data.transfer_Type;
        this.leaserPaymentHead.Proporty_Use = data.proporty_Use;
        this.lease_period_prev = data.lease_Payment_Year + data.lease_Payment_grace_Period;
        this._service.Lease_Payment_Year = data.lease_Payment_Year;
        this.leaserPaymentHead.Is_Active = data.is_Active;
        this.leaserPaymentHead.Parent = data.parent;
        this.leaserPaymentHead.lease_payment_advance_per = data.lease_payment_advance_per;
        this._service.lease_payment_advance_per = data.lease_payment_advance_per;

        // Call functions that depend on fetched data
        this.getTransferType(this.leaserPaymentHead.Transfer_type);
        this.getProportyUse(this.leaserPaymentHead.Proporty_Use);
        this.getCustomerType(this.leaserPaymentHead.Customer_Type);
      });
    });
  }
  async getLeasPaymentHeadData(appNo: any) {
    // 
    if (this._service.Service_ID == "e9a61e6a-d580-4cfa-921d-36e751d87a05" || this._service.Service_ID == "8a8588ae-0267-48b7-88ac-f3f18ac02167") {
      this._service.get_View_cert_for_get_appby_plot_Id(this._service.ploteId).subscribe(data => {
        this._service.getDataById(data[0].application_No).subscribe(async data1 => {
          let data2 = data1["proc_Lease_Payment_Heads"][0];
          this._service.parent_lease_code = data2.lease_code
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
              this.leaserPaymentHead.Is_old = data.is_old
              this.leaserPaymentHead.Old_Lease_Amount = data.old_lease_amount
              this.leaserPaymentHead.is_inter_free = data.is_inter_free
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
    else if (this._service.Service_ID == "793b8814-f845-429e-a472-dc47e797d3fe") {
      this.merged = true
      this.disabledate=true
      if (this._service.licenceData.Plot_Merge_1) {
        this.get_arrays(this._service.licenceData.Plot_Merge_1).subscribe(() => {
          // Once Plot_Merge_1 calculation is done, check if Plot_Merge_2 exists
          if (this._service.licenceData.Plot_Merge_2) {
            this.get_arrays(this._service.licenceData.Plot_Merge_2).subscribe(() => {
              // Once Plot_Merge_2 calculation is done, check if Plot_Merge_3 exists
              if (this._service.licenceData.Plot_Merge_3) {
                this.get_arrays(this._service.licenceData.Plot_Merge_3).subscribe(() => {
                  // Once Plot_Merge_3 calculation is done, check if Plot_Merge_4 exists
                  if (this._service.licenceData.Plot_Merge_4) {
                    this.get_arrays(this._service.licenceData.Plot_Merge_4).subscribe(() => {
                      // Once Plot_Merge_4 calculation is done, make the Lease Code Request
                      this.makeLeaseCodeRequest(appNo);
                    });
                  } else {
                    this.makeLeaseCodeRequest(appNo);
                  }
                });
              } else {
                this.makeLeaseCodeRequest(appNo);
              }
            });
          } else {
            this.makeLeaseCodeRequest(appNo);
          }
        });
      } else {
        this.makeLeaseCodeRequest(appNo);
      }

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

            this.leaserPaymentHead.Is_old = data.is_old
            this.leaserPaymentHead.Old_Lease_Amount = data.old_lease_amount
            this.leaserPaymentHead.is_inter_free = data.is_inter_free
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

                    this.leaserPaymentHead.Is_old = data.is_old
                    this.leaserPaymentHead.Old_Lease_Amount = data.old_lease_amount
                    this._service.Is_old = this.leaserPaymentHead.Is_old;
                    this.leaserPaymentHead.is_inter_free = data.is_inter_free
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
  get_merged_plots() {
    this.showmeged_plots = true;
  }
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