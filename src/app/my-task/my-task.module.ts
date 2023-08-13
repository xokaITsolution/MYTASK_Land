import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTaskRoutingModule } from './my-task-routing.module';
import { TaskComponent } from './task.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { SupervisorTaskComponent } from './supervisor-task/supervisor-task.component';
import { MyTaskService } from './my-task.service';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ToastModule } from 'primeng/toast';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    SimpleNotificationsModule,
    MyTaskRoutingModule,
    TranslateModule.forChild({}),
    NgxSmartModalModule
  ],
  declarations: [TaskComponent, MyTaskComponent, SupervisorTaskComponent,],
  providers: [MyTaskService]
})
export class MyTaskModule {
}
