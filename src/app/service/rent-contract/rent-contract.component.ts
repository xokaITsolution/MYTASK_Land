import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { RentContractService } from "./rent-contract.service";

@Component({
  selector: 'app-fixed-asset-rent',
  templateUrl: './rent-contract.component.html',
  styleUrls: ['./rent-contract.component.css']
})
export class RentContractComponent implements OnInit {
  @Output() completed = new EventEmitter;
  @Input() disable;
  @Input() Licence_Service_ID;
  @Input() Service_ID;
  public rentContract: RentContractObj;
  public PropertyStatusLookUP;
  isNew;
  isEdit;
  showForm;
  rentContracts;
  selectedContract;
  @Input() selectedpro;
  @Input() AppNo;
  Saved=false;

  constructor(
    private rentContractService: RentContractService
  ) { }

  ngOnInit() {
    // this.getFixeAssetsLookUp();
    this.getAllRentContracts();
    this.rentContract = new RentContractObj();
    this.isNew = false;
    this.isEdit = false;
    this.showForm = false;
  }

  getAllRentContracts() {
    this.rentContractService.getAllRentContract().subscribe(
      rentContracts => {
        this.rentContracts = rentContracts['procRentContracts'];
        this.rentContracts = (this.rentContracts as Array<any>).filter(
          rentContract => {
            if (rentContract.property_ID === this.selectedpro.Property_ID) {
              return true;
            }
            else {
              return false;
            }
          }
        );
        console.log('rent contracts :: ', rentContracts);
      },
      error => {
        console.error('unable to get rent contracts :: ', error);
      }
    );
  }

  getFixeAssetsLookUp() {
    console.log(">>>.", this.selectedpro.Property_ID)
    this.rentContracts = [new RentContractObj(), new RentContractObj()];
    this.rentContracts[0].rent_contract_id = "Type";
    this.rentContracts[0].property_id = this.selectedpro.Property_ID;
    this.rentContracts[0].plot_ID = this.selectedpro.Plot_ID;
    this.rentContracts[0].prop_type = "Type";
    this.rentContracts[0].basement_floor = "23";
    this.rentContracts[0].house_no = "421";
    this.rentContracts[0].description = "Some desc";
    this.rentContracts[0].number_of_lift = "4";
    this.rentContracts[0].estimated_price = "230,00";
    this.rentContracts[0].upper_floor = "12";
    this.rentContracts[0].building_size = "Type";
    this.rentContracts[0].property_status = "Active";
    this.rentContracts[0].parking_size = "Type";
    this.rentContracts[0].total_size = "Type";
    this.rentContracts[0].is_active = "Type";
    this.rentContracts[0].registration_date = "Type";

    this.rentContracts[1].rent_contract_id = "Type";
    this.rentContracts[0].property_id = this.selectedpro.Property_ID;
    this.rentContracts[0].plot_ID = this.selectedpro.Plot_ID;
    this.rentContracts[1].prop_type = "Type";
    this.rentContracts[1].basement_floor = "23";
    this.rentContracts[1].house_no = "421";
    this.rentContracts[1].description = "Type";
    this.rentContracts[1].number_of_lift = "4";
    this.rentContracts[1].estimated_price = "2300";
    this.rentContracts[1].upper_floor = "Type";
    this.rentContracts[1].building_size = "Type";
    this.rentContracts[1].property_status = "Active";
    this.rentContracts[1].parking_size = "Type";
    this.rentContracts[1].total_size = "Type";
    this.rentContracts[1].is_active = "Type";
    this.rentContracts[1].registration_date = "Type";
    this.rentContractService.getAll().subscribe(
      (propertyType) => {
        // this.rentContract = propertyType;
        console.log("propertyType>>", propertyType);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  AddAsset() {
    const rentContract = new RentContractObj();
    rentContract.property_id = this.selectedpro.Property_ID;
    rentContract.plot_ID = this.selectedpro.Plot_ID;
    this.selectedContract = rentContract;
    this.isNew = true;
    this.showForm = true;
  }

  EditAsset(contract) {
    this.selectedContract = contract;
    this.isNew = false;
    this.showForm = true;
    this.isEdit = true;
  }

  EnableFins() {
    this.getAllRentContracts();
    if(!this.Saved){
      this.completed.emit();
      this.Saved = true;
  }
    
  }
}

export class RentContractObj {
  public rent_contract_id: string;
  public property_id: string;
  public plot_ID: string;
  public from_organization_code: string;
  public rent_contract_type: string;
  public service_code: string;
  public application_code: string;
  public application_no: string;
  public to_customer: string;
  public currency: string;
  public unit: string;
  public price: string;
  public start_date: string;
  public end_date: string;
  public renew_year: string;
  public renew_contract_document: string;
  public main_contract_document: string;
  public parent_contact: string;
  public terminate: string;
  public terminate_remark: string;
  public active: string;
  public active_remark: string;
  public reference_letter: string;
  public document_id: string;
  public contract_no: string;
}
