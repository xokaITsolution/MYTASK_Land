import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import * as L from "../../../../node_modules/leaflet";
import "leaflet-draw";
import * as XLSX from "xlsx";
import * as shp from "node_modules/shpjs/dist/shp.js";
import * as JSZip from "jszip";
import "proj4leaflet";
import { environment } from "../../../environments/environment";
import { ServiceService } from "../../service/service.service";
import * as utm from "utm";
import { BsModalService } from "ngx-bootstrap";
import { NotificationsService } from "angular2-notifications";
import { MessageService, TreeNode } from "primeng/api";
import { ApiService } from "../testgismap/api.service";
import { CookieService } from "ngx-cookie-service/cookie-service/cookie.service";
import { Subject } from "rxjs";
import html2canvas from "html2canvas";
import "leaflet-simple-map-screenshoter";
//import * as json2csv from "json2csv";
interface AssignedBodyTree {
  label: string;
  workspace: string;
  value: string;
  children: any;
  randomColor: any;
}
interface AssignedBodyTree2 {
  label: string;
  workspace: string;
  value: string;

  randomColor: any;
}
@Component({
  selector: "app-gis-map",
  templateUrl: "./gis-map.component.html",
  styleUrls: ["./gis-map.component.css"],
})
export class GisMapComponent implements AfterViewInit {
  @ViewChild("snipContainer", { static: false }) snipContainer: ElementRef;
  @Output() completed = new EventEmitter();
  @ViewChild("tree", { static: false }) tree: any; // Replace 'any' with the actual type of your tree if available
  @ViewChild("fileInputt", { static: false }) fileInputt: ElementRef;
  @Input() disable;
  nodes: CustomTreeNode[];
  Centralspatial: Layer[] = [];
  polylinee: any;
  datum: string;
  defaultLayer: any;
  sample: L.Layer;
  rectangleOverlay: any;
  utmCoordinates: any[] = [];
  utmCoordinatesforallexcel: any;
  alllatlong: any[] = [];
  arrayFoPolygonarea: any[] = [];
  groupLayers: any;
  groupLayer: any;
  styleHref: any;
  subcities: any;
  woredas: any;
  woredaLayers: any;
  woredaLayersOneByOne: any;
  newpointLayer: string;
  central_AddisLand: any;
  subcity = environment.SubcityName;
  fromexcel: boolean;
  ispointadd: boolean;
  numberOFaddpoint: number = 0;
  lastCharacter: string = "A";
  centralAddis: any;
  groupLayerss: any;
  randomColor: string;
  selectedNode: any;
  activeNode: any;
  centermap: any;
  plot_locations_gejon: L.Proj.GeoJSON;
  isconfirmsave: boolean;
  message: string;
  arrayproporty: any;
  isSnipping: boolean;
  snipStartX: number;
  snipStartY: number;
  screenshot: any;
  simpleMapScreenshoter: any;
  screenshotBase64: any;
  alllatlongPlot: any[] = [];
  limitedAreaBounds: any;
  central_base: any;
  centralsublayers: any;
  cntralplanlayers: any;
  layer: any;
  fetchedGroups: any[] = [];
  ondrawingshape: boolean = false;
  ondataloaded: boolean;
  allmultiplshape: any[] = [];
  multishapearray: any[] = [];
  drawControll: any;
  allcoordenatezone: any[] = [];

  constructor(
    public ServiceService: ServiceService,
    private messageService: MessageService,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private geoser: ApiService,
    private cookieService: CookieService
  ) {
    this.defaultLayer = this.layers[0];
  }

  @Input() geometry;
  map: L.Map;
  editableLayers = new L.FeatureGroup();
  private EPSG20137: L.Proj.CRS;
  // Define the EPSG:20137 CRS
  private markerLayer: L.LayerGroup;
  @Input() mapConfig: any;
  @Output() mapLoaded = new EventEmitter<boolean>();
  latitude: number;
  longitude: number;
  latitudeDegrees: number;
  latitudeSeconds: number;
  latitudeMinutes: number;
  longitudeDegrees: number;
  longitudeMinutes: number;
  longitudeSeconds: number;
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  drawnShape: L.Layer;
  drawControl: L.Control.Draw;
  drawnShapes: L.LatLng[][] = []; // Array to store the drawn shapes' coordinates
  pinpointedPoints: any = [];
  coordinates: any = [];
  aaa: any[] = [];
  selectedDatum: string = "Adindan / UTM zone 37N";
  datums: string[] = [
    "Adindan / UTM zone 36N",
    "Adindan / UTM zone 37N",
    "Adindan / UTM zone 38N",
    "GCS Adindan",
    "WGS 1984 UTM Zone 36",
    "WGS 1984 UTM Zone 37",
    "WGS 1984 UTM Zone 38",
  ];

  // Add your event handlers and other component logic here

  vectorLayer: L.Proj.GeoJSON;

  customZoomLevels: Record<number, number> = {
    1: 2, // 1 meter on the map is 1 meter in the real world
    2: 4, // 1 meter on the map is 2 meters in the real world
    4: 8, // 1 meter on the map is 4 meters in the real world

    // Add more levels as needed
  };

  layers: Layer[] = [];
  @Input() changingg: Subject<any>;
  @Input() geo;
  ngOnInit() {
    console.log("value is changing", this.geo);
  }
  ngAfterViewInit() {
    console.log("subcitycurent", this.subcity);

    const subcityToSDPMapping = {
      arada: "6921d772-3a1c-4641-95a0-0ab320bac3e2",
      bole: "89eb1aec-c875-4a08-aaf6-2c36c0864979",
      nifass: "f8ea62db-05bc-4f1a-ab30-4e926d43e3fb",
      gullele: "6a8c042f-a3e1-4375-9769-54d94c2312c6",
      addisk: "7101d44d-97d5-41aa-957d-82f36d928c07",
      lideta: "e4d8219e-51f9-40cb-9d53-883c6ca9aaa3",
      lemik: "f02e9467-1b7d-4350-bee7-9844d4f56da0",
      yeka: "8222f028-5fe3-4047-9a50-b52bfa64c851",
      akakyk: "08f9c927-6366-467a-ba99-c837c5add427",
      kirkos: "aaa5094c-8899-4708-9f7b-d8ff634a3540",
      kolfek: "930d1c20-9e0e-4a50-9eb2-e542fafbad68",
      central: "275619f2-69c2-4fb7-a053-938f0b62b088",
    };

    const resultArray = Object.keys(subcityToSDPMapping).map((subcity) => ({
      name: `${subcity}_AddisLand`,
      id: subcityToSDPMapping[subcity],
    }));
    console.log("🚀 ~ resultArray ~ resultArray:", resultArray);

    if (this.subcity == "central_AddisLand") {
      const filtedsdp = resultArray.filter(
        (x) => x.id === this.ServiceService.currentsdpid
      );
      this.subcity = filtedsdp[0].name;
    }

    //L.Marker.prototype.options.icon = iconDefault;
    this.initMap();

    this.getGroupLayers();
    if (this.geo) {
      this.ondataloaded = true;
      console.log("value is changing", this.geo);
      if (this.ServiceService.check) {
        for (let index = 0; index < this.geo.length; index++) {
          // const element = this.geo[index];

          this.processcoordinatesForPlot(this.geo[index][0]);

          if (index == this.geo.length - 1) {
            this.drawnshapeAfterProcessForplot();
          }
        }
        // this.processImportedShapes(this.geo);
      } else {
        for (let index = 0; index < this.geo.length; index++) {
          // const element = this.geo[index];

          this.processcoordinates(this.geo[index][0]);

          if (index == this.geo.length - 1) {
            this.drawnshapeAfterProcess();
          }
        }
      }
    }

    //this.initMap();
  }

  generateRandomColor(): string {
    // Implement your logic to generate a random color here
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  onLabelClick(event) {
    console.log("lableselected", event);
  }

  getGroupLayers(): void {
    //
    this.geoser
      .fetchGroupLayers(environment.parentWorkspace)
      .subscribe((data: any) => {
        this.groupLayers = data.layerGroups.layerGroup;
        // console.log("Agroup", this.groupLayers);

        for (let index = 0; index < this.groupLayers.length; index++) {
          const element = this.groupLayers[index].name;
          //
          if (element == "AddisLand") {
            if (typeof this.groupLayers[index] === "object") {
              if (Array.isArray(this.groupLayers[index])) {
                // console.log('Variable is an array');
                this.groupLayer = this.groupLayers[index];
              } else {
                this.groupLayer = this.json2array(this.groupLayers[index]);
                // console.log("parent", this.groupLayer);
              }
            }
            //
            // console.log("AddisLand", this.groupLayers[index]);
            //this.nodes = JSON.parse(storedTreeDataString);
            this.getTree(this.groupLayer);
          }
        }
      });
    // }
    //  this.getcapablities(this.subcity)
  }
  async toggleLayer_expand(event) {
    if (this.subcity == "central_AddisLand") {
    } else {
      //
      console.log("event", event);
      if (
        event.node.parent == undefined ||
        event.node.parent == "central spatial data"
      ) {
        // this.fetchedGroups.push(event.node.label);
        const group = this.fetchedGroups.find(
          (fetched) => fetched === event.node.label
        );
        // if (event.node.parent == "AddisLand") {
        //   console.log("🚀 ~ toggleLayer_expand ~ parent:", event.node.parent)
        // }
        if (event.node.parent == "central spatial data") {
          if (group) {
            console.log("🚀 ~ toggleLayer_expand ~ group:", group);
          } else {
            this.fetchedGroups.push(event.node.label);
            var AddisLand = await this.geoser
              .getLayersFromGeoserver(event.node.value)
              .toPromise();
            let keys = Object.keys(AddisLand);
            if (keys[0] == "layer") {
              const newLayer: Layer = {
                name: AddisLand.layername,
                vectorLayer: null,
                tileLayer: null,
              };
              this.GetFeatureCapablities(
                AddisLand.layername,
                newLayer,
                event.node.workspace
              );
              this.Centralspatial.push(newLayer);
            }
            var AddisLandGroups = AddisLand.layerGroup.publishables.published;
            // if (typeof AddisLandGroups === 'object') {
            if (Array.isArray(AddisLandGroups)) {
              console.log(
                "🚀 ~ toggleLayer_expand ~ AddisLandGroups:",
                AddisLandGroups
              );
            } else {
              AddisLandGroups = this.json2array(AddisLandGroups);
              // console.log("subcities", this.subcities);
            }
            // }
            for (let i = 0; i < AddisLandGroups.length; i++) {
              var centralspatial_sub = await this.geoser
                .getLayersFromGeoserver(AddisLandGroups[i].value)
                .toPromise();
              let keys = Object.keys(centralspatial_sub);
              if (keys[0] == "layer") {
                const newLayer: Layer = {
                  name: centralspatial_sub.layername,
                  vectorLayer: null,
                  tileLayer: null,
                };
                this.GetFeatureCapablities(
                  AddisLand.layername,
                  newLayer,
                  event.node.workspace
                );
                this.Centralspatial.push(newLayer);
              }
            }
          }
        } else {
          if (group) {
            console.log("🚀 ~ toggleLayer_expand ~ group:", group);
          } else {
            this.fetchedGroups.push(event.node.label);
            var AddisLand = await this.geoser
              .getLayersFromGeoserver(event.node.value)
              .toPromise();
            //
            let keys = Object.keys(AddisLand);
            var subcityGroups = AddisLand.layerGroup.publishables.published;
            // if (typeof AddisLandGroups === 'object') {
            if (Array.isArray(subcityGroups)) {
              console.log(
                "🚀 ~ toggleLayer_expand ~ AddisLandGroups:",
                subcityGroups
              );
            } else {
              subcityGroups = this.json2array(subcityGroups);
              // console.log("subcities", this.subcities);
            }
            // }
            for (let i = 0; i < subcityGroups.length; i++) {
              const element = subcityGroups[i].name.split(":");
              subcityGroups[i].name = element[1];
              subcityGroups[i].workspace = element[0];
              const newLayer: Layer = {
                name: subcityGroups[i].name,
                vectorLayer: null,
                tileLayer: null,
              };
              this.GetFeatureCapablities(
                subcityGroups[i].name,
                newLayer,
                subcityGroups[i].workspace
              );
              this.Centralspatial.push(newLayer);
              // }
            }
          }
        }
      } else if (
        event.node.label == this.subcity ||
        event.node.parent.label == this.subcity
      ) {
        //
        const group = this.fetchedGroups.find(
          (fetched) => fetched === event.node.label
        );
        if (event.node.parent.label == this.subcity) {
          if (group) {
            console.log("🚀 ~ toggleLayer_expand ~ group:", group);
          } else {
            //
            this.fetchedGroups.push(event.node.label);
            var AddisLand = await this.geoser
              .getLayersFromGeoserver(event.node.value)
              .toPromise();
            let keys = Object.keys(AddisLand);
            var subcityGroups = AddisLand.layerGroup.publishables.published;
            if (Array.isArray(subcityGroups)) {
              console.log(
                "🚀 ~ toggleLayer_expand ~ AddisLandGroups:",
                subcityGroups
              );
            } else {
              subcityGroups = this.json2array(subcityGroups);
              // console.log("subcities", this.subcities);
            }
            subcityGroups.forEach(async (item: any) => {
              // Checking the type of item
              if (item["@type"] === "layer") {
                //
                // console.log("This is a layer:", item.name);
                // Perform actions for layers
                const element = item["name"].split(":");
                const newLayer: Layer = {
                  name: element[1],
                  vectorLayer: null,
                  tileLayer: null,
                };
                this.GetFeatureCapablities(element[1], newLayer, element[0]);
                this.layers.push(newLayer);
              } else {
                //
                console.log("This is layergroup:", item.name);
                // Perform actions for groups or other types
                var woredalayers = await this.geoser
                  .getLayersFromGeoserver(item.href)
                  .toPromise();
                // let keys = Object.keys(woredalayers)
                var woredalayers =
                  woredalayers.layerGroup.publishables.published;
                //;
                if (Array.isArray(woredalayers)) {
                  console.log(
                    "🚀 ~ toggleLayer_expand ~ AddisLandGroups:",
                    woredalayers
                  );
                } else {
                  woredalayers = this.json2array(woredalayers);
                  // console.log("subcities", this.subcities);
                }
                woredalayers.forEach(async (item: any) => {
                  // Checking the type of item
                  if (item["@type"] === "layer") {
                    // console.log("This is a layer:", item.name);
                    // Perform actions for layers
                    const element = item["name"].split(":");
                    const newLayer: Layer = {
                      name: element[1],
                      vectorLayer: null,
                      tileLayer: null,
                    };
                    this.GetFeatureCapablities(
                      element[1],
                      newLayer,
                      element[0]
                    );
                    this.layers.push(newLayer);
                  } else {
                    console.log("layerGroup");
                  }
                });
              }
            });
          }
        } else {
          if (group) {
            console.log("🚀 ~ toggleLayer_expand ~ group:", group);
          } else {
            this.fetchedGroups.push(event.node.label);
            var AddisLand = await this.geoser
              .getLayersFromGeoserver(event.node.value)
              .toPromise();
            let keys = Object.keys(AddisLand);
            var subcityGroups = AddisLand.layerGroup.publishables.published;
            // if (typeof AddisLandGroups === 'object') {
            if (Array.isArray(subcityGroups)) {
              console.log(
                "🚀 ~ toggleLayer_expand ~ AddisLandGroups:",
                subcityGroups
              );
            } else {
              subcityGroups = this.json2array(subcityGroups);
              // console.log("subcities", this.subcities);
            }
            subcityGroups.forEach((item: any) => {
              // Checking the type of item
              if (item["@type"] === "layer") {
                // console.log("This is a layer:", item.name);
                // Perform actions for layers
                const element = item["name"].split(":");

                // element[0]
                //
                const newLayer: Layer = {
                  name: element[1],
                  vectorLayer: null,
                  tileLayer: null,
                };
                this.GetFeatureCapablities(element[1], newLayer, element[0]);
                this.layers.push(newLayer);
              } else {
                console.log("This is layergroup:", item.name);
                // Perform actions for groups or other types
              }
            });
          }
        }
      }
      // else{}
    }
  }
  toggleLayer_Checked(event) {
    // // Apply styles only to the selected node
    event.styleClass = "custom-selected-node";
    // // this.activeNode = [event.node];

    if (event.children.length == 0 && event.children != undefined) {
      if (event.children) {
        // Deselect all the children nodes
        event.children.forEach((child) => {
          console.log("child", child);
          this.toggleLayer_UnChecked(child);
        });
      }
      console.log("event", event);
      const layerName = event.label;
      if (event.workspace == "AddisAbaba_AddisLand") {
        this.layer = this.Centralspatial.find((l) => l.name === layerName);
      } else {
        this.layer = this.layers.find((l) => l.name === layerName);
        // ;
      }

      if (this.layer && this.layer.vectorLayer) {
        event.randomColor =
          this.layer.vectorLayer.options.style === null
            ? this.generateRandomColor()
            : (this.layer.vectorLayer.options.style as L.PathOptions).color;
        // debugger
        if (this.layer.tileLayer) {
          // Create custom panes with specific z-index
          this.map.createPane("tilePane");
          //  this.map.getPane('tilePane').style.zIndex = 450; // TileLayer pane
          this.map.getPane("tilePane").style.zIndex = "450"; // Correctly assigning as a string
          this.map.createPane("vectorPane");
          this.map.getPane("vectorPane").style.zIndex = "390"; // VectorLayer pane

          // Assign the custom pane to the tileLayer
          this.layer.tileLayer.options.pane = "tilePane";

          // Assign the custom pane to the vectorLayer
          this.layer.vectorLayer.options.pane = "vectorPane";
          // Add the layers to the map
          this.map.addLayer(this.layer.vectorLayer);
          this.map.addLayer(this.layer.tileLayer);
        } else {
          this.map.createPane("vectorPane");
          this.map.getPane("vectorPane").style.zIndex = "490"; // VectorLayer pane
          // Add the layers to the map
          this.map.addLayer(this.layer.vectorLayer);
          // this.map.addLayer(this.layer.tileLayer);
        }
      } else if (this.layer && this.layer.tileLayer) {
        event.randomColor = "#7f7f7f";
        // this.map.createPane('vectorPane');
        // this.map.getPane('vectorPane').style.zIndex = ''; // VectorLayer pane
        this.map.getPane("tilePane").style.zIndex = "400"; // Correctly assigning as a string
        this.map.createPane("tilePane");
        console.log("tilelayer", this.layer.tileLayer);
        this.map.addLayer(this.layer.tileLayer);
      }
    } else {
      event.randomColor = "#c1cdcd";
    }
  }
  toggleLayer_UnChecked(event) {
    event.styleClass = "";
    event.style = {};
    // const visibility = event;
    console.log("event", event);

    const layerName = event.label;
    // const layer = this.layers.find(l => l.name === layerName);
    if (event.workspace == "AddisAbaba_AddisLand") {
      this.layer = this.Centralspatial.find((l) => l.name === layerName);
    } else {
      this.layer = this.layers.find((l) => l.name === layerName);
    }
    //
    if (this.layer && this.layer.vectorLayer) {
      console.log("vectorlayer", this.layer.vectorLayer);

      this.map.removeLayer(this.layer.vectorLayer);
      this.map.removeLayer(this.layer.tileLayer);
      // }
    } else if (this.layer && this.layer.tileLayer) {
      console.log("tilelayer", this.layer.tileLayer);
      this.map.removeLayer(this.layer.tileLayer);
    }
  }

  async getTree(parentgroup) {
    this.nodes = [];

    for (let i = 0; i < parentgroup.length; i++) {
      let a: AssignedBodyTree = {
        label: "",
        workspace: "",
        value: "",
        children: "",
        randomColor: "",
      };
      a["label"] = parentgroup[0].name;
      a["workspace"] = "";
      a["value"] = parentgroup[0].href;
      a.children = [];
      //
      // this.getcapablities(this.subcities[i].workspace);
      var centralcity = await this.geoser
        .getLayersFromGeoserver(parentgroup[0].href)
        .toPromise();
      let keys = Object.keys(centralcity);
      // console.log("wor.key", keys);
      if (keys[0] == "layer") {
        //
        // console.log("wor.layer.name", sub.layer.name);
        continue;
      }

      this.centralAddis = centralcity.layerGroup.publishables.published;
      if (typeof this.centralAddis === "object") {
        if (Array.isArray(this.centralAddis)) {
          // console.log('Variable is an array');
        } else {
          this.centralAddis = this.json2array(
            centralcity.layerGroup.publishables.published
          );
          // console.log("subcities", this.subcities);
        }
      }
      const l11 = Object.assign([], this.centralAddis);

      // console.log("subb", this.subcities.length);
      for (let n = 0; n < this.centralAddis.length; n++) {
        let f: AssignedBodyTree = {
          label: "",
          workspace: "",
          value: "",
          children: "",
          randomColor: "",
        };
        // console.log("hhhe", a)
        const element = this.centralAddis[n].name.split(":");
        this.centralAddis[n].name = element[1];
        this.centralAddis[n].workspace = element[0];
        f["label"] = this.centralAddis[n].name;
        f["workspace"] = this.centralAddis[n].workspace;
        f["value"] = this.centralAddis[n].href;
        f.children = [];
        a.children.push(f);
        if (this.centralAddis[n].name == "central spatial data") {
          var central = await this.geoser
            .getLayersFromGeoserver(this.centralAddis[n].href)
            .toPromise();
          // let keys = Object.keys(sub)
          var central = await this.geoser
            .getLayersFromGeoserver(this.centralAddis[n].href)
            .toPromise();
          let keys = Object.keys(central);
          if (keys[0] == "layer") {
            // console.log("wor.layer.name", sub.layer.name);
            continue;
          }
          // this.groupLayerss = central.layerGroup.publishables.published;
          //
          this.central_base = central.layerGroup.publishables.published;
          if (typeof this.central_base === "object") {
            if (Array.isArray(this.central_base)) {
              // console.log('Variable is an array');
            } else {
              this.central_base = this.json2array(
                central.layerGroup.publishables.published
              );
            }
          }
          //
          const l1 = Object.assign([], this.central_base);
          for (let x = 0; x < this.central_base.length; x++) {
            let y: AssignedBodyTree = {
              label: "",
              workspace: "",
              value: "",
              children: "",
              randomColor: "",
            };
            const element = this.central_base[x].name.split(":");
            this.central_base[x].name = element[1];
            this.central_base[x].workspace = element[0];
            y["label"] = this.central_base[x].name;
            y["workspace"] = this.central_base[x].workspace;
            y["value"] = this.central_base[x].href;
            y.children = [];
            f.children.push(y);

            var centralsub = await this.geoser
              .getLayersFromGeoserver(this.central_base[x].href)
              .toPromise();
            // console.log("worlay",worlay.layer.name);
            let keys = Object.keys(centralsub);
            // console.log("wor.key", keys);

            if (keys[0] == "layer") {
              // console.log("wor.layer.name", worlay.layer.name);
              continue;
            }
            // console.log("worlay", worlay.layerGroup.publishables.published);
            this.centralsublayers =
              centralsub.layerGroup.publishables.published;
            // console.log('ddd', this.woredaLayers);
            //
            if (typeof this.centralsublayers === "object") {
              if (Array.isArray(this.centralsublayers)) {
                // console.log('Variable is an array');
              } else {
                this.centralsublayers = this.json2array(
                  centralsub.layerGroup.publishables.published
                );
                // console.log("subcities", this.woredaLayers);
              }
            }
            // console.log("this11", this.woredaLayers);
            const l1 = Object.assign([], this.centralsublayers);

            for (let m = 0; m < this.centralsublayers.length; m++) {
              let z: AssignedBodyTree = {
                label: "",
                workspace: "",
                value: "",
                children: "",
                randomColor: "",
              };
              const element = this.centralsublayers[m].name.split(":");
              this.centralsublayers[m].name = element[1];
              this.centralsublayers[m].workspace = element[0];
              z["label"] = this.centralsublayers[m].name;
              z["workspace"] = this.centralsublayers[m].workspace;
              z["value"] = this.centralsublayers[m].href;
              z.children = [];
              y.children.push(z);

              var cntralplan = await this.geoser
                .getLayersFromGeoserver(this.centralsublayers[m].href)
                .toPromise();
              // console.log("worlay",worlay.layer.name);
              let keys = Object.keys(cntralplan);
              // console.log("wor.key", keys);

              if (keys[0] == "layer") {
                // console.log("wor.layer.name", worlay.layer.name);
                continue;
              }
              // console.log("worlay", worlay.layerGroup.publishables.published);
              this.cntralplanlayers =
                cntralplan.layerGroup.publishables.published;
              // console.log('ddd', this.woredaLayers);
              //
              if (typeof this.cntralplanlayers === "object") {
                if (Array.isArray(this.cntralplanlayers)) {
                  // console.log('Variable is an array');
                } else {
                  this.cntralplanlayers = this.json2array(
                    cntralplan.layerGroup.publishables.published
                  );
                  // console.log("subcities", this.woredaLayers);
                }
              }
              // console.log("this11", this.woredaLayers);
              const l1 = Object.assign([], this.cntralplanlayers);
              //
              for (let q = 0; q < this.cntralplanlayers.length; q++) {
                let p: AssignedBodyTree = {
                  label: "",
                  workspace: "",
                  value: "",
                  children: "",
                  randomColor: "",
                };
                const element = this.cntralplanlayers[q].name.split(":");
                this.cntralplanlayers[q].name = element[1];
                this.cntralplanlayers[q].workspace = element[0];
                p["label"] = this.cntralplanlayers[q].name;
                p["workspace"] = this.cntralplanlayers[q].workspace;
                p["value"] = this.cntralplanlayers[q].href;
                p.children = [];
                z.children.push(p);
              }
            }
          }
        }
        //

        if (keys[0] == "layer") {
          // console.log("wor.layer.name", sub.layer.name);
          continue;
        }

        if (this.subcity == "central_AddisLand") {
          //
          this.subcities = this.central_AddisLand;
        } else {
          //
          var sub = await this.geoser
            .fetchGroupLayers(this.subcity)
            .toPromise();
          let keys = Object.keys(sub);
          //
          this.groupLayerss = sub.layerGroups.layerGroup;
          // console.log("Agroup", this.groupLayers);
          for (let index = 0; index < this.groupLayerss.length; index++) {
            let elements = this.groupLayerss[index].name;
            // this.subcities[index].name = element[1];
            if (elements === this.subcity) {
              if (typeof this.groupLayerss[index] === "object") {
                if (Array.isArray(this.groupLayerss[index])) {
                  // console.log('Variable is an array');
                  this.subcities = this.groupLayerss[index];
                } else {
                  this.subcities = this.json2array(this.groupLayerss[index]);
                  // console.log("parent", this.groupLayer);
                }
              }
            }
          }
        }
        const l11 = Object.assign([], this.subcities);
        // console.log("subb", this.subcities.length);
        if (n == this.centralAddis.length - 1) {
          //
          for (let j = 0; j < this.subcities.length; j++) {
            let b: AssignedBodyTree = {
              label: "",
              workspace: "",
              value: "",
              children: "",
              randomColor: "",
            };

            if (this.subcity == "central_AddisLand") {
              const element = this.subcities[j].name.split(":");
              this.subcities[j].name = element[1];
              this.subcities[j].workspace = element[0];
            } else {
              this.subcities[j].workspace = this.subcities[j].name;
            }
            b["label"] = this.subcities[j].name;
            b["workspace"] = this.subcities[j].workspace;
            b["value"] = this.subcities[j].href;
            b.children = [];
            a.children.push(b);
            //
            // this.getcapablities(this.subcities[j].workspace);
            var wor = await this.geoser
              .getLayersFromGeoserver(this.subcities[j].href)
              .toPromise();
            let keys = Object.keys(wor);
            // console.log("wor.key", keys);

            if (keys[0] == "layer") {
              //
              // console.log("wor.layer.name", wor.layer.name);
              continue;
            }
            //
            this.woredas = wor.layerGroup.publishables.published;
            if (typeof this.woredas === "object") {
              if (Array.isArray(this.woredas)) {
                // console.log('Variable is an array');
              } else {
                this.woredas = this.json2array(
                  wor.layerGroup.publishables.published
                );
                // console.log("subcities", this.woredas);
              }
            }
            // console.log("this.files111", this.woredas);
            const l1 = Object.assign([], this.woredas);

            for (let k = 0; k < this.woredas.length; k++) {
              let c: AssignedBodyTree = {
                label: "",
                workspace: "",
                value: "",
                children: "",
                randomColor: "",
              };
              const element = this.woredas[k].name.split(":");
              this.woredas[k].name = element[1];
              this.woredas[k].workspace = element[0];
              c["label"] = this.woredas[k].name;
              c["workspace"] = this.woredas[k].workspace;
              c["value"] = this.woredas[k].href;
              c.children = [];
              b.children.push(c);
              //
              var worlay = await this.geoser
                .getLayersFromGeoserver(this.woredas[k].href)
                .toPromise();
              // console.log("worlay",worlay.layer.name);
              let keys = Object.keys(worlay);
              // console.log("wor.key", keys);

              if (keys[0] == "layer") {
                //
                // console.log("wor.layer.name", worlay.layer.name);
                continue;
              }
              // console.log("worlay", worlay.layerGroup.publishables.published);
              this.woredaLayers = worlay.layerGroup.publishables.published;
              // console.log('ddd', this.woredaLayers);
              //
              if (typeof this.woredaLayers === "object") {
                if (Array.isArray(this.woredaLayers)) {
                  // console.log('Variable is an array');
                } else {
                  this.woredaLayers = this.json2array(
                    worlay.layerGroup.publishables.published
                  );
                  // console.log("subcities", this.woredaLayers);
                }
              }
              // console.log("this11", this.woredaLayers);
              const l1 = Object.assign([], this.woredaLayers);

              for (let l = 0; l < this.woredaLayers.length; l++) {
                let d: AssignedBodyTree = {
                  label: "",
                  workspace: "",
                  value: "",
                  children: "",
                  randomColor: "",
                };
                const element = this.woredaLayers[l].name.split(":");
                this.woredaLayers[l].name = element[1];
                this.woredaLayers[l].workspace = element[0];
                d["label"] = this.woredaLayers[l].name;
                d["workspace"] = this.woredaLayers[l].workspace;
                d["value"] = this.woredaLayers[l].href;
                d.children = [];
                c.children.push(d);
                //
                var worlayonebyone = await this.geoser
                  .getLayersFromGeoserver(this.woredaLayers[l].href)
                  .toPromise();
                // console.log("worlay",worlay.layer.name);
                let keys = Object.keys(worlayonebyone);
                // console.log("wor.key", keys);
                //
                if (keys[0] == "layer") {
                  //
                  // console.log("wor.layer.name", worlayonebyone.layer.name);
                  continue;
                }
                //
                // console.log("worlayonebyone", worlayonebyone.layerGroup.publishables.published);
                this.woredaLayersOneByOne =
                  worlayonebyone.layerGroup.publishables.published;
                // console.log('ddd', this.woredaLayersOneByOne);

                if (typeof this.woredaLayersOneByOne === "object") {
                  if (Array.isArray(this.woredaLayersOneByOne)) {
                    // console.log('Variable is an array');
                  } else {
                    this.woredaLayersOneByOne = this.json2array(
                      worlayonebyone.layerGroup.publishables.published
                    );
                    // console.log("woredaLayersOneByOne", this.woredaLayersOneByOne);
                  }
                }
                // console.log("this11", this.woredaLayersOneByOne);
                // const l1 = Object.assign([], this.woredaLayersOneByOne);

                for (let m = 0; m < this.woredaLayersOneByOne.length; m++) {
                  let e: AssignedBodyTree = {
                    label: "",
                    workspace: "",
                    value: "",
                    children: "",
                    randomColor: "",
                  };
                  //
                  const element = this.woredaLayersOneByOne[m].name.split(":");
                  this.woredaLayersOneByOne[m].name = element[1];
                  this.woredaLayersOneByOne[m].workspace = element[0];
                  e["label"] = this.woredaLayersOneByOne[m].name;
                  e["workspace"] = this.woredaLayersOneByOne[m].workspace;
                  e.label = this.woredaLayersOneByOne[m].name;
                  e.value = this.woredaLayersOneByOne[m].href;
                  e.children = [];
                  // this.woredaLayersOneByOne[l].children = [];
                  d.children.push(e);
                }
              }
            }
          }
        }
      }
      this.nodes.push(a);
    }
    // this.geoser.isLoading = new BehaviorSubject<boolean>(
    //   false
    // );

    console.log("this.files", this.nodes);
  }

  // Function to find the "Arada image_M" node in the tree structure
  findAradaImageMNode(nodes): AssignedBodyTree {
    for (const topLevelNode of nodes) {
      for (const aradaAddisLandNode of topLevelNode.children) {
        for (const aradaImageMNode of aradaAddisLandNode.children) {
          if (aradaImageMNode.label === "Plot_Locations") {
            aradaImageMNode.expanded = true;
            return aradaImageMNode;
          }
        }
      }
    }
    return undefined;
  }
  json2array(json) {
    var result = [];
    result.push(json);

    return result;
  }

  fetchTileLayer(layerName, newLayer, _workspace) {
    //Add your raster layer to the map

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);

    // Conversion factor from meters to feet
    const metersToFeet = 3.28084;

    // Desired resolution in meters per pixel
    const desiredResolutionMeters = 10 / 512;

    // Calculate the desired resolution in feet per pixel
    const desiredResolutionFeet = desiredResolutionMeters * metersToFeet;

    // Set the tileSize based on the desired resolution in feet per pixel
    const tileSize = Math.round(20 / desiredResolutionFeet); // 20 feet is the desired resolution in feet

    console.log("tileSize", tileSize);

    // Create the WMS tile layer with the updated tileSize
    const TileLayer = L.tileLayer.wms(
      `${environment.geoser}/${_workspace}/wms`,
      {
        layers: layerName,
        format: "image/png",
        transparent: true,
        maxZoom: 18,
        tileSize: tileSize,
        zoomOffset: -1,
        attribution: "Powered by xoka",
      }
    );

    newLayer.tileLayer = TileLayer;
  }

  getcapablities(_workspace) {
    //
    // GetCapabilities request to retrieve layer names within the group
    const capabilitiesUrl = `${environment.geoser}/${_workspace}/wms?service=wms&request=getcapabilities&version=1.1.1`;

    // 'http://197.156.93.110:8080/geoserver/Arada_AddisLand/gwc/service/wms?service=wms&request=getcapabilities&version=1.1.0&tiled=true';
    fetch(capabilitiesUrl)
      .then((response) => response.text())
      .then((data) => {
        // console.log("gwc",data)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");
        const layers = xmlDoc.getElementsByTagName("Layer");

        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          let layerName = layer.getElementsByTagName("Name")[0].textContent;
          if (
            layerName == "AddisLand" ||
            layerName == environment.SubcityName
          ) {
            continue;
          }
          const newLayer: Layer = {
            name: layerName,
            vectorLayer: null,
            tileLayer: null,
          };
          // call getfeature capablities method
          this.GetFeatureCapablities(layerName, newLayer, _workspace);
          // console.log("gwc", newLayer)
          // push all changes on layers
          this.layers.push(newLayer);
          console.log("this.layersall", this.layers);
        }
      })
      .catch((error) => {
        console.error("Error fetching GetCapabilities:", error);
      });
  }

  GetFeatureCapablities(layerName: string, newLayer: Layer, _workspace) {
    this.geoser.fetchStyleLayers(layerName).subscribe((data: any) => {
      //console.log("stryle", data);
      //
      this.styleHref = data.layer.defaultStyle;
      if (typeof this.styleHref === "object") {
        if (Array.isArray(this.styleHref)) {
          // console.log('Variable is an array');
        } else {
          this.styleHref = this.json2array(data.layer.defaultStyle);
          //console.log("stylehref", this.styleHref);
        }
      }
      for (let index = 0; index < this.styleHref.length; index++) {
        const element = this.styleHref[index].href;

        //calls fetch style method
        this.fetchstylefile(element, (style: any) => {
          //console.log("tile", style);
          // Create a new L.Style object passing the SLD content
          // const sttyle = new L.Style(style.toString());
          const getFeatureUrl = `${environment.geoser}/${_workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&tiled=true&typeName=${layerName}&outputFormat=application/json`;
          fetch(getFeatureUrl)
            .then((response) => response.json())
            .then((geojson) => {
              // const Points = geojson.features.find(feature => feature.geometry.type === "Point");
              // //const Points = geojson.features.find(feature => feature.geometry.type === "LineString");
              //
              // if (Points && Points.geometry.type === "Point") {
              //       console.log("gfgf",layerName);
              //   } else {
              //       console.log("The fetched layer is not a MultiLineString.",layerName);
              //   }
              this.Bind_Features(geojson, layerName);
              this.vectorLayerOnClick(layerName);
              // Apply the style to the vector layer
              this.vectorLayer.setStyle(style);

              // console.log("vectorlayer", this.vectorLayer);

              // if (layerName === "W1_Points" || layerName === "W1_texts" || layerName === "W1_inserts") {
              //   newLayer.vectorLayer = this.vectorLayer;
              // }
              //;
              if (this.newpointLayer === "") {
                newLayer.vectorLayer = this.vectorLayer;
                this.fetchTileLayer(layerName, newLayer, _workspace);
              } else {
                newLayer.vectorLayer = this.vectorLayer;
                this.newpointLayer = "";
              }
            })
            .catch((error) => {
              //console.error('Error fetching GeoJSON:', error);
              // A layer which is not a vector layer can not be fetched as a geojson
              // So here it is fetched as a tileLiyer

              this.fetchTileLayer(layerName, newLayer, _workspace);
            });
        });
      }
    });
  }

  Bind_Features(geojson, layerName) {
    if (layerName === "Plot_Locations") {
      //;
      this.plot_locations_gejon = geojson;

      // Filter out features where Is_Active is false or null
      geojson.features = geojson.features.filter(
        (feature) =>
          feature.properties.Is_Active === true ||
          feature.properties.Is_Active == null
      );

      let isNorthernHemisphere: any = "N";

      // Loop through each filtered feature
      for (let i = 0; i < geojson.features.length; i++) {
        const coordinates = geojson.features[i].geometry.coordinates[0];

        // Convert coordinates from UTM to LatLng
        let coordinate = coordinates.map((coord) =>
          coord.map((row) =>
            this.conveUTMToLatLngforshapefilep(
              row[1],
              row[0],
              37,
              isNorthernHemisphere
            )
          )
        );

        // Convert LatLng coordinates back to UTM
        let coordinateutm = coordinate.map((coord) =>
          coord.map((row) => this.ConveLatLngToUTM(row[1], row[0]))
        );

        // Update the geometry coordinates with the converted UTM coordinates
        geojson.features[i].geometry.coordinates[0] = coordinateutm;
      }

      // Debugging output
      console.log("Modified GeoJSON features:", geojson.features);

      const randomColor = "#490000";
      const options = {
        style: function (feature) {
          return {
            color: randomColor,
            fillColor: randomColor,
          };
        },
      };
      // Create a leaflet vector layer with the modified GeoJSON and styling options
      this.vectorLayer = L.Proj.geoJson(geojson, {
        style: { color: randomColor },
      });
    } else if (layerName === "Property_locations") {
      // Filter out features where Is_Active is false or null
      geojson.features = geojson.features.filter(
        (feature) => feature.properties.Is_Active === true
      );
      let isNorthernHemisphere: any = "N";
      console.log("ddd", geojson.features);
      for (let i = 0; i < geojson.features.length; i++) {
        const coordinates = geojson.features[i].geometry.coordinates[0];
        //
        let coordinate = coordinates.map((coord) =>
          coord.map((row) =>
            this.conveUTMToLatLngforshapefilep(
              row[1],
              row[0],
              37,
              isNorthernHemisphere
            )
          )
        );
        let coordinateutm = coordinate.map((coord) =>
          coord.map((row) => this.ConveLatLngToUTM(row[1], row[0]))
        );
        console.log("coordinatecoordinate", coordinateutm);
        geojson.features[i].geometry.coordinates[0] = coordinateutm;
      }
      const randomColor = "#ffcc41";
      const options = {
        style: function (feature) {
          return {
            color: null,
            fillColor: randomColor,
          };
        },
      };
      // Debugging output
      console.log("Modified GeoJSON featuresp:", geojson.features);
      this.vectorLayer = L.Proj.geoJson(geojson, {
        style: { color: randomColor },
      });
      // console.log("hhh", geojson)
      // (this.vectorLayer = L.Proj.geoJson(geojson, options)), {};
      // console.log(
      //   "The fetched layer is a multipolygon.",
      //   this.vectorLayer,
      //   layerName
      // );
    } else if (layerName === "Relocation") {
      const randomColor = "#ff0000";
      const options = {
        style: function (feature) {
          return {
            color: null,
          };
        },
      };

      this.vectorLayer = L.Proj.geoJson(geojson, {
        style: { color: randomColor },
      });
    } else if (layerName === "Greenary") {
      const randomColor = "#53DA0D";
      const options = {
        style: function (feature) {
          return {
            color: null,
          };
        },
      };

      this.vectorLayer = L.Proj.geoJson(geojson, {
        style: { color: randomColor },
      });
    }
    // if (pointslayer && pointslayer.geometry.type === "point") {
    else {
      //
      const defaultColor = "";
      const multiLineStringLayer = geojson.features.find(
        (feature) => feature.geometry.type === "MultiLineString"
      );
      const LineStringLayer = geojson.features.find(
        (feature) => feature.geometry.type === "LineString"
      );
      const Points = geojson.features.find(
        (feature) => feature.geometry.type === "Point"
      );

      if (
        (multiLineStringLayer &&
          multiLineStringLayer.geometry.type === "MultiLineString") ||
        (LineStringLayer && LineStringLayer.geometry.type === "LineString")
      ) {
        // console.log("gg", geojson);
        this.vectorLayer = L.Proj.geoJson(geojson, {
          style: { color: this.generateRandomColor() },
        });
        console.log("gg", this.vectorLayer, layerName);
      } else if (Points && Points.geometry.type === "Point") {
        this.newpointLayer = layerName;
        const colorMap = {}; // Map to store generated colors for each layer
        let fillColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        // let labelfill:any //default fill color
        const options = {
          style: { color: fillColor },
          pointToLayer: function (feature, latlng) {
            // Generate dynamic color for other point type layers
            //fillColor =  "#" + Math.floor(Math.random() * 16777215).toString(16);
            if (colorMap[layerName]) {
              fillColor = colorMap[layerName];
              // this.fill = colorMap[layerName];
            } else {
              // Generate a new color for the layer
              // fillColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
              colorMap[layerName] = fillColor;
            }
            return L.circleMarker(latlng, {
              radius: 5, // Set your desired radius
              fillColor: fillColor, // Set your desired fill color
              color: fillColor, // Set your desired border color
              weight: 1, // Set your desired border weight
              opacity: 1, // Set your desired opacity
              fillOpacity: 0.8, // Set your desired fill opacity
            });
          },

          // style: function (feature) {
          //   return { color: feature.properties.fillColor };
          // },
        };
        (this.vectorLayer = L.Proj.geoJson(geojson, options)), {};
      } else {
        const options = {
          style: function (feature) {
            return {
              color: null,
            };
          },
        };

        //
        this.vectorLayer = L.Proj.geoJson(geojson, {
          style: { color: this.generateRandomColor() },
        });
      }
    }
  }
  ConveLatLngToUTM(latitude: number, longitude: number): [number, number] {
    // Determine the hemisphere (northern or southern)
    const hemisphere = latitude >= 0 ? "N" : "S";

    // Calculate the UTM zone
    const zone = Math.floor((longitude + 180) / 6) + 1;

    // Convert latitude and longitude to UTM coordinates
    const utmCoords = utm.fromLatLon(latitude, longitude, 37, hemisphere);

    return [utmCoords.easting, utmCoords.northing];
  }
  generateDynamicColor() {
    // Generate a random color or use any other color generation logic
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  }

  mergePolygons() {
    if (this.drawnShapes.length >= 2) {
      const selectedPolygons = this.drawnShapes.filter((polygon) => polygon); // Filter selected polygons
      if (selectedPolygons.length >= 2) {
        const mergedCoordinates = selectedPolygons.map((polygon) => polygon); // Extract coordinates of selected polygons
        const mergedPolygon = L.polygon(mergedCoordinates, { color: "green" }); // Create a merged polygon
        this.map.addLayer(mergedPolygon); // Add the merged polygon to the map
      } else {
        console.log("You need to select at least two polygons to merge.");
      }
    } else {
      console.log("You need to draw at least two polygons to merge.");
    }
  }

  fetchstylefile(href: string, callback: (style: any) => void) {
    this.geoser.fetchStyleFile(href).subscribe((style: any) => {
      callback(style);
    });
  }

  vectorLayerOnClick(layername) {
    // console.log("kkkk",layername);

    this.vectorLayer.on("click", (event: L.LeafletEvent) => {
      const clickedLayer = event.layer;
      const clickedFeature = clickedLayer.feature;

      if (clickedFeature && clickedFeature.properties) {
        let popupContent = "<div>";
        for (const key in clickedFeature.properties) {
          if (clickedFeature.properties.hasOwnProperty(key)) {
            popupContent += `<div><strong>${key}:</strong> ${clickedFeature.properties[key]}</div>`;
          }
        }
        popupContent += "</div>";
        // Bind the customized popup content to the layer
        clickedLayer.bindPopup(popupContent).openPopup();
      }
    });
  }
  initMap(): void {
    // Conversion factor from meters to feet
    const metersToFeet = 3.28084;

    // Define the base resolution in meters per pixel
    const baseResolutionMeters = 10; // 10 meters

    // Calculate the equivalent resolution in feet per pixel
    const baseResolutionFeet = baseResolutionMeters * metersToFeet; // 32.8084 feet

    // Create an array of resolutions that match your desired scales
    const resolutions = [
      baseResolutionMeters,
      baseResolutionMeters / 2,
      baseResolutionMeters / 4,
      baseResolutionMeters / 8,
      baseResolutionMeters / 16,
      baseResolutionMeters / 32,
      baseResolutionMeters / 64,
      baseResolutionMeters / 128,
      baseResolutionMeters / 256,
      baseResolutionMeters / 512,
      // ... Add more resolutions for finer zoom levels
    ];

    // // Define your Leaflet CRS with the updated resolutions
    this.EPSG20137 = new L.Proj.CRS(
      "EPSG:20137",
      "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs +type=crs",
      {
        resolutions: resolutions,
        origin: [166600.5155002516, 375771.9736823894],
      }
    );
    // this.EPSG20137 = new L.Proj.CRS(
    //   "EPSG:20137",
    //   "+proj=utm +zone=37 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
    //   {
    //     // resolutions: [
    //     //   0.03125, 0.0625, 0.125, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0, 16.0, 32.0,
    //     //   64.0, 128.0, 256.0,
    //     // ],
    //     resolutions: resolutions,
    //     transformation: new L.Transformation(
    //       1,
    //       -20037508.342789244,
    //       -1,
    //       20037508.342789244
    //     ),
    //   }
    // );

    const mapContainer = document.getElementById("mapp");
    if (!mapContainer) {
      return;
    }

    if (this.subcity == "bole_AddisLand") {
      this.centermap = [8.967201, 38.797822];
    } else if (this.subcity == "yeka_AddisLand") {
      this.centermap = [9.060803, 38.804322];
    } else if (this.subcity == "addisk_AddisLand") {
      this.centermap = [9.051497, 38.723454];
    } else if (this.subcity == "akakyk_AddisLand") {
      this.centermap = [8.859807, 38.798065];
    } else if (this.subcity == "kolfek_AddisLand") {
      this.centermap = [8.998647, 38.691922];
    } else if (this.subcity == "kirkos_AddisLand") {
      this.centermap = [9.004158, 38.772317];
    } else if (this.subcity == "lemik_AddisLand") {
      this.centermap = [9.004772, 38.884051];
    } else if (this.subcity == "lideta_AddisLand") {
      this.centermap = [9.003426, 38.731568];
    } else if (this.subcity == "gullele_AddisLand") {
      this.centermap = [9.02497, 38.74689];
    } else if (this.subcity == "nifass_AddisLand") {
      this.centermap = [8.949258, 38.728618];
    } else if (this.subcity == "arada_AddisLand") {
      this.centermap = [9.02497, 38.74689];
    }
    this.map = L.map("mapp", {
      crs: this.EPSG20137,
      center: this.centermap,
      zoom: 1, // Set the map CRS to EPSG:20137
      maxZoom: 18,
      minZoom: 1,
    });
    var crs = this.map.options.crs;
    console.log("🚀 ~ initMap ~ crs:", crs);
    // Set an appropriate initial view for Ethiopia
    // this.map = L.map("mapp").setView([9.02497, 38.74689], 6);
    // L.tileLayer(
    //   "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    //   {
    //     attribution: "Esri World Imagery",
    //   }
    // ).addTo(this.map);
    // const orgLocation: L.LatLngExpression = [9.02497, 38.74689];
    // const zoomLevel = 22;
    // const flyToDuration = 5; // seconds
    // this.map.flyTo(orgLocation, zoomLevel, {
    //   duration: flyToDuration,
    // });
    // Define custom zoom levels
    // this.map = L.map("mapp", {
    //   center: [9.032457, 38.759775],
    //   zoom: 15, // Set an initial zoom level (1 corresponds to a 1:1 scale)
    // });

    // const googleSatelliteLayer = L.gridLayer.googleSatelliteLayer({
    //   type: "satellite", // You can change this to 'terrain' or 'hybrid' for different views
    // });
    // // Define the tile layers
    // console.log(googleSatelliteLayer);
    // Custom control for North arrow
    if (this.subcity == "bole_AddisLand") {
      this.map.flyTo([8.967201, 38.797822], 0);
    } else if (this.subcity == "yeka_AddisLand") {
      this.map.flyTo([9.060803, 38.804322], 0);
    } else if (this.subcity == "addisk_AddisLand") {
      this.map.flyTo([9.051497, 38.723454], 0);
    } else if (this.subcity == "akakyk_AddisLand") {
      this.map.flyTo([8.859807, 38.798065], 0);
    } else if (this.subcity == "kolfek_AddisLand") {
      this.map.flyTo([8.998647, 38.691922], 0);
    } else if (this.subcity == "kirkos_AddisLand") {
      this.map.flyTo([9.004158, 38.772317], 0);
    } else if (this.subcity == "lemik_AddisLand") {
      this.map.flyTo([9.004772, 38.884051], 0);
    } else if (this.subcity == "lideta_AddisLand") {
      this.map.flyTo([9.003426, 38.731568], 0);
    } else if (this.subcity == "gullele_AddisLand") {
      this.map.flyTo([9.02497, 38.74689], 0);
    } else if (this.subcity == "nifass_AddisLand") {
      this.map.flyTo([8.949258, 38.728618], 0);
    }

    let pluginOptions = {
      cropImageByInnerWH: true, // crop blank opacity from image borders
      hidden: false, // hide screen icon
      preventDownload: false, // prevent download on button click
      domtoimageOptions: {}, // see options for dom-to-image
      position: "topleft", // position of take screen icon
      screenName: "screen", // string or function
      iconUrl: "http://land.xokait.com.et/images/camera.svg", // screen btn icon base64 or url
      hideElementsWithSelectors: [".leaflet-control-container"], // by default hide map controls All els must be child of _map._container
      mimeType: "image/png", // used if format == image,
      caption: null, // string or function, added caption to bottom of screen
      captionFontSize: 15,
      captionFont: "Arial",
      captionColor: "black",
      captionBgColor: "white",
      captionOffset: 5,
      // callback for manually edit map if have warn: "May be map size very big on that zoom level, we have error"
      // and screenshot not created
      onPixelDataFail: async function ({
        node,
        plugin,
        error,
        mapPane,
        domtoimageOptions,
      }) {
        // Solutions:
        // decrease size of map
        // or decrease zoom level
        // or remove elements with big distanses
        // and after that return image in Promise - plugin._getPixelDataOfNormalMap
        return plugin._getPixelDataOfNormalMap(domtoimageOptions);
      },
    };
    this.simpleMapScreenshoter = L.simpleMapScreenshoter(pluginOptions).addTo(
      this.map
    );

    var northArrowControl = L.Control.extend({
      options: {
        position: "topright",
      },

      onAdd: function (map) {
        // Create a container for the control
        var container = L.DomUtil.create("div", "north-arrow-control");

        // Add HTML content for the North arrow
        container.innerHTML =
          '<img src="http://ct.addisland.gov.et/datepicker/img/northarow.png" alt="North Arrow">';

        // Set up a click event on the container to rotate the map to north
        container.onclick = function () {
          map.setBearing(0); // You may need to use map.setRotationAngle(0) or other methods based on the Leaflet version and plugins you're using
        };

        return container;
      },
    });

    // Add the North arrow control to the map

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
      }
    );
    const noneLayer = L.tileLayer("", { attribution: "" });
    // Create an object to hold the tile layers
    const baseLayers = {
      "Google Maps": osmLayer,
      None: noneLayer,
    };
    // Create a layers control with checkboxes
    const layersControl = L.control.layers(baseLayers).addTo(this.map);
    // Add an event listener to handle the removal of all layers when "None" is selected
    this.map.addControl(new northArrowControl());
    // Create a map event listener to track mouse movements
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.map.on("mousemove", (event) => {
      const latLng = event.latlng;
      const lat = latLng.lat;
      const lng = latLng.lng;
      const UTMvalue = this.conveLatLngToUTM(lat, lng);
      const subtract_northing = 207.34388375;
      const subtract_easting = 95.4782061405;
      // Update the coordinate information element with the current latitude and longitude
      document.getElementById(
        "coordinateInfo"
      ).innerHTML = `Latitude: ${lat.toFixed(
        6
      )}&nbsp;&nbsp; Longitude: ${lng.toFixed(6)}<br> Easting: ${(
        UTMvalue.easting - subtract_easting
      ).toFixed(4)} &nbsp;&nbsp; Northing: ${(
        UTMvalue.northing - subtract_northing
      ).toFixed(4)} `;
    });
    // this.map.addControl(this.drawControl);
    L.control.scale().addTo(this.map);
    this.map.addLayer(this.editableLayers);
    const options = {
      position: "topleft" as L.ControlPosition, // Correctly specify the ControlPosition type
      draw: {
        polygon: {
          allowIntersection: false, // Prevent shapes from intersecting
          drawError: {
            color: "#e1e100", // Error color
            message: "<strong>Oh snap!<strong> you can't do that", // Error message
          },
        },
        polyline: {
          metric: true, // Use metric measurement system
        },
        // Add other shape options here
      },
      edit: {
        featureGroup: this.editableLayers, // Specify the feature group to edit
        remove: true, // Enable the remove/edit tool
      },
    };
    // const drawControl = new L.Control.Draw(options);
    // this.map.addControl(drawControl);
    const optionss = {
      draw: {
        polyline: true,
        polygon: true,
        rectangle: true,
        marker: true,
        // Exclude circle
        circle: false,
      },
      edit: {
        featureGroup: this.editableLayers, // Specify the feature group to edit
        remove: true, // Enable the remove/edit tool
      },
      // Add other options as needed
    };

    this.drawControll = new L.Control.Draw(optionss);
    this.map.addControl(this.drawControll);

    this.map.on("draw:created", (e) => {
      console.log("Shape created:", e, this.ServiceService.check);
      const layer = e.layer;
      this.ondrawingshape = true;
      if (!this.ServiceService.check) {
        console.log("Shape created:alllatlong", this.alllatlongPlot);
        if (this.alllatlongPlot.length === 0) {
          const toast = this.notificationsService.warn(
            "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡"
          );
          return;
        }
        let allVertices = [];
        // Iterate over each array in alllatlongPlot to extract the vertices of each polygon
        this.alllatlongPlot.forEach((array) => {
          console.log("🚀 ~ this.alllatlongPlot.forEach ~ array:", array);
          let vertices = array.map((coord) => {
            return L.latLng(coord.lat, coord.lng);
          });
          allVertices = allVertices.concat(vertices);
          console.log(
            "🚀 ~ this.alllatlongPlot.forEach ~ allVertices:",
            allVertices
          );
        });

        // Create a Leaflet polygon (limitedAreaBounds) using the array of vertices collected from all polygons
        this.limitedAreaBounds = L.polygon(allVertices);

        if (layer instanceof L.Polygon) {
          if (this.limitedAreaBounds.getBounds().contains(layer.getBounds())) {
            this.map.addLayer(layer);

            this.coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the polygon
            this.coordinates = this.coordinates.map((coord) => {
              return {
                lat: coord.lat - 0.001876,
                lng: coord.lng - 0.0008668,
              };
            });
            this.ServiceService.coordinateForwgs84 = this.mapToPolygonFormat(
              this.coordinates
            );
            console.log(
              "🚀 ~ file: gis-map.component.ts:1630 ~ this.map.on ~ tempcord:",
              this.ServiceService.coordinateForwgs84
            );
            console.log(this.coordinates);
            // Convert each L.LatLng object to [x, y] point
            //this.convertLatLngToUTM(this.coordinates)

            // Assuming you already have the 'points' array from the previous code
            const utmCoordinates = this.convertCoordinatesToUTM(
              this.coordinates
            );
            utmCoordinates.push(utmCoordinates[0]);
            this.utmCoordinates = utmCoordinates;
            let isNorthernHemisphere: any = "N";
            const utmToCoor = this.utmCoordinates.map((row) =>
              this.conveUTMToLatLngWrite(
                row.northing,
                row.easting,
                37,
                isNorthernHemisphere
              )
            );
            console.log(
              "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
              utmToCoor
            );

            const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
            //this.utmCoordinates = utmCoordinateslast;
            console.log(
              "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
              this.utmCoordinates
            );

            console.log(utmCoordinates);
            // Convert each L.LatLng object to [x, y] point
            // Assuming this.coordinates is an array of L.LatLng objects
            // Convert each L.LatLng object to [x, y] point

            const geojson = layer.toGeoJSON();

            // Create a layer with the transformed GeoJSON
            this.drawnShape = L.Proj.geoJson(geojson);
            console.log(this.drawnShape);

            // Add the transformed GeoJSON layer to the map

            this.drawnShape.addTo(this.map);
            //this.utmCoordinates.push(this.utmCoordinates[0]);
            //points.push(points[0])
            this.sample = this.drawnShape;
            console.log("utmCoordinates", utmCoordinates);
            // Add the coordinates to the array
            //this.drawnShapes.push(this.coordinates);

            // Do something with the coordinates, such as displaying or processing them
            this.editableLayers.addLayer(layer);
            let convertedUtmgeozone = this.convertCoordinateszone(
              this.utmCoordinates
            );
            convertedUtmgeozone.push(convertedUtmgeozone[0]);
            this.allcoordenatezone.push(convertedUtmgeozone);
            this.ServiceService.coordinate = this.allcoordenatezone;
            console.log(
              "🚀 ~ file: gis-map.component.ts:2104 ~ editedLayers.eachLayer ~ coordinate:",
              this.ServiceService.coordinate
            );
            this.utmCoordinatesforallexcel = this.utmCoordinates;
            // this.ServiceService.coordinateForwgs84 =
            //  this.ServiceService.shapes = this.aaa.push(this.drawnShape);
            // Transform GeoJSON to EPSG:20137 CRS
          } else {
            const toast = this.notificationsService.warn(
              "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡"
            );

            this.map.removeLayer(layer);
            this.editableLayers.removeLayer(layer);
            this.removeShape();
            this.ServiceService.disablebutton = false;
            return;
          }
        } else if (layer instanceof L.Circle) {
          // Get the center LatLng of the circle
          const centerLatLng = layer.getLatLng();
          const coordinatesArray = [
            { lat: centerLatLng.lat, lng: centerLatLng.lng },
          ];
          console.log(coordinatesArray);

          // Get the radius of the circle in meters
          const radiusMeters = layer.getRadius();

          // Calculate the LatLng coordinates of the circle
          const circleLatLngs = this.calculateCircleCoordinates(
            centerLatLng,
            radiusMeters
          );
          this.ServiceService.iscircleLatLngs = radiusMeters;

          const limitedAreaBoundss = L.latLngBounds(this.alllatlong[0][0]);

          if (limitedAreaBoundss.contains(centerLatLng)) {
            console.log("Circle LatLngs:", circleLatLngs);
            const utmCoordinates = this.convertCoordinatesToUTM(circleLatLngs);
            this.utmCoordinates = utmCoordinates;

            let isNorthernHemisphere: any = "N";
            const utmToCoor = this.utmCoordinates.map((row) =>
              this.conveUTMToLatLngWrite(
                row.northing,
                row.easting,
                37,
                isNorthernHemisphere
              )
            );
            console.log(
              "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
              utmToCoor
            );

            const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
            this.utmCoordinates = utmCoordinateslast;
            console.log(
              "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
              this.utmCoordinates
            );
            console.log(utmCoordinates);
            // Convert each L.LatLng object to [x, y] point
            // Assuming this.coordinates is an array of L.LatLng objects
            // Convert each L.LatLng object to [x, y] point

            this.drawnShape = L.polygon(circleLatLngs, {
              color: "blue",
            });

            console.log(this.drawnShape);

            // Add the transformed GeoJSON layer to the map

            this.drawnShape.addTo(this.map);
            this.utmCoordinates.push(this.utmCoordinates[0]);
            //points.push(points[0])
            this.sample = this.drawnShape;
            this.ServiceService.centerLatLng =
              this.convertCoordinatesToUTM(coordinatesArray);
            console.log(
              "centerLatLng",
              this.ServiceService.centerLatLng,
              this.ServiceService.iscircleLatLngs
            );

            let eachcoored: any = this.convertCoordinatesToUTM(
              this.coordinates
            );
            eachcoored.push(eachcoored[0]);
            eachcoored = this.convertArray(eachcoored);
            this.ServiceService.coordinate.push(eachcoored);

            console.log(
              "this.ServiceService.coordinate",
              this.ServiceService.coordinate
            );

            // Now you can use circleLatLngs as needed
          } else {
            const toast = this.notificationsService.warn(
              "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡"
            );

            this.map.removeLayer(layer);
            //this.editableLayers.removeLayer(layer);
            this.removeShape();
            this.ServiceService.disablebutton = false;
          }
        } else {
          this.coordinates = layer.getLatLngs(); // Get the coordinates of the polygon

          this.drawnShape = L.polyline(this.coordinates, {
            color: "blue",
          }).addTo(this.map);
          this.drawnShape.addTo(this.map);
          console.log(this.coordinates);

          const utmCoordinates = this.convertCoordinatesToUTM(this.coordinates);
          this.utmCoordinates = utmCoordinates;
          let isNorthernHemisphere: any = "N";
          const utmToCoor = this.utmCoordinates.map((row) =>
            this.conveUTMToLatLngWrite(
              row.northing,
              row.easting,
              37,
              isNorthernHemisphere
            )
          );
          console.log(
            "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
            utmToCoor
          );

          const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
          this.utmCoordinates = utmCoordinateslast;
          console.log(
            "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
            this.utmCoordinates
          );

          this.utmCoordinates.push(this.utmCoordinates[0]);

          this.sample = this.drawnShape;
          console.log("utmCoordinates", utmCoordinates);

          this.ServiceService.coordinate = this.utmCoordinates;

          //this.drawnShape.bindPopup("This is a polyline!");
        }
      } else {
        if (layer instanceof L.Polygon) {
          this.coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the polygon
          console.log("🚀 ~ this.map.on ~ coordinates:befor", this.coordinates);
          this.coordinates = this.coordinates.map((coord) => {
            return {
              lat: coord.lat - 0.001876,
              lng: coord.lng - 0.0008668,
            };
          });
          console.log("🚀 ~ this.map.on ~ coordinates:after", this.coordinates);
          this.ServiceService.coordinateForwgs84 = this.mapToPolygonFormat(
            this.coordinates
          );

          // Assuming you already have the 'points' array from the previous code
          const utmCoordinates = this.convertCoordinatesToUTM(this.coordinates);
          utmCoordinates.push(utmCoordinates[0]);
          this.utmCoordinates = utmCoordinates;

          console.log(
            "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
            this.ServiceService.allLicenceData.Parcel_ID
          );

          if (
            this.ServiceService.allLicenceData.Parcel_ID == null &&
            this.ServiceService.allLicenceData.Plot_Merge_1 == null &&
            this.ServiceService.allLicenceData.Plot_Merge_2 == null &&
            this.ServiceService.allLicenceData.Plot_Merge_3 == null &&
            this.ServiceService.allLicenceData.Plot_Merge_4 == null
          ) {
            console.log(
              "🚀 ~ file: gis-map.component.ts:1691 ~ this.map.on ~ ServiceService:",
              this.ServiceService.allLicenceData
            );

            this.checktheshapeexistans(this.coordinates);
          }

          console.log("utmCoordinatescreate", utmCoordinates);
          const geojson = layer.toGeoJSON();

          // Create a layer with the transformed GeoJSON
          this.drawnShape = L.Proj.geoJson(geojson);
          console.log(this.drawnShape);

          // Add the transformed GeoJSON layer to the map

          this.sample = this.drawnShape;
          console.log("utmCoordinates", this.utmCoordinates);
          // Add the coordinates to the array
          //this.drawnShapes.push(this.coordinates);

          // Do something with the coordinates, such as displaying or processing them

          // let eachcoored: any = this.convertCoordinatesToUTM(this.coordinates);
          // eachcoored.push(eachcoored[0]);
          // eachcoored = this.convertArray(eachcoored);
          // this.allcoordenatezone.push(eachcoored);
          // this.ServiceService.coordinate = this.allcoordenatezone;
          let convertedUtmgeozone = this.convertCoordinateszone(
            this.utmCoordinates
          );
          convertedUtmgeozone.push(convertedUtmgeozone[0]);
          this.allcoordenatezone.push(convertedUtmgeozone);
          this.ServiceService.coordinate = this.allcoordenatezone;
          console.log(
            "this.ServiceService.coordinateeeeeeee",
            this.ServiceService.coordinate
          );

          this.utmCoordinatesforallexcel = utmCoordinates;
          const subtract_northing = 207.34388375;
          const subtract_easting = 95.4782061405;

          this.utmCoordinatesforallexcel = this.utmCoordinatesforallexcel.map(
            (item) => {
              item.northing += subtract_northing;
              item.easting += subtract_easting;
              return item; // Return the modified item
            }
          );
          const area = this.calculateUTMPolygonArea(utmCoordinates);
          this.ServiceService.Totalarea = parseInt(area.toFixed(2));

          this.ServiceService.setCookies(area);
          // Show the area in a popup
          // if (this.ServiceService.isfreeholdselected) {
          //   localStorage.setItem(
          //     "PolygonAreanameFrehold",
          //     "" + area.toFixed(2)
          //   );
          // } else {
          //   localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
          // }
          console.log(
            "Totalarea",
            area,
            this.ServiceService.Totalarea,
            environment.Totalareatolerance,
            this.ServiceService.totalsizeformerage,
            this.ServiceService.Service_ID
          );
          const maxAreaDifference =
            environment.Totalareatolerance * this.ServiceService.Totalarea;

          const areaDifference = Math.abs(
            this.ServiceService.totalsizeformerage -
              this.ServiceService.Totalarea
          );
          console.log("Totalareatolerance", areaDifference, maxAreaDifference);
          const popupContent = `Area: ${area.toFixed(
            2
          )} square meters, Tolerance:${maxAreaDifference} square meters `;
          layer.bindPopup(popupContent).openPopup();

          if (
            areaDifference >= maxAreaDifference &&
            this.ServiceService.totalsizeformerage != 0 &&
            this.ServiceService.Service_ID ==
              "793B8814-F845-429E-A472-DC47E797D3FE".toLocaleLowerCase()
          ) {
            const warningMessage =
              "በካርታው ላይ የሚሳሉት ቅርፅ አካባቢው ከሊዝ መያዣ ጋር እኩል መሆን አለበት/the shape you draw on map  the area must be equal to Lease hold";
            const toastWarning = this.notificationsService.warn(
              "Warning",
              warningMessage + popupContent
            );
            this.map.removeLayer(layer);
            //this.editableLayers.removeLayer(layer);
            this.removeShape();
            this.ServiceService.areaVerified = false;
          } else {
            this.ServiceService.areaVerified = true;

            //this.onDatumChange();
            console.log(utmCoordinates);
            // Convert each L.LatLng object to [x, y] point
            // Assuming this.coordinates is an array of L.LatLng objects
            // Convert each L.LatLng object to [x, y] point

            const geojson = layer.toGeoJSON();

            // Create a layer with the transformed GeoJSON
            this.drawnShape = L.Proj.geoJson(geojson);
            console.log(this.drawnShape);

            this.sample = this.drawnShape;
            console.log("utmCoordinates", this.utmCoordinates);

            const area = this.calculateUTMPolygonArea(utmCoordinates);
            this.ServiceService.Totalarea = parseInt(area.toFixed(2));
            //this.ServiceService.coordinate = this.utmCoordinates;
            this.utmCoordinatesforallexcel = this.utmCoordinates;

            this.editableLayers.addLayer(this.drawnShape);
          }
        } else if (layer instanceof L.Circle) {
          // Get the center LatLng of the circle
          const centerLatLng = layer.getLatLng();
          const coordinatesArray = [
            { lat: centerLatLng.lat, lng: centerLatLng.lng },
          ];
          // Get the radius of the circle in meters
          const radiusMeters = layer.getRadius();

          // Calculate the LatLng coordinates of the circle
          const circleLatLngs = this.calculateCircleCoordinates(
            centerLatLng,
            radiusMeters
          );
          this.ServiceService.centerLatLng =
            this.convertCoordinatesToUTM(coordinatesArray);
          this.ServiceService.iscircleLatLngs = radiusMeters;

          console.log("Circle LatLngs:", circleLatLngs);
          const utmCoordinates = this.convertCoordinatesToUTM(circleLatLngs);
          this.utmCoordinates = utmCoordinates;
          let isNorthernHemisphere: any = "N";
          const utmToCoor = this.utmCoordinates.map((row) =>
            this.conveUTMToLatLngWrite(
              row.northing,
              row.easting,
              37,
              isNorthernHemisphere
            )
          );
          console.log(
            "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
            utmToCoor
          );

          const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
          //this.utmCoordinates = utmCoordinateslast;
          console.log(
            "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
            this.utmCoordinates
          );
          const area = this.calculateUTMPolygonArea(utmCoordinates);
          this.ServiceService.Totalarea = parseInt(area.toFixed(2));
          this.ServiceService.setCookies(area);
          // if (this.ServiceService.isfreeholdselected) {
          //   localStorage.setItem(
          //     "PolygonAreanameFrehold",
          //     "" + area.toFixed(2)
          //   );
          // } else {
          //   localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
          // }
          console.log("Totalarea", area, utmCoordinates);
          const maxAreaDifference =
            environment.Totalareatolerance * this.ServiceService.Totalarea;
          const areaDifference = Math.abs(
            this.ServiceService.totalsizeformerage -
              this.ServiceService.Totalarea
          );
          console.log("Totalareatolerance", areaDifference, maxAreaDifference);
          const popupContent = `Area: ${area.toFixed(
            2
          )} square meters, Tolerance:${maxAreaDifference} square meters `;
          layer.bindPopup(popupContent).openPopup();
          if (
            areaDifference >= maxAreaDifference &&
            this.ServiceService.totalsizeformerage != 0 &&
            this.ServiceService.Service_ID ==
              "793B8814-F845-429E-A472-DC47E797D3FE".toLocaleLowerCase()
          ) {
            const warningMessage =
              "በካርታው ላይ የሚሳሉት ቅርፅ አካባቢው ከሊዝ መያዣ ጋር እኩል መሆን አለበት/the shape you draw on map  the area must be equal to Lease hold";
            const toastWarning = this.notificationsService.warn(
              "Warning",
              warningMessage + popupContent
            );
            this.ServiceService.areaVerified = false;
          } else {
            this.ServiceService.areaVerified = true;

            console.log(utmCoordinates);
            // Convert each L.LatLng object to [x, y] point
            // Assuming this.coordinates is an array of L.LatLng objects
            // Convert each L.LatLng object to [x, y] point

            this.drawnShape = L.polygon(circleLatLngs, {
              color: "blue",
            });

            console.log(
              "centerLatLng",
              this.ServiceService.centerLatLng,
              this.ServiceService.iscircleLatLngs
            );
            console.log(this.drawnShape);

            // Add the transformed GeoJSON layer to the map

            this.drawnShape.addTo(this.map);
            this.utmCoordinates.push(this.utmCoordinates[0]);
            //points.push(points[0])
            this.sample = this.drawnShape;
            console.log("utmCoordinates", utmCoordinates);
            // Add the coordinates to the array
            //this.drawnShapes.push(this.coordinates);

            // Do something with the coordinates, such as displaying or processing them
            //this.editableLayers.addLayer(layer);
            let convertedUtmgeozone = this.convertCoordinateszone(
              this.utmCoordinates
            );
            convertedUtmgeozone.push(convertedUtmgeozone[0]);
            this.allcoordenatezone.push(convertedUtmgeozone);
            this.ServiceService.coordinate = this.allcoordenatezone;
            console.log(
              "🚀 ~ file: gis-map.component.ts:2104 ~ editedLayers.eachLayer ~ coordinate:",
              this.ServiceService.coordinate
            );
          }
          // Now you can use circleLatLngs as needed
        } else if (layer instanceof L.Polyline) {
          this.coordinates = layer.getLatLngs(); // Get the coordinates of the polygon

          this.drawnShape = L.polyline(this.coordinates, {
            color: "blue",
          }).addTo(this.map);
          this.drawnShape.addTo(this.map);
          console.log(this.coordinates);

          const utmCoordinates = this.convertCoordinatesToUTM(this.coordinates);

          this.utmCoordinates = utmCoordinates;
          let isNorthernHemisphere: any = "N";
          const utmToCoor = this.utmCoordinates.map((row) =>
            this.conveUTMToLatLngWrite(
              row.northing,
              row.easting,
              37,
              isNorthernHemisphere
            )
          );
          console.log(
            "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
            utmToCoor
          );

          const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
          this.utmCoordinates = utmCoordinateslast;
          console.log(
            "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
            this.utmCoordinates
          );
          console.log(utmCoordinates);

          // const geojson = layer.toGeoJSON();

          // this.drawnShape = L.Proj.geoJson(geojson);
          // console.log(this.drawnShape);

          this.drawnShape.addTo(this.map);
          //this.utmCoordinates.push(this.utmCoordinates[0]);

          this.sample = this.drawnShape;
          // console.log("utmCoordinates", utmCoordinates);

          let convertedUtmgeozone = this.convertCoordinateszone(
            this.utmCoordinates
          );
          convertedUtmgeozone.push(convertedUtmgeozone[0]);
          this.allcoordenatezone.push(convertedUtmgeozone);
          this.ServiceService.coordinate = this.allcoordenatezone;
          console.log(
            "🚀 ~ file: gis-map.component.ts:2104 ~ editedLayers.eachLayer ~ coordinate:",
            this.ServiceService.coordinate
          );
          this.utmCoordinatesforallexcel = this.utmCoordinates;
          //polyline.bindPopup("This is a polyline!");
        }
      }
    });

    // Event handler for when a shape is edited
    this.map.on("draw:edited", (e) => {
      console.log("Shape editmoveend:", e);
      const editedLayers: any = e.layers;

      editedLayers.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          let coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the edited polygon
          // this.ServiceService.coordinateForwgs84 = this.mapToPolygonFormat(
          //   this.coordinates
          // );
          coordinates = coordinates.map((coord) => {
            return {
              lat: coord.lat - 0.001876,
              lng: coord.lng - 0.0008668,
            };
          });
          console.log(
            "🚀 ~ file: gis-map.component.ts:1630 ~ this.map.on ~ tempcord:",
            this.ServiceService.coordinateForwgs84
          );
          // Assuming you have a function to convert coordinates to UTM
          const utmCoordinates = this.convertCoordinatesToUTM(coordinates);
          this.utmCoordinates = utmCoordinates;
          console.log("UTM Coordinates:", utmCoordinates);
          let isNorthernHemisphere: any = "N";
          const utmToCoor = this.utmCoordinates.map((row) =>
            this.conveUTMToLatLngWrite(
              row.northing,
              row.easting,
              37,
              isNorthernHemisphere
            )
          );
          console.log(
            "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
            utmToCoor
          );

          const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
          this.utmCoordinates = utmCoordinateslast;
          console.log(
            "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
            this.utmCoordinates
          );
          const area = this.calculateUTMPolygonArea(this.utmCoordinates);
          this.ServiceService.setCookies(area);
          // if (this.ServiceService.isfreeholdselected) {
          //   localStorage.setItem(
          //     "PolygonAreanameFrehold",
          //     "" + area.toFixed(2)
          //   );
          // } else {
          //   localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
          // }
          // Show the area in a popup
          console.log("Totalarea", area, utmCoordinates);
          this.ServiceService.Totalarea = parseInt(area.toFixed(2));
          if (this.ServiceService.check) {
            const maxAreaDifference = 0.05 * this.ServiceService.Totalarea;
            const areaDifference = Math.abs(
              this.ServiceService.Totalarea - area
            );
            console.log(
              "Totalareatolerance",
              areaDifference,
              maxAreaDifference
            );
            const popupContent = `Area: ${area.toFixed(
              2
            )} square meters, Tolerance:${maxAreaDifference} square meters `;
            layer.bindPopup(popupContent).openPopup();

            if (areaDifference >= maxAreaDifference) {
              const warningMessage =
                "በካርታው ላይ የሚሳሉት ቅርፅ አካባቢው ከሊዝ መያዣ ጋር እኩል መሆን አለበት/the shape you draw on map  the area must be equal to Lease hold";
              const toastWarning = this.notificationsService.warn(
                "Warning",
                warningMessage + popupContent
              );
              this.ServiceService.areaVerified = false;
            } else {
              this.ServiceService.areaVerified = true;
              //this.utmCoordinates.push(this.utmCoordinates[0]);
              // Convert the edited polygon to GeoJSON
              const geojson = layer.toGeoJSON();

              // Create a layer with the transformed GeoJSON
              const drawnShape = L.Proj.geoJson(geojson);

              // Add the transformed GeoJSON layer to the map
              drawnShape.addTo(this.map);
              // this.editableLayers.addLayer(this.drawnShape);
              // Do something with the coordinates, such as displaying or processing them
              // For example, you can set them in a service or perform other actions
              let convertedUtmgeozone = this.convertCoordinateszone(
                this.utmCoordinates
              );
              convertedUtmgeozone.push(convertedUtmgeozone[0]);
              this.allcoordenatezone.push(convertedUtmgeozone);
              this.ServiceService.coordinate = this.allcoordenatezone;
              console.log(
                "🚀 ~ file: gis-map.component.ts:2104 ~ editedLayers.eachLayer ~ coordinate:",
                this.ServiceService.coordinate
              );

              //console.log("utmCoordinates", utmCoordinates);
              // this.ServiceService.shapes.push(drawnShape);

              // Transform GeoJSON to EPSG:20137 CRS if needed
            }
          } else {
            let coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the edited polygon
            coordinates = coordinates.map((coord) => {
              return {
                lat: coord.lat - 0.001876,
                lng: coord.lng - 0.0008668,
              };
            });
            // Assuming you have a function to convert coordinates to UTM
            const utmCoordinates = this.convertCoordinatesToUTM(coordinates);
            this.utmCoordinates = utmCoordinates;
            let isNorthernHemisphere: any = "N";
            const utmToCoor = this.utmCoordinates.map((row) =>
              this.conveUTMToLatLngWrite(
                row.northing,
                row.easting,
                37,
                isNorthernHemisphere
              )
            );
            console.log(
              "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
              utmToCoor
            );

            const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
            this.utmCoordinates = utmCoordinateslast;
            console.log(
              "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
              this.utmCoordinates
            );
            this.utmCoordinates.push(this.utmCoordinates[0]);
            // Convert the edited polygon to GeoJSON
            const geojson = layer.toGeoJSON();

            // Create a layer with the transformed GeoJSON
            const drawnShape = L.Proj.geoJson(geojson);

            // Add the transformed GeoJSON layer to the map
            drawnShape.addTo(this.map);
            console.log("utmCoordinates", utmCoordinates);
            // this.editableLayers.addLayer(this.drawnShape);
            // Do something with the coordinates, such as displaying or processing them
            // For example, you can set them in a service or perform other actions
            let convertedUtmgeozone = this.convertCoordinateszone(
              this.utmCoordinates
            );
            convertedUtmgeozone.push(convertedUtmgeozone[0]);
            this.allcoordenatezone.push(convertedUtmgeozone);
            this.ServiceService.coordinate = this.allcoordenatezone;
            console.log(
              "🚀 ~ file: gis-map.component.ts:2104 ~ editedLayers.eachLayer ~ coordinate:",
              this.ServiceService.coordinate
            );
            // this.ServiceService.shapes.push(drawnShape);

            // Transform GeoJSON to EPSG:20137 CRS if needed
          }
        }
      });
    });
    this.map.on("draw:deleted", function (e) {
      console.log("🚀 ~ e:draw:deleted", e);
    });
  }
  convertCoordinateszone(data: any[]): any[] {
    return data.map((item) => {
      const northing = item.northing;
      const easting = item.easting;
      const hemisphere = item.hemisphere;
      const zone = item.zone || "37"; // default to "37" if zone is not provided

      return [northing, easting, hemisphere, zone];
    });
  }
  mapToPolygonFormat(coordinates: { lat: number; lng: number }[]): string {
    const sortedCoordinates = this.sortCoordinatesCounterClockwise(coordinates);

    // Map the sorted coordinates to the desired format
    const polygonString = `POLYGON((${sortedCoordinates
      .map((coord) => `${coord.lat} ${coord.lng}`)
      .join(", ")}, ${sortedCoordinates[0].lat} ${sortedCoordinates[0].lng}))`;

    return polygonString;
  }

  sortCoordinatesCounterClockwise(
    coordinates: { lat: number; lng: number }[]
  ): { lat: number; lng: number }[] {
    // Calculate the centroid of the coordinates
    const centroid = coordinates.reduce(
      (acc, coord) => ({ lat: acc.lat + coord.lat, lng: acc.lng + coord.lng }),
      { lat: 0, lng: 0 }
    );
    centroid.lat /= coordinates.length;
    centroid.lng /= coordinates.length;

    // Sort coordinates based on polar angle from the centroid
    const sortedCoordinates = coordinates.sort((a, b) => {
      const angleA = Math.atan2(a.lng - centroid.lng, a.lat - centroid.lat);
      const angleB = Math.atan2(b.lng - centroid.lng, b.lat - centroid.lat);
      return angleA - angleB;
    });

    return sortedCoordinates;
  }
  calculateCircleCoordinates(center, radius) {
    const points = [];
    const radiusKilometers = radius / 1000; // Convert meters to kilometers
    const segments = 64; // You can adjust this for the number of points

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * 2 * Math.PI;
      const x =
        center.lat +
        (radiusKilometers * Math.cos(angle)) /
          (111.32 * Math.cos(center.lat * (Math.PI / 180)));
      const y =
        center.lng +
        (radiusKilometers * Math.sin(angle)) /
          (111.32 * Math.cos(center.lat * (Math.PI / 180)));

      points.push(L.latLng(x, y));
    }

    // Close the circle by adding the first point at the end
    points.push(points[0]);

    return points;
  }

  addMarkerToMap(lat: number, lng: number): void {
    const marker = L.marker([lat, lng]);
    this.markerLayer.addLayer(marker);
  }
  removeLayerFromMap(): void {
    if (this.map && this.markerLayer) {
      this.map.removeLayer(this.markerLayer);
      this.markerLayer.clearLayers(); // Clear all markers from the layer
    }
  }

  convertCoordinatesToUTM(
    coordinates: { lat: number; lng: number }[]
  ): { northing: number; easting: number; zone: number; hemisphere: string }[] {
    const utmCoordinates: {
      northing: number;
      easting: number;
      zone: number;
      hemisphere: string;
    }[] = [];
    console.log(coordinates);

    coordinates.forEach((coord) => {
      const { lat, lng } = coord;
      const utmPoint = this.conveLatLngToUTM(lat, lng);
      utmCoordinates.push(utmPoint);
    });
    return utmCoordinates;
  }
  convertCoordinatesToUTMforAddpoint(
    coordinates: { lat: number; lng: number }[]
  ): { northing: number; easting: number; zone: number; hemisphere: string }[] {
    const utmCoordinates: {
      northing: number;
      easting: number;
      zone: number;
      hemisphere: string;
    }[] = [];
    console.log(coordinates);

    coordinates.forEach((coord) => {
      const { lat, lng } = coord;
      const utmPoint = this.conveLatLngToUTM(lat, lng);
      utmCoordinates.push(utmPoint);
    });
    return utmCoordinates;
  }

  toggleLayer(visibility: boolean, layerName: string) {
    console.log("layerName", layerName);

    const layer = this.layers.find((l) => l.name === layerName);
    //;
    if (layer && layer.vectorLayer) {
      if (visibility) {
        console.log("vectorlayer", layer.vectorLayer);

        this.map.addLayer(layer.tileLayer);
        this.map.addLayer(layer.vectorLayer);
        //this.onDatumChange();
      } else {
        console.log("vectorlayer", layer.vectorLayer);
        this.map.removeLayer(layer.tileLayer);
        this.map.removeLayer(layer.vectorLayer);
      }
    } else if (layer && layer.tileLayer) {
      if (visibility) {
        console.log("tilelayer", layer.tileLayer);
        this.map.addLayer(layer.tileLayer);
        //this.onDatumChange();
      } else {
        console.log("tilelayer", layer.tileLayer);
        this.map.removeLayer(layer.tileLayer);
      }
    }
  }
  convertToLatLng(
    latitudeDegrees: number,
    latitudeMinutes: number,
    latitudeSeconds: number,
    longitudeDegrees: number,
    longitudeMinutes: number,
    longitudeSeconds: number
  ): L.LatLng {
    const latitude =
      latitudeDegrees + latitudeMinutes / 60 + latitudeSeconds / 3600;
    const longitude =
      longitudeDegrees + longitudeMinutes / 60 + longitudeSeconds / 3600;
    return L.latLng(latitude, longitude);
  }
  drawShape(): void {
    if (this.latitude < 100000 || 1000000 <= this.latitude) {
      const toast = this.notificationsService.warn(
        "easting out of range (must be between 100 000 m and 999 999 m)"
      );
      return;
    }
    if (this.longitude < 0 || this.longitude > 10000000) {
      const toast = this.notificationsService.warn(
        "northing out of range (must be between 0 m and 10 000 000 m)"
      );
      return;
    }
    // Get the latitude and longitude values entered by the user
    if (
      this.selectedDatum === "Adindan / UTM zone 36N" ||
      this.selectedDatum === "WGS 1984 UTM Zone 36" ||
      this.selectedDatum === "WGS 1984 UTM Zone 37" ||
      this.selectedDatum === "WGS 1984 UTM Zone 38" ||
      this.selectedDatum === "Adindan / UTM zone 37N" ||
      this.selectedDatum === "Adindan / UTM zone 38N"
    ) {
      // const latLng = this.convertToLatLng(this.latitudeDegrees, this.latitudeMinutes, this.latitudeSeconds,
      //                          this.longitudeDegrees, this.longitudeMinutes, this.longitudeSeconds)
      console.log(this.longitude, this.latitude);
      let isNorthernHemisphere: any = "P";
      let zone = 37;
      const latLng = this.conveUTMToLatLngWriteadd(
        this.longitude,
        this.latitude,
        zone,
        isNorthernHemisphere
      );

      this.pinpointedPoints.push(latLng);
      console.log("pinpointedPoints", this.pinpointedPoints);
      if (this.pinpointedPoints.length > 0) {
        this.ispointadd = true;
        let count = (this.numberOFaddpoint = 1 + this.numberOFaddpoint);
      }
      // Remove the previously drawn shape, if any
      if (this.drawnShape) {
        this.map.removeLayer(this.drawnShape);
      }
      //this.addMarkerToMap(latLng.lat, latLng.lng);
      const myIcon = L.divIcon({
        className: "my-custom-icon",
        html: `<div class="my-icon-label">${this.lastCharacter}</div>`,
      });
      const latLngs = L.latLng(latLng.lat, latLng.lng); // Replace with your desired coordinates
      const marker = L.marker(latLngs, { icon: myIcon });
      marker.addTo(this.map);
      this.lastCharacter = String.fromCharCode(
        this.lastCharacter.charCodeAt(0) + 1
      );
      if (this.drawnShape instanceof L.Marker) {
        this.map.flyTo(this.drawnShape.getLatLng(), 6, {
          duration: 5,
        });
        this.map.fitBounds(this.drawnShape.getBounds());
      } else if (
        this.drawnShape instanceof L.Circle ||
        this.drawnShape instanceof L.Polygon
      ) {
        this.drawnShape.addTo(this.map);
        this.map.fitBounds(this.drawnShape.getBounds());
      }
      this.longitude = null;
      this.latitude = null;
    } else {
      const latLng = this.convertToLatLng(
        this.latitudeDegrees,
        this.latitudeMinutes,
        this.latitudeSeconds,
        this.longitudeDegrees,
        this.longitudeMinutes,
        this.longitudeSeconds
      );
      //const latLng = L.latLng(this.latitude, this.longitude);

      this.pinpointedPoints.push(latLng);
      console.log("pinpointedPoints", this.pinpointedPoints);

      // Remove the previously drawn shape, if any
      if (this.drawnShape) {
        this.map.removeLayer(this.drawnShape);
        this.removeLayerFromMap();
      }
      const myIcon = L.divIcon({
        className: "my-custom-icon",
        html: `<div class="my-icon-label">${this.lastCharacter}</div>`,
      });
      const latLngs = L.latLng(latLng.lat, latLng.lng); // Replace with your desired coordinates
      const marker = L.marker(latLngs, { icon: myIcon });
      marker.addTo(this.map);
      this.lastCharacter = String.fromCharCode(
        this.lastCharacter.charCodeAt(0) + 1
      );
      if (this.drawnShape instanceof L.Marker) {
        this.map.flyTo(this.drawnShape.getLatLng(), 13, {
          duration: 5,
        });
        this.map.fitBounds(this.drawnShape.getBounds());
      } else if (
        this.drawnShape instanceof L.Circle ||
        this.drawnShape instanceof L.Polygon
      ) {
        this.drawnShape.addTo(this.map);
        this.map.fitBounds(this.drawnShape.getBounds());
      }
    }
  }

  drawPolygon() {
    console.log("pinpointedpoints", this.pinpointedPoints);
    const firstPointUTM = this.pinpointedPoints[0].lat; // Assuming UTM value is at index 0
    console.log("🚀 ~ sparetedshape.forEach ~ firstPointUTM:", firstPointUTM);
    const lastPointUTM =
      this.pinpointedPoints[this.pinpointedPoints.length - 1].lat; // Assuming UTM value is at index 0
    if (firstPointUTM !== lastPointUTM) {
      const toast = this.notificationsService.warn(
        "The first and last point UTM values are not the same. Import aborted/የመጀመሪያው እና የመጨረሻው የዩቲኤም(የምስራቅ እና የሰሜን) ነጥቦች አንድ አይነት አይደሉም።"
      );
      return;
    }
    this.coordinates = this.pinpointedPoints;
    //this.coordinates.push(this.coordinates[0]);
    console.log(
      "🚀 ~ file: gis-map.component.ts:2417 ~ drawPolygon ~ coordinates:",
      this.coordinates
    );
    this.drawnShape = L.polygon(this.pinpointedPoints).addTo(this.map);

    let utmCoordinates = this.convertCoordinatesToUTM(this.pinpointedPoints);
    const subtract_northing = 207.34388375;
    const subtract_easting = 95.4782061405;

    utmCoordinates = utmCoordinates.map((item) => {
      item.northing -= subtract_northing;
      item.easting -= subtract_easting;
      return item; // Return the modified item
    });
    this.utmCoordinatesforallexcel = utmCoordinates;

    const area = this.calculateUTMPolygonArea(utmCoordinates);
    this.ServiceService.Totalarea = parseInt(area.toFixed(2));
    // Show the area in a popup
    this.ServiceService.setCookies(area);
    // if (this.ServiceService.isfreeholdselected) {
    //   localStorage.setItem("PolygonAreanameFrehold", "" + area.toFixed(2));
    // } else {
    //   localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
    // }

    this.utmCoordinates = utmCoordinates;
    //utmCoordinates.push(utmCoordinates[0]);
    let convertedUtmgeozone = this.convertCoordinateszone(this.utmCoordinates);
    //convertedUtmgeozone.push(convertedUtmgeozone[0]);
    this.allcoordenatezone.push(convertedUtmgeozone);
    this.ServiceService.coordinate = this.allcoordenatezone;
    console.log(
      "🚀 ~ drawPolygon ~ coordinate:",
      this.ServiceService.coordinate
    );

    //console.log(utmCoordinates);

    if (
      this.ServiceService.allLicenceData.Parcel_ID == null &&
      this.ServiceService.allLicenceData.Plot_Merge_1 == null &&
      this.ServiceService.allLicenceData.Plot_Merge_2 == null &&
      this.ServiceService.allLicenceData.Plot_Merge_3 == null &&
      this.ServiceService.allLicenceData.Plot_Merge_4 == null
    ) {
      console.log(
        "🚀 ~ file: gis-map.component.ts:1691 ~ this.map.on ~ ServiceService:",
        this.ServiceService.allLicenceData
      );

      this.checktheshapeexistans(this.coordinates);
    }
    //   this.pinpointedPoints.push(this.pinpointedPoints[0])
    //  this.ServiceService.coordinate=this.pinpointedPoints
    if (this.drawnShape instanceof L.Marker) {
      this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
    } else if (
      this.drawnShape instanceof L.Circle ||
      this.drawnShape instanceof L.Polygon
    ) {
      this.drawnShape.addTo(this.map);
      const drawnShapeBounds = this.drawnShape.getBounds();
      const center = drawnShapeBounds.getCenter();

      //this.addCenterMarker(center);
      // marker.addTo(this.map);

      this.map.fitBounds(this.drawnShape.getBounds());
      this.onDatumChange();
      // this.setviewFromDatumchange(center);
      // Specify the zoom level
      const zoomLevel = 6; // Adjust this to your desired zoom level

      // Specify the duration of the flyTo animation in seconds
      const flyToDuration = 5; // 2 seconds

      // Use the flyTo method to animate the map
      this.map.flyTo(center, zoomLevel, {
        duration: flyToDuration,
      });
    }
  }

  removeShape(): void {
    this.ispointadd = false;
    this.numberOFaddpoint = 0;
    this.fileInput.nativeElement.value = "";
    this.map.removeLayer(this.sample);
    this.map.removeLayer(this.drawnShape);
    this.removeLayerFromMap();
  }

  // importShapes(event: any): void {
  //   const file: File = event.target.files[0];
  //   const fileReader: FileReader = new FileReader();
  //   fileReader.onload = (e: any) => {
  //     const arrayBuffer: ArrayBuffer = e.target.result;
  //     const data: Uint8Array = new Uint8Array(arrayBuffer);
  //     const workbook: XLSX.WorkBook = XLSX.read(data, { type: "array" });
  //     const sheetName: string = workbook.SheetNames[0];
  //     const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  //     const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
  //       header: 1,
  //     });
  //     console.log("jsonData", jsonData);

  //     // Process the imported shapes and add them to the map
  //     this.fromexcel = true;
  //     this.processImportedShapesXLSX(jsonData);
  //   };
  //   fileReader.readAsArrayBuffer(file);
  // }
  // importShapes(event: any): void {
  //   const file: File = event.target.files[0];
  //   const fileReader: FileReader = new FileReader();
  //   fileReader.onload = (e: any) => {
  //     const csvData: string = e.target.result;

  //     // Split CSV data into rows
  //     const rows: string[] = csvData.split("\n");

  //     // Parse each row into an array of values, removing spaces and new lines
  //     const jsonData: any[] = rows
  //       .map((row) => row.replace(/\s+/g, "").split(","))
  //       .filter(
  //         (row) => row.length > 0 && row.some((value) => value.trim() !== "")
  //       ); // Filter out empty or all-empty arrays

  //     console.log("jsonData", jsonData);

  //     // Process the imported shapes and add them to the map
  //     this.fromexcel = true;
  //     console.log("🚀 ~ importShapes ~ fromexcel:", jsonData);
  //     this.processImportedShapesXLSX(jsonData);
  //   };
  //   fileReader.readAsText(file);
  // }
  importShapes(event: any): void {
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const csvData: string = e.target.result;

      // Split CSV data into shapes (separated by blank lines)
      const shapes: string[] = csvData.split("\n\n");
      console.log("🚀 ~ importShapes ~ shapes:", shapes);

      // Initialize array to store shapes
      const allShapes: any[] = [];

      // Process each shape separately
      let currentShape: any[] = [];
      shapes.forEach((shapeData: string) => {
        // Split shape data into rows
        const rows: string[] = shapeData.split("\n");

        // Process each row into an array of values, removing spaces and new lines
        const jsonData: any[] = rows
          .map((row) => row.replace(/\s+/g, "").split(","))
          .filter(
            (row) => row.length > 0 && row.some((value) => value.trim() !== "")
          ); // Filter out empty or all-empty arrays

        // Check if the first row starts with expected header fields
        if (
          jsonData.length > 0 &&
          jsonData[0].join("") === "northingeastinghemispherezone"
        ) {
          // Start a new shape
          if (currentShape.length > 0) {
            // Push the previous shape to the array
            allShapes.push(currentShape);
          }
          // Initialize a new shape array
          currentShape = [];
        }

        // Push current shape data to the array
        currentShape.push(...jsonData);
      });

      // Push the last shape to the array
      if (currentShape.length > 0) {
        allShapes.push(currentShape);
      }
      let sparetedshape = this.filterCoordinates(allShapes);
      console.log("🚀 ~ importShapes ~ sparetedshape:", sparetedshape);
      if (!this.ServiceService.check) {
        if (sparetedshape.length == 1) {
          sparetedshape.forEach((jsonData) => {
            this.fromexcel = true;
            console.log("🚀 ~ importShapes ~ fromexcel:", jsonData);
            const firstPointUTM = jsonData[1][0]; // Assuming UTM value is at index 0
            console.log(
              "🚀 ~ sparetedshape.forEach ~ firstPointUTM:",
              firstPointUTM
            );
            const lastPointUTM = jsonData[jsonData.length - 1][0]; // Assuming UTM value is at index 0
            console.log(
              "🚀 ~ sparetedshape.forEach ~ lastPointUTM:",
              lastPointUTM
            );
            if (firstPointUTM !== lastPointUTM) {
              const toast = this.notificationsService.warn(
                "The first and last point UTM values are not the same. Import aborted/የመጀመሪያው እና የመጨረሻው የዩቲኤም(የምስራቅ እና የሰሜን) ነጥቦች አንድ አይነት አይደሉም።"
              );
              return;
            } else {
              this.processImportedShapesXLSX(jsonData);
            }
          });
        } else if (sparetedshape.length > 1) {
          // Process all shapes and add them to the map
          sparetedshape.forEach((jsonData) => {
            this.fromexcel = true;
            console.log("🚀 ~ importShapes ~ fromexcel:", jsonData);
            const firstPointUTM = jsonData[1][0]; // Assuming UTM value is at index 0
            console.log(
              "🚀 ~ sparetedshape.forEach ~ firstPointUTM:",
              firstPointUTM
            );
            const lastPointUTM = jsonData[jsonData.length - 1][0]; // Assuming UTM value is at index 0
            console.log(
              "🚀 ~ sparetedshape.forEach ~ lastPointUTM:",
              lastPointUTM
            );

            if (firstPointUTM !== lastPointUTM) {
              const toast = this.notificationsService.warn(
                "The first and last point UTM values are not the same. Import aborted/የመጀመሪያው እና የመጨረሻው የዩቲኤም(የምስራቅ እና የሰሜን) ነጥቦች አንድ አይነት አይደሉም።"
              );
              return;
            } else {
              this.processImportedShapesXLSXmulti(jsonData);
            }
          });
        }
      } else {
        if (sparetedshape.length == 1) {
          sparetedshape.forEach((jsonData) => {
            this.fromexcel = true;
            console.log("🚀 ~ importShapes ~ fromexcel:", jsonData);
            console.log("🚀 ~ importShapes ~ fromexcel:", jsonData);
            const firstPointUTM = jsonData[1][0]; // Assuming UTM value is at index 0
            console.log(
              "🚀 ~ sparetedshape.forEach ~ firstPointUTM:",
              firstPointUTM
            );
            const lastPointUTM = jsonData[jsonData.length - 1][0]; // Assuming UTM value is at index 0
            console.log(
              "🚀 ~ sparetedshape.forEach ~ lastPointUTM:",
              lastPointUTM
            );
            if (firstPointUTM !== lastPointUTM) {
              const toast = this.notificationsService.warn(
                "The first and last point UTM values are not the same. Import aborted/የመጀመሪያው እና የመጨረሻው የዩቲኤም(የምስራቅ እና የሰሜን) ነጥቦች አንድ አይነት አይደሉም።"
              );
              return;
            } else {
              this.processImportedShapesXLSX(jsonData);
            }
          });
        } else {
          const toast = this.notificationsService.warn(
            "more than one plot location shape  import from csv is not allowed/ከአንድ በላይ የመሬት አቀማመጥ ቅርፅ ከ csv ማስመጣት አይፈቀድም።"
          );
          return;
        }
      }
    };
    fileReader.readAsText(file);
  }
  filterCoordinates(input: any[][]): any[][][] {
    const output: any[][][] = [];
    let currentGroup: any[][] = [];

    for (const row of input[0]) {
      //console.log("🚀 ~ filterCoordinates ~ input:", input);
      if (
        row[0] === "northing" &&
        row[1] === "easting" &&
        row[2] === "hemisphere" &&
        row[3] === "zone"
      ) {
        // Start a new group
        currentGroup = [row];
        output.push(currentGroup);
      } else {
        // Add row to current group
        currentGroup.push(row);
      }
    }

    return output;
  }
  async addShapefileToMap(event: any) {
    console.log(event.target.files[0]);

    try {
      const geoJsonAll = await this.geoser.readAndConvertShapefiles(
        event.target.files[0]
      );
      L.geoJSON(geoJsonAll).addTo(this.map);
    } catch (error) {
      console.error("Error adding shapefile to map:", error);
    }
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    this.extractShapefileFromZip(event.target.files[0] as ArrayBuffer);
  }

  async extractShapefileFromZip(zipData: ArrayBuffer): Promise<void> {
    const zip = new JSZip();

    try {
      const zipContent = await zip.loadAsync(zipData);

      let shpEntry = null;
      let shxEntry = null;
      let dbfEntry = null;

      // Iterate through entries and manually filter based on file extensions
      zipContent.forEach((relativePath, file) => {
        if (relativePath.endsWith(".shp")) {
          shpEntry = file;
        } else if (relativePath.endsWith(".shx")) {
          shxEntry = file;
        } else if (relativePath.endsWith(".dbf")) {
          dbfEntry = file;
        }
      });
      console.log(shpEntry);
      console.log(dbfEntry);

      if (shpEntry && shxEntry && dbfEntry) {
        const shpBuffer = await shpEntry.async("arraybuffer");
        const shxBuffer = await shxEntry.async("arraybuffer");
        const dbfBuffer = await dbfEntry.async("arraybuffer");

        const shpReader = shp.parseShp(shpBuffer);
        // const shxReader = shp.parseShx(shxBuffer);
        const dbfReader = shp.parseDbf(dbfBuffer);
        // const geoJSONData = shp.combine([
        //   shp.parseShp(shpBuffer),
        //   shp.parseDbf(dbfBuffer),
        // ]);

        const geoJSONData = shp.combine([shpReader, dbfReader]);
        let isNorthernHemisphere: any = "N";
        console.log(geoJSONData);
        if (geoJSONData && geoJSONData.features) {
          // Convert UTM coordinates to LatLng
          // Iterate through the GeoJSON features and add them to the map
          geoJSONData.features.forEach((feature) => {
            if (feature.geometry && feature.geometry.coordinates) {
              // Convert UTM coordinates to LatLng
              feature.geometry.coordinates = feature.geometry.coordinates.map(
                (coord) =>
                  coord.map((row) =>
                    this.conveUTMToLatLngforshapefile(
                      row[1],
                      row[0],
                      37,
                      isNorthernHemisphere
                    )
                  )
              );

              // Create a Leaflet layer for the feature and add it to the map
              const layer = L.geoJSON(feature);

              // Check if the feature has properties (attributes)
              if (feature.properties) {
                // Create a popup with the properties
                layer.on("click", (event: L.LeafletEvent) => {
                  const clickedLayer = event.layer;
                  const clickedFeature = clickedLayer.feature;

                  if (clickedFeature && clickedFeature.properties) {
                    let popupContent = "<div>";
                    for (const key in clickedFeature.properties) {
                      if (clickedFeature.properties.hasOwnProperty(key)) {
                        popupContent += `<div><strong>${key}:</strong> ${clickedFeature.properties[key]}</div>`;
                      }
                    }
                    popupContent += "</div>";

                    // Bind the customized popup content to the layer
                    clickedLayer.bindPopup(popupContent).openPopup();
                  }
                });
              }

              layer.addTo(this.map);
            }
          });

          const firstFeature = geoJSONData.features[0];
          console.log("firstFeature", firstFeature);

          if (
            firstFeature &&
            firstFeature.geometry &&
            firstFeature.geometry.coordinates
          ) {
            const coordinates = firstFeature.geometry.coordinates[0]; // Assuming it's a Polygon

            // Calculate the center of the shape
            const center = this.calculateCenter(coordinates);

            // Use the center for the map flyTo
            this.animateMap(center);
          }

          console.log(geoJSONData);
          // Add the converted GeoJSON data to the map
          // L.geoJSON(geoJSONData).addTo(this.map);
        } else {
          const toast = this.notificationsService.warn("Invalid GeoJSON data.");
        }
      } else {
        const toast = this.notificationsService.warn(
          "Missing one or more required files in the zip archive."
        );
      }
    } catch (error) {
      const toast = this.notificationsService.warn(
        "Error while extracting files from the zip:",
        error
      );
    }
  }
  animateMap(center: [number, number]): void {
    const zoomLevel = 6; // Adjust this to your desired zoom level
    const flyToDuration = 5; // Specify the duration of the flyTo animation in seconds

    if (this.map) {
      this.map.flyTo(center, zoomLevel, {
        duration: flyToDuration, // Convert to milliseconds
      });
    }
  }
  // Calculate the center of a set of coordinates
  calculateCenter(coordinates: [number, number][]): [number, number] {
    let sumLat = 0;
    let sumLng = 0;
    for (const coord of coordinates) {
      sumLat += coord[1];
      sumLng += coord[0];
    }

    const numCoords = coordinates.length;
    const centerLat = sumLat / numCoords;
    const centerLng = sumLng / numCoords;

    return [centerLat, centerLng];
  }

  public processcoordinates(data: any[]): void {
    //this.alllatlong = [];
    // Remove the header row from the data
    const coordinates = data.slice(1);
    console.log("coordinatesforpropert", coordinates);

    console.log(
      "🚀 ~ processcoordinatesForPlot ~ ServiceService:",
      this.ServiceService.coordinate
    );
    const combinedData = [];

    const latLngs = coordinates.map((row) =>
      this.conveUTMToLatLngWrite(row[0], row[1], row[3], row[2])
    );
    const shapeProperties = coordinates.map((row) => row.pop());
    combinedData.push(latLngs);

    const uniqueJobMatchIDs = {};
    const uniqueData = shapeProperties.filter((item) => {
      if (!uniqueJobMatchIDs[item.property_ID]) {
        uniqueJobMatchIDs[item.property_ID] = true;
        return true;
      }
      return false;
    });

    combinedData.push(uniqueData);
    console.log("🚀 ~ processcoordinates ~ combinedData:", combinedData);

    // Check if there is any shape property with plot_ID
    this.alllatlong.push(combinedData);
    console.log("🚀 ~ processcoordinates ~ alllatlong:", this.alllatlong);
    const hasPlotID = shapeProperties.some((item) => item.ploteId);
    console.log(
      "🚀 ~ processcoordinates ~ shapeProperties:",
      shapeProperties,
      hasPlotID
    );

    if (hasPlotID) {
      this.alllatlongPlot.push(latLngs);
      console.log(
        "🚀 ~ processcoordinates ~ alllatlongPlot:",
        this.alllatlongPlot
      );
    } else {
      let eachcoorde = coordinates;
      const subtract_northing = 207.34388375;
      const subtract_easting = 95.4782061405;
      for (let i = 0; i < eachcoorde.length; i++) {
        eachcoorde[i][0] -= subtract_northing;
        eachcoorde[i][1] -= subtract_easting; // Corrected subtraction
      }
      eachcoorde.push(eachcoorde[0]);
      this.ServiceService.coordinate.push(eachcoorde);
      console.log(
        "🚀 ~ processcoordinates ~ allmultiplshape:",
        this.ServiceService.coordinate
      );
      this.map.removeControl(this.drawControll);
    }
  }

  public processcoordinatesForPlot(data: any[]): void {
    // Remove the header row from the data
    const coordinates = data.slice(1);
    console.log("coordinates after", coordinates);

    // Map the data to LatLng objects and their associated shape properties

    const combinedData = [];
    const latLngs = coordinates.map((row) =>
      this.conveUTMToLatLngWrite(row[0], row[1], row[3], row[2])
    );
    const shapeProperties = coordinates.map((row) => row.pop());
    combinedData.push(latLngs);

    const uniqueJobMatchIDs = {};
    const uniqueData = shapeProperties.filter((item) => {
      if (!uniqueJobMatchIDs[item.plot_ID]) {
        uniqueJobMatchIDs[item.plot_ID] = true;
        return true;
      }
      return false;
    });
    combinedData.push(uniqueData);

    // Now, combinedData contains the latLng and shapeProperties in each object

    console.log("shapeProperties", combinedData);

    this.alllatlong.push(combinedData);
    let eachcoorde = coordinates;
    const subtract_northing = 207.34388375;
    const subtract_easting = 95.4782061405;
    for (let i = 0; i < eachcoorde.length; i++) {
      eachcoorde[i][0] -= subtract_northing;
      eachcoorde[i][1] -= subtract_easting; // Corrected subtraction
    }
    eachcoorde.push(eachcoorde[0]);
    this.ServiceService.coordinate.push(eachcoorde);
    console.log(
      "🚀 ~ processcoordinatesForPlot ~ ServiceService:",
      this.ServiceService.coordinate
    );
  }

  public drawnshapeAfterProcess() {
    console.log("this.alllatlong", this.alllatlong);

    this.alllatlong.forEach((shape) => {
      let latslng = shape[0];
      let dataofproperty = shape[1][0];

      console.log("shapeProperties", latslng);

      const randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      const polygonOptionss = {
        color: randomColor,
      };

      const polygonOptions = {
        weight: 3,
        dashArray: "5, 10",
        lineCap: "square",
        color: "blue",
      };
      console.log("polygonOptions", polygonOptions);

      let slectedpro =
        dataofproperty.property_ID == this.ServiceService.selectedproperty
          ? polygonOptions
          : polygonOptionss;

      this.drawnShape = L.polygon(latslng, slectedpro).addTo(this.map);
      this.drawnShape
        .bindPopup(
          dataofproperty.ploteId == undefined
            ? dataofproperty.property_ID
            : dataofproperty.ploteId
        )
        .openPopup();
      // this.arrayFoPolygonarea.push(this.calculatePolygonArea(L.polygon(shape)));
      // console.log("this.alllatlong", this.arrayFoPolygonarea);
      if (
        dataofproperty.ploteId == undefined ||
        (dataofproperty.ploteId != null &&
          dataofproperty.property_ID == this.ServiceService.selectedproperty)
      ) {
        this.editableLayers.addLayer(this.drawnShape);
        const utmCoordinates = this.convertCoordinatesToUTM(latslng);
        this.ServiceService.coordinateForwgs84 =
          this.mapToPolygonFormat(latslng);
        utmCoordinates.push(utmCoordinates[0]);
        console.log(
          "🚀 ~ this.alllatlong.forEach ~ utmCoordinates:",
          utmCoordinates
        );
        //this.ServiceService.coordinate = utmCoordinates;
        console.log(utmCoordinates);
      }
    });
    this.mapLoaded.emit(true);
    if (this.drawnShape instanceof L.Marker) {
      //this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
    } else if (
      this.drawnShape instanceof L.Circle ||
      this.drawnShape instanceof L.Polygon
    ) {
      // this.map.fitBounds(this.drawnShape.getBounds(),{ maxZoom:15 });
      const drawnShapeBounds = this.drawnShape.getBounds();
      console.log("center", drawnShapeBounds);

      const center = drawnShapeBounds.getCenter();
      console.log("center", center);

      this.map.fitBounds(this.drawnShape.getBounds());
      this.onDatumChange();
      // this.setviewFromDatumchange(center);
      // Specify the zoom level
      const zoomLevel = 6; // Adjust this to your desired zoom level

      // Specify the duration of the flyTo animation in seconds
      const flyToDuration = 5; // 2 seconds

      // Use the flyTo method to animate the map
      this.map.flyTo(center, zoomLevel, {
        duration: flyToDuration,
      });
      // this.map.setView(center, 15);
    }
  }
  public drawnshapeAfterProcessForplot() {
    console.log("this.alllatlong", this.alllatlong);

    this.alllatlong.forEach((shape) => {
      let latslng = shape[0];
      let dataofproperty = shape[1][0];

      console.log("shapeProperties", latslng);

      const randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      const polygonOptionss = {
        color: randomColor,
      };

      const polygonOptions = {
        weight: 3,
        dashArray: "5, 10",
        lineCap: "square",
        color: "blue",
      };
      console.log("polygonOptions", polygonOptions);

      let slectedpro =
        dataofproperty.ploteId == this.ServiceService.selectedplotid
          ? polygonOptions
          : polygonOptionss;
      this.drawnShape = L.polygon(latslng, slectedpro).addTo(this.map);
      this.drawnShape
        .bindPopup(
          dataofproperty.ploteId == undefined
            ? dataofproperty.ploteId
            : dataofproperty.ploteId
        )
        .openPopup();
      this.editableLayers.addLayer(this.drawnShape);
      // this.arrayFoPolygonarea.push(this.calculatePolygonArea(L.polygon(shape)));
      // console.log("this.alllatlong", this.arrayFoPolygonarea);
      // if (
      //   dataofproperty.ploteId == undefined ||
      //   (dataofproperty.ploteId != null &&
      //     dataofproperty.ploteId == this.ServiceService.selectedplotid)
      // ) {
      //   this.editableLayers.addLayer(this.drawnShape);
      //   const utmCoordinates = this.convertCoordinatesToUTM(latslng);
      //   utmCoordinates.push(utmCoordinates[0]);
      //   this.utmCoordinatesforallexcel = this.convertCoordinatesToUTM(latslng);
      //   const subtract_northing = 207.34388375;
      //   const subtract_easting = 95.4782061405;

      //   this.ServiceService.coordinateForwgs84 =
      //     this.mapToPolygonFormat(latslng);
      // //  this.ServiceService.coordinate = utmCoordinates;
      //   // for (let i = 0; i < this.ServiceService.coordinate.length; i++) {
      //   //   this.ServiceService.coordinate[i].northing -= subtract_northing;
      //   //   this.ServiceService.coordinate[i].easting -= subtract_easting; // Corrected subtraction
      //   let eachcoored: any = this.convertCoordinatesToUTM(latslng);
      //   eachcoored = this.convertArray(eachcoored);
      //   this.ServiceService.coordinate.push(eachcoored);
      //   console.log(
      //     "🚀 ~ this.alllatlong.forEach ~ utmCoordinates:curent",
      //     this.ServiceService.coordinate
      //   );
      //   // }
      // } else {
      //   this.editableLayers.addLayer(this.drawnShape);
      //   const utmCoordinates = this.convertCoordinatesToUTM(latslng);
      //   this.ServiceService.coordinateForwgs84 =
      //     this.mapToPolygonFormat(latslng);
      //   utmCoordinates.push(utmCoordinates[0]);
      //   this.ServiceService.coordinate = utmCoordinates;
      //   this.utmCoordinatesforallexcel = utmCoordinates;
      //   console.log(
      //     "🚀 ~ this.alllatlong.forEach ~ utmCoordinates:",
      //     utmCoordinates
      //   );
      // }
    });
    if (this.drawnShape instanceof L.Marker) {
      //this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
    } else if (
      this.drawnShape instanceof L.Circle ||
      this.drawnShape instanceof L.Polygon
    ) {
      // this.map.fitBounds(this.drawnShape.getBounds(),{ maxZoom:15 });
      const drawnShapeBounds = this.drawnShape.getBounds();
      console.log("center", drawnShapeBounds);

      const center = drawnShapeBounds.getCenter();
      console.log("center", center);

      this.map.fitBounds(this.drawnShape.getBounds());
      this.onDatumChange();
      // this.setviewFromDatumchange(center);
      // Specify the zoom level
      const zoomLevel = 6; // Adjust this to your desired zoom level

      // Specify the duration of the flyTo animation in seconds
      const flyToDuration = 5; // 2 seconds

      // Use the flyTo method to animate the map
      this.map.flyTo(center, zoomLevel, {
        duration: flyToDuration,
      });
      // this.map.setView(center, 15);
    }
  }

  calculateUTMPolygonArea(utmPoints) {
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

    return parseFloat(Math.abs(area).toFixed(2)); // Round to 2 decimal places and convert back to number
  }

  calculatePolygonArea(vertices) {
    const EarthRadiusMeters = 6371000; // Radius of the Earth in meters
    let area = 0;
    const result = [];
    // Convert degrees to radians
    function degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    // Calculate the area using the formula
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length]; // Wrap around for the last point

      const lat1 = degreesToRadians(p1.lat);
      const lat2 = degreesToRadians(p2.lat);
      const lon1 = degreesToRadians(p1.lng);
      const lon2 = degreesToRadians(p2.lng);

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      area += EarthRadiusMeters * EarthRadiusMeters * c;
      console.log("Totalarea", c, a);
    }
    console.log("Totalarea", area);

    result.push({
      Name: "shape",
      area: Math.abs(area / 2),
      mesurment: "M2",
    });
    return result;
  }
  checkvalidetion() {
    const toast = this.notificationsService.warn(
      "the drawing or imported shape of plot location already exists on map you so can only update/የቦታው ሥዕል ወይም ከውጪ የመጣ ቅርጽ አስቀድሞ በካርታው ላይ ስላለ ማዘመን ብቻ ይችላሉ።"
    );
  }
  public checktheshapeexistans(latLngss) {
    console.log(
      "🚀 ~ file: gis-map.component.ts:2821 ~ checktheshapeexistans ~ latLngss:",
      latLngss
    );
    let filtertheshape = this.findShapeFromGeoJSON(
      this.plot_locations_gejon,
      latLngss
    );
    if (this.nodes) {
      let selectednode = this.findNode(this.nodes[0], "Plot_Locations");
      console.log(
        "🚀 ~ file: gis-map.component.ts:2813 ~ shape.forEach ~ findAradaImageMNode:",
        this.plot_locations_gejon
      );

      this.toggleLayer_Checked(selectednode);
    }
    const zoomLevel = 5; // Adjust this to your desired zoom level

    // Specify the duration of the flyTo animation in seconds
    const flyToDuration = 5; // 2 seconds
    this.map.flyTo(latLngss[0], zoomLevel, {
      duration: flyToDuration,
    });
    console.log(
      "🚀 ~ file: gis-map.component.ts:2800 ~ processImportedShapes ~ filtertheshape:",
      filtertheshape
    );
    if (filtertheshape != null) {
      this.arrayproporty = Object.assign([], filtertheshape.properties);
      console.log(
        "🚀 ~ file: gis-map.component.ts:2836 ~ processImportedShapes ~ arrayproporty:",
        this.arrayproporty
      );
      this.ServiceService.isconfirmsave = true;
      this.message =
        `the plot location you import already exists so you can only update the exists record if it agree click yes` +
        this.arrayproporty.Plot_Ids;
      //this.updateplote(filtertheshape);
    }
  }
  public processImportedShapes(data: any[]): void {
    // Event handler for when a shape is drawn

    console.log("dataaaa", data);
    // Remove the header row from the data
    const coordinates = data.slice(1);
    console.log("coordinates", coordinates);
    this.utmCoordinates = coordinates;

    const latLngs = coordinates.map((row) =>
      this.conveUTMToLatLngWrite(row[0], row[1], row[3], row[2])
    );
    const latLngss = coordinates.map((row) =>
      this.conveUTMToLatLng(row[0], row[1], row[3], row[2])
    );

    // Map the data to LatLng objects

    console.log("latLngs", latLngs);
    if (!this.ServiceService.check) {
      this.alllatlong = [];
      this.alllatlong.push(latLngs);
    } else {
      this.alllatlong.push(latLngs);
    }
    if (this.fromexcel === true && this.alllatlong.length == 1) {
      if (
        this.ServiceService.allLicenceData.Parcel_ID == null &&
        this.ServiceService.allLicenceData.Plot_Merge_1 == null &&
        this.ServiceService.allLicenceData.Plot_Merge_2 == null &&
        this.ServiceService.allLicenceData.Plot_Merge_3 == null &&
        this.ServiceService.allLicenceData.Plot_Merge_4 == null
      ) {
        console.log(
          "🚀 ~ file: gis-map.component.ts:1691 ~ this.map.on ~ ServiceService:",
          this.ServiceService.allLicenceData
        );

        this.checktheshapeexistans(latLngss);
      }
    }
    const utmCoordinates = this.convertCoordinatesToUTM(latLngs);
    this.ServiceService.coordinateForwgs84 = this.mapToPolygonFormat(latLngs);
    utmCoordinates.push(utmCoordinates[0]);
    this.ServiceService.coordinate = utmCoordinates;
    console.log(utmCoordinates);

    // Remove the previously drawn shape, if any
    if (this.drawnShape) {
      this.map.removeLayer(this.drawnShape);
    }

    console.log("alllatlong", this.alllatlong);

    this.alllatlong.forEach((shape, index) => {
      let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

      this.drawnShape = L.polygon(shape, { color: randomColor }).addTo(
        this.map
      );

      this.editableLayers.addLayer(this.drawnShape);
      if (shape.length < 26) {
        shape.forEach((point, pointIndex) => {
          const markerLatLng = L.latLng(point); // Create a LatLng object for the point
          // Add a marker with a character label to the polygon
          this.addMarkerWithCharacter(
            this.drawnShape,
            markerLatLng,
            String.fromCharCode(65 + pointIndex)
          );
        });
      }
    });

    //this.ServiceService.coordinate.push(latLngs[0])
    console.log("alllatlong", latLngs);

    //this.ServiceService.coordinate=latLngs
    // Fit the map view to the drawn shape
    if (this.drawnShape instanceof L.Marker) {
      this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
    } else if (
      this.drawnShape instanceof L.Circle ||
      this.drawnShape instanceof L.Polygon
    ) {
      // this.map.fitBounds(this.drawnShape.getBounds(),{ maxZoom:15 });
      const drawnShapeBounds = this.drawnShape.getBounds();

      const customIcon = new L.Icon({
        iconUrl: environment.iconpath, // Replace with the actual path to your icon image
        iconSize: [50, 50], // Adjust the size as needed
        iconAnchor: [25, 50], // Adjust the anchor point if necessary
        popupAnchor: [0, -50], // Adjust the popup anchor if needed
        className: "custom-icon-class", // You can also add a custom CSS class
      });
      // Calculate the center of the bounds
      const center = drawnShapeBounds.getCenter();
      var marker = new L.Marker(center, {
        icon: customIcon,
      });
      //this.addCenterMarker(center);
      // marker.addTo(this.map);

      this.map.fitBounds(this.drawnShape.getBounds());
      this.onDatumChange();
      // this.setviewFromDatumchange(center);
      // Specify the zoom level

      const zoomLevel = 3; // Adjust this to your desired zoom level

      // Specify the duration of the flyTo animation in seconds
      const flyToDuration = 5; // 2 seconds

      // Use the flyTo method to animate the map
      this.map.flyTo(center, zoomLevel, {
        duration: flyToDuration,
      });

      // this.map.setView(center, 15);
      if (this.ServiceService.check != true) {
        this.map.on(L.Draw.Event.CREATED, (e: any) => {
          const layer = e.layer;
          console.log("alllatlong", this.alllatlong[0]);

          // Assuming limited area bounds as a polygon
          const limitedAreaBounds = L.polygon(this.alllatlong[0][0]).addTo(
            this.map
          );

          // Check if the drawn shape intersects with the limited area bounds
          if (limitedAreaBounds.getBounds().contains(layer.getBounds())) {
            this.map.addLayer(layer);
            this.ServiceService.disablebutton = true;
          } else {
            const toast = this.messageService.add({
              severity: "warn",
              summary: "Warn",
              detail:
                "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡",
            });
            this.map.removeLayer(layer);
            this.removeShape();
            this.ServiceService.disablebutton = false;
          }
        });
      }
      // Set the map view to the calculated center and zoom level
      // Fit the bounds with the new maxZoom level

      this.aaa.push(this.drawnShape);
      // this.onDatumChange()
      this.ServiceService.shapes = this.aaa;
      this.sample = this.drawnShape;
    }
  }
  public processImportedShapesXLSX(data: any[]): void {
    // Event handler for when a shape is drawn
    this.alllatlong = [];
    console.log("dataaaa", data);
    // Remove the header row from the data
    const coordinates = data.slice(1);
    let coordinatecuurent = coordinates;
    this.ServiceService.coordinate.push(coordinatecuurent);
    console.log("coordinates", this.ServiceService.coordinate);
    this.utmCoordinates = coordinates;

    const latLngs = coordinates.map((row) => {
      console.log(row[0], row[1], row[3], row[2]);
      if (row[0] !== undefined) {
        return this.conveUTMToLatLngWritexlsx(row[0], row[1], row[3], row[2]);
      }
    });

    const latLngss = coordinates.map((row) =>
      this.conveUTMToLatLng(row[0], row[1], row[3], row[2])
    );

    // Map the data to LatLng objects

    console.log("latLngs", latLngs);
    if (!this.ServiceService.check) {
      this.alllatlong = [];
      this.alllatlong.push(latLngs);
    } else {
      this.alllatlong.push(latLngs);
    }

    if (!this.ServiceService.check) {
      console.log("Shape created:alllatlong", this.alllatlongPlot);
      if (this.alllatlongPlot.length === 0) {
        const toast = this.notificationsService.warn(
          "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡"
        );
        return;
      }
      let allVertices = [];

      // Iterate over each array in alllatlongPlot to extract the vertices of each polygon
      this.alllatlongPlot.forEach((array) => {
        console.log("🚀 ~ this.alllatlongPlot.forEach ~ array:", array);
        let vertices = array.map((coord) => {
          return L.latLng(coord.lat, coord.lng);
        });
        allVertices = allVertices.concat(vertices);
        console.log(
          "🚀 ~ this.alllatlongPlot.forEach ~ allVertices:",
          allVertices
        );
      });

      // Create a Leaflet polygon (limitedAreaBounds) using the array of vertices collected from all polygons
      this.limitedAreaBounds = L.polygon(allVertices);

      if (this.alllatlong) {
        console.log(
          "🚀 ~ processImportedShapesXLSX ~ alllatlong:",
          this.alllatlong
        );
        this.alllatlong.forEach((shape, index) => {
          let randomColor =
            "#" + Math.floor(Math.random() * 16777215).toString(16);

          this.drawnShape = L.polygon(shape, { color: randomColor }).addTo(
            this.map
          );

          this.editableLayers.addLayer(this.drawnShape);
          if (shape.length < 26) {
            shape.forEach((point, pointIndex) => {
              const markerLatLng = L.latLng(point); // Create a LatLng object for the point
              // Add a marker with a character label to the polygon
              this.addMarkerWithCharacter(
                this.drawnShape,
                markerLatLng,
                String.fromCharCode(65 + pointIndex)
              );
            });
          }
        });
        if (
          this.limitedAreaBounds
            .getBounds()
            .contains(this.drawnShape.getBounds())
        ) {
          this.map.addLayer(this.drawnShape);

          // Convert each L.LatLng object to [x, y] point
          //this.convertLatLngToUTM(this.coordinates)

          // Assuming you already have the 'points' array from the previous code
          const utmCoordinates = this.convertCoordinatesToUTM(this.coordinates);
          utmCoordinates.push(utmCoordinates[0]);
          this.utmCoordinates = utmCoordinates;

          //this.ServiceService.coordinate = coordinates;
          // console.log(
          //   "🚀 ~ file: gis-map.component.ts:1569 ~ this.map.on ~ utmToCoor:",
          //   this.ServiceService.coordinate
          // );

          console.log(
            "🚀 ~ file: gis-map.component.ts:1361 ~ this.map.on ~ utmCoordinates:",
            this.utmCoordinates
          );
        } else {
          const toast = this.notificationsService.warn(
            "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡"
          );

          this.map.removeLayer(this.drawnShape);
          this.editableLayers.removeLayer(this.drawnShape);
          this.removeShape();
          this.ServiceService.disablebutton = false;
          return;
        }
      }
    } else {
      if (this.fromexcel === true && this.alllatlong.length == 1) {
        if (
          this.ServiceService.allLicenceData.Parcel_ID == null &&
          this.ServiceService.allLicenceData.Plot_Merge_1 == null &&
          this.ServiceService.allLicenceData.Plot_Merge_2 == null &&
          this.ServiceService.allLicenceData.Plot_Merge_3 == null &&
          this.ServiceService.allLicenceData.Plot_Merge_4 == null
        ) {
          console.log(
            "🚀 ~ file: gis-map.component.ts:1691 ~ this.map.on ~ ServiceService:",
            this.ServiceService.allLicenceData
          );

          this.checktheshapeexistans(latLngss);
        }
      }
    }
    let utmCoordinates = this.convertCoordinatesToUTM(latLngs);
    const subtract_northing = 207.34388375;
    const subtract_easting = 95.4782061405;

    utmCoordinates = utmCoordinates.map((item) => {
      item.northing -= subtract_northing;
      item.easting -= subtract_easting;
      return item; // Return the modified item
    });
    this.ServiceService.coordinateForwgs84 = this.mapToPolygonFormat(latLngs);
    utmCoordinates.push(utmCoordinates[0]);
    //this.ServiceService.coordinate = utmCoordinates;
    console.log(
      "🚀 ~ processImportedShapesXLSX ~ ServiceService:",
      this.ServiceService.coordinate
    );

    console.log(utmCoordinates);
    const area = this.calculateUTMPolygonArea(utmCoordinates);
    this.ServiceService.Totalarea = parseInt(area.toFixed(2));
    // Show the area in a popup
    this.ServiceService.setCookies(area);
    // if (this.ServiceService.isfreeholdselected) {
    //   localStorage.setItem("PolygonAreanameFrehold", "" + area.toFixed(2));
    // } else {
    //   localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
    // }
    // Remove the previously drawn shape, if any
    if (this.drawnShape) {
      this.map.removeLayer(this.drawnShape);
    }

    console.log("alllatlong", this.alllatlong);

    this.alllatlong.forEach((shape, index) => {
      let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

      this.drawnShape = L.polygon(shape, { color: randomColor }).addTo(
        this.map
      );

      this.editableLayers.addLayer(this.drawnShape);
      if (shape.length < 26) {
        shape.forEach((point, pointIndex) => {
          const markerLatLng = L.latLng(point); // Create a LatLng object for the point
          // Add a marker with a character label to the polygon
          this.addMarkerWithCharacter(
            this.drawnShape,
            markerLatLng,
            String.fromCharCode(65 + pointIndex)
          );
        });
      }
    });

    //this.ServiceService.coordinate.push(latLngs[0])
    console.log("alllatlong", latLngs);

    if (this.drawnShape instanceof L.Marker) {
      this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
    } else if (
      this.drawnShape instanceof L.Circle ||
      this.drawnShape instanceof L.Polygon
    ) {
      // this.map.fitBounds(this.drawnShape.getBounds(),{ maxZoom:15 });
      const drawnShapeBounds = this.drawnShape.getBounds();

      const customIcon = new L.Icon({
        iconUrl: environment.iconpath, // Replace with the actual path to your icon image
        iconSize: [50, 50], // Adjust the size as needed
        iconAnchor: [25, 50], // Adjust the anchor point if necessary
        popupAnchor: [0, -50], // Adjust the popup anchor if needed
        className: "custom-icon-class", // You can also add a custom CSS class
      });
      // Calculate the center of the bounds
      const center = drawnShapeBounds.getCenter();
      var marker = new L.Marker(center, {
        icon: customIcon,
      });
      //this.addCenterMarker(center);
      // marker.addTo(this.map);

      this.map.fitBounds(this.drawnShape.getBounds());
      this.onDatumChange();
      // this.setviewFromDatumchange(center);
      // Specify the zoom level

      const zoomLevel = 3; // Adjust this to your desired zoom level

      // Specify the duration of the flyTo animation in seconds
      const flyToDuration = 5; // 2 seconds

      // Use the flyTo method to animate the map
      this.map.flyTo(center, zoomLevel, {
        duration: flyToDuration,
      });

      this.aaa.push(this.drawnShape);
      // this.onDatumChange()
      this.ServiceService.shapes = this.aaa;
      this.sample = this.drawnShape;
    }
  }
  public processImportedShapesXLSXmulti(data: any[]): void {
    console.log("dataaaa", data);
    // Remove the header row from the data
    const coordinates = data.slice(1);
    console.log("coordinatesmultiple", coordinates);
    //this.ServiceService.coordinate.push(coordinates);
    this.ServiceService.coordinate.push(coordinates);

    console.log(
      "🚀 ~ processImportedShapesXLSXmulti ~ utmCoordinates:",
      this.allmultiplshape
    );

    const latLngs = coordinates.map((row) => {
      console.log(row[0], row[1], row[3], row[2]);
      if (row[0] !== undefined) {
        return this.conveUTMToLatLngWritexlsx(row[0], row[1], row[3], row[2]);
      }
    });

    this.allmultiplshape.push(latLngs);

    // if (!this.ServiceService.check) {
    //   console.log("Shape created:alllatlong", this.alllatlongPlot);
    //   if (this.alllatlongPlot.length === 0) {
    //     const toast = this.notificationsService.warn(
    //       "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡"
    //     );
    //     return;
    //   }
    //   let allVertices = [];

    //   // Iterate over each array in alllatlongPlot to extract the vertices of each polygon
    //   this.alllatlongPlot.forEach((array) => {
    //     console.log("🚀 ~ this.alllatlongPlot.forEach ~ array:", array);
    //     let vertices = array.map((coord) => {
    //       return L.latLng(coord.lat, coord.lng);
    //     });
    //     allVertices = allVertices.concat(vertices);
    //     console.log(
    //       "🚀 ~ this.alllatlongPlot.forEach ~ allVertices:",
    //       allVertices
    //     );
    //   });

    //   // Create a Leaflet polygon (limitedAreaBounds) using the array of vertices collected from all polygons
    //   this.limitedAreaBounds = L.polygon(allVertices);

    //   if (this.allmultiplshape) {
    //     console.log(
    //       "🚀 ~ processImportedShapesXLSX ~ alllatlong:",
    //       this.allmultiplshape
    //     );
    //     this.allmultiplshape.forEach((shape, index) => {
    //       let randomColor =
    //         "#" + Math.floor(Math.random() * 16777215).toString(16);

    //       this.drawnShape = L.polygon(shape, { color: randomColor }).addTo(
    //         this.map
    //       );

    //       this.editableLayers.addLayer(this.drawnShape);
    //       if (shape.length < 26) {
    //         shape.forEach((point, pointIndex) => {
    //           const markerLatLng = L.latLng(point); // Create a LatLng object for the point
    //           // Add a marker with a character label to the polygon
    //           this.addMarkerWithCharacter(
    //             this.drawnShape,
    //             markerLatLng,
    //             String.fromCharCode(65 + pointIndex)
    //           );
    //         });
    //       }
    //     });
    //     if (
    //       this.limitedAreaBounds
    //         .getBounds()
    //         .contains(this.drawnShape.getBounds())
    //     ) {
    //       this.map.addLayer(this.drawnShape);
    //     } else {
    //       const toast = this.notificationsService.warn(
    //         "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡"
    //       );

    //       this.map.removeLayer(this.drawnShape);
    //       this.editableLayers.removeLayer(this.drawnShape);
    //       this.removeShape();
    //       this.ServiceService.disablebutton = false;
    //       return;
    //     }
    //   }
    // }

    console.log(
      "🚀 ~ processImportedShapesXLSXmulti ~ allmultiplshape:",
      this.allmultiplshape
    );
    this.allmultiplshape.forEach((shape, index) => {
      let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

      this.drawnShape = L.polygon(shape, { color: randomColor }).addTo(
        this.map
      );

      this.editableLayers.addLayer(this.drawnShape);
      if (shape.length < 26) {
        shape.forEach((point, pointIndex) => {
          const markerLatLng = L.latLng(point); // Create a LatLng object for the point
          // Add a marker with a character label to the polygon
          this.addMarkerWithCharacter(
            this.drawnShape,
            markerLatLng,
            String.fromCharCode(65 + pointIndex)
          );
        });
      }
    });

    //this.ServiceService.coordinate.push(latLngs[0])
    console.log("alllatlong", latLngs);

    if (this.drawnShape instanceof L.Marker) {
      this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
    } else if (
      this.drawnShape instanceof L.Circle ||
      this.drawnShape instanceof L.Polygon
    ) {
      // this.map.fitBounds(this.drawnShape.getBounds(),{ maxZoom:15 });
      const drawnShapeBounds = this.drawnShape.getBounds();

      // Calculate the center of the bounds
      const center = drawnShapeBounds.getCenter();

      this.map.fitBounds(this.drawnShape.getBounds());
      this.onDatumChange();
      // this.setviewFromDatumchange(center);
      // Specify the zoom level
      const zoomLevel = 3; // Adjust this to your desired zoom level
      // Specify the duration of the flyTo animation in seconds
      const flyToDuration = 5; // 2 seconds

      // Use the flyTo method to animate the map
      this.map.flyTo(center, zoomLevel, {
        duration: flyToDuration,
      });
    }
  }

  convertToMultiPoints(pointsArray: Array<Array<Array<string>>>): string {
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
    let gezone = this.convertToMultiPointgeozone(pointsArray);
    console.log("🚀 ~ convertToMultiPoints ~ gezone:", gezone);

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
        return "Invalid polygon: The first and last points must be the same.";
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

  updateplote(filtertheshape: any) {
    console.log(
      "🚀 ~ file: gis-map.component.ts:2965 ~ updateplote ~ filtertheshape:",
      filtertheshape
    );
    this.completed.emit(filtertheshape);
  }
  findNode(tree: any, label: string): any {
    console.log(
      "🚀 ~ file: gis-map.component.ts:2908 ~ findNode ~ tree:",
      tree
    );

    if (tree.label === label) {
      return tree;
    }
    for (const child of tree.children || []) {
      const result = this.findNode(child, label);
      console.log(
        "🚀 ~ file: gis-map.component.ts:2913 ~ findNode ~ result:",
        result
      );

      if (result) {
        return result;
      }
    }
  }

  addMarkerWithCharacter(drawnShape, markerLatLng, character) {
    const myIcon = L.divIcon({
      className: "my-custom-icon",
      html: `<div class="my-icon-label">${character}</div>`,
    });

    const marker = L.marker(markerLatLng, { icon: myIcon });

    // Add the marker to the drawn shape (polygon)
    marker.addTo(this.map);
  }

  onClick(event: L.LeafletMouseEvent) {
    // Randomly select a shape from the array
    const randomIndex = Math.floor(
      Math.random() * this.ServiceService.shapes.length
    );
    const selectedShape = this.ServiceService.shapes[randomIndex];

    // Do something with the selected shape (e.g., change its style)

    // You can also select multiple shapes if needed
    // Just loop through the array and apply changes to each selected shape
  }

  convertToExcel(data: any[]): void {
    console.log(
      "🚀 ~ file: gis-map.component.ts:3111 ~ convertToExcel ~ data:",
      data
    );
    let isNorthernHemisphere: any = "N";
    // const utmToCoor = data.map((row) =>
    //   this.conveUTMToLatLngWritexlsxexport(
    //     row.northing - 207.34388375,
    //     row.easting - 95.4782061405,
    //     37,
    //     isNorthernHemisphere
    //   )
    // );
    const utmCoordinateslast = data;
    //const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(utmCoordinateslast);

    // Add headers to the worksheet
    const headers = ["northing", "easting"];
    const headerRange = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: 0, c: headers.length - 1 },
    });
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      worksheet[cellAddress] = { v: header };
    });

    // Set the column width for the latitude and longitude columns
    const columnWidth = 15;
    const columnWidths = [{ wch: columnWidth }, { wch: columnWidth }];
    worksheet["!cols"] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert the workbook to an array buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the file
    const fileName = "shapes.xlsx";
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  convertToExcelaferdraw(data: any[]): void {
    console.log(
      "🚀 ~ file: gis-map.component.ts:3111 ~ convertToExcel ~ data:",
      data
    );

    let utmCoordinateslast = data;
    const subtract_northing = 207.34388375;
    const subtract_easting = 95.4782061405;

    utmCoordinateslast = utmCoordinateslast.map((item) => {
      item.northing += subtract_northing;
      item.easting += subtract_easting;
      return item; // Return the modified item
    });

    //const utmCoordinateslast = this.convertCoordinatesToUTM(utmToCoor);
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(utmCoordinateslast);

    // Add headers to the worksheet
    const headers = ["northing", "easting"];
    const headerRange = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: 0, c: headers.length - 1 },
    });
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      worksheet[cellAddress] = { v: header };
    });

    // Set the column width for the latitude and longitude columns
    const columnWidth = 15;
    const columnWidths = [{ wch: columnWidth }, { wch: columnWidth }];
    worksheet["!cols"] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert the workbook to an array buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the file
    const fileName = "shapes.xlsx";
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  convertToCSV(data: any[]): void {
    console.log(
      "🚀 ~ file: gis-map.component.ts:3111 ~ convertToCSV ~ data:",
      data
    );

    let utmCoordinateslast = data;
    const subtract_northing = 207.34388375;
    const subtract_easting = 95.4782061405;

    utmCoordinateslast = utmCoordinateslast.map((item) => {
      item.northing += subtract_northing;
      item.easting += subtract_easting;
      return item; // Return the modified item
    });

    // Add constant values
    const zone = 37;
    const hemisphere = "P";

    // Convert data to CSV format
    let csvContent = "";

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
  convertToCSVondrwaing(data: any[]): void {
    const utmCoordinateslast = data;
    console.log(
      "🚀 ~ convertToCSVondrwaing ~ utmCoordinateslast:",
      utmCoordinateslast
    );
    const subtract_northing = 207.34388375;
    const subtract_easting = 95.4782061405;

    for (let i = 0; i < utmCoordinateslast.length; i++) {
      utmCoordinateslast[i].northing -= subtract_northing;
      utmCoordinateslast[i].easting -= subtract_easting; // Corrected subtraction
    }

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

  updateMapProjection(): void {
    // Define the projection transformations for each datum
    const wgs84Projection = "+proj=longlat +datum=WGS84 +no_defs";
    const gcsAdindanProjection =
      "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs +type=crs";
    const adindanZone36Projection =
      "+proj=utm +zone=36 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs";
    const adindanZone37Projection =
      "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs +type=crs";
    const adindanZone38Projection =
      "+proj=utm +zone=38 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs";
    const wgs84Zone36Projection =
      "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs";
    const wgs84Zone37Projection =
      "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs";
    const wgs84Zone38Projection =
      "+proj=utm +zone=38 +datum=WGS84 +units=m +no_defs";
    const gcsWgs84Projection = "+proj=longlat +datum=WGS84 +no_defs";
    const gseWgs84Projection = "+proj=longlat +datum=WGS84 +no_defs";

    // Define the default projection (WGS84) and the selected projection

    let selectedProjection = adindanZone37Projection;

    if (this.selectedDatum === "GCS Adindan") {
      selectedProjection = gcsAdindanProjection;
      const crs = new L.Proj.CRS("EPSG:20137", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          132291.9312505292, 66145.9656252646, 33072.9828126323,
          16536.49140631615, 8268.245703158075, 4134.122851579038,
          2067.061425789519, 1033.5307128947597, 516.7653564473798,
          258.3826782236899, 129.19133911184494, 64.59566955592247,
          32.29783477796124, 16.14891738898062, 8.07445869449031,
          4.037229347245155,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "Adindan / UTM zone 36N") {
      selectedProjection = adindanZone36Projection;
      const crs = new L.Proj.CRS("EPSG:4326", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          132291.9312505292, 66145.9656252646, 33072.9828126323,
          16536.49140631615, 8268.245703158075, 4134.122851579038,
          2067.061425789519, 1033.5307128947597, 516.7653564473798,
          258.3826782236899, 129.19133911184494, 64.59566955592247,
          32.29783477796124, 16.14891738898062, 8.07445869449031,
          4.037229347245155,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "Adindan / UTM zone 37N") {
      selectedProjection = adindanZone37Projection;
      // Conversion factor from meters to feet
      const metersToFeet = 3.28084;

      // Define the base resolution in meters per pixel
      const baseResolutionMeters = 10; // 10 meters

      // Calculate the equivalent resolution in feet per pixel
      const baseResolutionFeet = baseResolutionMeters * metersToFeet; // 32.8084 feet

      // Create an array of resolutions that match your desired scales
      const resolutions = [
        baseResolutionMeters,
        baseResolutionMeters / 2,
        baseResolutionMeters / 4,
        baseResolutionMeters / 8,
        baseResolutionMeters / 16,
        baseResolutionMeters / 32,
        baseResolutionMeters / 64,
        baseResolutionMeters / 128,
        baseResolutionMeters / 256,
        baseResolutionMeters / 512,
        // ... Add more resolutions for finer zoom levels
      ];

      // Define your Leaflet CRS with the updated resolutions
      const crs = new L.Proj.CRS(
        "EPSG:20137",
        "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs +type=crs",
        {
          resolutions: resolutions,
          origin: [166600.5155002516, 375771.9736823894],
        }
      );

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "Adindan / UTM zone 38N") {
      selectedProjection = adindanZone38Projection;
      const crs = new L.Proj.CRS("EPSG:4326", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          6617.6042616344625, 3308.8021308172313, 1654.4010654086156,
          827.2005327043078, 413.6002663521539, 206.80013317607695,
          103.40006658803848, 51.70003329401924, 25.85001664700962,
          12.92500832350481, 6.462504161752405, 3.2312520808762025,
          1.6156260404381012, 0.8078130202190506, 0.4039065101095253,
          0.20195325505476264,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "WGS 1984 UTM Zone 36") {
      selectedProjection = wgs84Zone36Projection;
      const crs = new L.Proj.CRS("EPSG:4326", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          6617.6042616344625, 3308.8021308172313, 1654.4010654086156,
          827.2005327043078, 413.6002663521539, 206.80013317607695,
          103.40006658803848, 51.70003329401924, 25.85001664700962,
          12.92500832350481, 6.462504161752405, 3.2312520808762025,
          1.6156260404381012, 0.8078130202190506, 0.4039065101095253,
          0.20195325505476264,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "WGS 1984 UTM Zone 37") {
      selectedProjection = wgs84Zone37Projection;
      const crs = new L.Proj.CRS("EPSG:4326", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          6617.6042616344625, 3308.8021308172313, 1654.4010654086156,
          827.2005327043078, 413.6002663521539, 206.80013317607695,
          103.40006658803848, 51.70003329401924, 25.85001664700962,
          12.92500832350481, 6.462504161752405, 3.2312520808762025,
          1.6156260404381012, 0.8078130202190506, 0.4039065101095253,
          0.20195325505476264,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "WGS 1984 UTM Zone 38") {
      selectedProjection = wgs84Zone38Projection;
      const crs = new L.Proj.CRS("EPSG:4326", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          6617.6042616344625, 3308.8021308172313, 1654.4010654086156,
          827.2005327043078, 413.6002663521539, 206.80013317607695,
          103.40006658803848, 51.70003329401924, 25.85001664700962,
          12.92500832350481, 6.462504161752405, 3.2312520808762025,
          1.6156260404381012, 0.8078130202190506, 0.4039065101095253,
          0.20195325505476264,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "GCS WGS 1984") {
      selectedProjection = gcsWgs84Projection;
      const crs = new L.Proj.CRS("EPSG:4326", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
          0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
          0.001373291015625, 0.0006866455078125, 0.00034332275390625,
          0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125,
          0.000021457672119140625,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    } else if (this.selectedDatum === "GSE WGS84") {
      selectedProjection = gseWgs84Projection;
      const crs = new L.Proj.CRS("EPSG:4326", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
          0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
          0.001373291015625, 0.0006866455078125, 0.00034332275390625,
          0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125,
          0.000021457672119140625,
        ],
        bounds: L.bounds([-168914.58, 375600.56], [1502637.63, 1665634.17]),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
    }

    // Update the map view to the center coordinates of Ethiopia and adjust the zoom level
    const center = L.latLng(9.032457, 38.759775); // Update with Ethiopia center coordinates
    const zoom = 6; // Update with the desired zoom level for the selected projection
    this.map.setView(center, zoom);
  }
  setviewFromDatumchange(center) {
    // Conversion factor from meters to feet
    const metersToFeet = 3.28084;

    // Define the base resolution in meters per pixel
    const baseResolutionMeters = 10; // 10 meters

    // Calculate the equivalent resolution in feet per pixel
    const baseResolutionFeet = baseResolutionMeters * metersToFeet; // 32.8084 feet

    // Create an array of resolutions that match your desired scales
    const resolutions = [
      baseResolutionFeet,
      baseResolutionFeet / 2,
      baseResolutionFeet / 4,
      baseResolutionFeet / 8,
      baseResolutionFeet / 16,
      baseResolutionFeet / 32,
      baseResolutionFeet / 64,
      baseResolutionFeet / 128,
      // ... Add more resolutions for finer zoom levels
    ];

    // Define your Leaflet CRS with the updated resolutions
    const crs = new L.Proj.CRS(
      "EPSG:20137",
      "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs +type=crs",
      {
        resolutions: resolutions,
        origin: [166600.5155002516, 375771.9736823894],
      }
    );

    // Set the updated map projection
    this.map.options.crs = crs;
    //const center = L.latLng(9.032457, 38.759775); // Update with Ethiopia center coordinates
    const zoom = 6; // Update with the desired zoom level for the selected projection
    this.map.setView(center, zoom);
  }

  addCenterMarker(center: L.LatLng) {
    const marker = L.marker(center, {
      icon: L.divIcon({
        className: "center-marker-icon",
        html: '<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%;"></div>',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      }),
    });
    marker.addTo(this.map);
  }

  onDatumChange(): void {
    console.log(this.selectedDatum);

    this.updateMapProjection();
    // Other actions to perform when the datum changes
  }

  conveLatLngToUTM(
    latitude: number,
    longitude: number
  ): { northing: number; easting: number; hemisphere: string; zone: number } {
    // Determine the hemisphere (northern or southern)
    //const hemisphere = latitude >= 0 ? "N" : "S";
    const hemisphere = "P";

    // Calculate the UTM zone
    const zone = Math.floor((longitude + 180) / 6) + 1;

    // Convert latitude and longitude to UTM coordinates
    const utmCoords = utm.fromLatLon(latitude, longitude, 37, hemisphere);

    return {
      northing: utmCoords.northing,
      easting: utmCoords.easting,
      hemisphere: utmCoords.zoneLetter,
      zone: utmCoords.zoneNum,
    };
  }
  conveUTMToLatLng(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): { lat: number; lng: number } {
    console.log(easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    //console.log("Latitude, Longitude:", latLngCoords);
    return {
      lat: latLngCoords.latitude,
      lng: latLngCoords.longitude,
    };
  }
  conveUTMToLatLngforshapefilep(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): [number, number, number] {
    console.log("ggggg", easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    // console.log(
    //   "Latitude, Longitude:",
    //   latLngCoords.longitude,
    //   latLngCoords.latitude
    // );
    console.log(
      "Latitude, Longitude:",
      latLngCoords.longitude - 0.0008668,
      latLngCoords.latitude - 0.001876
    );

    return [latLngCoords.longitude, latLngCoords.latitude, 0];
  }
  conveUTMToLatLngWrite(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): { lat: number; lng: number } {
    console.log(easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    return {
      lat: latLngCoords.latitude,
      lng: latLngCoords.longitude,
    };
  }
  conveUTMToLatLngWritexlsx(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): { lat: number; lng: number } {
    console.log(easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    //  console.log("Latitude, Longitude:", latLngCoords);
    // return {
    //   lat: latLngCoords.latitude,
    //   lng: latLngCoords.longitude,
    // };
    return {
      lat: latLngCoords.latitude + 0.001876,
      lng: latLngCoords.longitude + 0.0008668,
    };
  }
  conveUTMToLatLngWritexlsxexport(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): { lat: number; lng: number } {
    console.log(easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    //  console.log("Latitude, Longitude:", latLngCoords);
    // return {
    //   lat: latLngCoords.latitude,
    //   lng: latLngCoords.longitude,
    // };
    return {
      lat: latLngCoords.latitude,
      lng: latLngCoords.longitude,
    };
  }
  conveUTMToLatLngWriteadd(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): { lat: number; lng: number } {
    console.log(easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    // console.log("Latitude, Longitude:", latLngCoords);
    return {
      lat: latLngCoords.latitude + 0.001876,
      lng: latLngCoords.longitude + 0.0008668,
    };
    // return {
    //   lat: latLngCoords.latitude,
    //   lng: latLngCoords.longitude,
    // };
  } //998773 471308

  checkUTMtolatlong() {
    const latLngCoords = utm.toLatLon("425304.62", "1020351.60", 37, "N");
    console.log(
      "🚀 ~ file: gis-map.component.ts:3509 ~ checkUTMtolatlong ~ utmCoords:",
      latLngCoords
    );
    const utmCoords = utm.fromLatLon(
      latLngCoords.latitude,
      latLngCoords.longitude,
      37,
      "P"
    );
    console.log(
      "🚀 ~ file: gis-map.component.ts:3509 ~ checkUTMtolatlong ~ utmCoords:",
      utmCoords
    );
    return {
      lat: latLngCoords.latitude,
      lng: latLngCoords.longitude,
    };
  }
  conveUTMToLatLngforshapefile(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): [number, number, number] {
    //console.log(easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    console.log("Latitude, Longitude:", latLngCoords);

    return [latLngCoords.longitude, latLngCoords.latitude, 0];
  }
  findShapeFromGeoJSON(geoJSON, coordinates) {
    // Ensure the GeoJSON has features
    if (geoJSON && geoJSON.features && geoJSON.features.length > 0) {
      for (const feature of geoJSON.features) {
        const polygonCoordinates = feature.geometry.coordinates[0];

        const isNorthernHemisphere: any = "N";

        const latLngs = polygonCoordinates.map((row) =>
          row.map((coordinate) =>
            this.conveUTMToLatLng(
              coordinate[1],
              coordinate[0],
              37,
              isNorthernHemisphere
            )
          )
        );
        const limitedAreaBounds = L.latLngBounds(coordinates);
        console.log(
          "🚀 ~ file: gis-map.component.ts:3460 ~ findShapeFromGeoJSON ~ limitedAreaBounds:",
          limitedAreaBounds
        );

        const featurelatlong = L.latLngBounds(latLngs);
        console.log(
          "🚀 ~ file: gis-map.component.ts:3463 ~ findShapeFromGeoJSON ~ featurelatlong:",
          featurelatlong
        );

        const intersection = this.intersect(limitedAreaBounds, featurelatlong);
        const unionResult = this.union(limitedAreaBounds, featurelatlong);

        console.log("Intersection:", intersection);
        console.log("Union:", unionResult);

        // Calculate intersection area
        const intersectionArea = intersection
          ? this.calculateArea(intersection)
          : 0;
        console.log("intersectionArea:", intersectionArea);
        // Calculate union area
        const unionArea = this.calculateArea(unionResult);
        console.log("unionArea:", unionArea);
        // Calculate Jaccard similarity index
        // const jaccardSimilarity =
        //   unionArea === 0 ? 0 : intersectionArea / unionArea;
        // Calculate Jaccard similarity index
        const jaccardSimilarity = intersectionArea / unionArea;
        console.log("jaccardSimilarity:", jaccardSimilarity);
        const limitedAreaPolygon = L.polygon([
          limitedAreaBounds.getSouthWest(),
          limitedAreaBounds.getSouthEast(),
          limitedAreaBounds.getNorthEast(),
          limitedAreaBounds.getNorthWest(),
        ]);
        console.log("Limited Area Polygon:", limitedAreaPolygon);

        const featurePolygon = L.polygon([
          featurelatlong.getSouthWest(),
          featurelatlong.getSouthEast(),
          featurelatlong.getNorthEast(),
          featurelatlong.getNorthWest(),
        ]);
        let isconten = featurePolygon
          .getBounds()
          .contains(limitedAreaPolygon.getBounds());
        console.log("Feature Polygon:", featurePolygon, isconten);

        // Check if the polygons are at least 80% similar
        // if (
        //   limitedAreaPolygon.getBounds().contains(featurePolygon.getBounds())
        // ) {
        if (jaccardSimilarity >= 0.8) {
          console.log("Polygons are at least 80% similar.");
          // Return the feature or perform further actions as needed
          return feature;
        }
      }
    }
    return null;
  }
  // Function to calculate intersection of two bounding boxes
  intersect(bounds1, bounds2) {
    const southWest = {
      lat: Math.max(bounds1._southWest.lat, bounds2._southWest.lat),
      lng: Math.max(bounds1._southWest.lng, bounds2._southWest.lng),
    };
    const northEast = {
      lat: Math.min(bounds1._northEast.lat, bounds2._northEast.lat),
      lng: Math.min(bounds1._northEast.lng, bounds2._northEast.lng),
    };
    console.log("intersectofboth:", southWest, northEast);
    // Check if the intersection is valid
    if (southWest.lat <= northEast.lat && southWest.lng <= northEast.lng) {
      return { _southWest: southWest, _northEast: northEast };
    } else {
      return null;
    }
  }

  // Function to calculate union of two bounding boxes
  union(bounds1, bounds2) {
    const southWest = {
      lat: Math.min(bounds1._southWest.lat, bounds2._southWest.lat),
      lng: Math.min(bounds1._southWest.lng, bounds2._southWest.lng),
    };
    const northEast = {
      lat: Math.max(bounds1._northEast.lat, bounds2._northEast.lat),
      lng: Math.max(bounds1._northEast.lng, bounds2._northEast.lng),
    };

    return { _southWest: southWest, _northEast: northEast };
  }
  calculateArea(bounds) {
    return (
      (bounds._northEast.lat - bounds._southWest.lat) *
      (bounds._northEast.lng - bounds._southWest.lng)
    );
  }
  startSnipping(event: MouseEvent) {
    this.isSnipping = true;
    this.snipStartX = event.clientX;
    this.snipStartY = event.clientY;
  }

  saveMapAsImage() {
    html2canvas(document.getElementById("mapp")).then(function (canvas) {
      var imgData = canvas.toDataURL("image/png");
      var link = document.createElement("a");
      link.href = imgData;
      link.download = "map.png";
      link.click();
    });
  }
  takeScreenshot() {
    let format = "image"; // Return base64
    let overridedPluginOptions = {
      mimeType: "image/jpeg",
    };

    // Start the screenshot process
    this.simpleMapScreenshoter
      .takeScreen(format, overridedPluginOptions)
      .then((base64Data) => {
        console.log("Screenshot taken as base64:", base64Data);
        // Save the base64 data to a variable or use it as needed
        this.screenshotBase64 = base64Data;
        console.log("🚀 ~ .then ~ screenshotBase64:", this.screenshotBase64);
      })
      .catch((error) => {
        console.error("Error taking screenshot:", error);
      });
  }
  getCSVTemplate(): void {
    // Define constant values
    const zone = 37;
    const hemisphere = "P";

    // Define headers
    const headers = ["northing", "easting", "hemisphere", "zone"];

    // Sample data
    const sampleData = [
      {
        northing: 998101.614079862,
        easting: 473258.9323678574,
        hemisphere: "P",
        zone: 37,
      },
      {
        northing: 998115.3640795118,
        easting: 473256.5873595017,
        hemisphere: "P",
        zone: 37,
      },
      {
        northing: 998117.7077959186,
        easting: 473270.6576056435,
        hemisphere: "P",
        zone: 37,
      },
      {
        northing: 998103.3327965328,
        easting: 473273.0026125555,
        hemisphere: "P",
        zone: 37,
      },
      {
        northing: 998101.614079862,
        easting: 473258.9323678574,
        hemisphere: "P",
        zone: 37,
      },
    ];

    // Construct CSV template
    let csvContent = headers.join(",") + "\n";
    sampleData.forEach((item) => {
      csvContent +=
        item.northing +
        "," +
        item.easting +
        ',"' +
        item.hemisphere +
        '",' +
        item.zone +
        "\n";
    });

    // Create a blob with CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template.csv");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  parsePolygons(): any[] {
    let polygonsString = `POLYGON((474581.05 1001760.431 P 37, 474589.45 1001762.731 P 37, 474588.77 1001766.871 P 37, 474586.36 1001766.241 P 37, 474585.49 1001769.241 P 37, 474578.97 1001767.501 P 37, 474581.05 1001760.431 P 37, P 37)), 
  POLYGON((474583.15 1001748.271 P 37, 474590.28 1001750.901 P 37, 474587.83 1001759.431 P 37, 474586.34 1001759.051 P 37, 474586 1001760.291 P 37, 474583.92 1001759.841 P 37, 474584.33 1001758.581 P 37, 474580.7 1001757.671 P 37, 474583.15 1001748.271 P 37, P 37)), 
  POLYGON((474578.49 1001739.151 P 37, 474580.73 1001747.931 P 37, 474573.67 1001749.651 P 37, 474571.28 1001740.781 P 37, 474578.49 1001739.151 P 37 P 37))`;

    const polygons = polygonsString
      .split("),")
      .map((polygon) => `${polygon.trim()})`);
    console.log("🚀 ~ parsePolygons ~ polygons:", polygons);
    return polygons;
  }

  convertArray(inputArray: any[]): any[][][] {
    const outputArray = [];
    inputArray.forEach((item) => {
      const coordinates = [
        item.northing.toFixed(2),
        item.easting.toFixed(2),
        item.hemisphere,
        item.zone.toString(),
      ];
      outputArray.push([coordinates]);
    });
    return outputArray;
  }
  updateProperties() {
    // Update your properties here
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  // setCookies(area: number) {
  //   // Setting cookies using cookieService
  //    if (this.ServiceService.isfreeholdselected) {
  //      //localStorage.setItem("PolygonAreanameFrehold", "" + area.toFixed(2));
  //      this.cookieService.set("PolygonAreanameFrehold", "" + area.toFixed(2));
  //    } else {
  //      //ocalStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
  //      this.cookieService.set("PolygonAreaname", "" + area.toFixed(2));
  //    }
  // }
  // getCookies() {
  //   // Getting cookie values using cookieService
  //   this.ServiceService.polygonAreaname = this.cookieService.get("PolygonAreaname");
  //   this.ServiceService.polygonAreanameFrehold = this.cookieService.get("PolygonAreanameFrehold");

  //   // Use the retrieved values as needed
  //   console.log("PolygonAreaname:", this.ServiceService.polygonAreaname);
  //   console.log(
  //     "PolygonAreanameFrehold:",
  //     this.ServiceService.polygonAreanameFrehold
  //   );
  // }
}

// Define the Layer interface
interface Layer {
  name: string; // Name of the layer
  tileLayer?: L.TileLayer.WMS | null; // Tile layer (if it's a tile layer)
  vectorLayer?: L.Proj.GeoJSON | null; // Vector layer (if it's a vector layer)
}
interface CustomTreeNode extends TreeNode {
  selected?: boolean;
}
export interface Coordinates {
  northing: number;
  easting: number;
  hemisphere: string;
  zone: number;
}
