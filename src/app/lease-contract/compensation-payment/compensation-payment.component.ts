import { Component, Input, OnInit } from '@angular/core';
import { LeaseContractService } from '../lease-contract.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from "src/app/service/service.service";

@Component({
  selector: 'app-compensation-payment',
  templateUrl: './compensation-payment.component.html',
  styleUrls: ['./compensation-payment.component.css']
})
export class CompensationPaymentComponent implements OnInit {
  @Input() licenceData:any
  newcomp_payment: comp_payment = {} as comp_payment;
  Application_No: any;
  constructor(  private notificationsService: NotificationsService,
    private _service: LeaseContractService,
    private ServiceService: ServiceService,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
    // this.activatedRoute.params.subscribe((p) => {
    //   console.log("Observable Params:", p);
    //   this.Application_No = p["AppNo"];
    // });
    debugger
this.get_leas_payment_head(this.licenceData.Application_No);
  }
  get_leas_payment_head(appNo){
    this.newcomp_payment.Plot_ID= this.licenceData.Parcel_ID
    this.newcomp_payment.is_cleaned=1;
  this._service.getDataById(appNo).subscribe(
    (response) => {
      debugger
      if (response["proc_Lease_Payment_Heads"].length > 0) {
        let data = response["proc_Lease_Payment_Heads"][0];
        // this.newcomp_payment. = data.lease_code;
        // this._service.lease_code = data.lease_code;
        // this.newcomp_payment.Application_No = data.application_No;
      }
      else {
        this.ServiceService.getPlotManagementApi(this.ServiceService.Parcel_ID).subscribe(
          async (res: any) => {
            let appno = res["procPlot_Registrations"][0].application_No
            this._service.getDataById(res["procPlot_Registrations"][0].application_No).subscribe(
              (response) => {
                let data = response.proc_Lease_Payment_Heads[0];
                // this.newcomp_payment.Lease_code = data.lease_code;
                // this._service.lease_code = data.lease_code;
                // this.newcomp_payment.Application_No = data.application_No;
             
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
export class comp_payment {
  public Plot_ID: string;
  public compensation_amount: any; // Changed to string assuming it's a formatted string
  public rehabitation: any | null;
  public is_cleaned: any | null;
}