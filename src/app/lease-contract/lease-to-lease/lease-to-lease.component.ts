import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LeaseContractService } from '../lease-contract.service';
import { Guid } from 'guid-typescript';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/service/service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { NotificationsService } from "angular2-notifications";
import { error } from 'console';

@Component({
  selector: 'app-lease-to-lease',
  templateUrl: './lease-to-lease.component.html',
  styleUrls: ['./lease-to-lease.component.css']
})
export class LeaseToLeaseComponent implements OnInit {
  @Output() completed = new EventEmitter();
  AppNo: any;
  isnew = true;
  ReportPath;
  disable: true;
  isCertifcatePrintforConfirmation: boolean;
  maxWidth: string = "1800px";
  isMaximized: boolean;
  // leasetolease: any[];
  leasetolease: LeaseTolease[] = [];
  constructor(private _toast: MessageService, private _service: LeaseContractService,
    private activatedRoute: ActivatedRoute, private ServiceService: ServiceService,
    private sanitizer: DomSanitizer, private notificationsService: NotificationsService
  ) { }
  newLeaseTolease: LeaseTolease = {} as LeaseTolease;
  ngOnInit() {
    this.activatedRoute.params.subscribe((p) => {
      console.log("Observable Params:", p);
      // this.ServiceService.tiltledeed = p["AppNo"];
      this.AppNo = p["AppNo"];
      debugger
    });
    this.newLeaseTolease.ID = Guid.create().toString();
    // this.Get_Lease_contract();
  }
  showToast(type: string, title: string, message: string) {
    let messageConfig = {
      severity: type,
      summary: title,
      detail: message
    }
    this._toast.add(messageConfig);
  }
  format_date(date: any) {
    if (date != null && date != '') {
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
    else {
      return '';
    }

  }
  openFullModal() {
    this.isMaximized = true;
    this.maxWidth = "2000px"; // Set the max width for full modal
  }
  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "1000px"; // Set the max width for mini modal
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
  async getEthiopianToGregorian(date) {
    if (date) {
      var datenow = await this.ServiceService
        .getEthiopianToGregorian(date)
        .toPromise();
      console.log('datenow', datenow);
      return datenow.nowTime;
    }
  }
  async Get_Lease_contract() {
    this.ReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.Lease_contract + "/" + this._service.Report_name
    );
    console.log("ReportPath", this.ReportPath);


    this._service.get_Lease_to_lease_by_Id(this._service.contract_NO).subscribe(async data => {
     
      debugger
     if (data['proc_Lease_to_Leases'].length>0) {
        let LeaseTolease = data['proc_Lease_to_Leases'][0]
        this.newLeaseTolease.Contract_NO = LeaseTolease.contract_NO;
        this.newLeaseTolease.Custmer_ID = LeaseTolease.customer_ID;
        this.newLeaseTolease.Customer_Full_Name = LeaseTolease.customer_Full_Name;
        this.newLeaseTolease.Sign_Date = LeaseTolease.sign_Date.split("T")[0];
        this.newLeaseTolease.Sign_Date_Et = await this.getgregorianToEthiopianDate(
          this.newLeaseTolease.Sign_Date
        );
        this.newLeaseTolease.Plot_ID = LeaseTolease.plot_ID;
        this.newLeaseTolease.Land_grad = LeaseTolease.land_grad;
        this.newLeaseTolease.Constraction_Level = LeaseTolease.constraction_Level;
        this.newLeaseTolease.Land_size_M2 = LeaseTolease.land_size_M2;
        this.newLeaseTolease.Land_use = LeaseTolease.land_use;
        this.newLeaseTolease.Lease_Price = LeaseTolease.lease_Price;
        this.newLeaseTolease.Proprty_use = LeaseTolease.proprty_use;
        this.newLeaseTolease.Total_Lease_Price = LeaseTolease.total_Lease_Price;
        this.newLeaseTolease.Advance_payment = LeaseTolease.advance_payment;
        this.newLeaseTolease.Lease_period_in_Year = LeaseTolease.lease_period_in_Year;
        this.newLeaseTolease.Lease_Period_end_date = LeaseTolease.lease_Period_end_date.split("T")[0];
        this.newLeaseTolease.Lease_Period_end_date_ET =await this.getgregorianToEthiopianDate(
                                                       this.newLeaseTolease.Lease_Period_end_date);
        this.newLeaseTolease.Lease_Payment_grace_Period = LeaseTolease.lease_Payment_grace_Period;
        this.newLeaseTolease.Remaining_lease_payment = LeaseTolease.remaining_lease_payment;
        this.newLeaseTolease.Annual_Payment = LeaseTolease.annual_Payment;
        this.newLeaseTolease.Building_Max_Hight = 0;
        this.newLeaseTolease.Building_Min_Hight = 0;
        this.isnew = false
        this.notificationsService.success("success", "success");
        console.log("this.newLeaseTolease", this.newLeaseTolease);
      }
      else {
        this._service.get_veiw_contract(this._service.lease_code).subscribe(async data => {

          let LeaseTolease = data[0];
          this.newLeaseTolease.Contract_NO = LeaseTolease.contract_NO;
          this.newLeaseTolease.Custmer_ID = LeaseTolease.customer_ID;
          this.newLeaseTolease.Customer_Full_Name = LeaseTolease.customer_Full_Name;
          this.newLeaseTolease.Sign_Date = LeaseTolease.sign_Date.split("T")[0];
          this.newLeaseTolease.Sign_Date_Et = await this.getgregorianToEthiopianDate(
            this.newLeaseTolease.Sign_Date
          );
          this.newLeaseTolease.Plot_ID = LeaseTolease.plot_ID;
          this.newLeaseTolease.Land_grad = LeaseTolease.land_grad;
          this.newLeaseTolease.Constraction_Level = LeaseTolease.constraction_Level;
          this.newLeaseTolease.Land_size_M2 = LeaseTolease.land_size_M2;
          this.newLeaseTolease.Land_use = LeaseTolease.land_use;
          this.newLeaseTolease.Lease_Price = LeaseTolease.lease_Price;
          this.newLeaseTolease.Proprty_use = LeaseTolease.proprty_use;
          this.newLeaseTolease.Total_Lease_Price = LeaseTolease.total_Lease_Price;
          this.newLeaseTolease.Advance_payment = LeaseTolease.advance_payment;
          this.newLeaseTolease.Lease_period_in_Year = LeaseTolease.lease_period_in_Year;
          this.newLeaseTolease.Lease_Period_end_date = LeaseTolease.lease_Period_end_date.split("T")[0];
          this.newLeaseTolease.Lease_Period_end_date_ET = await this.getgregorianToEthiopianDate(
            this.newLeaseTolease.Lease_Period_end_date);
          this.newLeaseTolease.Lease_Payment_grace_Period = LeaseTolease.lease_Payment_grace_Period;
          this.newLeaseTolease.Remaining_lease_payment = LeaseTolease.remaining_lease_payment;
          this.newLeaseTolease.Annual_Payment = LeaseTolease.annual_Payment;
          this.newLeaseTolease.Building_Max_Hight = 0;
          this.newLeaseTolease.Building_Min_Hight = 0;
          this.notificationsService.success("success", "success");
          console.log("this.newLeaseTolease", this.newLeaseTolease);

        },
        error=>{
          this.notificationsService.error("error", "unable to get view contract on lease to lease");
        }
      )
      }
    },
    error=>{
      this.notificationsService.error("error", "unable to get lease to lease with CO_NO");
    }
  )
  }
  updateleaseTolease() {
// 
    this._service.updateleaseTolease(this.newLeaseTolease).subscribe(
      (response) => {
        // itHasError = false;
        this.notificationsService.success("Success", "Successfully Updated");
        this.ServiceService.disablefins = false;
        this.completed.emit();
      },
      (error) => {
        this.notificationsService.error("error", `unable to update lease to lease!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
      }
    );
  }
  InsertLeaseToLease() {
    this._service.insert_data_proc_Lease_to_Lease(this.newLeaseTolease).subscribe(
      data => { this.ServiceService.disablefins = false;
        this.completed.emit();
        this.notificationsService.success("Success", "Success");
       
        this.isnew = false;
        console.log('newLeaseContract :: ', data);

      },
      error => {
        this.notificationsService.error("error", `unable to add lease to lease!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
      }
    );
  }
  Addnew() {
    // this.showForm=true;
    this.newLeaseTolease = new LeaseTolease();
    this.newLeaseTolease.ID = Guid.create().toString();
  }
  json2array(json) {
    var result = [];
    result.push(json);

    return result;
  }
}
export class LeaseTolease {
  public ID: string;
  public Contract_NO: string;
  public Custmer_ID: string;
  public Customer_Full_Name: string;
  public Sign_Date: any | null;
  public Sign_Date_Et: any;
  public Plot_ID: string;
  public Land_grad: string;
  public Constraction_Level: string;
  public Land_size_M2: number;
  public Land_use: string;
  public Lease_Price: number;
  public Proprty_use: string;
  public Total_Lease_Price: number | null;
  public Advance_payment: number | null;
  public Lease_period_in_Year: number | null;
  public Lease_Period_end_date: any | null;
  public Lease_Period_end_date_ET: any | null;
  public Lease_Payment_grace_Period: number | null;
  public Remaining_lease_payment: number | null;
  public Annual_Payment: number | null;
  public Building_Max_Hight: number | null;
  public Building_Min_Hight: number | null;
  public Active: boolean | null;
}