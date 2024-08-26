import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  newConstraction_review: Constraction_review = {} as Constraction_review;
  @Input() licenceData:any
  @Output() completed = new EventEmitter();
  licenceService: any;

  constructor(private _toast: MessageService, public _service: LeaseContractService,
    private activatedRoute: ActivatedRoute, public ServiceService: ServiceService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
  this.get_constraction_review();
  this.licenceData.Parcel_ID
  debugger
  }
  get_constraction_review(){
    this._service.get_constraction_review( this.licenceData.Parcel_ID).subscribe(data=>{
      debugger
        let data1=this.newConstraction_review=data["proc_Lease_Contraction_Propertys"][0]
        this.newConstraction_review.plot_id=data1.plot_ID
        this.newConstraction_review.property_id=data1.proporty_ID
        this.newConstraction_review.design_in_month_start_date=data1.design_in_Month_StartDate.split("T")[0]
        this.newConstraction_review.design_in_month_end_date=data1.design_in_MonthEnd_Date.split("T")[0]
        this.newConstraction_review.building_licence_start_date=data1.building_Licence_StartDate.split("T")[0]
        this.newConstraction_review.building_licence_end_date=data1.building_Licence_EndDate.split("T")[0]
        this.newConstraction_review.extende_month=data1.con_Period_Extended_Month
        this.newConstraction_review.start_constraction_period_start_date=data1.start_Con_Period_Normal_startDate.split("T")[0]
        this.newConstraction_review.start_constraction_period_end_date=data1.start_Con_Period_Normal_Endate.split("T")[0]
        this.newConstraction_review.end_constraction_period_start_date=data1.end_Con_Period_Normal_startDate.split("T")[0]
        this.newConstraction_review.end_constraction_period_end_date=data1.end_Con_Period_Normal_enddate.split("T")[0]
        this.newConstraction_review.extended_start_date=data1.end_Con_Period_Extended_start_date.split("T")[0]
        this.newConstraction_review.extended_end_date=data1.end_Con_Period_Extended_Endate.split("T")[0]
    })
  }
}
export class Constraction_review {
  public plot_id: any;
  public property_id: any;
  public design_in_month_start_date: any;
  public design_in_month_end_date: any; // Changed to string assuming it's a formatted string
  public building_licence_start_date: any | null;
  public building_licence_end_date: any | null; // Assuming it's an integer
  public start_constraction_period_start_date: any;
  public start_constraction_period_end_date: any; // Changed to string assuming it's a formatted string
  public approved_start: any | null;
  public penality_start: any | null; // Assuming it's an integer
  public end_constraction_period_start_date: any;
  public end_constraction_period_end_date: any; // Changed to string assuming it's a formatted string
  public approved_end: any | null;
  public penality_end: any | null; // Assuming it's an integer
  public extended_start_date: any;
  public extended_end_date: any; // Changed to string assuming it's a formatted string
  public extende_month: any | null;
}