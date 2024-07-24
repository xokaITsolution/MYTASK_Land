import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LeaseContractService } from '../lease-contract.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/service/service.service';
import { Guid } from 'guid-typescript';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { NotificationsService } from "angular2-notifications";
import { error } from 'console';
@Component({
  selector: 'app-free-hold-to-lease',
  templateUrl: './free-hold-to-lease.component.html',
  styleUrls: ['./free-hold-to-lease.component.css']
})
export class FreeHoldToLeaseComponent implements OnInit {
  @Output() completed = new EventEmitter();
  newFreeHoldToLease: FreeHoldToLease = {} as FreeHoldToLease;
  constructor(private _toast: MessageService, private _service: LeaseContractService,
    private activatedRoute: ActivatedRoute, private ServiceService: ServiceService,
    private sanitizer: DomSanitizer, private notificationsService: NotificationsService) { }
  isnew = true;
  disable: true;
  ReportPath;
  isCertifcatePrintforConfirmation: boolean;
  ngOnInit() {
    this.newFreeHoldToLease.ID = Guid.create().toString();
  }
  format_date(date: any){
    if(date!=null && date!=''){
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
    else{
      return '';
    }
   
  }
  showToast(type: string, title: string, message: string) {
    let messageConfig = {
      severity: type,
      summary: title,
      detail: message
    }
    this._toast.add(messageConfig);
  }
  updateFreeholdTolease() {
    
    this._service.updateFreeholdTolease(this.newFreeHoldToLease).subscribe(
      (response) => {
        // itHasError = false;
        this.ServiceService.disablefins = false;
        this.completed.emit();
        this.notificationsService.success("Success", "Successfully Updated");
        // this.showToast('success', 'success', 'Success');
       
      },
      (error) => {
        this.notificationsService.error("error", `unable to update freehold to lease!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
      }
    );
  }
  InsertFreeholdToLease(){
      this._service.insert_data_proc_Freehold_to_Lease(this.newFreeHoldToLease).subscribe(
        data => {
          this.ServiceService.disablefins = false;
          this.completed.emit();
          // this.showToast('success', 'success', 'Success');
          this.notificationsService.success("Success", "Successfully inserted");

          this.isnew=false;
          console.log('newLeaseContract :: ', data);

        },
        error => {
          this.notificationsService.error("error", `unable to add Freehold to lease!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
          // this.showToast('error', 'error', `unable to add lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        }
      );
    // }
  }
  Addnew(){
    // this.showForm=true;
    this.newFreeHoldToLease = new FreeHoldToLease();
    this.newFreeHoldToLease.ID = Guid.create().toString();
  }
  json2array(json) {
    var result = [];
    result.push(json);

    return result;
  }
  async getgregorianToEthiopianDate(date) {

    if (date != "0001-01-01T00:00:00") {
      var datenow = await this.ServiceService
        .getgregorianToEthiopianDate(date)
        .toPromise();
      console.log('datenow', datenow);
      return datenow.nowTime;
    }
  }
  Get_Lease_contract(){
    this.ReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.con_report + "/" + this._service.Report_name +"/" + this._service.App_no
    );
    console.log("ReportPath",this.ReportPath);
    
    debugger
    this._service.get_freehold_to_Lease_by_Id(this._service.contract_NO).subscribe(async data=>{
      if(data['proc_FreeHold_to_Leases'].length>0){
        let FreeHoldTolease=data['proc_FreeHold_to_Leases'][0];
        
        this.newFreeHoldToLease.Contract_NO=FreeHoldTolease.contract_NO;
        this.newFreeHoldToLease.Custmer_ID=FreeHoldTolease.customer_ID;
        this.newFreeHoldToLease.Customer_Full_Name=FreeHoldTolease.customer_Full_Name;
        this.newFreeHoldToLease.Sign_Date=FreeHoldTolease.sign_Date.split("T")[0];
        this.newFreeHoldToLease.Sign_Date_Et=
        await this.getgregorianToEthiopianDate(
          this.newFreeHoldToLease.Sign_Date
        );
        this.newFreeHoldToLease.Plot_ID=FreeHoldTolease.plot_ID;
        this.newFreeHoldToLease.Land_grad=FreeHoldTolease.land_grad;
        this.newFreeHoldToLease.Constraction_Level=FreeHoldTolease.constraction_Level;
        this.newFreeHoldToLease.Land_size_M2=FreeHoldTolease.land_size_M2;
        this.newFreeHoldToLease.Land_use=FreeHoldTolease.land_use;
        this.newFreeHoldToLease.Lease_Price=FreeHoldTolease.lease_Price;
        this.newFreeHoldToLease.Proprty_use=FreeHoldTolease.proprty_use;
        this.newFreeHoldToLease.Total_Lease_Price=FreeHoldTolease.total_Lease_Price;
        this.newFreeHoldToLease.Advance_payment=FreeHoldTolease.advance_payment;
        this.newFreeHoldToLease.Lease_period_in_Year=FreeHoldTolease.lease_period_in_Year;
        this.newFreeHoldToLease.Lease_Period_end_date=FreeHoldTolease.lease_Period_end_date.split("T")[0];
        this.newFreeHoldToLease.Lease_Period_end_date_ET=
        await this.getgregorianToEthiopianDate(
          this.newFreeHoldToLease.Lease_Period_end_date
        );
        this.newFreeHoldToLease.Lease_Payment_grace_Period=FreeHoldTolease.lease_Payment_grace_Period;
        this.newFreeHoldToLease.Remaining_lease_payment=FreeHoldTolease.remaining_lease_payment;
        this.newFreeHoldToLease.Annual_Payment=FreeHoldTolease.annual_Payment;
        this.newFreeHoldToLease.Building_Max_Hight=0;
        this.newFreeHoldToLease.Building_Min_Hight=0;
        
        this.isnew=false
        this.notificationsService.success("success", "success");
        console.log("this.newFreeHoldToLease",this.newFreeHoldToLease);
      }
      else{
        debugger
        this._service.get_veiw_contract(this._service.lease_code).subscribe(async data=>{
          let FreeHoldTolease=data[0];
          debugger
          this.newFreeHoldToLease.Contract_NO=FreeHoldTolease.contract_NO;
          this.newFreeHoldToLease.Custmer_ID=FreeHoldTolease.customer_ID;
          this.newFreeHoldToLease.Customer_Full_Name=FreeHoldTolease.customer_Full_Name;
          this.newFreeHoldToLease.Sign_Date=FreeHoldTolease.sign_Date.split("T")[0];
          this.newFreeHoldToLease.Sign_Date_Et=
          await this.getgregorianToEthiopianDate(
            this.newFreeHoldToLease.Sign_Date
          );
          this.newFreeHoldToLease.Plot_ID=FreeHoldTolease.plot_ID;
          this.newFreeHoldToLease.Land_grad=FreeHoldTolease.land_grad;
          this.newFreeHoldToLease.Constraction_Level=FreeHoldTolease.constraction_Level;
          this.newFreeHoldToLease.Land_size_M2=FreeHoldTolease.land_size_M2;
          this.newFreeHoldToLease.Land_use=FreeHoldTolease.land_use;
          this.newFreeHoldToLease.Lease_Price=FreeHoldTolease.lease_Price;
          this.newFreeHoldToLease.Proprty_use=FreeHoldTolease.proprty_use;
          this.newFreeHoldToLease.Total_Lease_Price=FreeHoldTolease.total_Lease_Price;
          this.newFreeHoldToLease.Advance_payment=FreeHoldTolease.advance_payment;
          this.newFreeHoldToLease.Lease_period_in_Year=FreeHoldTolease.lease_period_in_Year;
          this.newFreeHoldToLease.Lease_Period_end_date=FreeHoldTolease.lease_Period_end_date.split("T")[0];
          this.newFreeHoldToLease.Lease_Period_end_date_ET=
          await this.getgregorianToEthiopianDate(
            this.newFreeHoldToLease.Lease_Period_end_date
          );
          debugger
          this.newFreeHoldToLease.Lease_Payment_grace_Period=FreeHoldTolease.lease_Payment_grace_Period;
          this.newFreeHoldToLease.Remaining_lease_payment=FreeHoldTolease.remaining_lease_payment;
          this.newFreeHoldToLease.Annual_Payment=FreeHoldTolease.annual_Payment;
          this.newFreeHoldToLease.Building_Max_Hight=0;
          this.newFreeHoldToLease.Building_Min_Hight=0;
          this.notificationsService.success("success", "success");
          console.log("this.newFreeHoldToLease",this.newFreeHoldToLease);
          
        },
        error=>{
          this.notificationsService.error("error", "unable to get view contract on freehold");
        }
      )
      }
    },
    error=>{

      this.notificationsService.error("error", "unable to get freehold with CO_NO");
    }
  )
   

  }
}
export class FreeHoldToLease {
  public ID: string;
  public Contract_NO: string;
  public Custmer_ID: string;
  public Customer_Full_Name: string;
  public Sign_Date: any | null;
  public Sign_Date_Et: string;
  public Plot_ID: string;
  public Land_grad: string;
  public Constraction_Level: string;
  public Land_size_M2: number | null;
  public Land_use: string;
  public Proprty_use: string;
  public Lease_Price: number | null;
  public Total_Lease_Price: number | null;
  public Advance_payment: number | null;
  public Lease_period_in_Year: number | null;
  public Lease_Period_end_date: any | null;
  public Lease_Period_end_date_ET: any | null;
  public Remaining_lease_payment: number | null;
  public Lease_Payment_grace_Period: number | null;
  public Annual_Payment: number | null;
  public Building_Max_Hight: number | null;
  public Building_Min_Hight: number | null;
  public Active: boolean | null;
}