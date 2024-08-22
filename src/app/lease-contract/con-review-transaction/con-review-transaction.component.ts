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
  newConstraction_review: Constraction_review = {} as Constraction_review;
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
    // this.newConstraction_review.ID = Guid.create().toString();
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