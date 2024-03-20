import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from "@angular/core";

import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DomSanitizer } from "@angular/platform-browser";
import { NotificationsService } from "angular2-notifications";
import { environment } from "src/environments/environment";
import { refactorDropdownArray } from "../helpers/helpers";
import { ServiceComponent } from "src/app/service/service.component";
import { ServiceService } from "src/app/service/service.service";
import { Guid } from "guid-typescript";

@Component({
  selector: "app-person",
  templateUrl: "./person.component.html",
  styleUrls: ["./person.component.css"],
})
export class PersonComponent implements OnChanges {
  modalRef: BsModalRef;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  @Output() updated = new EventEmitter<Person>();
  @Input() LicenceData;
  @Input() Customer;
  showcustomer = false;
  highlighted;
  public person: Person;
  public pictoShow;
  public isnew = true;
  public WoredaLookUP;
  public placeHolderImage;
  region: any;
  required: boolean;
  showcustomerr: boolean;
  required1: boolean;
  workingUser: any;
  individual: boolean = true;
  notindividual: boolean = true;
  customerworkfrom: any;
  display: boolean = false;
  disabled;
  Parentname: any;
  customerworkfroms: any;
  CustomerLookUP: any;
  CustomerTypeLookUP: any;
  CustomerStatusLookUP: any;
  CountryLookUP: any;
  ServiceDeliveryUnitLookUP;
  zones;
  customerdata: any;
  column: any;
  globvar: any;
  language: string;
  iform: boolean = false;
  constructor(
    private modalService: BsModalService,
    private serviceService: ServiceService,
    private sanitizer: DomSanitizer,
    private notificationsService: NotificationsService
  ) {
    this.person = new Person();
  }
  ngOnInit() {
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    //     this.ReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(environment.ReportPath +
    //       '/' + this.AppNo);
    // this.geteducationGetLookups();
    //     this.getGetLookups();
    //     this.getMSEEmployees();
    //     this.getErcaTinNos();
    //     console.log("sing ::",this.singleWin);
    this.person.customer_ID = Guid.create();
    this.person.customer_ID = this.person.customer_ID.value;
    this.getLookups();
  }
  ngOnChanges() {
    this.isnew = true;
    this.getcostemerbyuserid();
    this.getcustomerworkfrom();
    this.GetLookups();
    // this.placeHolderImage = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   `${environment.phisicalPath}../images.jpg`
    // )
    // if (this.Customer) {
    //   this.person = Object.assign({}, this.Customer);
    //   if (this.person.Customer_ID) {
    //     this.getWoredaLookUP(this.person.SDP_ID);
    //     this.isnew = false;
    //     if (this.person.Photo) {
    //       this.pictoShow = 'data:image/jpg;base64, ' + this.person.Photo;
    //       this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(this.pictoShow);
    //     } else {
    //       this.pictoShow = null;

    //     }
    //   } else {

    //   }
    // } else {
    //   this.isnew = true;
    // }
    console.log("this.isnew", this.isnew);
  }
  getcustomer(globvar) {
    console.log(globvar);
    this.serviceService.getcustomerlease(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;
    });
  }
  getcostumerbyid(globvar) {
    this.serviceService.getcustomerAll(globvar).subscribe((resp: any) => {
      this.customerdata = resp.procCustomers;
    });
  }
  getLookups() {
    this.getCountryLookUP();
    this.getCustomerTypeLookUP();
    this.getCustomerStatusLookUP();
    this.getCustomerLookUP();
  }
  getCustomerStatusLookUP() {
    this.serviceService.getCustomerStatusLookUP().subscribe(
      (CustomerStatusLookUP) => {
        this.CustomerStatusLookUP = CustomerStatusLookUP;
        this.CustomerStatusLookUP = Object.assign(
          [],
          this.CustomerStatusLookUP.list
        );
        console.log("CustomerStatusLookUP", this.CustomerStatusLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getCustomerTypeLookUP() {
    this.serviceService.getCustomerTypeLookUP().subscribe(
      (CustomerTypeLookUP) => {
        this.CustomerTypeLookUP = CustomerTypeLookUP;
        this.CustomerTypeLookUP = Object.assign(
          [],
          this.CustomerTypeLookUP.list
        );
        console.log("CustomerTypeLookUP", CustomerTypeLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getCountryLookUP() {
    this.serviceService.getCountryLookUP().subscribe(
      (CountryLookUP) => {
        this.CountryLookUP = CountryLookUP;
        this.CountryLookUP = Object.assign([], this.CountryLookUP.list);
        console.log("CountryLookUP", CountryLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  getCustomerLookUP() {
    this.serviceService.getCustomerLookUP().subscribe(
      (CustomerLookUP) => {
        this.CustomerLookUP = CustomerLookUP;
        this.CustomerLookUP = Object.assign([], this.CustomerLookUP.list);
        for (let i = 0; i < this.CustomerLookUP.length; i++) {
          this.CustomerLookUP[i].FullName_AM =
            this.CustomerLookUP[i].Applicant_First_Name_AM +
            " " +
            this.CustomerLookUP[i].Applicant_Middle_Name_AM +
            " " +
            this.CustomerLookUP[i].Applicant_Last_Name_AM;
          this.CustomerLookUP[i].FullName_EN =
            this.CustomerLookUP[i].Applicant_First_Name_EN +
            " " +
            this.CustomerLookUP[i].Applicant_Middle_Name_En +
            " " +
            this.CustomerLookUP[i].Applicant_Last_Name_EN;
        }
        console.log("CustomerLookUP", this.CustomerLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  pass(e) {
    console.log("eeeeeee", e, e.target.value);
    if (e.target.value == "1") {
      this.required = false;
      this.required1 = true;
      this.serviceService.showcustomerr = true;
      this.individual = true;
      this.notindividual = false;
    } else {
      this.notindividual = true;
      this.individual = false;
      this.required = true;
      this.required1 = false;
      this.serviceService.showcustomerr = false;
    }
  }
  getcostemerbyuserid() {
    this.serviceService.getUserRole().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            this.workingUser = response[0];
            console.log("user-info-response", this.workingUser.UserId);
            this.serviceService
              .getcostemerbyuserid(this.workingUser.UserId)
              .subscribe((response: any) => {
                console.log("resppp", response);
                if (response.procCCustomerLoadAlls.length > 0) {
                  this.serviceService
                    .getCustomer(response.procCCustomerLoadAlls[0].customer_ID)
                    .subscribe((responses: any) => {
                      console.log("respp", responses.list[0]);
                      this.person = responses.list[0];
                      this.person.parent_Customer_ID;
                      this.serviceService
                        .getView_CustomerForWhereWhereWork()
                        .subscribe(
                          (res) => {
                            this.customerworkfroms = res;
                            this.customerworkfroms =
                              this.customerworkfroms.filter(
                                (x) =>
                                  x.customer_ID ==
                                  this.person.parent_Customer_ID
                              );
                            console.log(
                              "customerworkfrom",
                              this.customerworkfrom
                            );
                            this.Parentname =
                              this.customerworkfroms[0].applicant_First_Name_AM;
                          },
                          (error) => {
                            console.log("error");
                          }
                        );

                      if (this.person.customer_Type_ID == 1) {
                        this.serviceService.showcustomerr = true;
                        this.individual = true;
                        this.notindividual = false;
                      } else this.serviceService.showcustomerr = false;
                      this.individual = true;
                      this.notindividual = false;
                      if (this.person.photo) {
                        this.pictoShow =
                          "data:image/jpg;base64, " + this.person.photo;
                        this.pictoShow =
                          this.sanitizer.bypassSecurityTrustResourceUrl(
                            this.pictoShow
                          );
                      } else {
                        this.pictoShow = null;
                      }
                      this.isnew = false;
                    });
                }
              });
          }
        }
      },
      (error) => {
        console.log("user-info-error", error);
      }
    );
    // this.serviceService.getFinshList("11e65c70-bd09-497d-abd7-1f0ba968eaa7").subscribe((response:any) => {
    //   console.log('respppp',response)})
  }
  passs(e) {
    console.log("eeeeeee", e, e.target.value);
    if (
      e.target.value == "1" ||
      e.target.value == "2" ||
      e.target.value == "3"
    ) {
      this.serviceService.showcustomerr = true;
    } else {
      this.serviceService.showcustomerr = false;
    }
  }
  GetLookups() {
    this.serviceService.getLookup("Region").subscribe((response) => {
      this.region = refactorDropdownArray(
        response,
        "english_description",
        "lkdetail_code"
      );
      this.person.state_Region = "Addis Ababa ";
      this.person.nationality = "+251";
      this.person.residence_Country = "+251";
      if (this.serviceService.EmployeeTIN != undefined) {
        this.person.tin = this.serviceService.EmployeeTIN;
        console.log("resultresult", this.serviceService.EmployeeTIN);
      }
      console.log("lookup", response);
    });
  }
  getWoredaLookUPbyorg(spd) {
    console.log("spd", spd);
    this.person.wereda_ID = undefined;
    this.getWoredaLookUP(spd);
  }
  getWoredaLookUP(spd) {
    this.serviceService.getWoredaLookUPbyorg(spd).subscribe(
      (WoredaLookUP) => {
        this.WoredaLookUP = WoredaLookUP;
        this.WoredaLookUP = Object.assign([], this.WoredaLookUP.list);
        console.log("WoredaLookUP", WoredaLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  getcoustomer() {
    this.display = true;
  }
  Selectcustomer(pop) {
    this.display = false;
    this.person.parent_Customer_ID = pop.customer_ID;
    this.Parentname = pop.applicant_First_Name_AM;
  }
  Selectcustomers(pop) {
    this.display = false;
    this.person = pop;
    if (this.person.photo) {
      this.pictoShow = "data:image/jpg;base64, " + this.person.photo;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
    }
    this.isnew = false;
    this.iform = true;
  }
  getcustomerworkfrom() {
    this.serviceService.getView_CustomerForWhereWhereWork().subscribe(
      (res) => {
        this.customerworkfrom = res;
        console.log("customerworkfrom", this.customerworkfrom);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }

  closeModal(customer) {
    this.person.parent_Customer_ID = customer.Customer_ID;
    console.log("closeing.....");
    this.modalRef.hide();
  }

  Uploader(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      this.pictoShow = base64file;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      base64file = base64file.split(";")[1];
      this.person.photo = base64file;
    });
  }

  upload(event, form) {
    this.Uploader(event.files[0]);
    form.clear();
  }
  add() {
    this.person = new Person();
    this.person.customer_ID = Guid.create();
    this.person.customer_ID = this.person.customer_ID.value;
    this.isnew = true;
    this.iform = true;
  }
  Save2() {
    this.serviceService.saveCustomer(this.person).subscribe(
      (CustID) => {
        this.getcostumerbyid(this.person.customer_ID);
        const toast = this.notificationsService.success(
          "Sucess",
          "Succesfully saved"
        );
      },
      (error) => {
        console.log("error");
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );
  }

  update() {
    this.serviceService.UpdateCustomer(this.person).subscribe(
      (CustID) => {
        this.getcostumerbyid(this.person.customer_ID);
        const toast = this.notificationsService.success(
          "Sucess",
          "Succesfully edited"
        );
      },
      (error) => {
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );
    // this.getcostemerbyuserid()
  }
}

export class Person {
  public customer_ID: any;
  public applicant_First_Name_AM: any;
  public applicant_First_Name_EN: any;
  public applicant_Middle_Name_AM: any;
  public applicant_Middle_Name_En: any;
  public applicant_Last_Name_AM: any;
  public applicant_Last_Name_EN: any;
  public applicant_Mother_Name_AM: any;
  public applicant_Mother_Name_EN: any;
  public tin: any;
  public gender: any;
  public sdP_ID: any;
  public wereda_ID: any;
  public email: any;
  public mobile_No: any;
  public photo: any;
  public home_Telephone: any;
  public house_No: any;
  public address: any;
  public kebele: any;
  public nationality: any;
  public residence_Country: any;
  public state_Region: any;
  public city: any;
  public passport_ID: any;
  public is_Active: any;
  public is_Represented: any;
  public parent_Customer_ID: any;
  public is_them: any;
  public customer_Type_ID: any;
  public is_Representative: any;
  public customer_Status: any;
  public created_By: any;
  public updated_By: any;
  public deleted_By: any;
  public is_Deleted: any;
  public created_Date: any;
  public updated_Date: any;
  public deleted_Date: any;
}
