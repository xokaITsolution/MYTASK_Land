import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MessageService} from 'primeng/api';
import {CertificateVersionService} from './certificate-version.service';
import {ServiceComponent} from '../service.component';
import {NotificationsService} from 'angular2-notifications';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {DomSanitizer} from '@angular/platform-browser';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-certificate-version',
  templateUrl: './certificate-version.component.html',
  styleUrls: ['./certificate-version.component.css'],
  providers: [MessageService]
})

export class CertificateVersionComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  public certificateVersion: CertificateVersion;
  ID = 0;
  isnew = false;
  pictoShow;
  pictoShow1;
  DeedTable;
  
  @Input() licenceData;
  @Input() Selectedcert;
  @Input() SelectedBase;
  @Input() disable;
  Saved = false ;
  @Input() Plot_Registration;
  organization: any;
  data: any;
  aa: boolean;

  constructor(private ngxSmartModalService: NgxSmartModalService,
              private messageService: MessageService,
              public serviceService: ServiceService,
              private certificateVersionService: CertificateVersionService,
              private sanitizer: DomSanitizer,
              public serviceComponent: ServiceComponent, private notificationsService: NotificationsService) {
    this.certificateVersion = new CertificateVersion();
  }

  ngOnChanges() {
   
    console.log('hahaha2', this.Selectedcert);
    console.log('hahaha1', this.SelectedBase);
    this.certificateVersion = this.Selectedcert;
    if (this.certificateVersion.Photo) {
      this.pictoShow = 'data:image/jpg;base64, ' + this.certificateVersion.Photo;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(this.pictoShow);
    }
    if (this.certificateVersion.Partner_Photo) {
      this.pictoShow1 = 'data:image/jpg;base64, ' + this.certificateVersion.Partner_Photo;
      this.pictoShow1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.pictoShow);
    }
    this.getDeed();
    if (!this.certificateVersion.Version_ID) {
      this.isnew = true;
    } else {
      this.isnew = false;
    }
  }
  // getorglokup(){
  //   this.serviceService.getServiceDeliveryUnitLookUP().subscribe(
  //     data=>{

  //     }
  //   )
  // }

  getDeed() {
    this.certificateVersionService.getDeedTable(this.SelectedBase.Plot_ID).subscribe(DeedTable => {
      this.DeedTable = DeedTable;
      // this.DeedTable = (Object.assign([], this.DeedTable));
      console.log('DeedTable', DeedTable);
    }, error => {
      console.log('error');
    });
  }

  Save() {
    this.certificateVersionService.SaveCertificate(this.certificateVersion).subscribe(certificateVersion => {
      console.log('certificateVersion', certificateVersion);
      const toast = this.notificationsService.success('Sucess', certificateVersion);
      if(!this.Saved){
        this.completed.emit();
        this.Saved = true;
      }
  
   
    }, error => {
      console.log(error);
      if (error.status == '400') {
        const toast = this.notificationsService.error('Error', error.error.InnerException.Errors[0].message);

      } else {
        const toast = this.notificationsService.error('Error', 'SomeThing Went Wrong');
      }
    });
    console.log('saveing....');
    /*console.log(this.certificateVersion);
    this.messageService.add({severity: 'error', sticky: true, summary: 'Error Message', detail: 'Validation failed'});
    this.messageService.add({severity: 'success', sticky: true, summary: 'Error Message', detail: 'Validation failed'});
    this.messageService.add({key: 'custom', sticky: true, severity: 'error', summary: 'Custom Toast', detail: 'With a Gradient'});*/
  }

  add() {
    this.certificateVersionService.AddCertificate(this.certificateVersion).subscribe(message => {
      console.log('message', message);
      const toast = this.notificationsService.success('Sucess', message);

      if(!this.Saved){
        this.completed.emit();
        this.Saved = true;
      }
    
  
    }, error => {
      console.log(error);
      if (error.status == '400') {
        const toast = this.notificationsService.error('Error', error.error.InnerException.Errors[0].message);

      } else {
        const toast = this.notificationsService.error('Error', 'SomeThing Went Wrong');
      }
    });
    console.log('saveing....');
  }

  AddNew() {
    this.certificateVersion = new CertificateVersion();
    // this.certificateVersion.Version_ID = this.Selectedcert.Version_ID;
    this.certificateVersion.Ownership_ID = this.Selectedcert.Ownership_ID;
    this.certificateVersion.Title_Deed_No = this.SelectedBase.Title_Deed_No;
    this.isnew = true;
  }


  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(organization, modal) {
    this.certificateVersion.Issued_By = organization.organization_code;
    console.log('closeing.....');
    console.log('closeing.....', organization.organization_code);
    this.ngxSmartModalService.getModal(modal).close();
  }
  
  Uploader(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener('loadend', (e) => {

      base64file = reader.result;
      const re = /base64,/gi;
      base64file = base64file.replace(re, '');
      base64file = base64file.split(';')[1];
      this.certificateVersion.Photo = base64file;
    });
  }


  upload(event) {
    this.Uploader(event.files[0]);
  }

  UploaderPartner(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener('loadend', (e) => {

      base64file = reader.result;
      const re = /base64,/gi;
      base64file = base64file.replace(re, '');
      base64file = base64file.split(';')[1];
      this.certificateVersion.Partner_Photo = base64file;
    });
  }


  uploadPartner(event) {
    this.Uploader(event.files[0]);
  }
}

class CertificateVersion {
  public Application_No: string;
  public Certificate_ID: number;
  public Version_ID: number;
  public Deed_ID: number;
  public Color: string;
  public Photo: string;
  public Serial_No: string;
  public Customer_Type_ID: string;
  public Remark: string;
  public Issued_By: string;
  public Expired_Date: string;
  public Is_Printed: boolean;
  public IsIssued: boolean;
  public Is_Active: boolean;
  public Version_No: string;
  public Built_Up_Area: string;
  public Ownership_ID;
  public Full_Name;
  public Title_Deed_No;
  public Parnter_Full_Name;
  public LocationName;
  public Compound_Size_M2;
  public Property_Status;
  public Property_Type;
  public TypeOfUser;
  public HouseNo;
  public Floor_No;
  public Building_No;
  public Size_In_Proportional;
  public Proportional_from_Compound_Size;
  public Woreda;
  public Block_No;
  public Parcel_No;
  public Street_No;
  public Land_Grade;
  public Nortech_No;
  public N_Plot_ID;
  public S_Plot_ID;
  public E_Plot_ID;
  public W_Plot_ID;
  public Partner_Photo;

}

