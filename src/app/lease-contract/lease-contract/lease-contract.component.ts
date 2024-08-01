import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LeaseContractService } from '../lease-contract.service';
import { Guid } from 'guid-typescript';
import { ServiceComponent } from 'src/app/service/service.component';
import { ServiceService } from 'src/app/service/service.service';
import { ActivatedRoute } from '@angular/router';
import { LeaseToLeaseComponent } from '../lease-to-lease/lease-to-lease.component';
import { FreeHoldToLeaseComponent } from '../free-hold-to-lease/free-hold-to-lease.component';
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: 'app-lease-contract',
  templateUrl: './lease-contract.component.html',
  styleUrls: ['./lease-contract.component.css']
})
export class LeaseContractComponent implements OnInit {
  @Output() completed = new EventEmitter();
  @Input() disable;
  @ViewChild(LeaseToLeaseComponent, { static: false }) childComponent: LeaseToLeaseComponent;
  @ViewChild(FreeHoldToLeaseComponent, { static: false }) childComponent1: FreeHoldToLeaseComponent;
  showForm: boolean;
  newLeaseContract: LeaseContract = {} as LeaseContract;
  contractTypearray: any[];
  selectedTab = 0;
  selectedTab1 = 0;
  tab1;
  tab2;
  contractList = []
  
  AppNo: any;
  licenceService: any;
  licenceData: any;
  enable_edit: boolean=false;
  lease_p_head: any[];
  enablenext: boolean = false;
  isnew :boolean;
  orginizationlookup: any;
  intervalId: NodeJS.Timer;
  conlevel_List: [];
  userid: any;
  constructor(private _toast: MessageService, public _service: LeaseContractService,
    private activatedRoute: ActivatedRoute, public ServiceService: ServiceService,
    private ServiceComponent: ServiceComponent, private notificationsService: NotificationsService
  ) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe((p) => {
      console.log("Observable Params:", p);
      this.AppNo = p["AppNo"];
      this._service.App_no = p["AppNo"];
    });
    this.get_license_service();
    this.get_contract_type();
    this.get_constraction_level();
    this.newLeaseContract.contract_no = Guid.create().toString();
    this.ServiceService.disable=this.disable
    this._service.completed=this.completed
  }
  get_license_service() {
    this._service.get_license_service(this.AppNo).subscribe((data) => {
      this.licenceService = data;
      this.licenceData = this.licenceService.list[0];
      console.log("get_license_service", this.licenceData);
      // this.newLeaseContract.sdp = this.licenceData.SDP_ID;
      this._service.get_organizationby_org_code(this.licenceData.SDP_ID).subscribe(data => {
          this.orginizationlookup = data['procorganizationss'][0];
          // 
             this.newLeaseContract.sdp=data['procorganizationss'][0].name_am
        // this.newLeaseContract.worda = data['procWoreda_Lookups'][0].woreda_Name
      },
      (error) => {
        this.notificationsService.error('Error fetching organization:', error);
      }
    );
      this._service.ploteId = this.licenceData.Parcel_ID;
        this.get_woreda(this.licenceData.Parcel_ID);
this.getLeasPaymentHeadData(this.licenceData.Application_No);
    //   this._service.get_by_ID(this.licenceData.Application_No).subscribe(data => {
    //     // console.log('lease_p_head:', data['proc_Lease_Payment_Heads'][0]);
    //     
    //     this.newLeaseContract.lease_code = data['proc_Lease_Payment_Heads'][0].lease_code
    //     this._service.lease_code = data['proc_Lease_Payment_Heads'][0].lease_code;
        
    //     this.get_lease_contract(data['proc_Lease_Payment_Heads'][0].lease_code);

    //   },
    //   (error) => {
    //     this.notificationsService.error('Error fetching Lease payment head:', error);
    //   }
    // );
    },
    (error) => {
      this.notificationsService.error('Error fetching License service:', error);
    }
  );
  }
  getLeasPaymentHeadData(appNo: any) {
    // debugger
    this._service.getView_lease_payment_head(appNo).subscribe(
      (response:any) => {
        if ([response].length>0){
          debugger
          if (Array.isArray(response)) {
            this.contractList = response;
            // this.newLeaseContract.Con_level=this.contractList.con_level
          } else {
            this.contractList = [response];
            // this.newLeaseContract.Con_level=this.contractList.con_level
          }
        }
        else{
          this.notificationsService.error("Error", "no data exist in head using Application number");
        }
        // else{
        //   this.ServiceService.getPlotManagementApi(this.ServiceService.Parcel_ID).subscribe(
        //     async (res: any) => {
              
        //       let appno= res["procPlot_Registrations"][0].application_No 
        //       this._service.getDataById(res["procPlot_Registrations"][0].application_No ).subscribe(
        //         (response) => { 
        //       let data = response.proc_Lease_Payment_Heads[0];
        //       this.leaserPaymentHead.Lease_code = data.lease_code;
        //       this._service.lease_code=data.lease_code;
         
        //     })
        //   })
        // }
        
      },
      (error) => {
        this.notificationsService.error("Error", "error geting head data");
      }
    );
  }
  get_woreda(ID){
    this._service.get_worad_from_plot_regstration(ID).subscribe(data => {
      this._service.get_woreda_lookup(data['procPlot_Registrations'][0].wereda_ID).subscribe(data => {

        this.newLeaseContract.worda = data['procWoreda_Lookups'][0].woreda_Name
      },
      (error) => {
        this.notificationsService.error('Error fetching woreda Lookup:', error);
      }
    );
    },
    (error) => {
      this.notificationsService.error('Error fetching plot regstration:', error);
    }
  );
  }
  get_lease_contract(lease_code) {
    this._service.get_Lease_contract_by_Id(lease_code).
      subscribe(data => {
        // debugger
        if (data['proc_Lease_Contracts'].length>0) { 
          // this.contractList = [data['proc_Lease_Contracts'][0]];
          this.get_contract_type1(data['proc_Lease_Contracts'][0].contact_Type)
          this.newLeaseContract=data['proc_Lease_Contracts'][0]
          this.newLeaseContract.sdp=this.orginizationlookup.name_am;
          this.newLeaseContract.Con_level=data['proc_Lease_Contracts'][0].con_level
          this._service.contract_NO=data['proc_Lease_Contracts'][0].contract_NO; 
          this.enable_edit=true;
          this.isnew = false;
          this.enablenext=true;
          // console.log("this.newLeaseContract", this.contractList);
        }
        else {
          this.showForm = true;
          this.isnew = true;
          this.enablenext=false;
          // this.newLeaseContract.contract_date=new LeaseContract().contract_date;
          this.newLeaseContract.contact_Type= new LeaseContract().contact_Type
          // this.newLeaseContract = new LeaseContract();
          this.newLeaseContract.contract_no = Guid.create().toString();
        }
      })
  }
  get_constraction_level(){
    this.ServiceService.get_constraction_level().subscribe(data=>{
      
      this.conlevel_List=data["proc_Contraction_Levels"];
    })
  }
  selected(data){
    
    // this.get_lease_contract(this._service.lease_code);
    this.get_lease_contract(data.lease_code);
    this.newLeaseContract.Con_level=data.con_level
    this._service.lease_code =data.lease_code
    this.showForm = true;
    this.newLeaseContract.sdp=this.orginizationlookup.name_am;
    this.newLeaseContract.lease_code=data.lease_code;
    // this.newLeaseContract.contract_date=data.contract_date;
    // this.newLeaseContract.sdp=this.orginizationlookup.name_am;
    // this.newLeaseContract.contract_date =  this.newLeaseContract.contract_date.split("T")[0];
  }
  get_contract_type() {
    this._service.get_all().subscribe(
      (data) => {
        const contractTypearray1 = this.json2array(data);
        this.contractTypearray = contractTypearray1[0].proc_Lease_Contract_Types;;
      },
      (error) => {
        this.notificationsService.error('Error fetching contract types:', error);
      }
    );
  }
  nextClicked() {
    // 
    if (this._service.EnambleFreeHold_to_Lease){
      this.childComponent1.Get_Lease_contract();
    }
    else{
      this.childComponent.Get_Lease_contract();
    }
  }
  get_contract_type1(contract_type_id) {

    this._service.get_all_by_contract_type_id(contract_type_id).subscribe(
      (data) => {
        debugger
        this._service.Report_name = data['proc_Lease_Contract_Types'][0].reportName
        // this._service.contract_type_Tablename = data['proc_Lease_Contract_Types'][0].tableName;
        if (data['proc_Lease_Contract_Types'][0].tableName == "FreeHold_to_Lease") {
          this._service.EnambleFreeHold_to_Lease = true;
          this._service.EnambleLease_to_Lease = false;
          this.selectedTab1 = 1;
        }
        else {
          this.selectedTab1 = 0;
          this._service.EnambleFreeHold_to_Lease = false;
          this._service.EnambleLease_to_Lease = true;

        }
      },
      (error) => {
        console.error('Error fetching contract types:', error);
      }
    );
  }
  updatelease_contract() {
    this.newLeaseContract.sdp=this.orginizationlookup.organization_code;
    this.get_contract_type1(this.newLeaseContract.contact_Type);
    this.ServiceService.getaspnetuser().subscribe((r) => {
      // this.userid = r[0].userid;
      this.newLeaseContract.lease_owner_appreved_by=r[0].userid;
    this._service.updatelease_contract(this.newLeaseContract).subscribe(
      (response) => {
        // this.completed.emit();
        this.notificationsService.success("Success", "Successfully Updated");
        this.enablenext = true;
        this.showForm=true;
        // this.ServiceService.disablefins = false;
      },
      (error) => {
        // this.showToast('error', 'error', `unable to update lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        this.notificationsService.error("error", `unable to update lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        // itHasError = false;
      }
    );
  });
  }
  InsertLeaseContract() {
    this.newLeaseContract.contract_date=new Date().toISOString().split('T')[0];
    this.newLeaseContract.sdp=this.orginizationlookup.organization_code;
    this.get_contract_type1(this.newLeaseContract.contact_Type);
    // if ((this.newLeaseContract.lease_code != null && this.newLeaseContract.lease_code != "")) {
      this.ServiceService.getaspnetuser().subscribe((r) => {
        this.userid = r[0].userid;
    
      this._service.insert_data(this.newLeaseContract).subscribe(
        data => {
          this._service.contract_NO= this.newLeaseContract.contract_no
          // this.contractList=[this.newLeaseContract];
          this.enablenext = true;
          this.isnew = false;
          // this.completed.emit();
          this.notificationsService.success("Success", "Success");
          console.log('newLeaseContract :: ', data);
        },
        error => {
          this.notificationsService.error("error", `insert lease contract error! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        }
      );
    });
   
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
  showToast(type: string, title: string, message: string) {
    let messageConfig = {
      severity: type,
      summary: title,
      detail: message
    }
    this._toast.add(messageConfig);
  }
  Addnew() {
    this.showForm = true;
    this.isnew = true;
    this.enablenext=false;
    // this.newLeaseContract.contract_date=new LeaseContract().contract_date;
    this.newLeaseContract.contact_Type= new LeaseContract().contact_Type
    // this.newLeaseContract = new LeaseContract();
    this.newLeaseContract.contract_no = Guid.create().toString();
  }
  json2array(json) {
    var result = [];
    result.push(json);
    return result;
  }
  tabChanged(e) {
    console.log(e.index);
    if (e.index == 0) {
      this.tab1 = true;
      this.tab2 = false;
    } else if (e.index == 1) {
      this.tab1 = false;
      this.tab2 = true;
    }
  }
}
export class LeaseContract {
  public contract_no: string;
  public lease_code: any; // Changed to string assuming it's a formatted string
  public contract_date: any | null;
  public contact_Type: number | null; // Assuming it's an integer
  public sdp: string; // Changed from SDP to match the naming convention
  public branch_name: string; // Changed to match the naming convention
  public worda: string; // Changed from Worda to match the naming convention
  public phone_no: string;
  public Con_level: any;
  public team_leader_approved_by: any;
  public lease_owner_appreved_by: any;

}
