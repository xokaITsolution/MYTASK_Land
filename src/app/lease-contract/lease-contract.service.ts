import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class LeaseContractService {
  apiUrl=environment.rootPathApi;
  private proc_Lease_Payment_Head = environment.rootPath3 + "proc_Lease_Payment_Head";
  Lease_Contract =`${environment.rootPathApi}proc_Lease_Contract`;
  ConReviewTran =`${environment.rootPathApi}proc_Con_Review_Transaction/proc_ConReviewTransaction`;
  lease_payment_head = environment.rootPathApi + "proc_Lease_Payment_Head/"
  veiw_contract = environment.rootPathApi + "view/View_Contract/Lease_Code?Lease_Code="
  contract_type =`${environment.rootPathApi}proc_Lease_Contract_Type`;
  private License_ServiceURL = environment.rootPath + "License_Service";
  private leaserPaymentHeadDetail = environment.rootPathApi + "proc_Leas_Payment_Head_Detail";
  Lease_To_lease =`${environment.rootPathApi}proc_Lease_to_Lease`;
  Freehold_To_lease =`${environment.rootPathApi}Service_fee/proc_FreeHold_to_Lease`;
  Proc_Genereate_Lease_Plan=`${environment.rootPathApi}Proc_Genereate_Lease_Plan`;
  procPlot_Registration=`${environment.rootPathApi}Plot_Registration/procPlot_Registration`;
  procWoreda_Lookup=`${environment.rootPathApi}Woreda_Lookup/procWoreda_Lookup/woredaid`;
  proc_Lease_to_Lease_by_Contract_NO=`${environment.rootPathApi}proc_Lease_to_Lease/Contract_NO`;
  proc_freehold_to_Lease_by_Contract_NO=`${environment.rootPathApi}Service_fee/proc_FreeHold_to_Lease/Contract_NO`;
  proc_lease_contract_by_lease_code=`${environment.rootPathApi}proc_Lease_Contract/Lease_code`;
  get_organization=`${environment.rootPathApi}organizations/procorganizations/organizations_code?organization_code=`;
  lease_code : any;
  ploteId: any;
  Lease_Payment_Year:any;
  lease_payment_advance_per:any;
  Lease_Payment_grace_Period:any;
 EnambleFreeHold_to_Lease = false;
 EnambleLease_to_Lease = false;
 Report_name:any;
 contract_NO:any;
  transfer_ID: any;
  App_no: any;
  constructor(private http: HttpClient) {}
  insert_data( data: any) {
    return this.http.post(this.Lease_Contract, data);
  }
  Generate_lease_plan(
    Lease_Code:any,
    Plot_ID:any,
    Lease_Payment_grace_Period:any,
    Lease_Payment_Year:any,
    Total_lease_amount_to_be_paid:any,
    Amount_of_down_payment:any,
    contract_date:any,
    transfer_ID:any,
    tskID:any
    ){
      // let ad = this.Proc_Genereate_Lease_Plan+
      // '?Lease_code='+Lease_Code+'&PlotID='+Plot_ID+'&Lease_Payment_grace_Period='+Lease_Payment_grace_Period+'&Lease_Payment_Year='+Lease_Payment_Year+'&Total_lease_amount_to_be_paid='+Total_lease_amount_to_be_paid
      return this.http.get(this.Proc_Genereate_Lease_Plan+
        '?Lease_code='+Lease_Code+'&PlotID='+Plot_ID+'&Lease_Payment_grace_Period='+Lease_Payment_grace_Period+
        '&Lease_Payment_Year='+Lease_Payment_Year+'&Total_lease_amount_to_be_paid='+Total_lease_amount_to_be_paid+
        '&Amount_of_down_payment='+Amount_of_down_payment+'&contract_date='+contract_date+'&transfer_ID='+transfer_ID+'&tskID='+tskID
      );
  }
  insert_data_proc_Lease_to_Lease( data: any) {
    // 
    return this.http.post(this.Lease_To_lease, data);
  }
  insert_data_proc_Freehold_to_Lease( data: any) {
    // 
    return this.http.post(this.Freehold_To_lease, data);
  }
  updateleaseTolease(data:any): Observable<any>{

    return this.http.put<any>(this.Lease_To_lease, data);
  }
  updatelease_contract(data:any): Observable<any>{

    return this.http.put(this.Lease_Contract, data);
  }
  updateConReviewTran(data:any): Observable<any>{

    return this.http.put(this.ConReviewTran, data);
  }
  updateFreeholdTolease(data:any): Observable<any>{

    return this.http.put<any>(this.Freehold_To_lease, data);
  }
  get_all(){
    // 
    return this.http.get(this.contract_type);
  }
  get_all_by_contract_type_id(ID){
    // 
    return this.http.get(this.contract_type+"/"+ID);
  }
  get_license_service (AppNo){
    // 
    return this.http.get(this.License_ServiceURL +
      "?" +
      "sortOrder=test&currentFilter=" +
      AppNo +
      "&searchString&pageIndex&pageSize");
  }
  get_by_ID(ID){
    // 
    return this.http.get(this.lease_payment_head +ID);
  }
  get_organizationby_org_code(ID){
    
    return this.http.get(this.get_organization +ID);
  }
  get_veiw_contract(ID){
    // 
    return this.http.get(this.veiw_contract +ID);
  }
  get_worad_from_plot_regstration(ID){
    return this.http.get(this.procPlot_Registration+'/'+ID);
  }
  get_woreda_lookup(ID){
    return this.http.get(this.procWoreda_Lookup+'/'+ID);
  }
  get_Lease_contract_by_Id(ID){
    return this.http.get(this.proc_lease_contract_by_lease_code+'/'+ID);
  }
  get_Lease_to_lease_by_Id(ID){
    return this.http.get(this.proc_Lease_to_Lease_by_Contract_NO+'/'+ID);
  }
  get_freehold_to_Lease_by_Id(ID){
    return this.http.get(this.proc_freehold_to_Lease_by_Contract_NO+'/'+ID);
  }
  


    // Retrieve single data by ID
    updateleaserPaymentHeadDetail(data:any): Observable<any>{
      const url = `${this.leaserPaymentHeadDetail}`;
      return this.http.put<any>(url, data);
    }
    getDataById(id: any): Observable<any> {
      // 
      const url = `${this.lease_payment_head}${id}`;
      return this.http.get<any>(url);
    }
    getDataByleasecode(id: any): Observable<any> {
   
      const url = `${this.leaserPaymentHeadDetail}/${id}`;
      return this.http.get<any>(url);
    }
    getTransferType(id: any): Observable<any> {
      const url = `${this.apiUrl}Deed_Transfer_Lookup/procDeed_Transfer_Lookup/${id}`;
      return this.http.get<any>(url);
    }
    // Retrieve single data by ID
    getPropertyUse(id: any): Observable<any> {
      const url = `${this.apiUrl}proc_Proprty_Use/proc_Proprty_Use/${id}`;
      return this.http.get<any>(url);
    }
    // Retrieve single data by ID
    getCustomerType(id: any): Observable<any> {
      const url = `${this.apiUrl}Customer_Type_Lookup/procCustomer_Type_Lookup/${id}`;
      return this.http.get<any>(url);
    }
    // Update data
    updateData(data: any): Observable<any> {
      const url = `${this.proc_Lease_Payment_Head}`;
      return this.http.put<any>(url, data);
    }
  
}
