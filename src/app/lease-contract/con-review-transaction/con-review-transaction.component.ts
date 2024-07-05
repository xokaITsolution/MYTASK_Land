import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LeaseContractService } from '../lease-contract.service';
import { NotificationsService } from 'angular2-notifications';
// import { ServiceComponent } from 'src/app/service/service.component';
import { ServiceService } from 'src/app/service/service.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-con-review-transaction',
  templateUrl: './con-review-transaction.component.html',
  styleUrls: ['./con-review-transaction.component.css']
})
export class ConReviewTransactionComponent implements OnInit {
  AppNo: any;
  newConReviewTran: conReviewTran = {} as conReviewTran;
  licenceData: any;
  licenceService: any;

  constructor(private _toast: MessageService, public _service: LeaseContractService,
    private activatedRoute: ActivatedRoute, public ServiceService: ServiceService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((p) => {
      console.log("Observable Params:", p);
      this.AppNo = p["AppNo"];
    });
    this.get_license_service();
    // this.get_contract_type();
    this.newConReviewTran.ID = Guid.create().toString();
  }
  get_license_service() {
    debugger
    this._service.get_license_service(this.AppNo).subscribe((data) => {
      this.licenceService = data;
      this.licenceData = this.licenceService.list[0];
      console.log("get_license_service", this.licenceData);

      this._service.ploteId = this.licenceData.Parcel_ID;
        // this.get_woreda(this.licenceData.Parcel_ID);

    //   this._service.get_by_ID(this.licenceData.Application_No).subscribe(data => {
    //     // console.log('lease_p_head:', data['proc_Lease_Payment_Heads'][0]);
    //     debugger
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
  updateConReviewTran() {
    // this.newLeaseContract.sdp=this.orginizationlookup.organization_code;
    // this.get_contract_type1(this.newLeaseContract.contact_Type);
    this._service.updateConReviewTran(this.newConReviewTran).subscribe(
      (response) => {
        // this.showToast('success', 'success', 'Success');
        this.notificationsService.success("Success", "Successfully Updated");
        // this.enablenext = true;
        // this.showForm=true;
        // this.ServiceService.disablefins = false;
      },
      (error) => {
        // this.showToast('error', 'error', `unable to update lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        this.notificationsService.error("error", `unable to update lease_contract! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        // itHasError = false;
      }
    );
  }
  InsertnewConReviewTran() {
    // this.newLeaseContract.sdp=this.orginizationlookup.organization_code;
    // this.get_contract_type1(this.newLeaseContract.contact_Type);
    // if ((this.newLeaseContract.lease_code != null && this.newLeaseContract.lease_code != "")) {
      // debugger
      this._service.insert_data(this.newConReviewTran).subscribe(
        data => {
          // this./_service.contract_NO= this.newLeaseContract.contract_no
          // this.contractList=[this.newLeaseContract];
          // this.enablenext = true;
          // this.isnew = false;
          this.notificationsService.success("Success", "Success");
          console.log('newLeaseContract :: ', data);
        },
        error => {
          this.notificationsService.error("error", `insert lease contract error! ${error['status'] == 0 ? error['message'] : JSON.stringify(JSON.stringify(error['error']))}`);
        }
      );
   
  }
}
export class conReviewTran {
  public ID: any;
  public Proporty_ID: any; // Changed to string assuming it's a formatted string
  public Date: any | null;
  public Proporty_Status: any | null; // Assuming it's an integer
 
}