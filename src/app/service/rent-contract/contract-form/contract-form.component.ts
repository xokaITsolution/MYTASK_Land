import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { NotificationsService } from "angular2-notifications";
import { environment } from "src/environments/environment";
import { ServiceComponent } from "../../service.component";
import { ServiceService } from "../../service.service";
// import { RentContract } from "../rent-contract.component";
import { ContractFormService } from "./contract-form-service.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import { Guid } from 'guid-typescript';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.css']
})
export class ContractFormComponent implements OnInit {
  //FOR AUTO COMPLETE
  RentContractDS;
  rentContractDS;
  RenewContractDocuments;
  renewContractDocuments;
  mainContractDocuments;
  MainContractDocuments;
  ParentContact;
  parentContact;
  DocumentId;
  documentId;

  // public SelectedContract: RentContract;

  //FOR SELECT DROPDOWN
  rentContractTypes;
  serviceCode;
  applicationCode;
  fromOrganaization;
  propertyType;
  customer;
  currencies;
  units;
  userInfo;
  letterUrl = {
    base: "http://197.156.93.110/xokaerp/en-us/letter",
    full: null
  }
  customers = [];
  contracts = [];
  selectedCustomer;
  selectedContractNo;

  rent_contract_id_invalid;
  @Output() completed = new EventEmitter();
  @Input() selectedContract;
  @Input() isNew;
  @Input() AppNo;


  constructor(
    private contractFormService: ContractFormService,
    private notificationsService: NotificationsService,
    private serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    public ngxModal: NgxSmartModalService,
    public sanitize: DomSanitizer
  ) { }

  ngOnChanges() {
    if (this.selectedContract) {
      // this.SelectedContract = this.selectedContract;
      console.log('selected contract :: ', this.selectedContract);
    }
  }

  ngOnInit() {
    this.getContractIdsLookUp();
    this.getFromOrganaizationLookUp();
    this.getServiceCodeLookUp();
    this.getApplicationCodeLookUp();
    this.getRenewContractDocumentsLookUp();
    this.getMainContractDocumentsLookUp();
    this.getParentContactLookUp();
    this.getDocumentIdLookUp();
    this.getUnits();
    this.getCurrencies();
    this.getUserInfo();
    this.getContractTypes();
    this.getContract();
    this.getCustomer();

    // this.getCustomerLookUp();
    this.rent_contract_id_invalid = false;
    this.letterUrl.full = this.sanitize.bypassSecurityTrustResourceUrl(`${this.letterUrl.base}/${this.AppNo}`);
    this.selectedContract.rent_contract_id = Guid.create().toString();
    console.log('letter url :: ', this.letterUrl);
  }

  deleteContract() {
    this.contractFormService.deleteRentContract(this.selectedContract.rent_contract_id).subscribe(
      success => {
        this.notificationsService.success('Success', 'rent contract deleted');
        console.log('rent contract deleted :: ', success);
      },
      error => {
        this.notificationsService.error('Failed', 'unable to delete rent contract');
        console.error('delete rent contract error :: ', error);
      }
    );
  }

  getAllContracts() {
    this.contractFormService.getAllRentContract().subscribe(
      rentContracts => {
        console.log('rent contracts :: ', rentContracts);
      },
      error => {
        console.error('unable to get rent contracts :: ', error);
      }
    );
  }

  addContract() {
    this.contractFormService.saveRentContract(
      this.selectedContract
    ).subscribe(
      success => {
        this.notificationsService.success("Success", 'rent contract added');
        this.completed.emit();
        console.log('rent contract added :: ', success);
      },
      error => {
        this.notificationsService.error('error', 'unable to add rent contract');
        console.error('unable to add rent contract :: ', error);
      }
    );
  }

  updateContract() {
    this.contractFormService.updateRentContract(
      this.selectedContract
    ).subscribe(
      success => {
        this.notificationsService.success("Success", 'rent contract added');
        this.completed.emit();
        console.log('rent contract added :: ', success);
      },
      error => {
        this.notificationsService.error('error', 'unable to add rent contract');
        console.error('unable to add rent contract :: ', error);
      }
    );
  }

  selectContact(contract) {
    this.selectedContractNo = contract;
    this.selectedContract.contract_NO = contract.contract_No;
    this.closeModal('contract-no');
  }

  getContract() {
    this.contractFormService.getContract().subscribe(
      contracts => {
        this.contracts = contracts['procContracts'];
      },
      error => {
        console.error('unable to get contracts :: ', error);
      }
    );
  }

  selectCustomer(customer) {
    this.selectedCustomer = customer;
    this.selectedContract.to_Customer = customer.customer_ID;
    this.closeModal('customer');
  }

  getCustomer() {
    this.contractFormService.getCustomer().subscribe(
      customers => {
        this.customers = customers['procCCustomerLoadAlls'];
      },
      error => {
        console.error('unable to get customers :: ', error);
      }
    );
  }

  getContractTypes() {
    this.serviceService.getLookupBy('Rent_Contract_Type').subscribe(
      rentContractTypes => {
        this.rentContractTypes = rentContractTypes;
      },
      error => {
        console.error('unable to get contract type :: ', error);
      }
    );
  }

  closeModal(modal) {
    this.ngxModal.getModal(modal).close();
  }

  openModal(modal) {
    this.ngxModal.getModal(modal).open();
  }

  getUserInfo() {
    this.serviceService.getViewAspNetUsersWorkInfoDetail(
      environment.username
    ).subscribe(
      userInfo => {
        if (userInfo.length > 0) {
          this.userInfo = userInfo[0];
        }
        this.userInfo = {};
        console.log('user info :: ', this.userInfo);
      },
      error => {
        console.error('unable to get user info :: ', error);
      }
    );
  }

  getUnits() {
    this.serviceService.getUnits().subscribe(
      units => {
        this.units = units['proccUnits'];
        console.log('all units :: ', this.units);
      },
      error => {
        console.error('unable to get units :: ', error);
      }
    );
  }

  getCurrencies() {
    this.serviceService.getCurrencies().subscribe(
      currencies => {
        this.currencies = currencies['procCCurrencyIDs'];
        console.log('all currencies :: ', this.currencies);
      },
      error => {
        console.error('unable to get currencies :: ', error);
      }
    );
  }

  getCustomerLookUp() {
    this.serviceService.getCustomerTypeLookUP().subscribe(
      (customer) => {
        this.customer = customer['list'];
        console.log("rentContractDS", customer);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getContractIdsLookUp() {
    this.RentContractDS = [
      { rent_contract_id: "one" },
      { rent_contract_id: "two" },
      { rent_contract_id: "three" },
    ];
    // this.contractFormService.getContractIdsLookUp().subscribe(
    //   (rentContractDS) => {
    //     this.rentContractDS = rentContractDS;
    //     console.log("rentContractDS", rentContractDS);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  getDocumentIdLookUp() {
    this.DocumentId = [
      { rent_contract_id: "one" },
      { rent_contract_id: "two" },
      { rent_contract_id: "three" },
    ];
    // this.contractFormService.getContractIdsLookUp().subscribe(
    //   (rentContractDS) => {
    //     this.rentContractDS = rentContractDS;
    //     console.log("rentContractDS", rentContractDS);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  getParentContactLookUp() {
    this.ParentContact = [
      { rent_contract_id: "one" },
      { rent_contract_id: "two" },
      { rent_contract_id: "three" },
    ];
    // this.contractFormService.getContractIdsLookUp().subscribe(
    //   (rentContractDS) => {
    //     this.rentContractDS = rentContractDS;
    //     console.log("rentContractDS", rentContractDS);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  getRenewContractDocumentsLookUp() {
    this.RenewContractDocuments = [
      { rent_contract_id: "one" },
      { rent_contract_id: "two" },
      { rent_contract_id: "three" },
    ];
    // this.contractFormService.getRenewContractDocumentsLookUp().subscribe(
    //   (rentContractDS) => {
    //     this.rentContractDS = rentContractDS;
    //     console.log("rentContractDS", rentContractDS);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  getMainContractDocumentsLookUp() {
    this.MainContractDocuments = [
      { rent_contract_id: "one" },
      { rent_contract_id: "two" },
      { rent_contract_id: "three" },
    ];
    // this.contractFormService.getRenewContractDocumentsLookUp().subscribe(
    //   (rentContractDS) => {
    //     this.rentContractDS = rentContractDS;
    //     console.log("rentContractDS", rentContractDS);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  getFromOrganaizationLookUp() {
    this.fromOrganaization = [
      { name: "one" },
      { name: "two" },
      { name: "three" },
    ];
    // this.contractFormService.getFromOrganaizationLookUp().subscribe(
    //   (propertyType) => {
    //     this.propertyType = propertyType;
    //     console.log("propertyType", propertyType);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  getServiceCodeLookUp() {
    this.serviceCode = [{ name: "one" }, { name: "two" }, { name: "three" }];
    // this.contractFormService.getRentContractTypeLookUp().subscribe(
    //   (propertyType) => {
    //     this.propertyType = propertyType;
    //     console.log("propertyType", propertyType);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  getApplicationCodeLookUp() {
    this.applicationCode = [
      { name: "one" },
      { name: "two" },
      { name: "three" },
    ];
    // this.contractFormService.getRentContractTypeLookUp().subscribe(
    //   (propertyType) => {
    //     this.propertyType = propertyType;
    //     console.log("propertyType", propertyType);
    //   },
    //   (error) => {
    //     console.log("error");
    //   }
    // );
  }

  searchContractIds(event) {
    this.rentContractDS = this.RentContractDS.filter((c) =>
      c.rent_contract_id.includes(event.query)
    );
    console.log("rentContractDS " + this.rentContractDS);
  }

  searchRenewContracts(event) {
    this.renewContractDocuments = this.RenewContractDocuments.filter((c) =>
      c.rent_contract_id.includes(event.query)
    );
    console.log("renewContractDocumentss " + this.renewContractDocuments);
  }

  searchMainContracts(event) {
    this.mainContractDocuments = this.MainContractDocuments.filter((c) =>
      c.rent_contract_id.includes(event.query)
    );
    console.log("mainContractDocumentss " + this.mainContractDocuments);
  }

  searchParentContact(event) {
    this.parentContact = this.ParentContact.filter((c) =>
      c.rent_contract_id.includes(event.query)
    );
    console.log("parentcontact " + this.parentContact);
  }

  searchDocumentId(event) {
    this.documentId = this.DocumentId.filter((c) =>
      c.rent_contract_id.includes(event.query)
    );
    console.log("parentcontact " + this.documentId);
  }


  save() {
    this.contractFormService.save(this.selectedContract).subscribe(
      (contract) => {
        console.log("contract", contract);

        this.completed.emit();
        const toast = this.notificationsService.success("Sucess", contract);
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
  }

  add() {
    console.log(this.selectedContract)
    this.selectedContract.Customer_ID = 'c78a0059-378e-4b3b-ac4f-0214e3ae4420';
    this.selectedContract.from_organization_code = this.userInfo['organization_code'];
    // this.selectedContract.contract_no = 'c78a0059-378e-4b3b-ac4f-0214e3ae4420';
    this.selectedContract.property_id = 'c78a0059-378e-4b3b-ac4f-0214e3ae4420';
    this.selectedContract.Plot_ID = Math.floor(Math.random() * 1000).toString();
    this.contractFormService.Add(this.selectedContract).subscribe(
      (contract) => {
        console.log("contract", contract);
        this.completed.emit();
        const toast = this.notificationsService.success("Sucess", contract);
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
  }
}
