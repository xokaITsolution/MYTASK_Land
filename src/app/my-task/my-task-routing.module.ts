import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyTaskComponent } from "./my-task/my-task.component";
import { SupervisorTaskComponent } from "./supervisor-task/supervisor-task.component";
import { TaskComponent } from "./task.component";
import { GisComponent } from "../service/gis/gis.component";
//import { DrawmapComponent } from "../components/drawmap/drawmap.component";
import { GeojsondeskComponent } from "../components/geojsondesk/geojsondesk.component";
import { PersonComponent } from "./person/person.component";
import { ArchiveComponent } from "./archive/archive.component";
import { TestgismapComponent } from "../service/testgismap/testgismap.component";
import { GisMapComponent } from "../service/gis-map/gis-map.component";

import { NetworkDatabaseMonitoringToolComponent } from "../service/network-database-monitoring-tool/network-database-monitoring-tool.component";
import { CertificateCheckStatusComponent } from "./certificate-check-status/certificate-check-status.component";
import { CompensationPaymentComponent } from "../lease-contract/compensation-payment/compensation-payment.component";

const routes: Routes = [
  {
    path: "task",
    component: TaskComponent,
    pathMatch: "prefix",
    children: [
      {
        path: "mehari",
        component: GeojsondeskComponent,
        pathMatch: "prefix",
      },
      // {
      //   path: "draw",
      //   component: DrawmapComponent,
      //   pathMatch: "prefix",
      // },
      {
        path: "MyTask",
        component: MyTaskComponent,
        pathMatch: "prefix",
      },
      {
        path: "SupervisorTask",
        component: SupervisorTaskComponent,
        pathMatch: "prefix",
      },
      {
        path: "compensation-payment",
        component: CompensationPaymentComponent,
        pathMatch: "prefix",
      },
      {
        path: "Customer",
        component: PersonComponent,
        pathMatch: "prefix",
      },
      {
        path: "Certificate",
        component: CertificateCheckStatusComponent,
        pathMatch: "prefix",
      },
      {
        path: "Gis/Arada_AddisLand",
        component: GisMapComponent,
        pathMatch: "prefix",
      },
      {
        path: "Archive",
        component: ArchiveComponent,
        pathMatch: "prefix",
      },
      {
        path: "NetworkMonitoring",
        component: NetworkDatabaseMonitoringToolComponent,
        pathMatch: "prefix",
      },
      {
        path: "",
        redirectTo: "task",
        pathMatch: "prefix",
      },
      { path: "**", redirectTo: "/task/MyTask", pathMatch: "prefix" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTaskRoutingModule {}
