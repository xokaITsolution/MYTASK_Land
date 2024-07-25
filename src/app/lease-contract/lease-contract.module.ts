import { NgModule } from "@angular/core";
import { LeaseContractService } from "./lease-contract.service";
import { LandWizardComponent } from "./land-wizard/land-wizard.component";
import { LeasePaymentHeadComponent } from "./lease-payment-head/lease-payment-head.component";
import { LeasePaymentHeadDetailComponent } from "./lease-payment-head-detail/lease-payment-head-detail.component";
import { CommonModule } from "@angular/common";
import { LeaseContractRoutingModule } from "./lease-contract-routing.module";
// import { ServiceModule } from "../service/service.module";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from "@angular/forms";
import { Steps, StepsModule } from "primeng/steps";
import { LeasePaymentHeadDetail } from "./model/LeasePaymentHeadDetail";
import { CheckboxModule } from "primeng/checkbox";
import { LeaseContractComponent } from "./lease-contract/lease-contract.component";
import { LeaseToLeaseComponent } from "./lease-to-lease/lease-to-lease.component";
import { FreeHoldToLeaseComponent } from "./free-hold-to-lease/free-hold-to-lease.component";
import { TabViewModule } from 'primeng/tabview'; 
import { FieldsetModule } from 'primeng/fieldset';
import { ToastModule } from 'primeng/toast';
import { ConReviewTransactionComponent } from './con-review-transaction/con-review-transaction.component';
import { ConReviewTransactionDetailComponent } from './con-review-transaction-detail/con-review-transaction-detail.component';


@NgModule({
  imports: [
    CommonModule,
    LeaseContractRoutingModule,
    // ServiceModule,
    CardModule,
    TabViewModule,
    ReactiveFormsModule,
    StepsModule,
    CheckboxModule,
    FormsModule,
    ToastModule,
    TableModule,
    FieldsetModule
  ],
  declarations: [
    LandWizardComponent,
    LeasePaymentHeadComponent,
    LeasePaymentHeadDetailComponent,
    LeaseContractComponent,
    LeaseToLeaseComponent,
    FreeHoldToLeaseComponent,
    ConReviewTransactionComponent,
    ConReviewTransactionDetailComponent
  ],
  providers: [LeaseContractService],
  exports: [LeaseContractComponent,LandWizardComponent,ConReviewTransactionComponent,ConReviewTransactionDetailComponent],
})
export class LeaseContractModule {}
