import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from "@angular/core";
import { ServiceService } from "../service.service";
import {PlatformLocation, PlotManagment} from "../plot-managment/plot-managment.component";
import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";

import { LeaseOwnerShipService } from "../lease-owner-ship/lease-owner-ship.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from "ngx-cookie-service/cookie-service/cookie.service";

@Component({
  selector: "app-plot",
  templateUrl: "./plot.component.html",
  styleUrls: ["./plot.component.css"],
})
export class PlotComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Input() Parcel_ID;
  @Input() Parcel_mearge1;
  @Input() Parcel_mearge2;
  @Input() Parcel_mearge3;
  @Input() Parcel_mearge4;
  @Input() disable;
  @Input() LicenceData;
  @Input() todoid;
  @Input() tskID;
  @Input() DocID;
  @Input() AppNo;
  @Input() Fields;
  PlotManagementList = [];
  SelectedPlot;
  plotForm;
  toLease;
  CanDone;
  toMes;
  isnew;
  noinvalidplot;
  OnParcle = -1;
  plotId = null;
  Saved = false;
  ischeckPlotaev: boolean = true;
  language: string;
  plotloc: any;
  public platformLocation: PlatformLocation;
  isplotllocnew: boolean = false;
  plot_ID: any;
  displayGIS: boolean;
  geo: any;
  multipleplotcanbeadd: boolean = true;
  display: boolean = false;
  isfinished: boolean;
  ismodaEnable = false;
  maxWidth: string = "1400px";
  isMaximized: boolean;
  PlotManagementListfinal = [];
  maxheight: string = "500px";
  convertedCoordinates: any = [];
  plotidlist: any;
  processedPlotIDs = new Set();
  processedPlotIDsCoordinates = new Set();
  processedPlotIDsCoordinatess = new Set();
  isfreehoadinsert: boolean;
  serviceisundoumneted: boolean;
  mapConfig = {
    center: [0, 0], // Initial center coordinates
    zoom: 10, // Initial zoom level
  };
  checkAPIstatus: boolean;
  plotlocshow: any;
  leaseholdGIs: any[];
  freeholdGIs: any[];
  showdialogee: boolean;
  ishaveplotlocation: boolean=false;
  isInclusion: boolean;
  constructor(
    public serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
    private modalsService: NgbModal,
    private cookieService: CookieService,

    private leaseOwnerShipService: LeaseOwnerShipService
  ) {}
  changingValue: Subject<boolean> = new Subject();
  ngOnChanges() {
    this.serviceService.allLicenceData = this.LicenceData;
    console.log(
      "🚀 ~ file: plot.component.ts:79 ~ PlotComponent ~ ngOnChanges ~ allLicenceData:",
      this.serviceService.allLicenceData
    );

    //this.serviceService.disablefins = true;
    this.serviceService.toMes = true;
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }

    console.log(
      "emptying list",
      this.PlotManagementListfinal,
      this.serviceService.Service_ID
    );
    
    if (
      this.serviceService.Service_ID ===
      "de330170-550b-4bf2-9908-dc557f92a7cc" ||
      this.serviceService.Service_ID === "449a14bd-e0c0-4eda-92f5-68b3fcf83433"
    ) {
      this.serviceService.serviceisundoumneted = true;
    } else {
      this.serviceService.serviceisundoumneted = false;
    }
    if (this.serviceService.Service_ID==='81F8770B-2C1E-4255-8BE1-341089703FA1'){
      this.isInclusion=true
    }
    this.PlotManagementListfinal = [];
    this.noinvalidplot = 0;
    console.log(
      "emptedlist",
      this.PlotManagementListfinal,
      this.LicenceData.Licence_Service_ID
    );

    this.getPloat();
    this.getPlotStutusLookUP();
    // this.serviceService.Totalarea = parseInt(
    //   localStorage.getItem("PolygonAreaname")
    // );
    // this.isvalidated();
  }
  open(content) {
    this.modalsService.open(content);
  }
  modalRef: BsModalRef;
  openModall(template: TemplateRef<any>) {
    this.serviceService.check = true;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }

  // tellChild(aa) {
  //   console.log("value is changing", aa);
  //   const coordinatesarea = this.convertCoordinatesformatd(aa);

  //   let areas = this.calculateUTMPolygonArea(coordinatesarea);
  //   localStorage.setItem("PolygonAreaname", "" + areas.toFixed(2));

  //   console.log("coordinatesarea", coordinatesarea, areas);
  //   this.geo = aa;
  //   this.serviceService.check = true;
  //   this.changingValue.next(aa);
  // }
  tellChild(aa) {
    this.convertedCoordinates.push(aa);
    this.geo = this.convertedCoordinates;

    console.log("value is changingg", this.geo);
    this.serviceService.check = false;
    this.changingValue.next(aa);
  }
  convertCoordinatesformatd(inputData: any[][]): any[] {
    const outputData = [];
    for (let i = 1; i < inputData.length; i++) {
      const northing = parseFloat(inputData[i][0]);
      const easting = parseFloat(inputData[i][1]);
      const hemisphere = inputData[i][2];
      const zone = parseInt(inputData[i][3], 10);
      outputData.push({
        northing,
        easting,
        hemisphere,
        zone,
      });
    }
    return outputData;
  }
  getAllplotLocationafter() {
    // if (this.PlotManagementListfinal.length > 0) {
    //   this.SelectPLot(this.PlotManagementListfinal[0]);
    // }
    this.serviceService.fornewplotinsert = true;

    this.ischeckPlotaev = true;
    this.ismodaEnable = true;
    this.serviceService.check = true;
    this.calculettotal();
  }
  getAllplotLocation() {
    //this.processedPlotIDs = new Set();
    this.serviceService.check = true;
    this.isfreehoadinsert = false;
    this.PlotManagementListfinal.forEach((element) => {
      console.log(
        "🚀 ~ PlotComponent ~ this.PlotManagementListfinal.forEach ~ element:",
        element
      );

      // Check if the plot_ID has already been processed
      if (!this.processedPlotIDs.has(element.plot_ID)) {
        this.getplotlocbyid(element.plot_ID);
        // Add the plot_ID to the set of processed plot IDs
        this.processedPlotIDs.add(element.plot_ID);
      }
    });
  }
  handleMapLoaded(event: any) {
    // Handle map loaded event
    console.log("Map loaded:", event);
  }

  getplotlocbyid(plot_ID) {
    //this.processedPlotIDsCoordinates = new Set();
    this.serviceService.check = true;
    this.serviceService.getPlotloc(plot_ID).subscribe((response: any) => {
      this.plotloc = response.procPlot_Locations;

      if (this.plotloc.length == 0) {
        console.log("plotloc:", this.plotloc);
        this.isfinished = false;
        this.ishaveplotlocation=false
        this.platformLocation = new PlatformLocation();
        this.platformLocation.ploteId=this.serviceService.selectedplotid
        this.isplotllocnew = true;
      } else {
      
        this.platformLocation = this.plotloc[0];
        console.log("plotloc:plotloc:", this.plotloc[0]);
        this.ishaveplotlocation=true
        // Check if the plot_ID has already been processed before calling the method
        if (!this.processedPlotIDsCoordinates.has(plot_ID)) {
          this.convertPolygonCoordinates(
            this.plotloc[0].geowithzone,
            this.plotloc[0]
          );
          if (
            this.plotloc[0].geoForwgs84 != null &&
            this.plotloc[0].freholdgis
          ) {
            this.convertPolygonCoordinates(
              this.plotloc[0].geoForwgs84,
              plot_ID
            );
          }

          // Add the plot_ID to the set of processed plot IDs
          this.processedPlotIDsCoordinates.add(plot_ID);
        }
        if (this.SelectedPlot) {
          if (this.SelectedPlot.plot_ID == plot_ID) {
            this.isplotllocnew = false;
            this.isfinished = true;
          }
        }
      }
    });
  }

  openGIsFreehold() {
    console.log("checkd openGIsFreehold");
    this.platformLocation.ploteId = this.serviceService.selectedplotid;
    this.ischeckPlotaev = false;
    this.ismodaEnable = true;
    this.serviceService.check = true;
    this.isfreehoadinsert = true;
    //localStorage.setItem("PolygonAreaname", "" + 0);
    //localStorage.setItem("PolygonAreanameFrehold", "" + 0);
  }
  calculateUTMPolygonArea(
    utmPoints: { northing: number; easting: number }[]
  ): number {
    const numPoints = utmPoints.length;
    let area = 0;

    if (numPoints < 3) {
      return area; // Not a polygon, return zero area
    }

    for (let i = 0; i < numPoints; i++) {
      const p1 = utmPoints[i];
      const p2 = utmPoints[(i + 1) % numPoints]; // Wrap around for the last point

      area += ((p2.easting - p1.easting) * (p2.northing + p1.northing)) / 2;
    }

    return Math.abs(area); // Take the absolute value to ensure a positive area
  }
  // convertPolygonCoordinates(polygonString: string, plot_ID): any[] {
  //   console.log(
  //     "🚀 ~ PlotComponent ~ convertPolygonCoordinates ~ polygonString:",
  //     polygonString
  //   );

  //   const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);
  //   console.log(
  //     "🚀 ~ PlotComponent ~ convertPolygonCoordinates ~ d:",
  //     coordinates
  //   );

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
  //   console.log("resultresult", result);
  //   this.convertCoordinates(result, plot_ID);

  //   return result;
  // }

  convertPolygonCoordinates(polygonString: string, data): any[] {
    const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);
    console.log("🚀 ~ convertPolygonCoordinates ~ coordinates:", coordinates);

    const result = [];

    if (coordinates) {
      const uniqueCoordinates = new Set(); // Using a Set to store unique coordinates
      for (const coord of coordinates) {
        const [easting, northing, hemisphere, zone] = coord.split(" ");

        // Check if the coordinate is unique before adding it to the result
        const uniqueCoordString = `${easting},${northing}`;
        if (!uniqueCoordinates.has(uniqueCoordString)) {
          uniqueCoordinates.add(uniqueCoordString);

          // result.push({
          //   northing: northing,
          //   easting: easting,
          //   hemisphere: hemisphere,
          //   zone: zone,
          // });
          result.push({
            northing: (parseFloat(northing) + 207.34388375).toString(),
            easting: (parseFloat(easting) + 95.4782061405).toString(),
            hemisphere: hemisphere,
            zone: zone,
          });
        }
      }
    }

    // Validating the polygon
    const isValidPolygon =
      result.length >= 3 &&
      result[0].northing === result[result.length - 1].northing &&
      result[0].easting === result[result.length - 1].easting;

    console.log("result", result);
    console.log("isValidPolygon", isValidPolygon);

    this.convertCoordinates(result, data);

    return isValidPolygon ? result : [];
  }
  convertCoordinatesToObjects(coordinates: string[], plot_ID): any[] {
    const result = [];

    if (coordinates) {
      for (const coord of coordinates) {
        const coordsArray = coord.trim().split(/\s+/);
        console.log(
          "🚀 ~ PlotComponent ~ convertCoordinatesToObjects ~ coordsArray:",
          coordsArray
        );

        const [easting, northing, hemisphere, zone] =
          coordsArray.map(parseFloat);

        result.push({
          northing: northing,
          easting: easting,
          hemisphere: "P",
          zone: 37,
        });
      }
    }
    console.log(
      "🚀 ~ PlotComponent ~ convertCoordinatesToObjects ~ result:",
      result
    );
    this.convertCoordinates(result, plot_ID);
    return result;
  }
  extractAndConvertPolygon(polygonString: string, plot_ID): any[] {
    const coordinatesRegex = /\((.*?)\)/;
    const coordinatesMatch = polygonString.match(coordinatesRegex);
    console.log(
      "🚀 ~ PlotComponent ~ extractAndConvertPolygon ~ coordinatesMatch:",
      coordinatesMatch
    );

    if (!coordinatesMatch) {
      // Handle invalid input
      return [];
    }

    const coordinatesString = coordinatesMatch[1];
    const coordinatesArray = coordinatesString.split(", ");

    return this.convertCoordinatesToObjects(coordinatesArray, plot_ID);
  }

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
  convertCoordinates(data, plot_ID) {
    const convertedCoordinates = [];
    // Convert UTM coordinates to the desired format
    convertedCoordinates.push([
      "northing",
      "easting",
      "hemisphere",
      "zone",
      "plot_ID",
    ]);

    for (const coord of data) {
      convertedCoordinates.push([
        coord.northing,
        coord.easting,
        coord.hemisphere,
        coord.zone,
        plot_ID,
      ]);
    }

    const arrayOfArrays = [];
    const coordinatesarea =
      this.convertCoordinatesformatd(convertedCoordinates);
    console.log(
      "🚀 ~ PlotComponent ~ tellChild ~ coordinatesarea:",
      coordinatesarea
    );
    const area = this.calculateUTMPolygonArea(coordinatesarea);
    this.serviceService.Totalarea = parseInt(area.toFixed(2));
    console.log(
      "🚀 ~ processcoordinatesForPlot ~ ServiceService:",
      this.serviceService.Totalarea
    );
    this.serviceService.setCookies(area);
    // localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
    arrayOfArrays.push(convertedCoordinates);
    console.log("convertedCconvertedCoordinatesoordinates", arrayOfArrays);
    this.tellChild(arrayOfArrays);
  }
  closeModall() {
    // console.log('closeing.....');
    //this.modalRef.hide();
    // Check if the value retrieved from localStorage is not null for Free_Hold_M2
    //const freeHoldM2Value = localStorage.getItem("PolygonAreanameFrehold");
    const freeHoldM2Value = this.serviceService.polygonAreanameFrehold;
    this.serviceService.leaseOwnerShip.free_Hold_M2 =
      freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;

    // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
    // const leaseHoldM2Value = localStorage.getItem("PolygonAreaname");
    const leaseHoldM2Value = this.serviceService.polygonAreaname;
    this.serviceService.leaseOwnerShip.lease_Hold_M2 =
      leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
  }

  convertToCSVondrwaing(data: any[]): void {

    const utmCoordinateslast = data;
    console.log(
      "🚀 ~ convertToCSVondrwaing ~ utmCoordinateslast:",
      utmCoordinateslast
    );

    console.log(
      "🚀 ~ utmCoordinateslast=utmCoordinateslast.map ~ utmCoordinateslast:",
      utmCoordinateslast
    );

    // Add constant values
    const zone = 37;
    let hemisphere = "P";

    // Convert data to CSV format
    let csvContent = "";

    // Add headers to CSV
    const headers = ["northing", "easting", "hemisphere", "zone"];
    csvContent += headers.join(",") + "\n";

    // Add constant values to each row
    // Add constant values to each row
    utmCoordinateslast.forEach((item, index) => {
      csvContent +=
        item.northing + "," + item.easting + "," + hemisphere + "," + zone;
      if (index !== utmCoordinateslast.length - 1) {
        // Add new line if it's not the last row
        csvContent += "\n";
      }
    });

    // Create a blob with CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "shapes.csv");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
  updateplotloc() {
    if (this.serviceService.Licence_Service_ID != this.serviceService.LicenceserviceID){
      const toast = this.notificationsService.error(
        "Error",
        "this plot created by other technical officer so you can't update it /ይህ ፕሎት በሌላ ቴክኒካል ኦፊሰር የተፈጠረ ስለሆነ ማዘመን አይችሉም"
      );
      return
    }
    console.log("coordinatcoordinat", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      let coordinate = this.convertToMultiPointgeozone(
        this.serviceService.coordinate
      );
      let coordinate2 = this.convertToMultiPointsmorethanone(
        this.serviceService.coordinate
      );
      console.log("🚀 ~ PlotComponent ~ updateplotloc ~ coordinate2:", coordinate2)
      this.platformLocation.geo = coordinate2;
      this.platformLocation.geowithzone = coordinate;
      // this.platformLocation.geoForwgs84 =
      //   this.serviceService.coordinateForwgs84;
      this.platformLocation.ploteId = this.Parcel_ID;
      this.serviceService.getUserRole().subscribe((response: any) => {
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.platformLocation.updated_By = response[0].UserId;
        // this.platformLocation.updated_Date =this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'); 
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
            //this.getplotloc(this.platformLocation.ploteId);
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully Upadted"
            );

            //  const freeHoldM2Value = localStorage.getItem(
            //    "PolygonAreanameFrehold"
            //  );
            const freeHoldM2Value = this.serviceService.polygonAreanameFrehold;
            let freeHoldM2Valuesize =
              freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;

            // Check if the value retrieved from localStorage is not null for Lease_Hold_M2
            //const leaseHoldM2Value = localStorage.getItem("PolygonAreaname");
            const leaseHoldM2Value = this.serviceService.polygonAreaname;
            let leaseHoldM2Valuesize =
              leaseHoldM2Value !== null ? parseFloat(leaseHoldM2Value) : 0;
            const maxAreaDifferences =
              environment.Totalareatolerance * this.serviceService.Totalarea;

            const areaDifferences = Math.abs(
              this.SelectedPlot.plot_Size_M2 -
                (leaseHoldM2Valuesize + freeHoldM2Valuesize)
            );

            if (areaDifferences <= maxAreaDifferences) {
              this.serviceService.plotsizenotequal = false;
            } else {
              this.serviceService.plotsizenotequal = true;
              const toast = this.notificationsService.warn(
                `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
          በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት
           ${Math.abs(
             this.SelectedPlot.plot_Size_M2 -
               (leaseHoldM2Valuesize + freeHoldM2Valuesize)
           )}`
              );
            }
            this.ismodaEnable = false;

            this.getAllplotLocation();
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
  updateplotlocfreeHold() {
    const freeHoldM2Value = this.serviceService.polygonAreanameFrehold;
    this.serviceService.leaseOwnerShip.free_Hold_M2 =
      freeHoldM2Value !== null ? parseFloat(freeHoldM2Value) : 0;

    this.serviceService.leaseOwnerShip.free_Hold_M2 = parseFloat(
      this.serviceService.polygonAreanameFrehold
    );
    console.log(
      "coordinatcoordinat",
      this.serviceService.leaseOwnerShip.free_Hold_M2
    );
    if (this.serviceService.coordinate) {
      let coordinatefreehold = this.convertToMultiPointsmorethanone(
        this.serviceService.coordinate
      );
      let coordinate = this.convertToMultiPointgeozone(
        this.serviceService.coordinate
      );

      this.platformLocation.geo = this.platformLocation.geo;
      this.platformLocation.freholdgis = coordinatefreehold;
      this.platformLocation.geoForwgs84 = coordinate;
      this.platformLocation.ploteId = this.serviceService.selectedplotid;
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
            //this.getplotloc(this.platformLocation.ploteId);
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully insert"
            );

            this.ismodaEnable = false;

            this.getAllplotLocation();
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
      this.serviceService.getUserRole().subscribe((response: any) => {
        this.serviceService
          .getcaseWorkerbyApplication(this.AppNo)
          .subscribe((res: any) => {
            console.log(
              "🚀 ~ file: plot.component.ts:324 ~ PlotComponent ~ this.serviceService.getcaseWorkerbyApplication ~ response:",
              res
            );
            res.forEach((element) => {
              if (element.roleId == "5b3b5dd4-3cef-4696-ac19-442ba531a7dd") {
                console.log(
                  "🚀 ~ file: plot-managment.component.ts:822 ~ response.forEach ~ element:",
                  element
                );
                this.platformLocation.legal_Approved_By = element.userId;
                this.platformLocation.legal_Approved = true;
              } else if (
                element.roleId == "3ba734c5-d75a-44c7-8c47-5233431372ba" ||
                element.roleId ==
                  "1A4A2E38-E6A2-45CE-9BFB-B44B7541618C".toLocaleLowerCase()
              ) {
                console.log(
                  "🚀 ~ file: plot-managment.component.ts:822 ~ response.forEach ~ element:",
                  element
                );
                this.platformLocation.tech_Approved_By = element.userId;
                this.platformLocation.tech_Approved = true;
              } else {
                this.platformLocation.tech_Approved_By = element.userId;
                this.platformLocation.tech_Approved = true;
              }
            });
          });
        let coordinates = this.convertToMultiPointsmorethanone(
          this.serviceService.coordinate
        );
        console.log("coordinatecoordinate", coordinates);
        this.platformLocation.geo = coordinates;
        let coordinate = this.convertToMultiPointgeozone(
          this.serviceService.coordinate
        );
        this.platformLocation.geowithzone = coordinate;
        // this.platformLocation.geoForwgs84 =
        //   this.serviceService.coordinateForwgs84;
        console.log("responseresponseresponse", response, response[0].RoleId);

        this.platformLocation.ploteId = this.Parcel_ID;
        this.platformLocation.created_By = response[0].RoleId;
        this.platformLocation.created_Date = new Date();
        this.serviceService.savePlotloc(this.platformLocation).subscribe(
          (CustID) => {
            //this.getplotloc(this.platformLocation.ploteId);
            this.getAllplotLocation();
            // this.serviceService.toMes = false;
            // this.serviceService.toMess = false;
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

  // convertToMultiPoint(
  //   points: {
  //     easting: number;
  //     northing: number;
  //     hemisphere: string;
  //     zone: number;
  //   }[]
  // ): string {
  //   const multiPointArray = points
  //     .map(
  //       (point) =>
  //         `${point.easting} ${point.northing} ${point.hemisphere} ${point.zone}`
  //     )
  //     .join(", ");

  //   // const multiPointString = `MULTIPOINT(${multiPointArray})`;
  //   const multiPointString = `POLYGON((${multiPointArray}))`;

  //   return multiPointString;
  // }
  convertToMultiPoint(
    points: {
      easting: number;
      northing: number;
      hemisphere: string;
      zone: number;
    }[]
  ): string {
    // Check if the input points form a valid polygon
    if (
      points.length < 3 || // At least three points are required for a polygon
      points[0].easting !== points[points.length - 1].easting || // Check if the first and last points are the same
      points[0].northing !== points[points.length - 1].northing
    ) {
      const toast = this.notificationsService.warn(
        "Invalid polygon: The first and last points must be the same."
      );
      return;
    }

    // Remove the last point if it's identical to the first point
    if (
      points.length > 1 &&
      points[0].easting === points[points.length - 2].easting &&
      points[0].northing === points[points.length - 2].northing
    ) {
      points.pop();
    }

    const multiPointArray = points
      .map(
        (point) =>
          `${point.easting} ${point.northing} ${point.hemisphere} ${point.zone}`
      )
      .join(", ");

    const multiPointString = `POLYGON((${multiPointArray}))`;

    return multiPointString;
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
  convertToMultiPointsmorethanone(
    pointsArray: Array<Array<Array<string>>>
  ): string {
    let multiPointString = "";

    pointsArray.forEach((polygonPoints) => {
      const multiPointArray = polygonPoints
        .map((point) => `${point[1]} ${point[0]}`)
        .join(", ");
      multiPointString += `POLYGON((${multiPointArray})), `;
    });

    // Remove the trailing comma and space
    multiPointString = multiPointString.slice(0, -2);
    console.log(
      "🚀 ~ convertToMultiPoints ~ multiPointString:",
      multiPointString
    );

    return multiPointString;
  }
  convertToMultiPointgeozone(points: Array<Array<Array<string>>>): string {
    const polygons = points.map((polygonPoints) => {
      // Check if the input points form a valid polygon
      if (
        polygonPoints.length < 3 || // At least three points are required for a polygon
        polygonPoints[0][3] !== polygonPoints[polygonPoints.length - 1][3] || // Check if the first and last points are the same
        polygonPoints[0][2] !== polygonPoints[polygonPoints.length - 1][2]
      ) {
        // Indicate an invalid polygon
        const toast = this.notificationsService.error( "Invalid polygon: The first and last points must be the same.")
      }

      // Remove the last point if it's identical to the first point
      if (
        polygonPoints.length > 1 &&
        polygonPoints[0][0] === polygonPoints[polygonPoints.length - 2][0] &&
        polygonPoints[0][1] === polygonPoints[polygonPoints.length - 2][1]
      ) {
        polygonPoints.pop();
      }

      const multiPointArray = polygonPoints
        .map((point) => `${point[1]} ${point[0]} ${point[2]} ${point[3]}`)
        .join(", ");

      return `POLYGON((${multiPointArray}))`;
    });

    return polygons.join(", ");
  }
  onConfirm(): void {
    // Handle confirm action
    console.log("Dialog confirmed");
    if (this.serviceService.coordinate) {
      let coordinate = this.convertToMultiPoint(this.serviceService.coordinate);
      // let coordinate2= this.convertToMultiPoints(this.serviceService.coordinate)
      this.plot_ID = this.serviceService.coordinate.toString();
    }
    this.displayGIS = false;
  }
  updateplotandlicense(event) {
    this.Parcel_ID = event.Plot_Ids;
    this.serviceService
      .getPlotManagementApi(this.Parcel_ID)
      .subscribe(async (PlotManagementLists: any) => {
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;

        console.log(
          "🚀 ~ file: plot.component.ts:414 ~ PlotComponent ~ updateplotandlicense ~ event:",
          event,
          PlotManagementList
        );
        if (PlotManagementList.length > 0) {
          this.LicenceData.Parcel_ID = this.Parcel_ID;
          this.serviceService.UpdateLicence(this.LicenceData).subscribe(
            (Licence) => {
              this.SelectedPlot = PlotManagementList[0];
              this.ismodaEnable = false;
            },
            (error) => {
              const toast = this.notificationsService.error(
                "Error",
                error.error
              );
            }
          );
        } else {
          this.serviceService.getCookies();
          this.Savetempora();
        }
      });
  }

  getPloat() {
    this.PlotManagementListfinal = [];
    if (this.LicenceData.Licence_Service_ID) {
      console.log("geting ploat this.Parcel_ID", this.Parcel_ID);
      this.getPlotManagement(this.Parcel_ID);
    }
    if (this.Parcel_mearge1) {
      console.log("geting ploat this.Parcel_mearge1", this.Parcel_mearge1);
      this.getPlotManagement(this.Parcel_mearge1);
    }
    if (this.Parcel_mearge2) {
      console.log("geting ploat this.Parcel_mearge2", this.Parcel_mearge2);
      this.getPlotManagement(this.Parcel_mearge2);
    }
    if (this.Parcel_mearge3) {
      console.log("geting ploat this.Parcel_mearge3", this.Parcel_mearge3);
      this.getPlotManagement(this.Parcel_mearge3);
    }
    if (this.Parcel_mearge4) {
      console.log("geting ploat this.Parcel_mearge4", this.Parcel_mearge4);
      this.getPlotManagement(this.Parcel_mearge4);
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
  Savetempora() {
    console.log(
      "ischeckPlotaev",
      this.serviceService.coordinate,
      this.serviceService.polygonAreaname,
      this.serviceService.polygonAreanameFrehold
    );
    if (this.serviceService.coordinate) {
      this.storeData();
      this.setCookies(this.serviceService.coordinate);
      this.AddPLot();
      this.ischeckPlotaev = false;
      this.ismodaEnable = false;
      console.log("ischeckPlotaev", localStorage.getItem("coordinate"));
    } else {
      const toast = this.notificationsService.warn(
        "first you have to draw or import  the plot location በመጀመሪያ የመሬቱን ቦታ መሳል ወይም ማስገባት አለብዎት"
      );
    }
  }
  openFullModal() {
    this.isMaximized = true;
    this.maxWidth = "2000px"; // Set the max width for full modal
    this.maxheight = "800px";
  }

  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "1600px"; // Set the max width for mini modal
  }
  // Function to store data in local storage
  storeData() {
    localStorage.setItem(
      "coordinate",
      JSON.stringify(this.serviceService.coordinate)
    );
  }

  // Function to remove data from local storage
  clearData() {
    localStorage.removeItem("coordinate");
  }
  setCookies(coordinate: any) {
    // Setting cookies using cookieService
    this.cookieService.set("coordinate", JSON.stringify(coordinate));
  }
  getCookies() {
    this.serviceService.coordinatetemp = this.cookieService.get("coordinate");
    // Use the retrieved values as needed
    console.log("coordinate:", this.serviceService.coordinatetemp);

    return this.serviceService.coordinatetemp;
  }
  calculettotal() {
    if (this.PlotManagementListfinal.length > 0) {
      this.serviceService.totalsizeformerage =
        this.PlotManagementListfinal.reduce((sum, node) => {
          sum += parseFloat(node.plot_Size_M2);

          return sum;
        }, 0);
      console.log(
        "🚀 ~ file: plot.component.ts:561 ~ PlotComponent ~ this.serviceService.totalsizeformerage=this.PlotManagementListfinal.reduce ~ totalsizeformerage:",
        this.serviceService.totalsizeformerage
      );
    }
    // localStorage.setItem("PolygonAreaname", "" + 0);
    // localStorage.setItem("PolygonAreanameFrehold", "" + 0);
  }
  getPlotManagement(Licence_Service_ID) {
    let a;
debugger
    this.serviceService.getPlotManagementApi(Licence_Service_ID).subscribe(
      async (PlotManagementLists: any) => {
        debugger
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;
        if (PlotManagementList.length > 0) {
          this.PlotManagementList = this.removeDuplicates(PlotManagementList);
        }
        this.checkAPIstatus = true;
        console.log("PlotManagementList", this.PlotManagementList);
        if (this.PlotManagementList.length > 0) {
          this.ischeckPlotaev = false;
          this.PlotManagementListfinal.push(this.PlotManagementList[0]);
          this.PlotManagementListfinal = this.removeDuplicates(
            this.PlotManagementListfinal
          );
        }

        console.log("PlotManagementList", this.PlotManagementListfinal);
        // this.isisvalidated(
        //   this.todoid,
        //   this.tskID,
        //   this.PlotManagementListfinal[0].plot_ID,
        //   "00000000-0000-0000-0000-000000000000",
        //   this.DocID
        // );

        for (
          let index = 0;
          index < this.PlotManagementListfinal.length;
          index++
        ) {
          const element = this.PlotManagementListfinal[index];
          if (element.plot_Status == 1) {
            this.PlotManagementListfinal = this.PlotManagementListfinal.filter(
              (x) => x.plot_Status == 1
            );
          }
        }
        this.PlotManagementListfinal = this.PlotManagementListfinal.filter(
          (x) => x.plot_Status != 2019
        );

        console.log("PlotManagementList", this.PlotManagementListfinal);
        console.log(
          "this.PlotManagementList",
          this.PlotManagementList,
          this.serviceService.Service_ID
        );
        debugger
        if (this.PlotManagementListfinal.length > 0) {
          if (this.serviceService.multipleplotcanbeadd) {
            let filterservice = this.serviceService.multipleplotcanbeadd.filter(
              (x) => x.id === this.serviceService.Service_ID
            );
            debugger
            if (filterservice.length > 0) {
              this.multipleplotcanbeadd = true;
            } else {
              this.multipleplotcanbeadd = false;
            }
          }
        }
      },
      (error) => {
        console.log("error");
      }
    );
  }

  // getPlotManagement(Parcel_ID) {
  //   let a;
  //   this.serviceService.getPlotManagement(Parcel_ID).subscribe(
  //     async (PlotManagementLists) => {
  //       a = PlotManagementLists;

  //       let b = false;
  //       for (let i = 0; i < (PlotManagementLists as any).list.length; i++) {
  //         if (
  //           a.list[0].plot_ID == (PlotManagementLists as any).list[i].plot_ID
  //         ) {
  //           b = true;
  //           // this.PlotManagementList[i] = a.list[0];
  //         }
  //       }
  //       if (b) {
  //         this.noinvalidplot = this.noinvalidplot + 1;
  //         if (this.language == "amharic") {
  //           a.list[0].Registration_Date =
  //             await this.getgregorianToEthiopianDate(
  //               a.list[0].Registration_Date
  //             );
  //         }
  //         this.PlotManagementList.push(a.list[0]);
  //         this.PlotManagementList = this.removeDuplicates(
  //           this.PlotManagementList
  //         );
  //         console.log("PlotManagementList", this.PlotManagementList);
  //         this.isisvalidated(
  //           this.todoid,
  //           this.tskID,
  //           a.list[0].plot_ID,
  //           "00000000-0000-0000-0000-000000000000",
  //           this.DocID
  //         );
  //       }

  //       console.log("PlotManagementList", PlotManagementLists);
  //       console.log(
  //         "this.PlotManagementList",
  //         this.PlotManagementList,
  //         this.LicenceData
  //       );
  //       if (this.serviceService.multipleplotcanbeadd) {
  //         let filterservice = this.serviceService.multipleplotcanbeadd.filter(
  //           (x) => x.id === this.serviceService.Service_ID
  //         );
  //         if (filterservice.length > 0) {
  //           this.multipleplotcanbeadd = true;
  //         } else {
  //           this.multipleplotcanbeadd = false;
  //         }
  //       }
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }
  removeDuplicates(data) {
    const uniqueArray = data.filter(
      (item, index, self) =>
        self.findIndex((i) => i.plot_ID === item.plot_ID) === index
    );

    return uniqueArray;
  }
  async SelectPLot(plot) {
    this.ishaveplotlocation=false
    this.SelectedPlot = plot;
    this.serviceService.fornewplotinsert = false;
    console.log("dfghgfd", plot);
    this.plot_ID = this.SelectedPlot.plot_ID;
    this.serviceService.selectedplotid = this.plot_ID;
    this.Parcel_ID= this.serviceService.selectedplotid
    this.serviceService.Totalarea = this.SelectedPlot.plot_Size_M2;
    plot.SDP_ID = this.serviceComponent.licenceData.SDP_ID;

    plot.Licence_Service_ID = this.LicenceData.Licence_Service_ID;
    this.serviceService.Licence_Service_ID=this.SelectedPlot.Licence_Service_ID    ;
    plot.Application_No = this.AppNo;
    if (this.language != "amharic") {
      plot.registration_Date = plot.registration_Date.split("T")[0];
    } else if (this.language == "amharic") {
      plot.registration_Date = await this.getgregorianToEthiopianDate(
        plot.registration_Date
      );
    }
    if (this.serviceService.multipleplotcanbeadd) {
      let filterservice = this.serviceService.multipleplotcanbeadd.filter(
        (x) => x.id === this.serviceService.Service_ID
      );
      if (filterservice.length > 0) {
        this.multipleplotcanbeadd = true;
      } else {
        this.multipleplotcanbeadd = false;
      }
    }
    // this.plotForm = true;
    this.PlotManagementListfinal.forEach((element) => {
      console.log(
        "🚀 ~ PlotComponent ~ this.PlotManagementListfinal.forEach ~ element:",
        element
      );
      // Check if the plot_ID has already been processed
      if (!this.processedPlotIDs.has(element.plot_ID)) {
        this.getplotlocbyid(element.plot_ID);
        // Add the plot_ID to the set of processed plot IDs
        this.processedPlotIDs.add(element.plot_ID);
      }
    });
  }
  highlighted;
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

  public selectedTab = 0;
  showform() {
    this.plotForm = true;
    this.isnew = false;
    this.serviceService.isleaseForm = false;
  }
  AddPLot() {
    this.serviceService.toMes = true;
    this.isnew = true;
    this.plotForm = true;
    const plot = new PlotManagment();
    plot.sdP_ID = this.LicenceData.SDP_ID;
    console.log(this.Parcel_ID);
    plot.licence_Service_ID = this.LicenceData.Licence_Service_ID;

    plot.application_No = this.AppNo;
    if (this.Parcel_ID) {
      if (this.PlotManagementListfinal.length == 0) {
        plot.plot_ID = this.Parcel_ID;
        if (!this.Parcel_ID) {
          this.OnParcle = 0;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementListfinal.length == 1) {
        plot.plot_ID = this.Parcel_mearge1;
        if (!this.Parcel_mearge1) {
          this.OnParcle = 1;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementListfinal.length == 2) {
        plot.plot_ID = this.Parcel_mearge2;
        if (!this.Parcel_mearge2) {
          this.OnParcle = 2;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementListfinal.length == 3) {
        plot.plot_ID = this.Parcel_mearge3;
        if (!this.Parcel_mearge3) {
          this.OnParcle = 3;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementListfinal.length == 4) {
        plot.plot_ID = this.Parcel_mearge4;
        if (!this.Parcel_mearge4) {
          this.OnParcle = 4;
        }
        this.SelectedPlot = plot;
      } else {
      }
    } else if (this.Parcel_mearge1) {
      if (this.PlotManagementListfinal.length == 0) {
        plot.plot_ID = this.Parcel_mearge1;
        this.SelectedPlot = plot;
        if (!this.Parcel_mearge1) {
          this.OnParcle = 1;
        }
      } else if (this.PlotManagementListfinal.length == 1) {
        plot.plot_ID = this.Parcel_mearge2;
        if (!this.Parcel_mearge2) {
          this.OnParcle = 2;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementListfinal.length == 2) {
        plot.plot_ID = this.Parcel_mearge3;
        if (!this.Parcel_mearge3) {
          this.OnParcle = 3;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementListfinal.length == 3) {
        plot.plot_ID = this.Parcel_mearge4;
        if (!this.Parcel_mearge4) {
          this.OnParcle = 4;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementListfinal.length == 4) {
        plot.plot_ID = this.Parcel_ID;
        if (!this.Parcel_ID) {
          this.OnParcle = 0;
        }
        this.SelectedPlot = plot;
      }
    } else {
      this.SelectedPlot = plot;
    }
  }

  isvalidated() {
    if (this.Parcel_ID) {
      console.log("validating ploat this.Parcel_ID", this.Parcel_ID);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        "00000000-0000-0000-0000-000000000000",
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge1) {
      console.log("validating ploat this.Parcel_mearge1", this.Parcel_mearge1);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge1,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge2) {
      console.log("validating ploat this.Parcel_mearge2", this.Parcel_mearge2);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge2,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge3) {
      console.log("validating ploat this.Parcel_mearge3", this.Parcel_mearge3);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge3,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge4) {
      console.log("validating ploat this.Parcel_mearge4", this.Parcel_mearge4);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge4,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
  }

  getPlotStutusLookUP() {
    this.serviceService.getPlotStutusLookUP().subscribe(
      (PlotStutusLookUP) => {
        this.serviceService.PlotStutusLook = PlotStutusLookUP;
        this.serviceService.PlotStutusLook = Object.assign(
          [],
          this.serviceService.PlotStutusLook.list
        );
        // if(this.serviceService.Service_ID != '449A14BD-E0C0-4EDA-92F5-68B3FCF83433'.toLocaleLowerCase()
        // || this.serviceService.Service_ID != 'DE330170-550B-4BF2-9908-DC557F92A7CC'.toLocaleLowerCase()
        // || this.serviceService.Service_ID != '05BF5DE7-7170-43CE-8320-C747748D40E5'.toLocaleLowerCase()
        // || this.serviceService.Service_ID != '5FE58D7F-6E9F-452E-B85B-8CD501F020BE'.toLocaleLowerCase()
        // || this.serviceService.Service_ID != '05DB54FC-E388-4E5E-AAAA-BD6141C8E533'.toLocaleLowerCase()
        // ){
        //   this.serviceService.PlotStutusLook=this.serviceService.PlotStutusLook.filter(x=>x.Plot_Status_ID != 2019)
        // }
        console.log("PlotStutusLookUP", this.serviceService.PlotStutusLook);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  isisvalidated(todoID, tskID, plotid, proid, DocID) {
    this.serviceService
      .isvalidated(todoID, tskID, plotid, proid, DocID)
      .subscribe(
        (Validated) => {
          if (Validated == "Validated") {
            this.noinvalidplot = this.noinvalidplot - 1;
            console.log("noinvalidplot", this.noinvalidplot);

            if (this.noinvalidplot == 0) {
              if (!this.Saved) {
                //this.completed.emit();
                this.Saved = true;
                this.CanDone = true;
              }
              // this.CanDone = true;
            }
          } else {
            // this.validated = false;
            // const toast = this.notificationsService.warn("Warning", Validated);
            console.log("Warning=>>> " + Validated);
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
    this.getPloat();
    this.isvalidated();
  }

  EnableFinsDel() {
    this.plotForm = false;
    this.getPloat();
  }

  EnableFinsPloat(Parcel) {
    console.log("FinalPLoat", Parcel);
    //console.log("FinalPLoat ID", Parcel.plot_ID);
    // this.plotForm = false;
    this.plotId = Parcel.plot_ID;

    if (this.OnParcle !== -1) {
      if (this.OnParcle == 0) {
        this.Parcel_ID = Parcel.plot_ID;
        this.LicenceData.Parcel_ID = Parcel.plot_ID;
      }
      if (this.OnParcle == 1) {
        this.Parcel_mearge1 = Parcel.plot_ID;
        this.LicenceData.Plot_Merge_1 = Parcel.plot_ID;
      }
      if (this.OnParcle == 2) {
        this.Parcel_mearge2 = Parcel.plot_ID;
        this.LicenceData.Plot_Merge_2 = Parcel.plot_ID;
      }
      if (this.OnParcle == 3) {
        this.Parcel_mearge3 = Parcel.plot_ID;
        this.LicenceData.Plot_Merge_3 = Parcel.plot_ID;
      }
      if (this.OnParcle == 4) {
        this.Parcel_mearge4 = Parcel.plot_ID;
        this.LicenceData.Plot_Merge_4 = Parcel.plot_ID;
      }
    } else {
      this.Parcel_ID = Parcel.plot_ID;
      this.LicenceData.Parcel_ID = Parcel.plot_ID;
    }

    console.log("Licence", this.LicenceData);
    this.serviceService.UpdateLicence(this.LicenceData).subscribe(
      (Licence) => {
        if (this.isnew) {
          this.SelectedPlot = Parcel;
          // this.SelectedPlot.Parcel_ID = Parcel_ID;
          this.toLease = true;
        } else {
          this.isvalidated();
        }
      },
      (error) => {
        const toast = this.notificationsService.error("Error", error.error);
      }
    );
    this.PlotManagementListfinal = [];
    // this.getPloat();
  }

  EnableFinsPloatuupdate(Parcel) {
    // console.log("FinalPLoat", Parcel);
    // //console.log("FinalPLoat ID", Parcel.plot_ID);
    // // this.plotForm = false;
    // this.plotId = Parcel.plot_ID;

    // if (this.OnParcle !== -1) {
    //   if (this.OnParcle == 0) {
    //     this.Parcel_ID = Parcel.plot_ID;
    //     this.LicenceData.Parcel_ID = Parcel.plot_ID;
    //   }
    //   if (this.OnParcle == 1) {
    //     this.Parcel_mearge1 = Parcel.plot_ID;
    //     this.LicenceData.Plot_Merge_1 = Parcel.plot_ID;
    //   }
    //   if (this.OnParcle == 2) {
    //     this.Parcel_mearge2 = Parcel.plot_ID;
    //     this.LicenceData.Plot_Merge_2 = Parcel.plot_ID;
    //   }
    //   if (this.OnParcle == 3) {
    //     this.Parcel_mearge3 = Parcel.plot_ID;
    //     this.LicenceData.Plot_Merge_3 = Parcel.plot_ID;
    //   }
    //   if (this.OnParcle == 4) {
    //     this.Parcel_mearge4 = Parcel.plot_ID;
    //     this.LicenceData.Plot_Merge_4 = Parcel.plot_ID;
    //   }
    // } else {
    //   this.Parcel_ID = Parcel.plot_ID;
    //   this.LicenceData.Parcel_ID = Parcel.plot_ID;
    // }

    console.log("Licence", this.LicenceData);
    this.serviceService.UpdateLicence(this.LicenceData).subscribe(
      (Licence) => {
        if (this.isnew) {
          this.SelectedPlot = Parcel;
          // this.SelectedPlot.Parcel_ID = Parcel_ID;
          this.toLease = true;
        } else {
          this.isvalidated();
        }
      },
      (error) => {
        const toast = this.notificationsService.error("Error", error.error);
      }
    );
    this.PlotManagementListfinal = [];
    // this.getPloat();
  }

  async DoneNew() {
    this.serviceService.getPlotloc(this.plot_ID).subscribe((response: any) => {
      let plotloc = response.procPlot_Locations;
      if (plotloc.length > 0) {
      } else {
        const toast = this.notificationsService.warn(
          `must save the plot location on the map  first / በቅድሚያ በካርታው ላይ ያለውን ቦታ ማስቀመጥ አለበት`
        );
        return;
      }
    });
    for (let i = 0; i < this.PlotManagementListfinal.length; i++) {
      const element: any = this.PlotManagementListfinal[i];
      const isdeedchildren = await this.checkLease_and_Owned_Land(element);

      if (!isdeedchildren) {
        const toast = this.notificationsService.warn(
          `Must add  Lease awned  for this plot: ${element.plot_ID}`
        );
        return;
      } else {
        if (
          "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() !=
            this.serviceService.Service_ID ||
          "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() !=
            this.serviceService.Service_ID
        ) {
          this.leaseOwnerShipService
            .getAllapi(this.plot_ID)
            .subscribe((CertificateVersion: any) => {
              let tasks = CertificateVersion;
              tasks = Object.assign([], tasks.procLease_and_Owned_Lands);
              const uniquePlotIDs = new Set();
              const totalsize = tasks
                .filter((x) => parseInt(x.status) === 1)
                .reduce((sum, node) => {
                  if (!uniquePlotIDs.has(node.plot_ID)) {
                    sum +=
                      parseFloat(node.free_Hold_M2) +
                      parseFloat(node.lease_Hold_M2);
                    uniquePlotIDs.add(node.plot_ID);
                  }

                  return sum;
                }, 0);
              console.log(
                "leaseOwnerShipService",
                tasks,
                this.serviceService.Totalarea,
                totalsize
              );

              if (tasks.length > 0) {
                if (this.serviceService.Totalarea == this.serviceService.Totalarea) {
                  this.serviceService
                    .GetPlotValidationURL(
                      this.serviceService.LicenceserviceID,
                      this.serviceService.Service_ID
                    )
                    .subscribe((message: any) => {
                      if (message.Message == "1") {
                        this.serviceService.disablefins = false;

                        this.completed.emit();
                      } else {
                        const toast = this.notificationsService.error(
                          "Error",
                          message.Message
                        );
                      }
                    });
                } else {
                  const toast = this.notificationsService.warn(
                    `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
                  በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት`
                  );
                  return;
                }
              } else {
                const toast = this.notificationsService.warn(
                  "before submit the form you have to register lease ownershipቅጹን ከማቅረቡ በፊት የሊዝ ባለቤትነት መመዝገብ አለብዎት"
                );
                return;
              }
            });
        } else {
          this.serviceService
            .GetPlotValidationURL(
              this.serviceService.LicenceserviceID,
              this.serviceService.Service_ID
            )
            .subscribe((message: any) => {
              console.log(
                "🚀 ~ PlotComponent ~ .subscribe ~ message:",
                message
              );
              if (message.Message == "1") {
                this.serviceService.disablefins = false;

                this.completed.emit();
              } else {
                const toast = this.notificationsService.error(
                  "Error",
                  message.Message
                );
              }
            });
        }
      }
    }

    //this.serviceService.disablefins = false;
    this.plotForm = false;
    this.isvalidated();
    this.toLease = false;
    this.CanDone = false;
  }
  async getlese(plotID) {
    var a: any = this.leaseOwnerShipService.getAllapi(plotID).toPromise();

    return a;
  }
  async checkLease_and_Owned_Land(element) {
    let b = await this.getlese(element.plot_ID);
    b = Object.assign([], b.procLease_and_Owned_Lands);
    if (b.length === 0) {
      return false; // No deed record for current property
    }

    return true; // All children and descendants have deed records
  }

  getconvertPolygonCoordinates(polygonString: string): any[] {
    const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);
    console.log("🚀 ~ convertPolygonCoordinates ~ coordinates:", coordinates);

    const result = [];

    if (coordinates) {
      const uniqueCoordinates = new Set(); // Using a Set to store unique coordinates
      for (const coord of coordinates) {
        const [easting, northing, hemisphere, zone] = coord.split(" ");

        // Check if the coordinate is unique before adding it to the result
        const uniqueCoordString = `${easting},${northing}`;
        if (!uniqueCoordinates.has(uniqueCoordString)) {
          uniqueCoordinates.add(uniqueCoordString);
          result.push({
            northing: (parseFloat(northing)).toString(),
            easting: (parseFloat(easting)).toString(),
            hemisphere: hemisphere,
            zone: zone,
          });
        }
      }
    }

 
    return  result 
  }

  getplotlocbyidcheck(plot_ID) {

    this.serviceService.getPlotloc(plot_ID).subscribe(async (response: any) => {
      this.plotlocshow = response.procPlot_Locations;

      if ( this.plotlocshow.length == 0) {
       
      } else {
       
        
        // Check if the plot_ID has already been processed before calling the method
        if (!this.processedPlotIDsCoordinatess.has(plot_ID)) {
        this.leaseholdGIs= await this.getconvertPolygonCoordinates(
            this.plotlocshow[0].geowithzone
          );

          if (
            this.plotlocshow[0].geoForwgs84 != null &&
            this.plotlocshow[0].freholdgis
          ) {
           this.freeholdGIs=await this.getconvertPolygonCoordinates(
              this.plotlocshow[0].geoForwgs84
            );
          }

          console.log("plotloc:plotloc:show", this.plotlocshow[0] ,this.leaseholdGIs ,this.freeholdGIs);
          // Add the plot_ID to the set of processed plot IDs
          if(this.leaseholdGIs != undefined){
            this.showdialogee=true
          }
          this.processedPlotIDsCoordinatess.add(plot_ID);
        }
       
      }
    });
  }

  EnableFinsLise() {
    this.isvalidated();
    this.toMes = true;
    this.getPloat();
    this.CanDone = true;
  }
}
