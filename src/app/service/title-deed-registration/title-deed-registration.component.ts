import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { TitleDeedRegistrationService } from "./title-deed-registration.service";
import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ConfirmationService } from "primeng/api";
import { ServiceService } from "../service.service";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { format } from "util";

@Component({
  selector: "app-title-deed-registration",
  templateUrl: "./title-deed-registration.component.html",
  styleUrls: ["./title-deed-registration.component.css"],
})
export class TitleDeedRegistrationComponent implements OnInit, OnChanges {
  @Output() completed = new EventEmitter();

  modalRef: BsModalRef;
  modalRefTo: BsModalRef;
  public titleDeedRegistration: TitleDeedRegistration;
  titleDeedRegistrationList;
  deedform = false;
  isnew = false;
  highlighted;
  @Input() selectedpro;
  @Input() Licence_Service_ID;
  @Input() AppNo;
  @Input() Service_ID;
  @Input() disable;
  Saved: boolean;
  language: string;
  urlParams: any;
  Customer_NAMEe: string;
  Customer_NAME: string;
  customerdata: any;
  CustomerLookUP: any;
  Transfer_From_CustomerName: null;
  Transfer_To_CustomerName: any;
  customerdataTo: any;
  TransferredTo: boolean = false;
  TransferredFrom: boolean = false;
  globvarto;
  isconfirmsave: boolean;
  msgs: string;
  iscustomerdatato: boolean;
  iscustomerdata: boolean;
  Isshow: boolean;
  constructor(
    private modalService: BsModalService,
    private ngxSmartModalService: NgxSmartModalService,
    private titleDeedRegistrationService: TitleDeedRegistrationService,
    public serviceComponent: ServiceComponent,
    public serviceService: ServiceService,
    private routerService: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private notificationsService: NotificationsService
  ) {
    this.titleDeedRegistration = new TitleDeedRegistration();
  }
  visible;
  visiblee;
  ngOnInit() {
    //this.getCustomerLookUP();
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
    });
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    console.log("chang detected", this.disable, this.isnew);
  }
  closeModalll(customer) {
    if (
      this.titleDeedRegistrationList.transfer_To_Customer ==
        this.titleDeedRegistration.transfer_From_Customer &&
      this.titleDeedRegistrationList.transfer_To_Customer != null
    ) {
      const toast = this.notificationsService.warn("warn");
    } else {
      this.visible = false;
      this.titleDeedRegistration.transfer_From_Customer = customer.customer_ID;
      if (this.language == "amharic") {
        this.Customer_NAME =
          customer.applicant_First_Name_AM +
          "  " +
          customer.applicant_Middle_Name_AM +
          " " +
          customer.applicant_Last_Name_AM;
        console.log("closeing.....");
      } else {
        this.Customer_NAME =
          customer.applicant_First_Name_EN +
          "  " +
          customer.applicant_Middle_Name_En +
          " " +
          customer.applicant_Last_Name_EN;
      }
    }
  }
  closeModall(customer) {
    this.visible = false;
    if (
      this.titleDeedRegistrationList.transfer_To_Customer ==
        this.titleDeedRegistration.transfer_From_Customer &&
      this.titleDeedRegistrationList.Transfer_To_Customer != null
    ) {
      const toast = this.notificationsService.warn("warn");
    } else {
      this.titleDeedRegistrationList.transfer_To_Customer =
        customer.customer_ID;
      if (this.language == "amharic") {
        this.Customer_NAME =
          customer.applicant_First_Name_AM +
          "  " +
          customer.applicant_Middle_Name_AM +
          " " +
          customer.applicant_Last_Name_AM;
        console.log("closeing.....");
      } else {
        this.Customer_NAMEe =
          customer.applicant_First_Name_EN +
          "  " +
          customer.applicant_Middle_Name_En +
          " " +
          customer.applicant_Last_Name_EN;
      }
    }
  }

  ngOnChanges() {
    console.log("chang detected", this.selectedpro, this.Service_ID);
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
    });

    this.deedform = false;
    this.getdeed(this.selectedpro.property_ID);
    this.titleDeedRegistration.ownership_ID = this.selectedpro.property_ID;
    console.log(this.selectedpro.property_ID);
  }
  confirmsave() {
    this.msgs = "Are you sure that you want to save?";
    this.isconfirmsave = true;
  }

  getdeed(propertyid) {
    this.deedform = false;
    console.log("propertyid", propertyid);

    this.titleDeedRegistrationService.getAllby().subscribe(
      async (titleDeedRegistration: any) => {
        
        let a;
        a = titleDeedRegistration.procDeed_Registrations.filter(
          (x) => x.property_ID === propertyid 
        );
        var titleDeedRegistrationList = a;
        if (this.language == "amharic") {
          if (titleDeedRegistrationList.length > 0) {
            for (let i = 0; i < titleDeedRegistrationList.length; i++) {
              titleDeedRegistrationList[i].date =
                await this.getgregorianToEthiopianDate(
                  titleDeedRegistrationList[i].date
                );
            }
          }
        }
        this.titleDeedRegistrationList = titleDeedRegistrationList;
        console.log(
          "this.titleDeedRegistration",
          this.titleDeedRegistrationList
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onOptionsSelected(e) {
    console.log(
      "🚀 ~ TitleDeedRegistrationComponent ~ onOptionsSelected ~ e:",
      e
    );

    if (e == 2014 || e == 2044 || e == 2015 || e== 2048 || e==2050) {
      this.Isshow = true;
    } else {
      this.Isshow = false;
    }
  }
  // getdeed(propertyid) {
  //   console.log("propertyid", propertyid);

  //   this.titleDeedRegistrationService.getAll(propertyid).subscribe(
  //     async (titleDeedRegistration) => {
  //       let a;
  //       a = titleDeedRegistration;
  //       var titleDeedRegistrationList = a.list;
  //       if (this.language == "amharic") {
  //         if (titleDeedRegistrationList.length > 0) {
  //           for (let i = 0; i < titleDeedRegistrationList.length; i++) {
  //             titleDeedRegistrationList[i].Date =
  //               await this.getgregorianToEthiopianDate(
  //                 titleDeedRegistrationList[i].Date
  //               );
  //           }
  //         }
  //       }
  //       this.titleDeedRegistrationList = titleDeedRegistrationList;
  //       console.log(
  //         "this.titleDeedRegistration",
  //         this.titleDeedRegistrationList
  //       );
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
  selectedDateTime(dates: any, selecter) {
    if (selecter == 1) {
      this.titleDeedRegistration.date =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
    }
  }
  async getEthiopianToGregorian(date) {
    if (date) {
      var datenow = await this.serviceService
        .getEthiopianToGregorian(date)
        .toPromise();
      console.log(datenow);
      return datenow.nowTime;
    }
  }
  async getgregorianToEthiopianDate(date) {
    if (date != "0001-01-01T00:00:00") {
      var datenow = await this.serviceService
        .getgregorianToEthiopianDate(date)
        .toPromise();
      console.log(datenow);
      return datenow.nowTime;
    }
  }
  async getcurrentdate() {
    const currentDate = new Date();
    const currentDatestring = currentDate.toISOString();
    console.log("currentDate", currentDatestring);
    let ed = await this.getgregorianToEthiopianDate(currentDatestring);
    let feedbackDate = await this.getEthiopianToGregorian(
      ed
    );
    this.titleDeedRegistration.updated_Date=feedbackDate
  }
  async save() {
   let date = await this.getcurrentdate()
  //   if ( 
  //   this.serviceService.errorservices != 'DE4937D8-BDCD-46D6-8749-DC31C9F3ADCF'.toLocaleLowerCase()){
  //   console.log("🚀 ~ TitleDeedRegistrationComponent ~ this.serviceService.errorservices!='DE4937D8-BDCD-46D6-8749-DC31C9F3ADCF'.toLocaleLowerCase ~ errorservices:", this.serviceService.errorservices)

    
  //   if (this.serviceService.Licence_Service_ID != this.serviceService.LicenceserviceID 
      
  //   ){
  //     const toast = this.notificationsService.error(
  //       "Error",
  //       "this property created by other technical officer so you can't update it /ይህ ቤት በሌላ ቴክኒካል ኦፊሰር የተፈጠረ ስለሆነ ማዘመን አይችሉም"
  //     );
  //     return
  //   }
  // }
    if (this.language === "amharic") {
      this.titleDeedRegistration.date = await this.getEthiopianToGregorian(
        this.titleDeedRegistration.date
      );
    }
    this.serviceService.getUserRole().subscribe((response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.titleDeedRegistration.updated_By = response[0].UserId;
      
   
    this.titleDeedRegistrationService
      .save(this.titleDeedRegistration)
      .subscribe(
        (deptSuspension) => {
          console.log("deptSuspension", deptSuspension);
          const toast = this.notificationsService.success("Sucess");
          this.deedform = false;

          this.completed.emit();

          // if (!this.Saved) {
          //   this.completed.emit();
          //   this.Saved = true;
          // }
          //.adddeed();
          this.getdeed(this.selectedpro.property_ID);
          //this.serviceService.disablefins = false;
        },
        (error) => {
          console.log(error);

          console.log(error);
          const toast = this.notificationsService.error("Error", error.error);
          this.adddeed();
        }
      );
    console.log("saveing....");
    })
  }

  async add() {
    this.titleDeedRegistration.pay_Capital_Gain = true;
    if (this.language === "amharic") {
      this.titleDeedRegistration.date = await this.getEthiopianToGregorian(
        this.titleDeedRegistration.date
      );
    }
    if (this.titleDeedRegistration.property_ID == null) {
      this.titleDeedRegistration.property_ID =
        this.serviceService.insertedProperty;
    }
    this.titleDeedRegistration.licence_Service_Id = this.Licence_Service_ID;
    this.titleDeedRegistration.application_No = this.AppNo;
    this.titleDeedRegistration.service_ID = this.Service_ID;
    this.titleDeedRegistration.ownership_ID = "-1";
    this.serviceService.getUserRole().subscribe((response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.titleDeedRegistration.created_By = response[0].UserId;
     // this.titleDeedRegistration.created_Date = new Date();
     
    this.titleDeedRegistrationService.Add(this.titleDeedRegistration).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success("Sucess");
        this.deedform = false;
        this.getdeed(this.selectedpro.property_ID);
        //this.adddeed();

        this.completed.emit();
        if (
          this.serviceService.selectedproperty_Type_ID == 2 ||
          this.serviceService.selectedproperty_Type_ID == 3
        ) {
          const toastt = this.notificationsService.warn(
            "must  add minimum  one sub property if the property type is building or apartment / የንብረቱ ዓይነት ሕንፃ ወይም አፓርትመንት ከሆነ ቢያንስ አንድ ንዑስ ንብረት መጨመር አለበት"
          );
        }

        // if (!this.Saved) {
        //
        //   this.Saved = true;
        // }
        //this.serviceService.disablefins = false;
      },
      (error) => {
        console.log(error);

        const toast = this.notificationsService.error("Error", error.error);
      }
    );
    console.log("saveing....");
  })
  }

  Delete() {
    this.confirmationService.confirm({
      message: "Are you sure u want to delete this title deed?",
      accept: () => {
        this.titleDeedRegistration.is_Deleted = true;
        this.titleDeedRegistrationService
          .Delete(this.titleDeedRegistration)
          .subscribe(
            (deptSuspension) => {
              console.log("deptSuspension", deptSuspension);
              const toast = this.notificationsService.success(
                "Sucess",
                deptSuspension
              );
              this.deedform = false;
              const index: number = this.titleDeedRegistrationList.indexOf(
                this.titleDeedRegistration
              );
              if (index !== -1) {
                this.titleDeedRegistrationList.splice(index, 1);
              }
              if (!this.Saved) {
                this.completed.emit();
                this.Saved = true;
              }
            },
            (error) => {
              console.log(error);
              if (error.status == "400") {
                const toast = this.notificationsService.error(
                  "Error",
                  error.error.InnerException.Errors[0].message
                );
              } else {
                const toast = this.notificationsService.error(
                  "Error",
                  "SomeThing Went Wrong"
                );
              }
            }
          );
        console.log("saveing....");
      },
    });
  }
  getCustomerLookUP() {
    this.serviceService.getcustomerby().subscribe(
      (CustomerLookUP: any) => {
        this.CustomerLookUP = CustomerLookUP.procCustomers;
        for (let i = 0; i < this.CustomerLookUP.length; i++) {
          this.CustomerLookUP[i].FullName_AM =
            this.CustomerLookUP[i].applicant_First_Name_AM +
            " " +
            this.CustomerLookUP[i].applicant_Middle_Name_AM +
            " " +
            this.CustomerLookUP[i].applicant_Last_Name_AM;
          this.CustomerLookUP[i].FullName_EN =
            this.CustomerLookUP[i].applicant_First_Name_EN +
            " " +
            this.CustomerLookUP[i].applicant_Middle_Name_En +
            " " +
            this.CustomerLookUP[i].applicant_Last_Name_EN;
        }
        console.log("CustomerLookUP", this.CustomerLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  adddeed() {
    this.deedform = true;
    this.isnew = true;
    this.Transfer_From_CustomerName = null;
    this.Transfer_To_CustomerName = null;
    this.titleDeedRegistration = new TitleDeedRegistration();
    this.titleDeedRegistration.capital_Gain_Value = 0;
    this.titleDeedRegistration.property_ID = this.selectedpro.property_ID;
    this.titleDeedRegistration.is_Active = true;
  }

  async selectdeed(deed) {
    this.deedform = true;
    this.isnew = false;
 

    this.titleDeedRegistration = deed;
    this.serviceService
      .getcustomerbycusid(deed.transfer_From_Customer)
      .subscribe(async (res: any) => {
        const customerdata = res.procCustomers;
        console.log(
          "🚀 ~ TitleDeedRegistrationComponent ~ .subscribe ~ customerdata:",
          customerdata
        );

        if (
          parseInt(this.titleDeedRegistration.transfer_Type) == 2014 ||
          parseInt(this.titleDeedRegistration.transfer_Type) == 2044 ||
          parseInt(this.titleDeedRegistration.transfer_Type) == 2015 ||
          parseInt(this.titleDeedRegistration.transfer_Type) == 2050 ||
          parseInt(this.titleDeedRegistration.transfer_Type) == 2048
        ) {
          this.Isshow = true;
        } else {
          this.Isshow = false;
        }
        if (this.language === "amharic") {
          deed.Date = await this.getEthiopianToGregorian(deed.date);
        } else {
          deed.Date = deed.date.split("T")[0];
        }

        this.Transfer_From_CustomerName =
          customerdata[0].applicant_First_Name_AM;
      });
   
    this.serviceService
      .getcustomerbycusid(deed.transfer_To_Customer)
      .subscribe((res: any) => {
        const customerdata = res.procCustomers;
        console.log(
          "🚀 ~ TitleDeedRegistrationComponent ~ .subscribe ~ customerdata:",
          customerdata
        );
        this.Transfer_To_CustomerName = customerdata[0].applicant_First_Name_AM;
      });
    // this.Transfer_To_CustomerName = this.CustomerLookUP.filter(
    //   (x) => x.customer_ID ==
    // )[0].FullName_AM;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }
  openModalTo(template: TemplateRef<any>) {
    this.modalRefTo = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
    this.modalRef.hide();
  }
  closeModal(customer) {
    console.log(customer, this.serviceService.Service_ID);
    if (
      this.serviceService.Service_ID ==
        "793B8814-F845-429E-A472-DC47E797D3FE".toLocaleLowerCase() || //Merge  of two or more bordering plot managed by lease-lease and lease-freehold.
      this.serviceService.Service_ID ===
        "5DE49606-4DC6-4FB1-8F37-0CFC948FDC83".toLocaleLowerCase() || //Merge two or more bordering plot managed by the free hold
      this.serviceService.Service_ID ===
        "8a8588ae-0267-48b7-88ac-f3f18ac02167".toLocaleLowerCase() ||
      this.serviceService.Service_ID ===
        "86997006-53C7-4BBD-9F56-E79721B4561E".toLocaleLowerCase()
    ) {
      
      if (this.serviceService.Service_ID ===
        "86997006-53C7-4BBD-9F56-E79721B4561E".toLocaleLowerCase() && this.serviceService.salesFrominformat == true
      && customer.customer_ID =='00000000-0000-0000-0000-000000000000'){
        const toast = this.notificationsService.warn(
          "warn",
          "this title deed sale after new format change you have to select the exists customer with account"
        );
        }else{
          this.titleDeedRegistration.transfer_From_Customer = customer.customer_ID;
          console.log("closeing.....");
          this.Transfer_From_CustomerName = customer.applicant_First_Name_AM;
        }
    } else {
      if (
        this.titleDeedRegistration.transfer_To_Customer == customer.customer_ID
      ) {
        const toast = this.notificationsService.warn(
          "warn",
          "you enter same customer . you must enter different customer "
        );
      } else {
        this.titleDeedRegistration.transfer_From_Customer =
          customer.customer_ID;
        console.log("closeing.....");
        this.Transfer_From_CustomerName = customer.applicant_First_Name_AM;
      }
    }
    // this.modalRef.hide();
  }
  closeModalTo(customer) {
    console.log(customer, this.serviceService.Service_ID);
    if ("00000000-0000-0000-0000-000000000000" == customer.customer_ID) {
      const toast = this.notificationsService.warn(
        "warn",
        "Transferred to  must an existring customer with custmer account"
      );
      return;
    } else {
      if (
        this.serviceService.Service_ID ===
          "793B8814-F845-429E-A472-DC47E797D3FE".toLocaleLowerCase() || //Merge  of two or more bordering plot managed by lease-lease and lease-freehold.
        this.serviceService.Service_ID ===
          "5DE49606-4DC6-4FB1-8F37-0CFC948FDC83".toLocaleLowerCase() || //Merge two or more bordering plot managed by the free hold
        this.serviceService.Service_ID ===
          "8a8588ae-0267-48b7-88ac-f3f18ac02167".toLocaleLowerCase() 
          ||
      this.serviceService.Service_ID ===
        "86997006-53C7-4BBD-9F56-E79721B4561E".toLocaleLowerCase()
      ) {
        this.titleDeedRegistration.transfer_To_Customer = customer.customer_ID;
        console.log("closeing.....");
        this.Transfer_To_CustomerName = customer.applicant_First_Name_AM;
      } else {
        if (
          customer.customer_ID ==
          this.titleDeedRegistration.transfer_From_Customer
        ) {
          const toast = this.notificationsService.warn(
            "warn",
            "you enter same customer . you must enter different customer "
          );
          return;
        } else {
          this.titleDeedRegistration.transfer_To_Customer =
            customer.customer_ID;
          console.log("closeing.....");
          this.Transfer_To_CustomerName = customer.applicant_First_Name_AM;
        }
      } //Plot Split service for any type of possession
      // this.modalRefTo.hide();
      //this.ngxSmartModalService.getModal(modal).close();
    }
  }
  getcustomer(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerlease(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;

      if (this.customerdata.length > 0) {
        this.iscustomerdata = false;
      } else {
        this.iscustomerdata = true;
      }
    });
  }
  getcustomerTO(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerlease(globvar).subscribe((resp: any) => {
      this.customerdataTo = resp.procCustomers;
      if (this.customerdataTo.length > 0) {
        this.iscustomerdatato = false;
      } else {
        this.iscustomerdatato = true;
      }
    });
  }
  getcustomerfilter(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerlease(globvar).subscribe((resp: any) => {
      return resp.procCustomers;
    });
  }
  // closeModalTo(customer, modal) {
  //   this.titleDeedRegistration.Transfer_To_Customer = customer.Customer_ID;
  //   console.log("closeing.....");
  //   this.ngxSmartModalService.getModal(modal).close();
  // }

  async getFromFromDeed(Ownership_ID) {
    
    for (let i = 0; i < this.titleDeedRegistrationList.length; i++) {
      // this.titleDeedRegistration.Date=await this.getgregorianToEthiopianDate(this.titleDeedRegistrationList[i].Date)
      if (this.titleDeedRegistrationList[i].Ownership_ID == Ownership_ID) {
        this.titleDeedRegistration.transfer_From_Customer =
          this.titleDeedRegistrationList[i].Transfer_To_Customer;
      }
    }
  }
}
export class TitleDeedRegistration {
  public titleDeedNo: string;
  public property_ID: string;
  public date: string;
  public transfer_From_Customer: string;
  public transfer_To_Customer: string;
  public parent_Deed_ID: string;
  public transfer_Type: string;
  public is_Active: true;
  public is_Deleted: boolean;
  public ownership_ID;
  public licence_Service_Id;
  public application_No;
  public service_ID;
  public estimate_Value;
  public transferd_Value;
  public capital_Gain_Value;
  public pay_Capital_Gain; 
  public updated_By
  public created_By
  public deleted_By
  public created_Date
  public updated_Date
  public deleted_Date
}
