import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TitleDeedRegistrationService } from './title-deed-registration.service';
import { ServiceComponent } from '../service.component';
import { NotificationsService } from 'angular2-notifications';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ConfirmationService } from 'primeng/api';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-title-deed-registration',
  templateUrl: './title-deed-registration.component.html',
  styleUrls: ['./title-deed-registration.component.css']
})
export class TitleDeedRegistrationComponent implements OnInit, OnChanges {
  @Output() completed = new EventEmitter();
  public titleDeedRegistration: TitleDeedRegistration;
  titleDeedRegistrationList;
  deedform = false;
  isnew = false;
  @Input() selectedpro;
  @Input() Licence_Service_ID;
  @Input() AppNo;
  @Input() Service_ID;
  @Input() disable;
  Saved: boolean;

  constructor(private ngxSmartModalService: NgxSmartModalService,
    private titleDeedRegistrationService: TitleDeedRegistrationService,
    public serviceComponent: ServiceComponent,
    public serviceService: ServiceService,
    private confirmationService: ConfirmationService, private notificationsService: NotificationsService) {
    this.titleDeedRegistration = new TitleDeedRegistration();
  }

  ngOnInit() {

    console.log('chang detected', this.disable, this.isnew);
  }

  ngOnChanges() {
    console.log('chang detected');

    this.deedform = false;
    this.getdeed(this.selectedpro.Property_ID);
    console.log(this.selectedpro.Property_ID)
  }

  getdeed(propertyid) {
    this.titleDeedRegistrationService.getAll(propertyid).subscribe(titleDeedRegistration => {
      let a;
      a = titleDeedRegistration;
      this.titleDeedRegistrationList = a.list;
      console.log('this.titleDeedRegistration', this.titleDeedRegistrationList);
    }, error => {
      console.log(error);
    });
  }


  save() {
    this.titleDeedRegistrationService.save(this.titleDeedRegistration).subscribe(deptSuspension => {
      console.log('deptSuspension', deptSuspension);
      const toast = this.notificationsService.success('Sucess', deptSuspension);

      if (!this.Saved) {
        this.completed.emit();
        this.Saved = true;
      }
      this.serviceService.disablefins = false;
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
    this.titleDeedRegistration.Licence_Service_Id = this.Licence_Service_ID;
    this.titleDeedRegistration.Application_No = this.AppNo;
    this.titleDeedRegistration.Service_ID = this.Service_ID;
    this.titleDeedRegistrationService.Add(this.titleDeedRegistration).subscribe(deptSuspension => {
      console.log('deptSuspension', deptSuspension);
      const toast = this.notificationsService.success('Sucess', deptSuspension);
      this.getdeed(this.selectedpro.Property_ID);
      if (!this.Saved) {
        this.completed.emit();
        this.Saved = true;
      }
      this.serviceService.disablefins = false;
    }, error => {
      console.log(error);
      console.log(error);
      if (error.status == '400') {
        const toast = this.notificationsService.error('Error', error.error.InnerException.Errors[0].message);

      } else {
        const toast = this.notificationsService.error('Error', 'SomeThing Went Wrong');
      }
    }
    );
    console.log('saveing....');
  }


  Delete() {

    this.confirmationService.confirm({
      message: 'Are you sure u want to delete this title deed?',
      accept: () => {
        this.titleDeedRegistration.Is_Deleted = true;
        this.titleDeedRegistrationService.Delete(this.titleDeedRegistration).subscribe(deptSuspension => {
          console.log('deptSuspension', deptSuspension);
          const toast = this.notificationsService.success('Sucess', deptSuspension);
          this.deedform = false;
          const index: number = this.titleDeedRegistrationList.indexOf(this.titleDeedRegistration);
          if (index !== -1) {
            this.titleDeedRegistrationList.splice(index, 1);
          }
          if (!this.Saved) {
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


  adddeed() {
    this.deedform = true;
    this.isnew = true;
    this.titleDeedRegistration = new TitleDeedRegistration();
    this.titleDeedRegistration.Property_ID = this.selectedpro.Property_ID;
    this.titleDeedRegistration.Is_Active =true
  }

  selectdeed(deed) {
    this.deedform = true;
    this.isnew = false;
    deed.Date = deed.Date.split('T')[0];
    this.titleDeedRegistration = deed;

  }


  openModal(modal) {

    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(customer, modal) {
    this.titleDeedRegistration.Transfer_From_Customer = customer.Customer_ID;
    console.log('closeing.....');
    this.ngxSmartModalService.getModal(modal).close();
  }

  closeModalTo(customer, modal) {
    this.titleDeedRegistration.Transfer_To_Customer = customer.Customer_ID;
    console.log('closeing.....');
    this.ngxSmartModalService.getModal(modal).close();
  }

  getFromFromDeed(Ownership_ID) {
    for (let i = 0; i < this.titleDeedRegistrationList.length; i++) {
      if (this.titleDeedRegistrationList[i].Ownership_ID == Ownership_ID) {
        this.titleDeedRegistration.Transfer_From_Customer = this.titleDeedRegistrationList[i].Transfer_To_Customer;
      }
    }
  }


}

class TitleDeedRegistration {
  public TitleDeedNo: string;
  public Property_ID: string;
  public Date: string;
  public Transfer_From_Customer: string;
  public Transfer_To_Customer: string;
  public Parent_Deed_ID: string;
  public Transfer_Type: string;
  public Is_Active: true;
  public Is_Deleted: boolean;
  public Ownership_ID;
  public Licence_Service_Id;
  public Application_No;
  public Service_ID;
}
