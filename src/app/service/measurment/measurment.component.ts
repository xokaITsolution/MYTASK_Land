import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ServiceComponent } from '../service.component';
import { MeasurmentService } from './measurment.service';
import { NotificationsService } from 'angular2-notifications';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-measurment',
  templateUrl: './measurment.component.html',
  styleUrls: ['./measurment.component.css']
})
export class MeasurmentComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  public measurment: Measurment;
  @Input() selectedpro;
  @Input() disable;
  @Input() Licence_Service_ID;
  measurmentList;
  measurmentform = false;
  added = false;
  Saved=false;

  constructor(
    public serviceComponent: ServiceComponent,
    private measurmentService: MeasurmentService,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {
    this.measurment = new Measurment();
  }

  ngOnChanges() {
    console.log('chang detected');
    this.measurmentform = false;
    this.getmeasurment(this.selectedpro.Property_ID);
  }


  getmeasurment(propertyid) {
    this.measurmentService.getAll(propertyid).subscribe(titleDeedRegistration => {
      let a;
      a = titleDeedRegistration;
      this.measurmentList = (Object.assign([], a.list));
      console.log('this.titleDeedRegistration', this.measurmentList);
    }, error => {
      console.log(error);
    });
  }


  save() {
    this.measurmentService.save(this.measurment).subscribe(deptSuspension => {
      console.log('deptSuspension', deptSuspension);
      const toast = this.notificationsService.success('Sucess', deptSuspension);

      this.measurmentform = false;
      this.getmeasurment(this.selectedpro.Property_ID);
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

  add() {
    this.measurment.Property_ID = this.selectedpro.Property_ID;
    this.measurment.To_Do_ID = this.Licence_Service_ID;
    this.measurment.Application_No = this.Licence_Service_ID;
    console.log('this.measurment', this.measurment);
    this.measurmentService.Add(this.measurment).subscribe(message => {
      console.log('message', message);
      const toast = this.notificationsService.success('Sucess', message);

      this.measurmentform = false;
      this.getmeasurment(this.selectedpro.Property_ID);
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

  addmeasurment() {
    this.measurmentform = true;
    this.added = true;
    this.measurment = new Measurment();
  }

  selectmeasurment(measurment) {
    this.added = false;
    this.measurmentform = true;
    this.measurment = measurment;

  }


  Delete() {
    this.confirmationService.confirm({
      message: 'Are you sure u want to delete this Measurment?',
      accept: () => {
        this.measurment.Is_Deleted = true;
        this.measurmentService.Delete(this.measurment.Measurement).subscribe(deptSuspension => {
          console.log('deptSuspension', deptSuspension);
          const toast = this.notificationsService.success('Sucess', deptSuspension);
          // window.location.reload();

          this.measurmentform = false;
          const index: number = this.measurmentList.indexOf(this.measurment);
          if (index !== -1) {
            this.measurmentList.splice(index, 1);
          }
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
    });

  }
}

class Measurment {
  public Measurement;
  public Comment;
  public Property_ID;
  public To_Do_ID;
  public Application_No;
  public Is_Deleted;

}
