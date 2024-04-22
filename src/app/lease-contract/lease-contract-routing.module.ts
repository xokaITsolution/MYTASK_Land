import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaseContractComponent } from './lease-contract/lease-contract.component';

const routes: Routes = [
  { path: 'lease-contract', component: LeaseContractComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaseContractRoutingModule { }
