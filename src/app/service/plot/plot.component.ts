import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from "@angular/core";
import { ServiceService } from "../service.service";
import {
  PlatformLocation,
  PlotManagment,
} from "../plot-managment/plot-managment.component";
import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";
import { LeaseOwnerShipService } from "../lease-owner-ship/lease-owner-ship.service";
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
  ischeckPlotaev: boolean = false;
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

  constructor(
    public serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
    private leaseOwnerShipService: LeaseOwnerShipService
  ) {}
  changingValue: Subject<boolean> = new Subject();
  ngOnChanges() {
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
  modalRef: BsModalRef;
  openModall(template: TemplateRef<any>) {
    this.serviceService.check = true;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "gray modal-lg" })
    );
  }
  tellChild(aa) {
    console.log("value is changing", aa);
    const coordinatesarea = this.convertCoordinatesformatd(aa);

    let areas = this.calculateUTMPolygonArea(coordinatesarea);
    localStorage.setItem("PolygonAreaname", "" + areas.toFixed(2));

    console.log("coordinatesarea", coordinatesarea, areas);
    this.geo = aa;
    this.serviceService.check = true;
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

  getplotlocbyid(plot_ID) {
    this.serviceService.check = true;
    this.serviceService.getPlotloc(plot_ID).subscribe((response: any) => {
      this.plotloc = response.procPlot_Locations;

      if (this.plotloc.length == 0) {
        console.log("plotloc:", this.plotloc);
        this.isfinished = false;

        this.platformLocation = new PlatformLocation();
        this.isplotllocnew = true;
      } else {
        this.platformLocation = this.plotloc[0];
        console.log(this.plotloc[0]);

        this.convertPolygonCoordinates(this.plotloc[0].geowithzone);

        this.isplotllocnew = false;
        this.isfinished = true;
      }
    });
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
  updateplotloc() {
    console.log("coordinatcoordinat", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      let coordinate = this.convertToMultiPoint(this.serviceService.coordinate);
      let coordinate2 = this.convertToMultiPoints(
        this.serviceService.coordinate
      );
      this.platformLocation.geo = coordinate2;
      this.platformLocation.geowithzone = coordinate;
      this.platformLocation.ploteId = this.Parcel_ID;
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
              "Succesfully Upadted"
            );
            const maxAreaDifferences =
              environment.Totalareatolerance * this.serviceService.Totalarea;

            const areaDifferences = Math.abs(
              this.SelectedPlot.plot_Size_M2 -
                parseFloat(localStorage.getItem("PolygonAreaname"))
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
               parseInt(localStorage.getItem("PolygonAreaname"))
           )}`
              );
            }
            this.ismodaEnable = false;

            this.getplotlocbyid(this.platformLocation.ploteId);
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

        this.platformLocation.ploteId = this.Parcel_ID;
        this.platformLocation.created_By = response[0].RoleId;
        this.platformLocation.created_Date = new Date();
        this.serviceService.savePlotloc(this.platformLocation).subscribe(
          (CustID) => {
            //this.getplotloc(this.platformLocation.ploteId);
            this.getplotlocbyid(this.plot_ID);
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
    console.log("ischeckPlotaev", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      this.storeData();
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
    this.maxWidth = "1600px"; // Set the max width for full modal
  }

  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "800px"; // Set the max width for mini modal
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
  getPlotManagement(Licence_Service_ID) {
    let a;
    this.serviceService.getPlotManagementApi(Licence_Service_ID).subscribe(
      async (PlotManagementLists: any) => {
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;
        if (PlotManagementList.length > 0) {
          this.PlotManagementList = this.removeDuplicates(PlotManagementList);
        }
        console.log("PlotManagementList", this.PlotManagementList);
        if (this.PlotManagementList.length > 0) {
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

        console.log("PlotManagementList", this.PlotManagementListfinal);
        console.log(
          "this.PlotManagementList",
          this.PlotManagementList,
          this.serviceService.Service_ID
        );
        if (this.PlotManagementListfinal.length > 0) {
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
    this.SelectedPlot = plot;
    console.log("dfghgfd", plot);
    this.plot_ID = this.SelectedPlot.plot_ID;
    this.serviceService.Totalarea = this.SelectedPlot.plot_Size_M2;
    // const maxAreaDifferences =
    //   environment.Totalareatolerance * this.serviceService.Totalarea;

    // const areaDifferences = Math.abs(
    //   this.SelectedPlot.plot_Size_M2 -
    //     parseFloat(localStorage.getItem("PolygonAreaname"))
    // );
    // console.log(
    //   maxAreaDifferences,
    //   areaDifferences,
    //   this.serviceService.leaselist
    // );
    this.getplotlocbyid(plot.plot_ID);
    let totalleas = 0;
    // this.serviceService.leaselist[0].Lease_Hold_M2 +
    //   this.serviceService.leaselist[0].Free_Hold_M2;
    // this.serviceService.leaselist.forEach((element) => {
    //   let totalleaseach = element.Lease_Hold_M2 + element.Free_Hold_M2;
    //   totalleas = totalleaseach + totalleas;
    // });
    // if (this.SelectedPlot.plot_Size_M2 <= totalleas) {
    //   this.serviceService.plotsizenotequal = false;
    // } else {
    //   this.serviceService.plotsizenotequal = true;
    //   const toast = this.notificationsService.warn(
    //     `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
    //       በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት
    //        ${Math.abs(
    //          this.SelectedPlot.plot_Size_M2 -
    //            parseInt(localStorage.getItem("PolygonAreaname"))
    //        )}`
    //   );
    //}

    plot.SDP_ID = this.serviceComponent.licenceData.SDP_ID;
    plot.Licence_Service_ID = this.LicenceData.Licence_Service_ID;
    plot.Application_No = this.AppNo;
    if (this.language != "amharic") {
      plot.registration_Date = plot.registration_Date.split("T")[0];
    }
    if (this.language == "amharic") {
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
        // console.log('PlotStutusLookUP', PlotStutusLookUP);
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

    this.serviceService.UpdateLicence(this.LicenceData).subscribe(
      (Licence) => {
        console.log("Licence");
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

  DoneNew() {
    this.leaseOwnerShipService
      .getAll(this.plot_ID)
      .subscribe((CertificateVersion: any) => {
        let tasks = CertificateVersion;
        tasks = Object.assign([], tasks.list);
        const totalsize = tasks
          .filter((x) => parseInt(x.Status) === 1)
          .reduce((sum, node) => {
            sum +=
              parseFloat(node.Free_Hold_M2) + parseFloat(node.Lease_Hold_M2);

            return sum;
          }, 0);
        console.log(
          "leaseOwnerShipService",
          tasks,
          this.serviceService.Totalarea,
          totalsize
        );

        if (tasks.length > 0) {
          if (totalsize === this.serviceService.Totalarea) {
            this.completed.emit();
          } else {
            const toast = this.notificationsService.warn(
              `the plot location size on the map different from the sum lease hold and free hold so you have to update lease ownership\
          በካርታው ላይ ያለው የቦታ መጠን ከድምሩ የሊዝ ይዞታ እና ነፃ መያዣ የተለየ ስለሆነ የሊዝ ባለቤትነትን ማዘመን አለብዎት`
            );
          }
        } else {
          const toast = this.notificationsService.warn(
            "before submit the form you have to register lease ownershipቅጹን ከማቅረቡ በፊት የሊዝ ባለቤትነት መመዝገብ አለብዎት"
          );
        }
      });

    //this.serviceService.disablefins = false;
    this.plotForm = false;
    this.isvalidated();
    this.toLease = false;
    this.CanDone = false;
  }

  EnableFinsLise() {
    this.isvalidated();
    this.toMes = true;
    this.getPloat();
    this.CanDone = true;
  }
}
