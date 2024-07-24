import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Survey from "survey-angular";
import { ServiceService } from '../../service/service.service';
import { MessageService} from 'primeng/api';
import {NotificationsService} from 'angular2-notifications';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-con-review-transaction-detail',
  templateUrl: './con-review-transaction-detail.component.html',
  styleUrls: ['./con-review-transaction-detail.component.css']
})
export class ConReviewTransactionDetailComponent implements OnInit {
 
 
  @Output() completed = new EventEmitter();
  @Input() formData;
  Mode:string
 
  surveyModel: any;
  json;
  data: any;
  ID = "surveyElementDisplay";
  userid: any;
  id: any;

  constructor(
    private notificationsService: NotificationsService,
    private service: ServiceService

  ) { }



  ngOnInit() {
    this.service.DisableFormb
    let propType= this.service.getPropertyTypeId()
    // console.log('getPropertyTypeIdp',propType);
   // console.log('Guid',Guid.create());
    this.id = Guid.create()
    this.id = this.id.value
    console.log('Guid.',this.id);
    
    // console.log('this.service.getPropertyTypeId',this.service.getPropertyTypeId());
    
     this.service.getPropertyTypeForm( this.service.getPropertyTypeId()).subscribe((res: any) => {
      // console.log('this is the empty form ',res);
      let emptyForm = res.procProportyType[0].static_Json_from
      // if (this.formData) {
      //   // console.log('this static formData',this.formData);
      //       this.viewform(this.formData);
      //     }
          this.service.getPropertyStaticForm().subscribe((res:any) => {
    console.log(res);
    let staticdata= res.procProportyStaticdata.filter(x=>x.property_ID==this.service.getPropertyId())
    this.formData = staticdata[0].static_form_Data 
      if(this.formData || this.service.DisableFormb ==true){
      this.Mode='Display'
    }
    //console.log('this static formData',this.formData);
    
    if (emptyForm && this.formData) {
      this.viewform(emptyForm);
    }
  })
 if (!this.formData) {
      this.viewform(emptyForm);
    }

    })


    // console.log('looking for environment.username', environment.username);
   
    this.service.getViewAspNetUsersWorkInfoDetail(environment.username).subscribe((res) => {
      // console.log('environment.username',res[0].userId);
      this.userid = res[0].userId
   })
   
    // this.formcode = params['formcode'];
   

  }

  

  viewform(data: any): any {
    // console.log(data);
    this.surveyModel = new Survey.Model(data);
    try {
      this.surveyModel.data = JSON.parse(this.formData);
    }
    catch (e) {
      console.error('unable to parse json data');
    }
    if (this.Mode ) {
      this.surveyModel.mode = this.Mode; // 'display';
      Survey.SurveyNG.render(this.ID, { model: this.surveyModel });
    } else if (this.service.DisableFormb ==false){
      Survey.SurveyNG.render(this.ID, { model: this.surveyModel });
     
      this.surveyModel.onComplete.add((result) => {
        // console.log("result", result);
        this.saveToDB(result.data)
        this.completed.emit(result.data);
      });
    }
  }

  saveToDB(data) {
    let dynamicdata: ProcProportyStaticData = {
      id : this.id,
      property_ID: this.service.getPropertyId(),
      static_form_Data: JSON.stringify(data),
      collection_Date: new Date(),
      is_Active: false
    }
    console.log(dynamicdata);
    
    this.service.savePropertyStaticForm(dynamicdata).subscribe((res) => {
      // console.log(res);
      const toast = this.notificationsService.success("Sucess");
    },(error) => {
      const toast = this.notificationsService.error("error");
    }  
    )
  }
}
export interface ProcProportyStaticData {
  id: any,
  property_ID: any,
  static_form_Data: any,
  collection_Date: any,
  is_Active: boolean,
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