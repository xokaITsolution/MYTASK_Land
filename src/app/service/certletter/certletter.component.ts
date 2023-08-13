import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {ServiceService} from '../service.service';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {NotificationsService} from 'angular2-notifications';
import {CertificateVersionService} from '../certificate-version/certificate-version.service';
import {ServiceComponent} from '../service.component';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-certletter',
  templateUrl: './certletter.component.html',
  styleUrls: ['./certletter.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CertletterComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Input() AppNo;
  @Input() certCode;
  @Input() disable;
  @Input() licenceData;
  certReportPath;
  LetterReportPath;
  isnew;
  public cerltter: Cerltter;
  cerlettrformList;
  cerlettrform = false;

  SelectedBase;
  BaseTable;
  Selectedcert;
  certltrview;
  DeedTableview;
  CertificateVersion;
  Saved=false;

  constructor(
    private sanitizer: DomSanitizer,
    public serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private certificateVersionService: CertificateVersionService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService) {
    this.cerltter = new Cerltter();
  }

  ngOnChanges() {
    // this.completed.emit();

    this.BaseTable = [];
    if (this.licenceData.Parcel_ID) {
      this.getBase(this.licenceData.Parcel_ID);
    }
    if (this.licenceData.Parcel_mearge1) {
      this.getBase(this.licenceData.Parcel_mearge1);
    }
    if (this.licenceData.Parcel_mearge2) {
      this.getBase(this.licenceData.Parcel_mearge2);
    }
    if (this.licenceData.Parcel_mearge3) {
      this.getBase(this.licenceData.Parcel_mearge3);
    }
    if (this.licenceData.Plot_Merge_4) {
      this.getBase(this.licenceData.Plot_Merge_4);
    }
  }

  getBase(ploat) {
    this.serviceService.getBaseTable(ploat).subscribe(BaseTable => {

      if (BaseTable) {
        this.BaseTable.push(BaseTable[0]);
      }
      // this.BaseTable = (Object.assign([], this.BaseTable));
      console.log('BaseTable', BaseTable);
    }, error => {
      console.log('error');
    });
  }

  Selectversion(certver) {
    this.Selectedcert = certver;
    this.certltrview = true;
    this.certReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(environment.certReportPath +
       '/' + this.AppNo +'/' +this.Selectedcert.Title_Deed_No );
    this.LetterReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(environment.LetterReportPath +
       '/' + this.AppNo );
    console.log('certver', certver);
  }

  SelectBase(base) {
    this.DeedTableview = true;
    this.SelectedBase = base;
    this.getCertificateVersion(base);
    console.log('base', base);

    this.getDocmentArcive();
  }


  getCertificateVersion(Base) {
    this.serviceService.getCertificateVersion(Base.Title_Deed_No).subscribe(CertificateVersion => {
      this.CertificateVersion = CertificateVersion;
      this.CertificateVersion = (Object.assign([], this.CertificateVersion.list));
      /*if (this.CertificateVersion.length > 1) {
        this.SelectcertVer(this.CertificateVersion[0]);
      }*/
      console.log('CertificateVersion', CertificateVersion);
    }, error => {
      console.log('error');
    });
  }


  getDocmentArcive() {
    let a;
    this.serviceService.getDocmentArcive(this.SelectedBase.Title_Deed_No).subscribe(cerltter => {
      a = cerltter;
      this.cerlettrformList = (Object.assign([], a.list));
      console.log('cerltter', cerltter);
      console.log('this.cerltter', this.cerltter);
      /* if (a.list.length) {
         this.isnew = false;
       } else {
         this.isnew = true;
         this.cerltter.Title_Deed_No = this.certCode;
       }*/
    }, error => {
      console.log('error');
    });

  }

  save() {
    this.cerltter.Application_No = this.AppNo;
 
    this.serviceService.UpdateDocmentArcive(this.cerltter).subscribe(message => {
      console.log('message', message);

      if(!this.Saved){
        this.completed.emit();
        this.Saved = true;
      }
     
      const toast = this.notificationsService.success('Sucess', message);
      
    } , error => {
      console.log(error);
      if (error.status == '400') {
        const toast = this.notificationsService.error('Error', error.error.InnerException.Errors[0].message);

      } else {
        const toast = this.notificationsService.error('Error', 'SomeThing Went Wrong');
      }
    });
    console.log('saveing....');
  }

  add() {

    this.serviceService.CreateDocmentArcive(this.cerltter).subscribe(message => {
      console.log('message', message);

      if(!this.Saved){
        this.completed.emit();
        this.Saved = true;
      }
      const toast = this.notificationsService.success('Sucess', message);
      this.getDocmentArcive();
      this.cerlettrform = false;

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


  addcerltter() {
    this.cerlettrform = true;
    this.isnew = true;
    this.cerltter = new Cerltter();
    //this.cerltter.Title_Deed_No = this.certCode;
    this.cerltter.Application_No = this.AppNo;
    this.cerltter.Title_Deed_No = this.SelectedBase.Title_Deed_No;

  }

  selectcerltter(cerltter) {
    this.isnew = false;
    this.cerlettrform = true;
    this.cerltter = cerltter;
    if (this.cerltter.Regstration_Date) {
      this.cerltter.Regstration_Date = this.cerltter.Regstration_Date.split('T')[0];
    }
    if (this.cerltter.Created_Date) {
      this.cerltter.Created_Date = this.cerltter.Created_Date.split('T')[0];
    }


  }
  
  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }
  closeModal(modal) {
    this.ngxSmartModalService.getModal(modal).close();
   // this.ngxSmartModalService.close('Letter');
  }

}


export class Cerltter {
  public Document_Number;
  public Title_Deed_No;
  public Application_No;
  public Room;
  public Site;
  public Block_Floor;
  public Shelf_NO;
  public Shelf_Raw;
  public Shelf_Column;
  public Created_Date;
  public Regstration_Date;
}
