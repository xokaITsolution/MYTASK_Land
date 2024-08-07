import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTaskRoutingModule } from './my-task-routing.module';
import { TaskComponent } from './task.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { SupervisorTaskComponent } from './supervisor-task/supervisor-task.component';
import { MyTaskService } from './my-task.service';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { ToastModule } from 'primeng/toast';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { AccordionModule, BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ServiceRoutingModule } from '../service/service-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ArchwizardModule } from 'angular-archwizard';
import { CheckboxModule } from 'primeng/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FieldsetModule } from 'primeng/fieldset';
import { ServiceService } from '../service/service.service';
import { ServiceComponent } from '../service/service.component';
import { MessageService } from 'primeng/api';
import { PersonComponent } from './person/person.component';
import { ArchiveComponent } from './archive/archive.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { OtpComponent } from './my-task/otp/otp.component';
import { CertificateCheckStatusComponent } from './certificate-check-status/certificate-check-status.component';
@NgModule({
  imports: [
    CommonModule,
    NgxDocViewerModule,
    TableModule,
    FormsModule,
    ToastModule,
    TableModule,
    SimpleNotificationsModule,
    MyTaskRoutingModule,
    TranslateModule.forChild({}),
    NgxSmartModalModule,
    DialogModule,
    CommonModule,
    FormsModule,
    ServiceRoutingModule,
    AngularFontAwesomeModule,
    TableModule,
    SimpleNotificationsModule.forRoot(),
    ArchwizardModule,
    TabsModule.forRoot(),
    CheckboxModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    NgxSpinnerModule,
    AccordionModule,
    FieldsetModule,
    FileUploadModule,
    TranslateModule.forChild({}),
    NgxSmartModalModule.forChild(),
  ],
  declarations: [TaskComponent, MyTaskComponent, PersonComponent,SupervisorTaskComponent, ArchiveComponent, OtpComponent, CertificateCheckStatusComponent,],
  providers: [MyTaskService, MessageService, NgxSmartModalService]
})
export class MyTaskModule {
}
