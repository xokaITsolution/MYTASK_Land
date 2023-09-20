import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { ServiceComponent } from "../service.component";
import { PropertyRegisterService } from "./property-register.service";
import { NotificationsService } from "angular2-notifications";
import { PropertyComponent } from "../property/property.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmationService } from "primeng/api";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ServiceService } from "../service.service";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { PlatformLocation } from "../plot-managment/plot-managment.component";

@Component({
  selector: "app-property-register",
  templateUrl: "./property-register.component.html",
  styleUrls: ["./property-register.component.css"],
})
export class PropertyRegisterComponent implements OnInit, OnChanges {
  @Output() completed = new EventEmitter();
  @Output() completeddel = new EventEmitter();

  public propertyRegister: PropertyRegister;
  public propformLocation: PropformLocation;
  @Input() selectedpro;
  @Input() disable;
  @Input() LicenceData;
  pictoShow;
  isnew = true;
  Saved = false;
  PropertyList: any;
  isproplocnew: boolean;
  proploc: any;
  language: string;
  plotloc: any;
  urlParams: any;
  PropertyTypeLookUP: any;
  CustomerLookUP: any;
  platformLocation: PlatformLocation;
  geo: any;

  constructor(
    private serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    private routerService: ActivatedRoute,
    public propertyRegisterService: PropertyRegisterService,
    private notificationsService: NotificationsService,
    public propertyComponent: PropertyComponent,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private ngxSmartModalService: NgxSmartModalService,
    private confirmationService: ConfirmationService
  ) {
    this.propertyRegister = new PropertyRegister();
    this.propformLocation = new PropformLocation();
  }
  changingValue: Subject<boolean> = new Subject();

  tellChild(aa) {
    console.log("value is changing", aa);
    this.geo = aa;
    this.serviceService.check = false;
    this.changingValue.next(aa);
  }
  async ngOnChanges() {
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
    });
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    this.pictoShow = null;
    console.log("chang detected");
    if (this.selectedpro !== undefined && this.selectedpro !== null) {
      this.propertyRegister = this.selectedpro;
      this.propertyRegister.plot_ID = this.selectedpro.Plot_ID;
      console.log("selected", this.selectedpro.Plot_ID);
      //
      this.getplotlocbyid(this.propertyRegister.plot_ID);
    }

    if (this.LicenceData !== undefined && this.LicenceData !== null) {
      if (!this.propertyRegister.property_ID) {
        this.propertyRegister.property_ID = this.LicenceData.Property_ID;
      }
    }
    if (this.propertyRegister.registration_Date) {
      if (this.language != "amharic") {
        this.propertyRegister.registration_Date =
          this.propertyRegister.registration_Date.split("T")[0];
      } else {
        this.propertyRegister.registration_Date =
          await this.getgregorianToEthiopianDate(
            this.propertyRegister.registration_Date
          );
      }
    }

    if (this.propertyRegister.map_Floor_Plan) {
      this.pictoShow =
        "data:image/jpg;base64, " + this.propertyRegister.map_Floor_Plan;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
    }

    if (!this.selectedpro.property_ID) {
      this.isnew = false;
    } else {
      this.isnew = true;
      this.getproploc(this.propertyRegister.property_ID);
    }
  }

  ngOnInit() {
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
    });
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    console.log("is new :: ", this.isnew);
    console.log("is disable :: ", this.disable);
  }
  selectedDateTime(dates: any, selecter) {
    if (selecter == 1) {
      this.propertyRegister.registration_Date =
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

  async save() {
    let totalsize =
      parseInt(this.propertyRegister.building_Size_M2) +
      parseInt(this.propertyRegister.proportional_from_Compound_Size) +
      parseInt(this.propertyRegister.parking_Area_M2);
    console.log(parseInt(this.serviceService.Plot_Size_M2));

    if (parseInt(this.serviceService.Plot_Size_M2) < totalsize) {
      const toast = this.notificationsService.error(
        "error",
        "the sum of building_Size_M2 , compound_Size_M2  and parking_Area_M2 must be equle to " +
          this.serviceService.Plot_Size_M2 +
          "M2"
      );
      return;
    } else {
      const prop = Object.assign({}, this.propertyRegister);
      if (prop.children) {
        prop.children = null;
      }
      if (prop.parent) {
        if (prop.parent.children) {
          prop.parent.children = null;
        }
      }
      if (prop.property_Parent_ID == "No Parent") {
        prop.property_Parent_ID = "0";
      }
      prop.registration_Date = await this.getEthiopianToGregorian(
        prop.registration_Date
      );
      console.log("saveing....", prop);
      this.propertyRegisterService.save(prop).subscribe(
        (property) => {
          console.log("property", property);
          this.getPropertyList(prop.plot_ID);
          if (!this.Saved) {
            this.completed.emit();
            this.Saved = true;
          }
          const toast = this.notificationsService.success("Sucess", property);
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
    }
  }
  modalRef: BsModalRef;
  openModall(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }
  getplotlocbyid(Plot_ID) {
    this.serviceService.getPlotloc(Plot_ID).subscribe((response: any) => {
      this.plotloc = response.procPlot_Locations;
      if (this.plotloc.length > 0) {
        this.platformLocation = this.plotloc[0];
        console.log(this.plotloc[0]);

        this.convertPolygonCoordinates(this.plotloc[0].geowithzone);
        this.serviceService.fromPropoperty = true;
        console.log("plotloc:", this.plotloc, this.plotloc[0].geowithzone);
        //this.isplotllocnew = true;
      } else {
        this.platformLocation = new PlatformLocation();
        //this.isplotllocnew = false;
      }
    });
  }
  convertPolygonCoordinates(polygonString: string): any[] {
    const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);

    const result = [];

    if (coordinates) {
      for (const coord of coordinates) {
        console.log("coordcoordcoord", coord);

        const [easting, northing, hemisphere, zone] = coord.split(" ");

        result.push({
          northing: northing,
          easting: easting,
          hemisphere: hemisphere,
          zone: zone,
        });
      }
    }
    console.log("result", result);
    this.convertCoordinates(result);

    return result;
  }
  convertCoordinates(data) {
    const convertedCoordinates = [];
    // Convert UTM coordinates to the desired format
    convertedCoordinates.push(["northing", "easting", "hemisphere", "zone"]);

    for (const coord of data) {
      convertedCoordinates.push([
        coord.northing,
        coord.easting,
        coord.hemisphere,
        coord.zone,
      ]);
    }
    this.tellChild(convertedCoordinates);
    console.log(
      "convertedCconvertedCoordinatesoordinates",
      convertedCoordinates
    );
  }
  closeModall() {
    // console.log('closeing.....');
    this.modalRef.hide();
  }
  Delete() {
    this.confirmationService.confirm({
      message: "Are you sure u want to delete this Property?",
      accept: () => {
        this.propertyRegister.is_Deleted = true;
        const prop = Object.assign({}, this.propertyRegister);
        if (prop.children) {
          prop.children = null;
        }
        if (prop.parent) {
          if (prop.parent.children) {
            prop.parent.children = null;
          }
        }
        console.log("saveing....", prop);
        this.propertyRegisterService.save(prop).subscribe(
          (property) => {
            console.log("property", property);
            this.getPropertyList(prop.plot_ID);
            const toast = this.notificationsService.success("Sucess", property);
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
  getPropertyList(Plot_ID) {
    this.serviceService.getPropertyLists(Plot_ID).subscribe(
      (PropertyList: any) => {
        this.PropertyList = PropertyList.procProperty_Registrations;
        this.PropertyList = Object.assign([], this.PropertyList);
        console.log("PropertyList", PropertyList);
        this.PropertyList.push({ property_ID: "No Parent" });
        this.getTree(Object.assign([], this.PropertyList));
        // this.novalidprops = this.PropertyList.length;
        // this.isvalidated();
      },
      (error) => {
        console.log("error");
      }
    );
  }
  getPropertyTypeLookUP() {
    this.serviceService.getPropertyTypeLookUP().subscribe(
      (PropertyTypeLookUP) => {
        this.PropertyTypeLookUP = PropertyTypeLookUP;
        this.PropertyTypeLookUP = Object.assign(
          [],
          this.PropertyTypeLookUP.list
        );
        // console.log('PropertyTypeLookUP', PropertyTypeLookUP);
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
          if (l1[j].Property_Parent_ID == a.property_ID) {
            b = Object.assign({}, l1[j]);
            b.label = Object.assign(l1[j].property_ID);
            b.children = [];
            a.children.push(b);
            l1[j].children = [];

            const l2 = Object.assign([], this.PropertyList);
            for (let k = 0; k < l2.length; k++) {
              let c;
              if (l2[k].property_Parent_ID == b.property_ID) {
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
  async add() {
    let totalsize =
      parseInt(this.propertyRegister.building_Size_M2) +
      parseInt(this.propertyRegister.proportional_from_Compound_Size) +
      parseInt(this.propertyRegister.parking_Area_M2);
    console.log(parseInt(this.serviceService.Plot_Size_M2));

    if (parseInt(this.serviceService.Plot_Size_M2) < totalsize) {
      const toast = this.notificationsService.error(
        "error",
        "the sum of building_Size_M2 , compound_Size_M2  and parking_Area_M2 must be equle to " +
          this.serviceService.Plot_Size_M2 +
          "M2"
      );
      return;
    } else {
      const prop = Object.assign({}, this.propertyRegister);
      if (prop.children) {
        prop.children = null;
      }
      if (prop.parent) {
        if (prop.parent.children) {
          prop.parent.children = null;
        }
      }

      if (prop.property_Parent_ID == "No Parent") {
        prop.property_Parent_ID = "0";
      }
      prop.registration_Date = await this.getEthiopianToGregorian(
        prop.registration_Date
      );
      this.propertyRegisterService.Add(prop).subscribe(
        (deptSuspension) => {
          console.log("deptSuspension", deptSuspension);

          this.isnew = true;
          if (!this.Saved) {
            this.completed.emit();
            this.Saved = true;
          }
          this.getPropertyList(prop.plot_ID);
          if (prop.property_Parent_ID != "0") {
            this.serviceService.hide = false;
          }
          const toast = this.notificationsService.success(
            "Sucess",
            deptSuspension
          );
          // this.serviceService.disablefins = false;

          console.log("added property registration");
        },
        (error) => {
          console.log(error);
          if (error.status == "400") {
            const toast = this.notificationsService.error(
              "Error",
              error.error.InnerException.Message
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
    }
  }
  getproploc(plotid) {
    this.serviceService.getProploc(plotid).subscribe((response: any) => {
      this.proploc = response.procProporty_Locations;

      console.log("protlocprotloc:", this.proploc);
      if (this.proploc.length > 0) {
        this.propformLocation = this.proploc[0];
        this.isproplocnew = false;
      } else {
        this.isproplocnew = true;
      }
    });
  }
  getproplocbyid() {
    this.serviceService
      .getPlotloc(this.selectedpro.plot_ID)
      .subscribe((response: any) => {
        this.plotloc = response.procPlot_Locations;
        console.log("plotlocccc:", this.plotloc, this.plotloc[0].geowithzone);
        if (this.plotloc.length > 0) {
          // this.platformLocation=this.plotloc[0]
          this.convertPolygonCoordinates(this.plotloc[0].geowithzone);

          console.log("plotlocccc:", this.plotloc, this.plotloc[0].geowithzone);
          this.serviceService
            .getProploc(this.selectedpro.property_ID)
            .subscribe((response: any) => {
              this.proploc = response.procProporty_Locations;
              if (this.proploc.length > 0) {
                this.propformLocation = this.proploc[0];
                this.convertPolygonCoordinates(this.proploc[0].geowithzone);

                console.log(
                  "protlocprotlocprotlocprotloc:",
                  this.proploc,
                  this.proploc[0].geowithzone
                );
                this.isproplocnew = false;
              } else {
                this.isproplocnew = true;
              }
            });
        }
      });
  }

  convertToMultiPoint(
    points: {
      easting: number;
      northing: number;
      hemisphere: string;
      zone: number;
    }[]
  ): string {
    const multiPointArray = points
      .map(
        (point) =>
          `${point.easting} ${point.northing} ${point.hemisphere} ${point.zone}`
      )
      .join(", ");

    // const multiPointString = `MULTIPOINT(${multiPointArray})`;
    const multiPointString = `POLYGON((${multiPointArray}))`;

    return multiPointString;
  }
  convertToMultiPoints(
    points: { easting: number; northing: number }[]
  ): string {
    const multiPointArray = points
      .map((point) => `${point.easting} ${point.northing}`)
      .join(", ");

    // const multiPointString = `MULTIPOINT(${multiPointArray})`;
    const multiPointString = `POLYGON((${multiPointArray}))`;

    return multiPointString;
  }
  // convertPolygonCoordinates(polygonString: string): any[] {
  //   const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);

  //   const result = [];

  //   if (coordinates) {
  //     for (const coord of coordinates) {
  //       console.log("coordcoordcoord", coord);

  //       const [easting, northing, hemisphere, zone] = coord.split(" ");

  //       result.push({
  //         northing: northing,
  //         easting: easting,
  //         hemisphere: hemisphere,
  //         zone: zone,
  //       });
  //     }
  //   }
  //   console.log("result", result);
  //   this.convertCoordinates(result);

  //   return result;
  // }
  // convertCoordinates(data) {
  //   const convertedCoordinates = [];
  //   // Convert UTM coordinates to the desired format
  //   convertedCoordinates.push(["northing", "easting", "hemisphere", "zone"]);

  //   for (const coord of data) {
  //     convertedCoordinates.push([
  //       coord.northing,
  //       coord.easting,
  //       coord.hemisphere,
  //       coord.zone,
  //     ]);
  //   }
  //   this.tellChild(convertedCoordinates);
  //   console.log(
  //     "convertedCconvertedCoordinatesoordinates",
  //     convertedCoordinates
  //   );
  // }
  updateproploc() {
    console.log("coordinatcoordinat", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      let coordinate = this.convertToMultiPoint(this.serviceService.coordinate);
      let coordinate2 = this.convertToMultiPoints(
        this.serviceService.coordinate
      );
      this.propformLocation.geo = coordinate2;
      this.propformLocation.geowithzone = coordinate;
      this.serviceService.getUserRole().subscribe((response: any) => {
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.propformLocation.updated_By = response[0].UserId;
        this.propformLocation.updated_Date = new Date();
        if (response[0].RoleId == "f8dda85e-f967-4ac5-bf79-4d989ecfb863") {
          this.propformLocation.team_Leader_Approved_By = response[0].UserId;
          this.propformLocation.team_Leader_Approved = true;
          console.log(
            this.propformLocation.team_Leader_Approved_By,
            this.propformLocation.team_Leader_Approved
          );
        } else if (
          response[0].RoleId == "fe7be2e0-e717-4230-b732-5b810a8bb875"
        ) {
          this.propformLocation.baseMap_Approved_By = response[0].UserId;
          this.propformLocation.baseMap_Approved = true;
          console.log(
            this.propformLocation.team_Leader_Approved_By,
            this.propformLocation.team_Leader_Approved
          );
        }
        this.serviceService.updateProploc(this.propformLocation).subscribe(
          (CustID) => {
            this.getproploc(this.propformLocation.proporty_Id);
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully Upadted"
            );
          },
          (error) => {
            console.log("error");
            const toast = this.notificationsService.error(
              "error",
              `unable to Update ${
                error["status"] == 0
                  ? error["message"]
                  : JSON.stringify(JSON.stringify(error["error"]))
              }`
            );
          }
        );
      });
    }
  }
  saveproploc() {
    console.log("coordinatcoordinat", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      // let coordinate= this.convertToMultiPoint(this.serviceService.coordinate)
      // console.log('coordinatecoordinate',coordinate)

      // let coordinate= this.convertToMultiPoint(this.serviceService.coordinate)
      // this.propformLocation.geowithzone=coordinate

      this.serviceService.getUserRole().subscribe((response: any) => {
        let coordinates = this.convertToMultiPoints(
          this.serviceService.coordinate
        );
        console.log("coordinatecoordinate", coordinates);
        this.propformLocation.geo = coordinates;
        let coordinate = this.convertToMultiPoint(
          this.serviceService.coordinate
        );
        this.propformLocation.geowithzone = coordinate;
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.propformLocation.proporty_Id = this.propertyRegister.property_ID;
        this.propformLocation.created_By = response[0].RoleId;
        this.propformLocation.created_Date = new Date();
        this.serviceService.saveProploc(this.propformLocation).subscribe(
          (CustID) => {
            this.getproploc(this.propformLocation.proporty_Id);
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully saved"
            );
            this.serviceService.hide = false;
          },
          (error) => {
            console.log("error");
            const toast = this.notificationsService.error(
              "error",
              `unable to Save ${
                error["status"] == 0
                  ? error["message"]
                  : JSON.stringify(JSON.stringify(error["error"]))
              }`
            );
          }
        );
      });
    }
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
      this.propertyRegister.imageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];
      this.propertyRegister.map_Floor_Plan = base64file;
    });
  }

  upload(event, form) {
    this.Uploader(event.files[0]);
    form.clear();
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(modal) {
    console.log("closeing.....");
    this.ngxSmartModalService.getModal(modal).close();
  }
}

export class PropertyRegister {
  public property_ID: any;
  public description: any;
  public plot_ID: any;
  public registration_Date: any;
  public property_Type_ID: any;
  public basement_Floor_No: any;
  public upper_Floor_No: any;
  public parking_Area_M2: any;
  public estimated_Price: any;
  public building_Size_M2: any;
  public compound_Size_M2: any;
  public property_Status_ID: any;
  public property_Parent_ID: any;
  public map_Floor_Plan: any;
  public application_No: any;
  public licence_Service_ID: any;
  public number_of_Lift: any;
  public building_No: any;
  public houseNo: any;
  public location_of_Property: any;
  public floor_No: any;
  public size_In_Proportional: any;
  public proportional_from_Compound_Size: any;
  public created_By: any;
  public updated_By: any;
  public deleted_By: any;
  public is_Deleted: any;
  public created_Date: any;
  public updated_Date: any;
  public deleted_Date: any;
  public imageType: any;
  public children;
  public parent;
}
export class PropformLocation {
  public proporty_Id: any;
  public no: any;
  public created_By: any;
  public updated_By: any;
  public deleted_By: any;
  public is_Deleted: any;
  public created_Date: any;
  public updated_Date: any;
  public deleted_Date: any;
  public geo: any;
  public plan_Document: any;
  public picture_North: any;
  public picture_East: any;
  public picture_South: any;
  public picture_West: any;
  public baseMap_Approved: any;
  public baseMap_Approved_By: any;
  public team_Leader_Approved: any;
  public team_Leader_Approved_By: any;
  public geowithzone: any;
}
