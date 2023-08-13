import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DrawmapComponent } from "./components/drawmap/drawmap.component";
import { GeojsondeskComponent } from "./components/geojsondesk/geojsondesk.component";

const routes: Routes = [
  // {
  //   path: "",
  //   component: GeojsondeskComponent,
  // },
  // {
  //   path: "draw",
  //   component: DrawmapComponent,
  // },
  {
    path: "*",
    redirectTo: "/task/MyTask/",
    pathMatch: "prefix",
  },
  {
    path: "**",
    redirectTo: "/task/MyTask",
    pathMatch: "prefix",
  },
  {
    path: "**",
    redirectTo: "/am-et/task/MyTask",
    pathMatch: "prefix",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
