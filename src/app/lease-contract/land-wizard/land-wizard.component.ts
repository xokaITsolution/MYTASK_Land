import { ServiceService } from './../../service/service.service';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, } from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { NotificationsService } from "angular2-notifications";
import { LeasePaymentHeadDetail } from "../model/LeasePaymentHeadDetail";
import { LeasePaymentHeadDetailComponent } from "../lease-payment-head-detail/lease-payment-head-detail.component";
import { ActivatedRoute } from '@angular/router';
import { LeaserPaymentHead } from '../model/LeaserPaymentHead';
import { LeaseContractService } from '../lease-contract.service';
import { LeasePaymentHeadComponent } from '../lease-payment-head/lease-payment-head.component';

@Component({
  selector: "app-land-wizard",
  templateUrl: "./land-wizard.component.html",
  styleUrls: ["./land-wizard.component.css"],
})
export class LandWizardComponent implements AfterViewInit{
  items: MenuItem[];
  @Input() AppNo;
  @Input() licenceData:any;
  @Input() tskID;
  @Input() disable;
  @Output() completed = new EventEmitter();
  leaserPaymentHead: LeaserPaymentHead = new LeaserPaymentHead();
  @ViewChild(LeasePaymentHeadDetailComponent, { static: false }) childComponent: LeasePaymentHeadDetailComponent;
  @ViewChild(LeasePaymentHeadComponent, { static: false }) childComponent1: LeasePaymentHeadComponent;

  activeIndex: number = 0;
  tab1: boolean;
  tab2: boolean;
  selectedTab = 0;
  selectedTab1 = 0;
  Application_No: any;
  contractList:any[]=[];
  selectedRowIndex: number;
  showform: boolean=false;
  disabled: any;

  constructor(
    public messageService: MessageService,
    private notificationsService: NotificationsService,
    public ServiceService:ServiceService,
    private activatedRoute: ActivatedRoute,
    private _service: LeaseContractService,
    private cdr: ChangeDetectorRef
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
    this.disabled=this.disable
    this.ServiceService.tskID=this.tskID;
    console.log("this.tskID",this.tskID);
    this.getLeasPaymentHeadData(this.AppNo);
    this._service.completed=this.completed;
    this._service.Service_ID=this.licenceData.Service_ID;
    this._service.ploteId=this.licenceData.Parcel_ID;
    this._service.licenceData=this.licenceData
  }
  ngAfterViewInit() {
    // Ensures that child components are available after view initialization
    this.cdr.detectChanges();
  }
  next() {
    this.activeIndex = 1;
    this.childComponent.getLeasPaymentHeadDataDetail();
  }
  nextClicked(){
    this.childComponent.getLeasPaymentHeadDataDetail();
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
  selected(lease_contract,index: number){
    this.selectedRowIndex = index;
    this.showform = true;
    this.cdr.detectChanges();  // Ensure change detection is triggered
    // Use setTimeout to ensure the component is fully initialized before calling the method
    // 
    this._service.lease_code = lease_contract.lease_code
    setTimeout(() => {
      if (this.childComponent1) {
        this.childComponent1.getLeasPaymentHeadData(lease_contract.lease_code);
        
      }
    }, 0);
  }

  getLeasPaymentHeadData(ID: any) {
    // 
    this._service.getView_lease_payment_head(ID).subscribe(
      (response:any) => {
       debugger
        if (response.length>0){
          
          if (Array.isArray(response)) {
            this.contractList = response;
          } else {
            this.contractList = [response];
          }
        }
        else{ 
          // 
          this.ServiceService.getPlotManagementApi(this.licenceData.Parcel_ID).subscribe(
            async (res: any) => {
              // 
              // let appno= res["procPlot_Registrations"][0].application_No 
              this._service.getView_lease_payment_head(res["procPlot_Registrations"][0].application_No ).subscribe(
                (response) => { 
                  if (Array.isArray(response)) {
                    this.contractList = response;
                  } else {
                    this.contractList = [response];
                  }
              // this.leaserPaymentHead.Lease_code = data.lease_code;
              // this._service.lease_code=data.lease_code;
         
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