import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { ServiceService } from "../service.service";
import { TreeNode } from "primeng/api";
import { NotificationsService } from "angular2-notifications";
import { ServiceComponent } from "../service.component";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-property",
  templateUrl: "./property.component.html",
  styleUrls: ["./property.component.css"],
})
export class PropertyComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Output() getpro = new EventEmitter();
  @Input() LicenceData;
  highlighted;
  @Input() Mode;
  @Input() Licence_Service_ID;
  @Input() disable;
  @Input() AppNo;
  @Input() Service_ID;
  @Input() todoid;
  @Input() tskID;
  @Input() DocID;
  PlotManagementList = [];
  propertyForm;
  SelectedProperty;
  PropertyList;
  propertyregForm;
  selectedprofromtree;
  selectedFile;
  disabled;
  PropertyTypeLookUP: any;
  totitleDeed;
  toFixedasset;
  isnew = true;
  CanDone;
  novalidprops;

  public SelectedProprtyPlot;

  Saved = false;
  language: string;
  newplot: boolean = true;

  constructor(
    public serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService
  ) {}

  ngOnChanges() {
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    this.propertyForm = false;
    this.propertyregForm = false;
    this.PlotManagementList = [];
    this.novalidprops = 0;
    this.getPloat();
  }

  getPloat() {
    if (this.LicenceData.Parcel_ID) {
      console.log("geting ploat this.Parcel_ID", this.LicenceData.Parcel_ID);
      this.getPlotManagement(this.LicenceData.Parcel_ID);
    }
    if (this.LicenceData.Plot_Merge_1) {
      console.log(
        "geting ploat this.Plot_Merge_1",
        this.LicenceData.Plot_Merge_1
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_1);
    }
    if (this.LicenceData.Plot_Merge_2) {
      console.log(
        "geting ploat this.Plot_Merge_2",
        this.LicenceData.Plot_Merge_2
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_2);
    }
    if (this.LicenceData.Plot_Merge_3) {
      console.log(
        "geting ploat this.Plot_Merge_3",
        this.LicenceData.Plot_Merge_3
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_3);
    }
    if (this.LicenceData.Plot_Merge_4) {
      console.log(
        "geting ploat this.Plot_Merge_4",
        this.LicenceData.Plot_Merge_4
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_4);
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
  getPlotManagement(Parcel_ID) {
    let a;
    this.serviceService.getPlotManagement(Parcel_ID).subscribe(
      async (PlotManagementList) => {
        a = PlotManagementList;
        let b = false;
        console.log("this.PlotManagementList", this.PlotManagementList);
        for (let i = 0; i < (PlotManagementList as any).list.length; i++) {
          console.log("plot list loop");

          if (
            a.list[0].Plot_ID == (PlotManagementList as any).list[i].Plot_ID
          ) {
            b = true;
            break;
          }
        }
        if (b) {
          this.novalidprops = this.novalidprops + 1;
          if (this.language == "amharic") {
            a.list[0].Registration_Date =
              await this.getgregorianToEthiopianDate(
                a.list[0].Registration_Date
              );
          }
          this.PlotManagementList.push(a.list[0]);
          // this.isisvalidated(
          //   this.todoid,
          //   this.tskID,
          //   a.list[0].Plot_ID,
          //   "00000000-0000-0000-0000-000000000000",
          //   this.DocID
          // );
        }

        console.log("PlotManagementList", PlotManagementList);
        console.log("this.PlotManagementList", this.PlotManagementList);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  SelectProprty(property) {
    this.propertyForm = true;
    this.propertyregForm = false;
    this.SelectedProperty = property;

    this.serviceService.Plot_Size_M2 = this.SelectedProperty.Plot_Size_M2;
    console.log("plotManagment", this.SelectedProperty);
    this.getPropertyList();
    // this.disable=false;
  }

  getPropertyList() {
    this.serviceService
      .getPropertyLists(this.SelectedProperty.Plot_ID)
      .subscribe(
        (PropertyList: any) => {
          this.PropertyList = PropertyList.procProperty_Registrations;
          this.PropertyList = Object.assign([], this.PropertyList);
          console.log("PropertyList", PropertyList);
          this.PropertyList.push({ property_ID: "No Parent" });
          this.getTree(Object.assign([], this.PropertyList));
          this.novalidprops = this.PropertyList.length;
          this.isvalidated();
        },
        (error) => {
          console.log("error");
        }
      );
  }

  getTree(List) {
    this.serviceService.files = [];
    for (let i = 0; i < this.PropertyList.length; i++) {
      let a;
      if (
        this.PropertyList[i].property_Parent_ID == null ||
        this.PropertyList[i].property_Parent_ID == 0
      ) {
        a = Object.assign({}, this.PropertyList[i]);
        a.label = Object.assign(this.PropertyList[i].property_ID);
        a.children = [];
        const l1 = Object.assign([], this.PropertyList);
        for (let j = 0; j < l1.length; j++) {
          let b;
          if (l1[j].property_Parent_ID == a.property_ID) {
            b = Object.assign({}, l1[j]);
            b.label = Object.assign(l1[j].property_ID);
            b.children = [];
            a.children.push(b);
            l1[j].children = [];

            const l2 = Object.assign([], this.PropertyList);
            for (let k = 0; k < l2.length; k++) {
              let c;
              if (l2[k].Property_Parent_ID == b.property_ID) {
                c = Object.assign({}, l2[k]);
                c.label = Object.assign(l2[k].property_ID);
                c.children = [];
                b.children.push(c);
              }
            }
          }
        }
        this.serviceService.files.push(a);
      }
    }
    console.log("this.files", this.serviceService.files);
  }

  AddNew() {
    this.getpro.emit();
    this.isnew = true;
    this.propertyregForm = true;
    this.selectedprofromtree = {};
    if (this.selectedFile) {
      this.selectedprofromtree.property_Parent_ID =
        this.selectedFile.property_ID;
    }
    console.log("plotManagment", this.SelectedProperty.Plot_ID);

    this.selectedprofromtree.Plot_ID = this.SelectedProperty.Plot_ID;
    this.selectedprofromtree.Property_Type_ID = 1;
    this.selectedprofromtree.licence_Service_ID = this.Licence_Service_ID;
  }
  selectedTab = 0;
  tab1;
  tab2;
  initTabs() {
    this.tab1 = true;
    this.tab2 = false;
  }
  tabChanged(e) {
    console.log(e.index);
    if (e.index == 0) {
      this.tab1 = true;
      this.tab2 = false;
    } else if (e.index == 1) {
      this.tab1 = false;
      this.tab2 = true;
    }
  }
  nodeSelect() {
    console.log("selectedFile", this.selectedFile);

    if (this.selectedFile.property_ID == "No Parent") {
      this.getpro.emit();
      // this.serviceService
      //   .getPropertyTypeLookUP()
      //   .subscribe((PropertyTypeLookUP) => {
      //     this.PropertyTypeLookUP = PropertyTypeLookUP;
      //     this.PropertyTypeLookUP = Object.assign(
      //       [],
      //       this.PropertyTypeLookUP.list
      //     );
      //     // console.log('PropertyTypeLookUP', PropertyTypeLookUP);
      //   });

      this.newplot = false;
      this.propertyregForm = false;

      this.serviceService.hide = true;
      this.isnew = true;
    } else {
      // this.serviceService
      //   .getPropertyTypeLookUP()
      //   .subscribe((PropertyTypeLookUP) => {
      //     this.PropertyTypeLookUP = PropertyTypeLookUP;
      //     this.PropertyTypeLookUP = Object.assign(
      //       [],
      //       this.PropertyTypeLookUP.list
      //     );

      //   });

      this.propertyregForm = true;
      this.isnew = false;
      this.selectedFile.Plot_ID = this.SelectedProperty.Plot_ID;
      this.selectedprofromtree = this.selectedFile;

      console.log("any", this.selectedprofromtree, this.SelectedProperty);
      this.selectedprofromtree = this.selectedFile;
      if (this.selectedFile.property_Type_ID == 1) {
        this.newplot = true;
      } else {
        this.serviceComponent.PropertyTypeLookUP =
          this.serviceComponent.PropertyTypeLookUP.filter(
            (x) => x.Property_Type_ID != 1
          );
      }
    }
  }

  SelectPropertyPLot(ProprtyPlot) {
    this.propertyregForm = false;
    this.SelectedProprtyPlot = ProprtyPlot;
  }

  isvalidated() {
    if (this.PropertyList !== null && this.PropertyList !== undefined) {
      for (let i = 0; i < this.PropertyList.length; i++) {
        if (this.PropertyList[i].property_ID !== "No Parent") {
          this.isisvalidated(
            this.todoid,
            this.tskID,
            "00000000-0000-0000-0000-000000000000",
            "00000000-0000-0000-0000-000000000000",
            this.DocID
          );
        }
      }
    }
  }

  isisvalidated(todoID, tskID, plotid, proid, DocID) {
    this.serviceService
      .isvalidated(todoID, tskID, plotid, proid, DocID)
      .subscribe(
        (Validated) => {
          if (Validated == "Validated") {
            this.novalidprops = this.novalidprops - 1;
            console.log("novalidprops", this.novalidprops);
            this.completed.emit();
            if (this.novalidprops == 0) {
              if (!this.Saved) {
                this.Saved = true;
              }
              // this.CanDone = true;
            }
          } else {
            // this.validated = false;
            // const toast = this.notificationsService.warn("Warning", Validated);
          }
          // this.RequerdDocs = RequerdDocs;

          // this.getAllDocument();
          // console.log('RequerdDocs', this.RequerdDocs);
        },
        (error) => {
          console.log("error");
        }
      );
  }

  EnableFins() {
    this.getPropertyList();
    this.isvalidated();
  }

  EnableFinspro() {
    // this.propertyregForm = false;
    this.getPropertyList();
    this.isvalidated();
  }

  EnableFinsFixedasset() {
    // this.propertyregForm = false;
    console.log("fixed asset");
    this.toFixedasset = true;
    this.getPropertyList();
    this.isvalidated();
  }

  EnableFinspronew(Property) {
    this.getPropertyList();
    // this.propertyregForm = false;
    this.selectedFile = Property;
    // this.completed.emit();
    console.log("next to measurement", Property.property_ID);

    this.selectedprofromtree;
    this.selectedprofromtree = {
      property_ID: Property.property_ID,
    };
  }

  EnabledelFinspro() {
    this.getPropertyList();
    this.propertyregForm = false;
  }

  EnableFinsMesNEw() {
    // this.propertyregForm = false;
    // this.getPropertyList();
    // this.completed.emit();
    this.totitleDeed = true;
  }

  DoneNew() {
    this.propertyregForm = false;

    this.isvalidated();
  }

  EnableFinstitle() {
    // this.propertyregForm = false;
    // this.getPropertyList();
    // this.completed.emit();
    this.CanDone = true;
  }
}
