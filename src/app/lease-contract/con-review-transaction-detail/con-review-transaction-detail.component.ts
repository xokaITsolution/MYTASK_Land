import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LeaseContractService } from '../lease-contract.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ServiceService } from 'src/app/service/service.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-con-review-transaction-detail',
  templateUrl: './con-review-transaction-detail.component.html',
  styleUrls: ['./con-review-transaction-detail.component.css']
})
export class ConReviewTransactionDetailComponent implements OnInit {
  AppNo: any;
  licenceService: any;
  licenceData: any;
  newConReviewTranDetail: ConReviewTranDetail = {} as ConReviewTranDetail;
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
    this.newConReviewTranDetail.DID = Guid.create().toString();
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
    this._service.updateConReviewTran(this.newConReviewTranDetail).subscribe(
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
      this._service.insert_data(this.newConReviewTranDetail).subscribe(
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
export class ConReviewTranDetail {
  public DID: any;
  public Trans_ID: any;
  public collection_Date: any;
  public Location: any;
  public JsonData: any;
  public JsonData_validation: any;
  public JsonData_approve: any;
  public Collected_By: any;
  public validated_Gy: any;
  public approved_By: any;
  public collected_date: any;
  public validated_date: any;
  public approved_date: any;
  public There_Program_Chnage: any;
  public There_is_Use_chnaged: any;
}