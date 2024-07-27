import { ServiceService } from './../../service/service.service';
import { Component, EventEmitter, Input, Output, ViewChild, } from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { NotificationsService } from "angular2-notifications";
import { LeasePaymentHeadDetail } from "../model/LeasePaymentHeadDetail";
import { LeasePaymentHeadDetailComponent } from "../lease-payment-head-detail/lease-payment-head-detail.component";
import { ActivatedRoute } from '@angular/router';
import { LeaserPaymentHead } from '../model/LeaserPaymentHead';
import { LeaseContractService } from '../lease-contract.service';

@Component({
  selector: "app-land-wizard",
  templateUrl: "./land-wizard.component.html",
  styleUrls: ["./land-wizard.component.css"],
})
export class LandWizardComponent {
  items: MenuItem[];
  @Input() AppNo;
  @Input() tskID;
  @Input() disable;
  @Output() completed = new EventEmitter();
  leaserPaymentHead: LeaserPaymentHead = new LeaserPaymentHead();
  @ViewChild(LeasePaymentHeadDetailComponent, { static: false }) childComponent: LeasePaymentHeadDetailComponent;
  // @ViewChild(LeasePaymentHeadDetailComponent) childComponent: LeasePaymentHeadDetailComponent;

  activeIndex: number = 0;
  tab1: boolean;
  tab2: boolean;
  selectedTab = 0;
  selectedTab1 = 0;
  Application_No: any;
  contractList:any[]=[];

  constructor(
    public messageService: MessageService,
    private notificationsService: NotificationsService,
    public ServiceService:ServiceService,
    private activatedRoute: ActivatedRoute,
    private _service: LeaseContractService,
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: "Leaser Payment Head",
        command: (event: any) => {
          this.activeIndex = 0;
        },
      },
      {
        label: "Leaser Payment Head Detail",
        command: (event: any) => {
          this.activeIndex = 1;
        },
      },
    ];
    this.ServiceService.disable=this.disable
    this.ServiceService.tskID=this.tskID;
    console.log("this.tskID",this.tskID);

    this.activatedRoute.params.subscribe((p) => {
      console.log("Observable Params:", p);
      // this.ServiceService.tiltledeed = p["AppNo"];
      this.Application_No = p["AppNo"];
    });
    this.getLeasPaymentHeadData(this.Application_No);
  }

  next() {
    this.activeIndex = 1;
    this.childComponent.getLeasPaymentHeadDataDetail();
  }
  nextClicked(){
    this.childComponent.getLeasPaymentHeadDataDetail();
    this.completed.emit();
    // debugger
  }
  prv() {
    this.activeIndex = 0;
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
  selectprop(propose){
    debugger
  }
  getLeasPaymentHeadData(appNo: any) {
    
    this._service.getView_lease_payment_head(appNo).subscribe(
      (response:any) => {
        if ([response].length>0){
          debugger
          if (Array.isArray(response)) {
            this.contractList = response;
          } else {
            this.contractList = [response];
          }
      
        // this.contractList=[response]
        // let data = [response]
        // this.leaserPaymentHead.Lease_code = data.lease_code;
        // this._service.lease_code=data.lease_code;
       
        }
        else{
          // 
          this.ServiceService.getPlotManagementApi(this.ServiceService.Parcel_ID).subscribe(
            async (res: any) => {
              
              let appno= res["procPlot_Registrations"][0].application_No 
              this._service.getDataById(res["procPlot_Registrations"][0].application_No ).subscribe(
                (response) => { 
              let data = response.proc_Lease_Payment_Heads[0];
              this.leaserPaymentHead.Lease_code = data.lease_code;
              this._service.lease_code=data.lease_code;
         
            })
          })
        }
        
      },
      (error) => {
        this.notificationsService.error("Error", "error geting head data");
      }
    );
  }
}


export class leaserPaymentHead {
  public Application_No: any;
  public Plot_ID: any;
  public Property_ID: any;
  public Lease_code: any;
  public Plot_Size_M2: any;
}