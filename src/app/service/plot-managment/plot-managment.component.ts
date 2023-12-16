import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ServiceComponent } from "../service.component";
import { PloatManagmentService } from "./ploat-managment.service";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ServiceService } from "../service.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ViewEncapsulation } from "@angular/core";
import { Regions } from "./regions";
import { PlotComponent } from "../plot/plot.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GisMapComponent } from "../gis-map/gis-map.component";
import { environment } from "src/environments/environment";
import { GisMapService } from "../gis-map/gis-map.service";
import { BehaviorSubject, Subject } from "rxjs";
import * as proj4 from "proj4";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-plot-managment",
  templateUrl: "./plot-managment.component.html",
  styleUrls: ["./plot-managment.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class PlotManagmentComponent implements OnInit, OnChanges {
  @Output() completed = new EventEmitter<any>();
  @Output() completeddel = new EventEmitter<any>();
  @Input() LicenceData;
  public plotManagment: PlotManagment;
  public platformLocation: PlatformLocation;
  @Input() SelectedPlot;
  @Input() disable;
  @Input() Fields;

  mapCenter = [11.610400228322295, 37.41706261388921];
  basemapType = "streets-vector";
  mapZoomLevel = 1;
  isnew = false;
  isploatDisabled = false;
  displayGIS = false;
  toogleSpin = false;
  Saved = false;
  woredas = [];
  woredasHolder = [];
  zoneOptions = [];
  Land_Grade = [];
  selectedRegion;
  selectedZone;
  plotloc: any;
  isplotllocnew: boolean = true;
  language: string;
  urlParams: any;
  plotlistnull: null;
  PlotManagementfilterd: any;
  serachplotExists: boolean;

  constructor(
    public serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    public serviceComponent: ServiceComponent,
    private ploatManagmentService: PloatManagmentService,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService,
    private message: MessageService,
    private routerService: ActivatedRoute,
    private modalService: BsModalService,
    public plotcomponent: PlotComponent,
    public gisMapService: GisMapService
  ) {
    this.plotManagment = new PlotManagment();
    this.platformLocation = new PlatformLocation();
  }

  @ViewChild("myModal", { static: false }) myModal: TemplateRef<any>;
  // tellChild(aa) {
  //   this.serviceService.check = false;
  //   this.changingValue.next(aa);
  // }
  modalRef: BsModalRef;
  openModall(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }
  closeModall() {
    // console.log('closeing.....');
    this.modalRef.hide();
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
    console.log(
      "haha1",
      this.SelectedPlot,
      this.serviceComponent.ServiceDeliveryUnitLookUP
    );

    if (this.SelectedPlot) {
      console.log("plotManagment", this.SelectedPlot);

      this.plotManagment = this.SelectedPlot;
      this.plotManagment.plot_Status = 1;
      this.getplotloc(this.plotManagment.plot_ID);
      this.regionSelectedd(this.plotManagment.sdP_ID);
    }
    console.log("chang detected");

    if (this.plotManagment["plot_ID"]) {
      this.isnew = this.plotManagment["parcel_No"] ? false : true;
      this.isploatDisabled = true;
    } else {
      this.isnew = this.plotManagment["parcel_No"] ? false : true;
      this.isploatDisabled = false;
    }

    // if (this.plotManagment.Registration_Date) {
    //   if (this.language == "amharic") {
    //     this.plotManagment.Registration_Date =
    //       await this.getgregorianToEthiopianDate(
    //         this.plotManagment.Registration_Date
    //       );
    //   }
    // }
    // this.plotManagment.SDP_ID =
    //   this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code;
    if (
      this.plotManagment.sdP_ID != null ||
      this.plotManagment.sdP_ID != undefined
    ) {
      this.regionSelectedd(this.plotManagment.sdP_ID);
    }
    console.log("vvvvv", this.plotManagment.sdP_ID);
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
  selectedDateTime(dates: any, selecter) {
    if (selecter == 1) {
      this.plotManagment.registration_Date =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;
      console.log(this.plotManagment.registration_Date);
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
    // this.getServiceDeliveryUnitLookUP();
    console.log(
      "plot debug ::: ",
      "is new :: ",
      this.isnew,
      "disabled :: ",
      this.disable,
      "is plot Disabled :: ",
      this.isploatDisabled,
      "plot id :: ",
      this.plotManagment.plot_ID,
      "plotManagement :: ",
      this.plotManagment
    );

    // this.plotManagment.SDP_ID=this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code
  }

  subcitySelected(event) {
    if (this.selectedRegion) {
      (this.selectedRegion.woredas as any[]).find((subcity) => {
        if (subcity.value == event.target.value) {
          this.woredas = subcity.woredas;
          return true;
        }
        return false;
      });
    }
  }
  LandGrade(event) {
    if (this.selectedRegion) {
      (this.selectedRegion.Land_Grade as any[]).find((sub) => {
        if (sub.value == event.target.value) {
          this.Land_Grade = sub.Land_Grade;
          return true;
        }
        return false;
      });
    }
  }
  regionSelectedd(events) {
    Regions.find((region) => {
      if (region.orgCode == events) {
        console.log("bbbb", events);
        this.zoneOptions = region.woredas;
        this.selectedRegion = region;
        this.woredas = [];
        this.plotManagment.land_Grade_ID;
        return true;
      }
      return false;
    });
  }
  regionSelected(event) {
    Regions.find((region) => {
      if (region.orgCode == event.target.value) {
        console.log("bbbx", event.target.value);
        this.zoneOptions = region.woredas;
        this.selectedRegion = region;
        this.woredas = [];
        this.plotManagment.land_Grade_ID;
        return true;
      }
      return false;
    });
  }

  woredaLookup() {
    this.serviceService.getWoredaLookUP().subscribe(
      (data) => {
        if (data["list"] instanceof Array) {
          this.woredasHolder = data["list"];
          this.woredasHolder.sort(
            (a, b) => a["Woreda_Name"] - b["Woreda_Name"]
          );
          let tempWoredasHolder = [];
          this.woredasHolder.forEach((woreda) => {
            if (
              !tempWoredasHolder.some(
                (tempWoreda) =>
                  tempWoreda["Woreda_Name"] == woreda["Woreda_Name"]
              )
            ) {
              tempWoredasHolder.push(woreda);
            }
          });
          this.woredasHolder = tempWoredasHolder;
        }
      },
      (error) => {
        console.error("unable to get woreda :: ", error);
      }
    );
  }

  finishSelection() {
    this.plotManagment.plot_ID = this.plotManagment.plot_ID.toString();
    this.platformLocation.ploteId = this.plotManagment.plot_ID;
    console.log("gusssss", this.plotManagment.plot_ID);
    this.getplotloc(this.platformLocation.ploteId);
    if (this.plotManagment.plot_ID) {
      this.message.add({
        severity: "success",
        summary: "Plot Selection",
        detail: "Plot selected successfully!",
      });

      this.toogleSpin = true;
      setTimeout(() => {
        this.displayGIS = false;
        this.toogleSpin = false;
      }, 1000);
    } else {
      this.message.add({
        severity: "warn",
        summary: "Plot Selection",
        detail: "Please select a plot first!",
      });
    }
  }

  selectPlotID(plotData) {
    console.log("selected plot :: ", plotData);
    this.plotManagment.plot_ID = plotData;
    // if (plotData.properties.OBJECTID || plotData.properties.ID_3 || plotData.properties.ID_0) {
    //   console.log('plot id from gis :: ', plotData.properties.POP2000);
    //   console.log('plot id before gis :: ', this.plotManagment.Plot_ID);
    //   this.plotManagment.Plot_ID = plotData.properties.OBJECTID ? plotData.properties.OBJECTID : plotData.properties.ID_3 || plotData.properties.ID_0;
    //   console.log('plot id from gis :: ', this.plotManagment.Plot_ID);
    // }
  }
  convertToMultiPoints(
    points: { easting: number; northing: number }[]
  ): string {
    const multiPointArray = points
      .map((point) => `${point.easting} ${point.northing}`)
      .join(", ");

    if (this.serviceService.iscircleLatLngs == 0) {
      const multiPointString = `POLYGON((${multiPointArray}))/0`;

      return multiPointString;
    } else {
      const multiPointCircle = this.serviceService.centerLatLng
        .map((point) => `${point.easting} ${point.northing}`)
        .join(", ");

      const multiPoint = `POINT(${multiPointCircle})/${Math.trunc(
        this.serviceService.iscircleLatLngs
      )}`;
      return multiPoint;
    }
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

  onConfirm(): void {
    // Handle confirm action
    console.log("Dialog confirmed");
    if (this.serviceService.coordinate) {
      let coordinate = this.convertToMultiPoint(this.serviceService.coordinate);
      // let coordinate2= this.convertToMultiPoints(this.serviceService.coordinate)
      this.plotManagment.plot_ID = this.serviceService.coordinate.toString();
    }
    this.displayGIS = false;
  }
  plotSelector(event) {
    console.log("event", event.mapPoint.spatialReference.latestWkid);
    if (!this.isploatDisabled) {
      this.plotManagment.plot_ID = event.mapPoint.spatialReference.latestWkid;
      this.ngxSmartModalService.getModal("GisViewer").close();
    }
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(modal) {
    console.log("closeing.....");
    this.plotManagment.GISCoordinate =
      this.plotManagment.giS_X_Coordinate_1 +
      ":" +
      this.plotManagment.giS_Y_Coordinate_1 +
      "," +
      this.plotManagment.giS_X_Coordinate_2 +
      ":" +
      this.plotManagment.giS_Y_Coordinate_2 +
      "," +
      this.plotManagment.giS_X_Coordinate_3 +
      ":" +
      this.plotManagment.giS_Y_Coordinate_3 +
      "," +
      this.plotManagment.giS_X_Coordinate_4 +
      ":" +
      this.plotManagment.giS_Y_Coordinate_4 +
      "," +
      this.plotManagment.giS_X_Coordinate_5 +
      ":" +
      this.plotManagment.giS_Y_Coordinate_5 +
      "," +
      this.plotManagment.giS_X_Coordinate_6 +
      ":" +
      this.plotManagment.giS_Y_Coordinate_6 +
      "," +
      this.plotManagment.giS_X_Coordinate_7 +
      ":" +
      this.plotManagment.giS_Y_Coordinate_7 +
      "," +
      this.plotManagment.giS_X_Coordinate_8 +
      ":" +
      this.plotManagment.giS_X_Coordinate_8;
    this.ngxSmartModalService.getModal(modal).close();
  }

  async save() {
    this.plotManagment.plot_ID = JSON.stringify(this.plotManagment.plot_ID);
    this.platformLocation.ploteId = this.plotManagment.plot_ID;
    if (this.language === "amharic") {
      this.plotManagment.registration_Date = await this.getEthiopianToGregorian(
        this.plotManagment.registration_Date
      );
    }
    this.plotManagment.registration_Date = await this.getEthiopianToGregorian(
      this.plotManagment.registration_Date
    );

    this.ploatManagmentService.save(this.plotManagment).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );
        // this.serviceService.disablefins=false

        if (!this.Saved) {
          this.completed.emit(this.plotManagment);
          this.Saved = true;
        }
      },
      (error) => {
        console.log(error);

        if (error.status == "400") {
          const toast = this.notificationsService.error("Error", error.error);
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
  filter(e) {
    if (e.target.value) {
      this.serviceService.getPlotManagement(e.target.value).subscribe(
        async (PlotManagementLists: any) => {
          this.PlotManagementfilterd = PlotManagementLists.list;
          console.log("PlotManagementListsfilterd", this.PlotManagementfilterd);
          if (this.PlotManagementfilterd.length > 0) {
            this.serachplotExists = true;
          } else {
            this.serachplotExists = false;
          }
        },
        (error) => {
          console.log("error => ", error);
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      );
    } else {
      this.plotlistnull = null;
    }
  }
  async SelectPLot(plot) {
    if (this.language === "amharic") {
      plot.Registration_Date = await this.getgregorianToEthiopianDate(
        plot.Registration_Date
      );
    } else {
      plot.Registration_Date = plot.Registration_Date.split("T")[0];
    }
    this.isnew = false;
    this.plotManagment = plot;
    console.log("dfghgfd", plot);

    // this.plotForm = true;
  }
  getplotloc(plotid) {
    this.serviceService.getPlotloc(plotid).subscribe((response: any) => {
      this.plotloc = response.procPlot_Locations;

      console.log("plotloc:", this.plotloc);
      if (this.plotloc.length > 0) {
        this.platformLocation = this.plotloc[0];
        this.isplotllocnew = false;
      } else {
        this.isplotllocnew = true;
      }
    });
  }
  getplotlocbyid() {
    this.serviceService
      .getPlotloc(this.plotManagment.plot_ID)
      .subscribe((response: any) => {
        this.plotloc = response.procPlot_Locations;
        if (this.plotloc.length > 0) {
          this.platformLocation = this.plotloc[0];
          this.convertPolygonCoordinates(this.plotloc[0].geowithzone);

          console.log("plotloc:", this.plotloc, this.plotloc[0].geowithzone);
          this.isplotllocnew = false;
        } else {
          this.isplotllocnew = true;
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
    // this.tellChild(convertedCoordinates);
    // console.log(
    //   "convertedCconvertedCoordinatesoordinates",
    //   convertedCoordinates
    // );
  }

  updateplotloc() {
    console.log("coordinatcoordinat", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      let coordinate = this.convertToMultiPoint(this.serviceService.coordinate);
      let coordinate2 = this.convertToMultiPoints(
        this.serviceService.coordinate
      );
      this.platformLocation.geo = coordinate2;
      this.platformLocation.geowithzone = coordinate;
      this.serviceService.getUserRole().subscribe((response: any) => {
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.platformLocation.updated_By = response[0].UserId;
        this.platformLocation.updated_Date = new Date();
        if (response[0].RoleId == "f8dda85e-f967-4ac5-bf79-4d989ecfb863") {
          this.platformLocation.team_Leader_Approved_By = response[0].UserId;
          this.platformLocation.team_Leader_Approved = true;
          console.log(
            this.platformLocation.team_Leader_Approved_By,
            this.platformLocation.team_Leader_Approved
          );
        } else if (
          response[0].RoleId == "fe7be2e0-e717-4230-b732-5b810a8bb875"
        ) {
          this.platformLocation.baseMap_Approved_By = response[0].UserId;
          this.platformLocation.baseMap_Approved = true;
          console.log(
            this.platformLocation.team_Leader_Approved_By,
            this.platformLocation.team_Leader_Approved
          );
        }
        this.serviceService.updatePlotloc(this.platformLocation).subscribe(
          (CustID) => {
            this.serviceService.toMes = false;
            this.getplotloc(this.platformLocation.ploteId);
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
  saveplotloc() {
    console.log("coordinatcoordinat", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      // let coordinate= this.convertToMultiPoint(this.serviceService.coordinate)
      // console.log('coordinatecoordinate',coordinate)

      // let coordinate= this.convertToMultiPoint(this.serviceService.coordinate)
      // this.platformLocation.geowithzone=coordinate

      this.serviceService.getUserRole().subscribe((response: any) => {
        let coordinates = this.convertToMultiPoints(
          this.serviceService.coordinate
        );
        console.log("coordinatecoordinate", coordinates);
        this.platformLocation.geo = coordinates;
        let coordinate = this.convertToMultiPoint(
          this.serviceService.coordinate
        );
        this.platformLocation.geowithzone = coordinate;
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.platformLocation.ploteId = this.plotManagment.plot_ID;
        this.platformLocation.created_By = response[0].RoleId;
        this.platformLocation.created_Date = new Date();
        this.serviceService.savePlotloc(this.platformLocation).subscribe(
          (CustID) => {
            this.getplotloc(this.platformLocation.ploteId);
            this.serviceService.toMes = false;
            this.serviceService.toMess = false;
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully saved"
            );
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

  async Delete() {
    // this.confirmationService.confirm({
    //   message: 'Are you sure u want to delete this Plot?',
    //   accept: () => {
    console.log("this.plotManagment", this.plotManagment);

    if (this.language === "amharic") {
      this.plotManagment.registration_Date = await this.getEthiopianToGregorian(
        this.plotManagment.registration_Date
      );
    }

    this.plotManagment.is_Deleted = true;
    this.ploatManagmentService.save(this.plotManagment).subscribe(
      async (deptSuspension) => {
        console.log("deptSuspension");
        const toast = this.notificationsService.success("Sucess updated");

        // this.serviceService.disablefins = false;
        if (this.language === "amharic") {
          this.plotManagment.registration_Date =
            await this.getgregorianToEthiopianDate(
              this.plotManagment.registration_Date
            );
        }

        this.completed.emit(this.plotManagment);
        if (!this.Saved == undefined) {
          this.Saved = true;
        }
        (deptSuspension) => {
          const toast = this.notificationsService.warn("Warning");
        };
      },

      async (error) => {
        console.log(error);
        if (error.status == "400") {
          if (this.language === "amharic") {
            this.plotManagment.registration_Date =
              await this.getgregorianToEthiopianDate(
                this.plotManagment.registration_Date
              );
          }
          const toast = this.notificationsService.error("Error", error.error);
        } else {
          if (this.language === "amharic") {
            this.plotManagment.registration_Date =
              await this.getgregorianToEthiopianDate(
                this.plotManagment.registration_Date
              );
          }
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      }
    );
    console.log("saveing....");

    //   });
  }

  async add() {
    this.plotManagment.plot_ID = "-1";

    if (this.language === "amharic") {
      this.plotManagment.registration_Date = await this.getEthiopianToGregorian(
        this.plotManagment.registration_Date
      );
    }
    this.ploatManagmentService.Add(this.plotManagment).subscribe(
      async (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);
        this.serviceService.toMess = true;
        const toast = this.notificationsService.success("Success");
        this.plotManagment.plot_ID = deptSuspension[0].plot_ID;
        this.plotManagment.parcel_No = deptSuspension[0].plot_ID;
        const warningMessage =
          "የሊዝ ወይም የነባር ይዞታ መመዝገቡን አረጋግጥ/Check lease or freehold record is active for this plot";
        const toastWarning = this.notificationsService.warn(
          "Warning",
          warningMessage
        );
        this.saveplotlocnew();
        if (this.language === "amharic") {
          this.plotManagment.registration_Date =
            await this.getgregorianToEthiopianDate(
              this.plotManagment.registration_Date
            );
        }
        this.serviceService.toEnablenext = false;
        this.plotcomponent.toMes = true;
        // this.plotcomponent.CanDone = true;
        this.isnew = false;
        this.isploatDisabled = true;
        console.log("FinalPLoat before send", this.plotManagment);

        if (!this.Saved) {
          this.completed.emit(this.plotManagment);
          this.Saved = true;
        }

        // Add warning message here
        // const warningMessage = "የሊዝ ወይም የነባር ይዞታ መመዝገቡን አረጋግጥ/Check lease or freehold record is active for this plot";
        // const toastWarning = this.notificationsService.warn(
        //   "Warning",
        //   warningMessage
        // );
      },
      async (error) => {
        console.log(error);

        if (error.status == "400") {
          if (this.language === "amharic") {
            this.plotManagment.registration_Date =
              await this.getgregorianToEthiopianDate(
                this.plotManagment.registration_Date
              );
          }
          const toast = this.notificationsService.error("Error", error.error);
        } else {
          if (this.language === "amharic") {
            this.plotManagment.registration_Date =
              await this.getgregorianToEthiopianDate(
                this.plotManagment.registration_Date
              );
          }
          const toast = this.notificationsService.error("Error", error.error);
        }
      }
    );

    console.log("saving....");
  }
  saveplotlocnew() {
    console.log("coordinatcoordinat", localStorage.getItem("coordinate"));
    const cordinatetemp = JSON.parse(localStorage.getItem("coordinate"));
    console.log("coordinatcoordinat", cordinatetemp);
    if (cordinatetemp) {
      this.serviceService.getUserRole().subscribe((response: any) => {
        let coordinates = this.convertToMultiPoints(cordinatetemp);
        console.log("coordinatecoordinate", coordinates);
        this.platformLocation.geo = coordinates;
        this.platformLocation.geoForwgs84 =
          this.serviceService.coordinateForwgs84;
        let coordinate = this.convertToMultiPoint(cordinatetemp);
        this.platformLocation.geowithzone = coordinate;
        console.log("responseresponseresponse", response, response[0]);

        this.platformLocation.ploteId = this.plotManagment.parcel_No;
        this.platformLocation.created_By = response[0].RoleId;
        this.platformLocation.created_Date = new Date();
        this.serviceService.savePlotloc(this.platformLocation).subscribe(
          (CustID) => {
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully saved"
            );
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
}

export class PlotManagment {
  public plot_ID: string;
  public description: string;
  public sdP_ID: string;
  public wereda_ID: string;
  public house_No: string;
  public block_No: string;
  public parcel_No: string;
  public plot_Size_M2: string;
  public plot_Status: any;
  public registration_Date: string;
  public type_Of_Use_ID: string;
  public land_Grade_ID: string;
  public giS_X_Coordinate_1: string;
  public giS_X_Coordinate_2: string;
  public giS_X_Coordinate_3: string;
  public giS_X_Coordinate_4: string;
  public giS_X_Coordinate_5: string;
  public giS_X_Coordinate_6: string;
  public giS_X_Coordinate_7: string;
  public giS_X_Coordinate_8: string;
  public giS_Y_Coordinate_1: string;
  public giS_Y_Coordinate_2: string;
  public giS_Y_Coordinate_3: string;
  public giS_Y_Coordinate_4: string;
  public giS_Y_Coordinate_5: string;
  public giS_Y_Coordinate_6: string;
  public giS_Y_Coordinate_7: string;
  public giS_Y_Coordinate_8: string;
  public GISCoordinate: string;
  public n_Plot_ID: string;
  public s_Plot_ID: string;
  public e_Plot_ID: string;
  public w_Plot_ID: string;
  public is_Deleted;
  public street_No;
  public nortech_No: string;
  public licence_Service_ID;
  public application_No;
}
export class PlatformLocation {
  public ploteId: any;
  public no: any;
  public created_By: any;
  public updated_By: any;
  public deleted_By: any;
  public is_Deleted: any;
  public created_Date: any;
  public updated_Date: any;
  public deleted_Date: any;
  public geo: any;
  public baseMap_Approved: any;
  public baseMap_Approved_By: any;
  public team_Leader_Approved: any;
  public team_Leader_Approved_By: any;
  public geowithzone: any;
  public geoForwgs84: any;
}
