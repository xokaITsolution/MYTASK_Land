import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyTaskComponent } from "./my-task/my-task.component";
import { SupervisorTaskComponent } from "./supervisor-task/supervisor-task.component";
import { TaskComponent } from "./task.component";
import { GisComponent } from "../service/gis/gis.component";
//import { DrawmapComponent } from "../components/drawmap/drawmap.component";
import { GeojsondeskComponent } from "../components/geojsondesk/geojsondesk.component";

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
        path: "Gis",
        component: GisComponent,
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
