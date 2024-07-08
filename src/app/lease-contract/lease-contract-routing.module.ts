import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { FreeHoldToLeaseComponent } from './free-hold-to-lease/free-hold-to-lease.component';
// import { LeasePaymentHeadComponent } from './lease-payment-head/lease-payment-head.component';

// const routes: Routes = [
//   { path: 'lease-contract', component: LeaseContractComponent }
  
// ];
const routes: Routes = [
  // { path: '', component: FreeHoldToLeaseComponent },
  // { path: 'Leasepayment', component: LeasePaymentHeadComponent}
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaseContractRoutingModule {}
