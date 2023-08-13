import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {DeptSuspensionRecordService} from './dept-suspension-record.service';
import {ServiceComponent} from '../service.component';
import {NotificationsService} from 'angular2-notifications';
import {NgxSmartModalService} from 'ngx-smart-modal';

@Component({
  selector: 'app-dept-suspension-record',
  templateUrl: './dept-suspension-record.component.html',
  styleUrls: []
})
export class DeptSuspensionRecordComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  public deptSuspensionRecord: DeptSuspensionRecord;
  deptSuspensionRecordList;
  deptForm = false;
  currntDate = new Date();
  @Input() Selectedcert;
  @Input() disable;
  @Input() LicenceData;

  constructor(private ngxSmartModalService: NgxSmartModalService, private deptSuspensionRecordService: DeptSuspensionRecordService,
              public serviceComponent: ServiceComponent, private notificationsService: NotificationsService) {
    this.deptSuspensionRecord = new DeptSuspensionRecord();
  }

  ngOnChanges() {
    console.log('hahaha2', this.Selectedcert);
    this.getdeed();
    this.deptForm = false;
  }

  getdeed() {
    this.deptSuspensionRecordService.getAll(this.Selectedcert.Version_ID).subscribe(deptSuspension => {
      let a;
      a = deptSuspension;
      this.deptSuspensionRecordList = (Object.assign([], a.list));
      console.log('this.deptSuspensionRecord', this.deptSuspensionRecordList);
    }, error => {
      console.log(error);
    });
  }

  save() {
    this.deptSuspensionRecordService.save(this.deptSuspensionRecord).subscribe(deptSuspension => {
      console.log('deptSuspension', deptSuspension);
      const toast = this.notificationsService.success('Sucess', deptSuspension);

      this.getdeed();
      this.deptForm = false;
      this.completed.emit();
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

  add() {
    this.deptSuspensionRecordService.Add(this.deptSuspensionRecord).subscribe(deptSuspension => {
      console.log('deptSuspension', deptSuspension);
      const toast = this.notificationsService.success('Sucess', deptSuspension);

      this.getdeed();
      this.deptForm = false;
      this.completed.emit();
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

  adddeed() {
    this.deptForm = true;
    this.deptSuspensionRecord = new DeptSuspensionRecord();
    this.deptSuspensionRecord.Certificate_Version_No = this.Selectedcert.Version_ID;

    this.deptSuspensionRecord.SDP_ID = this.LicenceData.SDP_ID;
    this.deptSuspensionRecord.Suspend_Start_Date = (new Date()).toDateString();
  }

  selectdeed(dept) {
    this.deptSuspensionRecord = dept;
    this.deptSuspensionRecord.Letter_Ref_Date = this.deptSuspensionRecord.Letter_Ref_Date.split('T')[0];
    this.deptSuspensionRecord.Suspend_End_Date = this.deptSuspensionRecord.Suspend_End_Date.split('T')[0];
    this.deptSuspensionRecord.Suspend_Start_Date = this.deptSuspensionRecord.Suspend_Start_Date.split('T')[0];
    this.deptForm = true;


  }


  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(customer, modal) {
    this.deptSuspensionRecord.Suspended_By = customer.Customer_ID;
    console.log('closeing.....');
    console.log('closeing.....', customer.Customer_ID);
    this.ngxSmartModalService.getModal(modal).close();
  }

}

class DeptSuspensionRecord {
  public ID: string;
  public Certificate_Version_No: string;
  public Suspended_By: string;
  public Suspend_Start_Date: string;
  public Suspend_End_Date: string;
  public Suspend_Reason: string;
  public Letter_Ref_No: string;
  public Letter_Ref_Date: string;
  public Remark: string;
  public Is_Suspended: string;
  public Is_Released: string;
  public SDP_ID;
}
