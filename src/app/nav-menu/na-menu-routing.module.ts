import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CounterComponent } from '../counter/counter.component';
import { FetchDataComponent } from '../fetch-data/fetch-data.component';
import { HomeComponent } from '../home/home.component';
import { NavMenuComponent } from './nav-menu.component';


const routes: Routes = [{
    
        path: 'NavMenu',
        
        component: NavMenuComponent,
        pathMatch: 'prefix' ,
        children:[  {
  path: 'NavMenu/home',
  component: HomeComponent,
  pathMatch: 'prefix'},
    {
      path: 'NavMenu/counter',
      component: CounterComponent,
      pathMatch: 'prefix'
    },
    {
      path: 'NavMenu/fetch-data',
      component: FetchDataComponent,
      pathMatch: 'prefix'
    },
]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaMenukRoutingModule {
}
