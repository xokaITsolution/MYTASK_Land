import { Component, OnInit, Input } from '@angular/core';
import { ServiceService } from "../service.service";

@Component({
  selector: 'app-top-grid',
  templateUrl: './top-grid.component.html',
  styleUrls: ['./top-grid.component.css']
})
export class TopGridComponent implements OnInit {
  list;
  // public rentContract: RentContractObj;
  // public PropertyStatusLookUP;
  // showForm;
  licenceData = [];
  // selectedContract;
  @Input() AppNo;

  constructor(
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.licenceData = [];
    this.getFixeAssetsLookUp();
  }

  getFixeAssetsLookUp() {
    this.serviceService.getAll(this.AppNo).subscribe(
      (licenceData) => {
        this.licenceData = licenceData['list'];
        console.log("License_Service1", licenceData);
        console.log("License_Service1", this.licenceData[0]);
      },
      (error) => {
        console.log("error");
      }
    );
  }

}
