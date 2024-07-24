import { ServiceService } from './../../service/service.service';
import { Component, EventEmitter, Input, Output, ViewChild, } from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { NotificationsService } from "angular2-notifications";
import { LeasePaymentHeadDetail } from "../model/LeasePaymentHeadDetail";
import { LeasePaymentHeadDetailComponent } from "../lease-payment-head-detail/lease-payment-head-detail.component";

@Component({
  selector: "app-land-wizard",
  templateUrl: "./land-wizard.component.html",
  styleUrls: ["./land-wizard.component.css"],
})
export class LandWizardComponent {
  items: MenuItem[];
  @Input() AppNo;
  @Input() disable;
  @Output() completed = new EventEmitter();
  @ViewChild(LeasePaymentHeadDetailComponent, { static: false }) childComponent: LeasePaymentHeadDetailComponent;
  // @ViewChild(LeasePaymentHeadDetailComponent) childComponent: LeasePaymentHeadDetailComponent;

  activeIndex: number = 0;
  tab1: boolean;
  tab2: boolean;
  selectedTab = 0;
  selectedTab1 = 0;

  constructor(
    public messageService: MessageService,
    private notificationsService: NotificationsService,
    public ServiceService:ServiceService
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
}
