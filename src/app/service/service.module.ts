import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProgressBarModule } from "primeng/progressbar";
import { ServiceRoutingModule } from "./service-routing.module";
import { ServiceComponent } from "./service.component";
import { PlotManagmentComponent } from "./plot-managment/plot-managment.component";
import { LeaseOwnerShipComponent } from "./lease-owner-ship/lease-owner-ship.component";
import { PropertyRegisterComponent } from "./property-register/property-register.component";
import { MeasurmentComponent } from "./measurment/measurment.component";
import { TitleDeedRegistrationComponent } from "./title-deed-registration/title-deed-registration.component";
import { CertificateVersionComponent } from "./certificate-version/certificate-version.component";
import { ThemComponent } from "./them/them.component";
import { DeptSuspensionRecordComponent } from "./dept-suspension-record/dept-suspension-record.component";
import { SurveyComponent } from "./task-layout/layout.component";
import { ServiceService } from "./service.service";
import { TreeModule } from "primeng/tree";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { CertificateVersionService } from "./certificate-version/certificate-version.service";
import { DeptSuspensionRecordService } from "./dept-suspension-record/dept-suspension-record.service";
import { LeaseOwnerShipService } from "./lease-owner-ship/lease-owner-ship.service";
import { MeasurmentService } from "./measurment/measurment.service";
import { PloatManagmentService } from "./plot-managment/ploat-managment.service";
import { PropertyRegisterService } from "./property-register/property-register.service";
import { ThemService } from "./them/them.service";
import { TitleDeedRegistrationService } from "./title-deed-registration/title-deed-registration.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingComponent } from "../shared/loading/loading.component";
import { SimpleNotificationsModule } from "angular2-notifications";
import { TranslateModule } from "@ngx-translate/core";
import { SidebarModule } from "ng-sidebar";
import { BrowserModule } from "@angular/platform-browser";
import { DemoComponent } from "./demo/demo.component";
import { FileUploadModule } from "primeng/fileupload";
import { FormDisplayComponent } from "./form-display/form-display.component";
import { PlotComponent } from "./plot/plot.component";
import { PropertyComponent } from "./property/property.component";
import { CertComponent } from "./cert/cert.component";
import { GisComponent } from "./gis/gis.component";
import { TopGridComponent } from "./top-grid/top-grid.component";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { NgxSmartModalModule } from "ngx-smart-modal";
import { DialogModule } from "primeng/dialog";
import { ArchwizardModule } from "angular-archwizard";
import { RentContractComponent } from "./rent-contract/rent-contract.component";
import { ContractFormComponent } from "./rent-contract/contract-form/contract-form.component";
import { ConfirmationService } from "primeng/api";
import { PaymentComponent } from "./payment/payment.component";
import { TabViewModule } from "primeng/tabview";
import { CertletterComponent } from "./certletter/certletter.component";

//import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
//material
import {
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatGridListModule,
  MatCardModule,
  MatCheckboxModule,
  MatProgressBarModule,
} from "@angular/material";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ReportDialogComponent } from "./report-dialog/report-dialog.component";

//material
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { ExplorationLicenseComponent } from "./exploration-license/exploration-license.component";
import { NgxSimplePrintDirective } from "./ngx-simple-print.directive";
import { GisMapComponent } from "./gis-map/gis-map.component";
import { GisMapService } from "./gis-map/gis-map.service";
import { DatepickerEthiopianDirective } from "./datepicker-ethiopian.directive";
import { CustomAlertComponent } from "./gis-map/CustomAlertComponent";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TestgismapComponent } from "./testgismap/testgismap.component";
import { TreeComponentComponent } from "./tree-component/tree-component.component";
import { ExampleComponent } from "./loading/example.component";
@NgModule({
  imports: [
    //BackButtonDisableModule.forRoot({
    //  preserveScrollPosition: true
    // }),
    TreeModule,
    NgxDocViewerModule,
    TabViewModule,
    ArchwizardModule,
    NgxDocViewerModule,
    NgxSmartModalModule.forChild(),
    BrowserModule,
    CommonModule,
    FormsModule,
    ServiceRoutingModule,
    AngularFontAwesomeModule,
    ProgressSpinnerModule,
    TreeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    DialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    TableModule,
    TabsModule.forRoot(),
    CheckboxModule,
    ToastModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    TranslateModule.forChild({}),
    SidebarModule.forRoot(),
    NgxSpinnerModule,
    FileUploadModule,
    //material
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    //material
    OverlayPanelModule,
  ],

  declarations: [
    ExampleComponent,
    PaymentComponent,
    ServiceComponent,
    SurveyComponent,
    PlotManagmentComponent,
    LeaseOwnerShipComponent,
    PropertyRegisterComponent,
    MeasurmentComponent,
    TitleDeedRegistrationComponent,
    CertificateVersionComponent,
    CertletterComponent,
    ThemComponent,
    DeptSuspensionRecordComponent,
    LoadingComponent,
    DemoComponent,
    FormDisplayComponent,
    PlotComponent,
    PropertyComponent,
    CertComponent,
    GisComponent,
    TopGridComponent,
    SideMenuComponent,
    RentContractComponent,
    ContractFormComponent,
    ReportDialogComponent,
    ExplorationLicenseComponent,
    GisMapComponent,
    NgxSimplePrintDirective,
    DatepickerEthiopianDirective,
    CustomAlertComponent,
    TestgismapComponent,
    TreeComponentComponent,
  ],
  entryComponents: [GisMapComponent, CustomAlertComponent],
  providers: [
    ConfirmationService,
    ServiceService,
    GisMapService,
    MessageService,
    CertificateVersionService,
    DeptSuspensionRecordService,
    LeaseOwnerShipService,
    MeasurmentService,
    PloatManagmentService,
    PlotComponent,
    PropertyRegisterService,
    ThemService,
    TitleDeedRegistrationService,
  ],
})
export class ServiceModule {}
