import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() completed = new EventEmitter();
  newcomp_payment: comp_payment = {} as comp_payment;
  Application_No: any;
  compensationList: any[]=[];
  show: boolean=false;
  enable: boolean;
  total_lease_amount_to_be_paid: any;
  constructor(  private notificationsService: NotificationsService,
    private _service: LeaseContractService,
    private ServiceService: ServiceService,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {

this.get_leas_payment_head(this.licenceData.Parcel_ID);

  }
  selected(lease_contract){
    this.show=true;
    
    this.newcomp_payment=lease_contract
    // this.newcomp_payment.plot_ID=lease_contract.plot_ID  
    // this.compensationList=lease_contract
  }
  get_leas_payment_head(appNo){
   
  this._service.get_compensationBy_plot_Id(appNo).subscribe(
    (response) => {
      // 
      if (response["proc_compensation_payments"].length > 0) {
        let data = response["proc_compensation_payments"];
        this.compensationList=data
        this.enable=true;
        this._service.get_lease_payment_head_plot(appNo).subscribe(res=>{
          
          let data = res["proc_Leas_Payment_Head_Details"][0];
          // this.newcomp_payment.rehabitation=data.total_lease_amount_to_be_paid*0.3
          this.total_lease_amount_to_be_paid=data.total_lease_amount_to_be_paid
        })
        // this.newcomp_payment = data.lease_code;
        // this._service.lease_code = data.lease_code;
        // this.newcomp_payment.Application_No = data.application_No;
      }
    else{
      this._service.get_lease_payment_head_plot(appNo).subscribe(res=>{
        let data = res["proc_Leas_Payment_Head_Details"][0];
        this.show=true;
        this.enable=false;
        this.newcomp_payment.rehabitation=data.total_lease_amount_to_be_paid*0.3
        this.total_lease_amount_to_be_paid=data.total_lease_amount_to_be_paid
        this.newcomp_payment.plot_ID= this.licenceData.Parcel_ID
        this.newcomp_payment.is_cleaned = true;
      })
    }

    },
    (error) => {
      this.notificationsService.error("Error", "error geting Compensation");
    }
  );
}
savecompensation(){
  this.ServiceService.getUserRole().subscribe((response: any) => {
    this.newcomp_payment.created_by = response[0].UserId;
    // this.newcomp_payment.created_date = new Date();
  this._service.savecompensation(this.newcomp_payment).subscribe(data=>{
    this.notificationsService.success("Success", "Successfully inserted");
    
    this.selected(this.newcomp_payment);
    this.show=false
    this.ServiceService.disablefins = false;
    this.completed.emit();
  })
  })
}
onIsCleanedChange(event){
  

  if(event==true){
    this.newcomp_payment.rehabitation=this.total_lease_amount_to_be_paid*0.3
  }
  else{
    this.newcomp_payment.rehabitation=this.total_lease_amount_to_be_paid*0.1
  }
}
updatecompensation(){
  this.ServiceService.getUserRole().subscribe((response: any) => {
    this.newcomp_payment.updated_by = response[0].UserId;
    // this.newcomp_payment.updated_date = new Date();
    
    this._service.updatecompensation(this.newcomp_payment).subscribe(data=>{
      
      this.notificationsService.success("Success", "Successfully updated");
  
      this.selected(this.newcomp_payment);
      
      // this.show=false
      this.ServiceService.disablefins = false;
      this.completed.emit();
      
    },
    error => {
      this.notificationsService.error("error", `unable to update!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
      // this.showToast('error', 'error', `unable to add lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
    }
  )
  })
}
}

export class comp_payment {
  public plot_ID: string;
  public compensation_amount: any; // Changed to string assuming it's a formatted string
  public rehabitation: any | null;
  public is_cleaned: any | null;
  public created_by: any | null;
  public created_date: any | null;
  public updated_by: any | null;
  public updated_date: any | null;
}