import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Survey from "survey-angular";
import { ServiceService } from '../../service/service.service';
import { MessageService} from 'primeng/api';
import {NotificationsService} from 'angular2-notifications';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { Guid } from 'guid-typescript';
import { LeaseContractService } from '../lease-contract.service';

@Component({
  selector: 'app-con-review-transaction-detail',
  templateUrl: './con-review-transaction-detail.component.html',
  styleUrls: ['./con-review-transaction-detail.component.css']
})
export class ConReviewTransactionDetailComponent implements OnInit {
  @Output() completedTORequiredAction = new EventEmitter();
  formMeta:any;
  Mode =null;
  @Input() licenceData;
  // @Input() PreAppData
  // @Input() Licence_Service_ID
  PreAppData_data
  transId
  procProportyDataCollectionTransactiondata

  formData: any;
  surveyModel: any;
  json;
  data: any;
  ID = "surveyDisp";
  PropertyDynamicDataCollectionTransaction: any;
  userid: any;

  constructor(
    private notificationsService: NotificationsService,
    private service: LeaseContractService
  ) { }

   coords
  ngOnInit() {
    navigator.geolocation.getCurrentPosition((loc) => {
      console.log(loc.coords.latitude, loc.coords.longitude);
      this.coords = loc.coords.latitude + " " + loc.coords.longitude
    })
    console.log('looking for environment.username', environment.username);

    this.service.getViewAspNetUsersWorkInfoDetail(environment.username).subscribe((res) => {
      console.log('environment.username',res[0].userId);
      this.userid = res[0].userId
   })
  }

  ngOnChanges(changes) {
    
    if (changes.licenceData.currentValue != undefined ) {
      console.log('PreAppData',changes);
      this.PreAppData_data = changes.licenceData.currentValue.Licence_Service_ID
      console.log('PreAppData',this.PreAppData_data);
      if (this.PreAppData_data != undefined ) {
        this.service.getPropertyDynamicDataCollectionTransactionByTransId(this.PreAppData_data).subscribe((res: any) => {
          // debugger
          console.log('getPropertyDynamicDataCollectionTransactionByTransId',res);
          this.procProportyDataCollectionTransactiondata = res;
          console.log('this.procProportyDataCollectionTransactiondata: ',this.procProportyDataCollectionTransactiondata );
          
          debugger
         this.viewform(res.proc_Con_Review_Transaction_Details[0].jsonData);
      })

      }
  }
  }

  viewform(data: any): any {
     console.log(data);
     debugger
    this.surveyModel = new Survey.Model(data);
    try {
       this.surveyModel.data = JSON.parse(data);
    }
    catch (e) {
      console.error('unable to parse json data');
    }
    if (this.Mode) {
      this.surveyModel.mode = this.Mode; // 'display';
      Survey.SurveyNG.render(this.ID, { model: this.surveyModel });
    } else {
      Survey.SurveyNG.render(this.ID, { model: this.surveyModel });
      this.surveyModel.onComplete.add((result) => {
        console.log("result", result);
        this.saveToDB(result.data)
        // this.completed.emit(result.data);
      });
    }
  }

  saveToDB(data) {
    let coords;
    navigator.geolocation.getCurrentPosition((loc) => {
      console.log(loc.coords.latitude, loc.coords.longitude);
      coords = loc.coords.latitude + " " + loc.coords.longitude
      console
    })
    let dynamicdata: procProportyDataCollectionTransaction = {
      trans_ID : this.procProportyDataCollectionTransactiondata.procProportyDataCollection[0].trans_ID ,
      property_ID: this.procProportyDataCollectionTransactiondata.procProportyDataCollection[0].property_ID,
      transaction_Date: this.procProportyDataCollectionTransactiondata.procProportyDataCollection[0].transaction_Date,
      collected_by_user: this.userid,
      dinamic_Form_Data: JSON.stringify(data),
      location : coords,
      approved: this.procProportyDataCollectionTransactiondata.procProportyDataCollection[0].approved
    }
    console.log(dynamicdata);

    this.service.updatePropertyDynamicDataCollectionTransactionByTransId(dynamicdata).subscribe((res) => {
      console.log(res);
      const toast = this.notificationsService.success("Sucess"); 
      this.completedTORequiredAction.emit()
    },(error) => {
      const toast = this.notificationsService.error("error");
    }
      )
  }
}
export interface procProportyDataCollectionTransaction {
  trans_ID: any,
  property_ID: any,
  transaction_Date: any,
  collected_by_user: any,
  dinamic_Form_Data: string,
  location: any,
  approved: boolean
}

// export class ConReviewTranDetail {
//   public DID: any;
//   public Trans_ID: any;
//   public collection_Date: any;
//   public Location: any;
//   public JsonData: any;
//   public JsonData_validation: any;
//   public JsonData_approve: any;
//   public Collected_By: any;
//   public validated_Gy: any;
//   public approved_By: any;
//   public collected_date: any;
//   public validated_date: any;
//   public approved_date: any;
//   public There_Program_Chnage: any;
//   public There_is_Use_chnaged: any;
// }