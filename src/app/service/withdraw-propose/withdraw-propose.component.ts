import { ServiceService } from 'src/app/service/service.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { LeaseContractService } from 'src/app/lease-contract/lease-contract.service';

@Component({
  selector: 'app-withdraw-propose',
  templateUrl: './withdraw-propose.component.html',
  styleUrls: ['./withdraw-propose.component.css']
})
export class WithdrawProposeComponent implements OnInit {
  enable_edit: boolean;
  @Output() completed = new EventEmitter();
  serachplotExists: boolean;
  showform: boolean;
  enable: boolean;
  @Input () Licence_Service_ID:any
  certReportPath: any;

  constructor(private ServiceService:LeaseContractService,private notificationsService: NotificationsService,
    private sanitizer: DomSanitizer,
  ) { }
// @Input AppNo 
newWithdrawPropose :WithdrawPropose ={ } as WithdrawPropose;
proposeList: any[] = [];
proposebyidList: any[] = [];
proposebyidGridList: any[] = [];
isCertifcatePrintforConfirmation: boolean;
  ngOnInit() {
   this.getWithdrawpropose();
   
   this.Licence_Service_ID
  }
  getWithdrawpropose(){
    this.ServiceService.getWithdrawpropose().subscribe(data=>{
      this.enable_edit=true
      this.serachplotExists=true;
      
      if (Array.isArray(data)) {
        this.proposeList = data;
      } else {
        this.proposeList = [data];
      }
    })
  }

  selectprop(propose){
    this.serachplotExists=false;
    let cid,titdeed;
    if(propose.transfer_To_Customer!=null){
       cid=propose.transfer_To_Customer;
       titdeed=propose.title_Deed_No
    }
    else{
      cid=propose.customer_ID
      titdeed=propose.title_Deed_No
    }
    this.ServiceService.getwithpropbyId(cid,titdeed).subscribe(data=>{
      
      if(data["proc_withdraw_proposes"].length>0){

        this.newWithdrawPropose=data["proc_withdraw_proposes"][0];
        this.ServiceService.getWithdrawproposebyid(data["proc_withdraw_proposes"][0].title_Deed_No,data["proc_withdraw_proposes"][0].customer_ID).
          subscribe(data1=>{
            
            this.proposebyidGridList =  [data1[0]];
          })
        // this.newWithdrawPropose.title_Deed_No=propose.title_Deed_No;
        // this.newWithdrawPropose.customer_ID=propose.transfer_To_Customer;
        this.showform=false;
        this.enable=true;
      }
      else{
        debugger
        this.proposebyidList =  propose;
        this.newWithdrawPropose.title_Deed_No=propose.title_Deed_No;
        this.newWithdrawPropose.customer_ID=propose.transfer_To_Customer;
        console.log("this.Licence_Service_ID",this.Licence_Service_ID);
        
        this.newWithdrawPropose.Licence_Service_Id=this.Licence_Service_ID;
        this.showform=true;
        this.enable=false;
      }
    })
  }
  selected(data){
    debugger
    this.certReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.certReportPath + "/" + data.title_Deed_No
    );
    this.proposebyidList =  data;
    console.log("this.proposebyidList",);
    
    this.showform=true
  }
  savewithdrawProp(){
    // this.newWithdrawPropose.created_date=new Date().toISOString();
    debugger
    this.ServiceService.getUserRole().subscribe((response: any) => {
      this.newWithdrawPropose.created_by = response[0].UserId;
      this.newWithdrawPropose.created_date = new Date();
      
    this.ServiceService.addwithprop(this.newWithdrawPropose).subscribe(data=>{
      this.ServiceService.disablefins = false;
      this.completed.emit();
      this.notificationsService.success("Success", "Successfully inserted");
      this.selectprop(this.newWithdrawPropose);
    },
    error => {
      this.notificationsService.error("error", `unable to save!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
      // this.showToast('error', 'error', `unable to add lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
    }
  )
  })
  }
  updatewithdrawProp(){
    this.ServiceService.getUserRole().subscribe((response: any) => {
      this.newWithdrawPropose.updated_by = response[0].UserId;
      this.newWithdrawPropose.updated_date = new Date();
      this.ServiceService.updatewithprop(this.newWithdrawPropose).subscribe(data=>{
        this.ServiceService.disablefins = false;
        this.completed.emit();
        this.notificationsService.success("Success", "Successfully updated");
        this.selectprop(this.newWithdrawPropose);
      },
      error => {
        this.notificationsService.error("error", `unable to update!  ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        // this.showToast('error', 'error', `unable to add lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
      }
    )
    })
  }
}

export class WithdrawPropose{
  
   public customer_ID: any;
    public title_Deed_No: any;
    public Licence_Service_Id: any;
    public is_approved: any;
    public approved_by: any;
    public created_by: any;
    public updated_by: any;
    public created_date: any;
    public updated_date: any;
}