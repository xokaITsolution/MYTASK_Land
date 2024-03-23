import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GisComponent } from "./gis/gis.component";
import { ServiceComponent } from "./service.component";
import { CertletterComponent } from "./certletter/certletter.component";

const routes: Routes = [
  {
    path: "service/:formcode",
    component: ServiceComponent,
    pathMatch: "prefix",
  },
  {
    path: "service/:id/:SDP_ID/:tskID/:formcode",
    component: ServiceComponent,
    pathMatch: "prefix",
  },
  {
    path: "service/:formcode/:AppNo/:tskID/:DocId/:todoid/:TaskStatus",
    component: ServiceComponent,
    pathMatch: "prefix",
  },
  {
    path: "services/:id/:AppNo/:tskTyp/:tskID/:docid/:todoID/:formcode",
    component: ServiceComponent,
    pathMatch: "prefix",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {}
