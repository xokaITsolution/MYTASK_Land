import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaseContractRoutingModule } from './lease-contract-routing.module';
import { LeaseContractComponent } from './lease-contract/lease-contract.component';

import { LeaseContractService } from './lease-contract.service';
import { ServiceModule } from '../service/service.module';


@NgModule({
  declarations: [LeaseContractComponent],
  imports: [
    CommonModule,
    LeaseContractRoutingModule,
    ServiceModule
  ],
  providers:[LeaseContractService]
})
export class LeaseContractModule { }
