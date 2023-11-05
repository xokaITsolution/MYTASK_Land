import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
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
import { BehaviorSubject, Subject } from "rxjs";
import { BsModalService } from "ngx-bootstrap";
import { CustomAlertComponent } from "./CustomAlertComponent";
import { NotificationsService } from "angular2-notifications";
import { MessageService, TreeNode } from "primeng/api";
import { ApiService } from "../testgismap/api.service";
import { parse } from "querystring";

interface AssignedBodyTree {
  label: string;
  workspace: string;
  value: string;
  children: any;
}

interface AssignedBodyTree2 {
  label: string;
  workspace: string;
  value: string;
}
@Component({
  selector: "app-gis-map",
  templateUrl: "./gis-map.component.html",
  styleUrls: ["./gis-map.component.css"],
})
export class GisMapComponent implements AfterViewInit {
  @ViewChild("tree", { static: false }) tree: any; // Replace 'any' with the actual type of your tree if available
  @ViewChild("fileInputt", { static: false }) fileInputt: ElementRef;
  nodes: CustomTreeNode[];
  polylinee: any;
  datum: string;
  defaultLayer: any;
  sample: L.Layer;
  rectangleOverlay: any;
  utmCoordinates: any;
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

  constructor(
    public ServiceService: ServiceService,
    private messageService: MessageService,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private geoser: ApiService
  ) {
    this.defaultLayer = this.layers[0];
  }
  @Input() geometry;
  map: L.Map;
  editableLayers = new L.FeatureGroup();
  private EPSG20137: L.Proj.CRS;
  // Define the EPSG:20137 CRS
  private markerLayer: L.LayerGroup;

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
  private geoserverUrl = environment.geoserverUrl;
  private parentGroupName = environment.parentGroupName;
  private geoserverUrlwfs = environment.geoserverUrlwfs;
  customZoomLevels: Record<number, number> = {
    1: 2, // 1 meter on the map is 1 meter in the real world
    2: 4, // 1 meter on the map is 2 meters in the real world
    4: 8, // 1 meter on the map is 4 meters in the real world

    // Add more levels as needed
  };

  //  layers: Layer[] = [
  //     { name: 'Oromia_district', tileLayer: null },
  //     { name: 'Oromia_region', tileLayer: null },
  //      { name: 'Oro_road', tileLayer: null },
  //     // Add more layers as needed
  //   ];
  layers: Layer[] = [];
  @Input() changingg: Subject<any>;
  @Input() geo;
  ngOnInit() {
    console.log("value is changing", this.geo);
    // this.changingg.subscribe((v: any) => {
    //   console.log("value is changing", v);
    //   this.processImportedShapes(v);
    // });
  }
  ngAfterViewInit() {
    const iconRetinaUrl = "assets/marker-icon-2x.png";
    const iconUrl = "assets/marker-icon.png";
    const shadowUrl = "assets/marker-shadow.png";
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.initMap();
    this.getGroupLayers();

    // this.changingg.subscribe((v: any) => {
    //   console.log("value is changing", v);
    //   this.processImportedShapes(v);
    // });
    if (this.geo) {
      console.log("value is changing", this.geo);
      if (this.ServiceService.check) {
        this.processImportedShapes(this.geo);
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
  }
  toggleLayer_Checked(event) {
    //;
    if (event.node.children) {
      // Deselect all the children nodes
      event.node.children.forEach((child) => {
        console.log("child", child);
        this.toggleLayer_UnChecked(child);
      });
    }
    // const visibility = event;
    console.log("event", event.node.label);

    const layerName = event.node.label;
    const layer = this.layers.find((l) => l.name === layerName);
    //
    if (layer && layer.vectorLayer) {
      // if (visibility) {
      console.log("vectorlayer", layer.vectorLayer);

      this.map.addLayer(layer.vectorLayer);
      this.map.addLayer(layer.tileLayer);
      //this.onDatumChange()

      // } else {
      //   console.log("vectorlayer", layer.vectorLayer);

      //   this.map.removeLayer(layer.vectorLayer);
      //   this.map.removeLayer(layer.tileLayer);
      // }
    } else if (layer && layer.tileLayer) {
      // if (visibility) {
      console.log("tilelayer", layer.tileLayer);
      this.map.addLayer(layer.tileLayer);
      //this.onDatumChange();

      // }
      // else {
      //   console.log("tilelayer", layer.tileLayer);
      //   this.map.removeLayer(layer.tileLayer);

      // }
    }
  }
  toggleLayer_UnChecked(event) {
    // const visibility = event;
    console.log("event", event.node.label);

    const layerName = event.node.label;
    const layer = this.layers.find((l) => l.name === layerName);
    //
    if (layer && layer.vectorLayer) {
      // if (visibility) {
      //   console.log("vectorlayer", layer.vectorLayer);

      //   this.map.addLayer(layer.vectorLayer);
      //   this.map.addLayer(layer.tileLayer);
      //   //this.onDatumChange()

      // } else {
      console.log("vectorlayer", layer.vectorLayer);

      this.map.removeLayer(layer.vectorLayer);
      this.map.removeLayer(layer.tileLayer);
      // }
    } else if (layer && layer.tileLayer) {
      // if (visibility) {
      //   console.log("tilelayer", layer.tileLayer);
      //   this.map.addLayer(layer.tileLayer);
      //   //this.onDatumChange();

      // }
      // else {
      console.log("tilelayer", layer.tileLayer);
      this.map.removeLayer(layer.tileLayer);

      // }
    }
  }
  // getGroupLayers(): void {
  //   this.geoser.fetchGroupLayers().subscribe((data: any) => {
  //     //
  //     this.groupLayers = data.layerGroups.layerGroup;
  //     console.log("Agroup", this.groupLayers);
  //     for (let index = 0; index < this.groupLayers.length; index++) {
  //       const element = this.groupLayers[index].name;
  //       // this.subcities[index].name = element[1];
  //       if (element === this.parentGroupName) {
  //         if (typeof this.groupLayers[index] === "object") {
  //           if (Array.isArray(this.groupLayers[index])) {
  //             console.log("Variable is an array");
  //           } else {
  //             this.groupLayer = this.json2array(this.groupLayers[index]);
  //             console.log("parent", this.groupLayer);
  //           }
  //         }
  //         if (this.groupLayer.length > 0) {
  //           const firstElementValue = this.groupLayer[0].href;
  //           this.ParentGroupLayerSelected(true, firstElementValue);
  //         }
  //         console.log("AddisLand", this.groupLayers[index]);
  //       }
  //     }
  //   });
  // }
  getGroupLayers(): void {
    this.geoser
      .fetchGroupLayers(environment.parentWorkspace)
      .subscribe((data: any) => {
        // debugger
        this.groupLayers = data.layerGroups.layerGroup;
        // console.log("Agroup", this.groupLayers);
        for (let index = 0; index < this.groupLayers.length; index++) {
          const element = this.groupLayers[index].name;
          // this.subcities[index].name = element[1];
          // if (element === this.parentGroupName) {
          if (typeof this.groupLayers[index] === "object") {
            if (Array.isArray(this.groupLayers[index])) {
              // console.log('Variable is an array');
              this.groupLayer = this.groupLayers[index];
            } else {
              this.groupLayer = this.json2array(this.groupLayers[index]);
              // console.log("parent", this.groupLayer);
            }
          }
          // console.log("AddisLand", this.groupLayers[index]);
          this.getTree(this.groupLayer);
        }
        // }
      });
  }
  async getTreebk(grouplist) {
    this.nodes = [];
    //

    // console.log("this.groupLayer", this.groupLayer);

    for (let i = 0; i < this.groupLayer.length; i++) {
      let a: AssignedBodyTree = {
        label: "",
        workspace: "",
        value: "",
        children: "",
      };
      //
      // console.log("hhhe", a)
      a["label"] = this.groupLayer[i].name;
      a["workspace"] = "";
      a["value"] = this.groupLayer[i].href;
      a.children = [];
      var sub = await this.geoser
        .getLayersFromGeoserver(this.groupLayer[i].href)
        .toPromise();
      let keys = Object.keys(sub);
      // console.log("wor.key", keys);

      if (keys[0] == "layer") {
        // console.log("wor.layer.name", sub.layer.name);
        continue;
      }

      if (this.subcity == "central_AddisLand") {
        //
        this.subcities = this.central_AddisLand;
      } else {
        this.subcities = sub.layerGroup.publishables.published;
      }

      if (typeof this.subcities === "object") {
        if (Array.isArray(this.subcities)) {
          // console.log('Variable is an array');
        } else {
          this.subcities = this.json2array(
            sub.layerGroup.publishables.published
          );
          // console.log("subcities", this.subcities);
        }
      }
      const l11 = Object.assign([], this.subcities);
      // console.log("subb", this.subcities.length);

      for (let j = 0; j < this.subcities.length; j++) {
        let b: AssignedBodyTree = {
          label: "",
          workspace: "",
          value: "",
          children: "",
        };
        const element = this.subcities[j].name.split(":");
        this.subcities[j].name = element[1];
        this.subcities[j].workspace = element[0];
        b["label"] = this.subcities[j].name;
        b["workspace"] = this.subcities[j].workspace;
        b["value"] = this.subcities[j].href;
        b.children = [];
        a.children.push(b);
        //
        this.getcapablities(this.subcities[j].workspace);
        var wor = await this.geoser
          .getLayersFromGeoserver(this.subcities[j].href)
          .toPromise();
        let keys = Object.keys(wor);
        // console.log("wor.key", keys);

        if (keys[0] == "layer") {
          // console.log("wor.layer.name", wor.layer.name);
          continue;
        }
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
            // console.log("wor.layer.name", worlay.layer.name);
            continue;
          }
          // console.log("worlay", worlay.layerGroup.publishables.published);
          this.woredaLayers = worlay.layerGroup.publishables.published;
          // console.log('ddd', this.woredaLayers);

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

            if (keys[0] == "layer") {
              // console.log("wor.layer.name", worlayonebyone.layer.name);
              continue;
            }
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
              let e: AssignedBodyTree2 = {
                label: "",
                workspace: "",
                value: "",
              };
              //
              const element = this.woredaLayersOneByOne[m].name.split(":");
              this.woredaLayersOneByOne[m].name = element[1];
              this.woredaLayersOneByOne[m].workspace = element[0];
              e["label"] = this.woredaLayersOneByOne[m].name;
              e["workspace"] = this.woredaLayersOneByOne[m].workspace;
              e.label = this.woredaLayersOneByOne[m].name;
              e.value = this.woredaLayersOneByOne[m].href;
              this.woredaLayersOneByOne[l].children = [];
              d.children.push(e);
            }
          }
        }
      }
      this.nodes.push(a);
      const uniqueJobMatchIDs = {};
      const uniqueData = this.nodes.filter((item) => {
        if (!uniqueJobMatchIDs[item.label]) {
          uniqueJobMatchIDs[item.label] = true;
          return true;
        }
        return false;
      });
      this.nodes = uniqueData;
    }
    const aradaImageMNode: CustomTreeNode | undefined =
      this.findAradaImageMNode(this.nodes);
    if (aradaImageMNode) {
      //console.log(aradaImageMNode);
      const layer = this.layers.find((l) => l.name === aradaImageMNode.label);
      this.map.addLayer(layer.tileLayer);
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
      };

      a["label"] = parentgroup[0].name;
      a["workspace"] = "";
      a["value"] = parentgroup[0].href;
      a.children = [];

      // this.getcapablities(this.subcities[i].workspace);
      var centralcity = await this.geoser
        .getLayersFromGeoserver(parentgroup[0].href)
        .toPromise();
      let keys = Object.keys(centralcity);

      // debugger
      if (keys[0] == "layer") {
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
        };
        // debugger
        // console.log("hhhe", a)
        const element = this.centralAddis[n].name.split(":");
        this.centralAddis[n].name = element[1];
        this.centralAddis[n].workspace = element[0];
        f["label"] = this.centralAddis[n].name;
        f["workspace"] = this.centralAddis[n].workspace;
        f["value"] = this.centralAddis[n].href;
        f.children = [];
        a.children.push(f);
        this.getcapablities(this.centralAddis[n].workspace);
        // var sub = await this.geoser.fetchGroupLayers(this.subcity).toPromise();
        // let keys = Object.keys(sub)
        // console.log("wor.key", keys);
        // debugger

        if (keys[0] == "layer") {
          // console.log("wor.layer.name", sub.layer.name);
          continue;
        }
        if (this.subcity == "central_AddisLand") {
          // debugger
          this.subcities = this.central_AddisLand;
        } else {
          var sub = await this.geoser
            .fetchGroupLayers(this.subcity)
            .toPromise();
          let keys = Object.keys(sub);
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
            // console.log("AddisLand", this.groupLayers[index]);
            // this.getTree(this.groupLayer);
          }
          // this.subcities = sub.layerGroup.publishables.published;
        }
        // if (typeof this.subcities === 'object') {
        //   if (Array.isArray(this.subcities)) {
        //     // console.log('Variable is an array');
        //   } else {
        //     this.subcities = this.json2array(sub.layerGroup.publishables.published);
        //     // console.log("subcities", this.subcities);
        //   }
        // }
        const l11 = Object.assign([], this.subcities);
        // console.log("subb", this.subcities.length);
        if (n == this.centralAddis.length - 1) {
          for (let j = 0; j < this.subcities.length; j++) {
            let b: AssignedBodyTree = {
              label: "",
              workspace: "",
              value: "",
              children: "",
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
            // debugger
            this.getcapablities(this.subcities[j].workspace);
            var wor = await this.geoser
              .getLayersFromGeoserver(this.subcities[j].href)
              .toPromise();
            let keys = Object.keys(wor);
            // console.log("wor.key", keys);
            //debugger;
            if (keys[0] == "layer") {
              // console.log("wor.layer.name", wor.layer.name);
              continue;
            }
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
              };
              const element = this.woredas[k].name.split(":");
              this.woredas[k].name = element[1];
              this.woredas[k].workspace = element[0];
              c["label"] = this.woredas[k].name;
              c["workspace"] = this.woredas[k].workspace;
              c["value"] = this.woredas[k].href;
              c.children = [];
              b.children.push(c);
              // debugger
              var worlay = await this.geoser
                .getLayersFromGeoserver(this.woredas[k].href)
                .toPromise();
              // console.log("worlay",worlay.layer.name);
              let keys = Object.keys(worlay);
              // console.log("wor.key", keys);

              if (keys[0] == "layer") {
                // console.log("wor.layer.name", worlay.layer.name);
                continue;
              }
              // console.log("worlay", worlay.layerGroup.publishables.published);
              this.woredaLayers = worlay.layerGroup.publishables.published;
              // console.log('ddd', this.woredaLayers);

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
                };
                const element = this.woredaLayers[l].name.split(":");
                this.woredaLayers[l].name = element[1];
                this.woredaLayers[l].workspace = element[0];
                d["label"] = this.woredaLayers[l].name;
                d["workspace"] = this.woredaLayers[l].workspace;
                d["value"] = this.woredaLayers[l].href;
                d.children = [];
                c.children.push(d);
                // debugger
                var worlayonebyone = await this.geoser
                  .getLayersFromGeoserver(this.woredaLayers[l].href)
                  .toPromise();
                // console.log("worlay",worlay.layer.name);
                let keys = Object.keys(worlayonebyone);
                // console.log("wor.key", keys);

                if (keys[0] == "layer") {
                  // console.log("wor.layer.name", worlayonebyone.layer.name);
                  continue;
                }
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
                  let e: AssignedBodyTree2 = {
                    label: "",
                    workspace: "",
                    value: "",
                  };
                  // debugger
                  const element = this.woredaLayersOneByOne[m].name.split(":");
                  this.woredaLayersOneByOne[m].name = element[1];
                  this.woredaLayersOneByOne[m].workspace = element[0];
                  e["label"] = this.woredaLayersOneByOne[m].name;
                  e["workspace"] = this.woredaLayersOneByOne[m].workspace;
                  e.label = this.woredaLayersOneByOne[m].name;
                  e.value = this.woredaLayersOneByOne[m].href;
                  this.woredaLayersOneByOne[l].children = [];
                  d.children.push(e);
                }
              }
            }
          }
        }
      }
      this.nodes.push(a);
    }

    console.log("this.files", this.nodes);
  }

  // Function to find the "Arada image_M" node in the tree structure
  findAradaImageMNode(nodes: CustomTreeNode[]): CustomTreeNode | undefined {
    for (const topLevelNode of nodes) {
      for (const aradaAddisLandNode of topLevelNode.children) {
        for (const aradaImageMNode of aradaAddisLandNode.children) {
          if (aradaImageMNode.label === "Arada image_M") {
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
    const capabilitiesUrl = `${environment.geoser}/${_workspace}/wms?service=wms&request=getcapabilities&version=1.1.0&tiled=true`;

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
    if (layerName === "Relocation") {
      // const MultiPolygonLayer = geojson.features.find(feature => feature.geometry.type === "MultiPolygon");

      //   if (MultiPolygonLayer && MultiPolygonLayer.geometry.type === "MultiPolygon") {
      //  // console.log("The fetched layer is a MultiPolygon.",layerName);

      //   if (layerName==="Relocation"){
      //     //
      const options = {
        style: function (feature) {
          return {
            color: null,
          };
        },
      };
      // console.log("hhh", geojson)
      (this.vectorLayer = L.Proj.geoJson(geojson, options)), {};
      console.log(
        "The fetched layer is a multipolygon.",
        this.vectorLayer,
        layerName
      );
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
        this.vectorLayer = L.Proj.geoJson(geojson, {});
        console.log("gg", this.vectorLayer, layerName);
      } else if (Points && Points.geometry.type === "Point") {
        this.newpointLayer = layerName;
        const colorMap = {}; // Map to store generated colors for each layer
        const options = {
          style: function (feature) {
            return {
              color: null,
            };
          },
          pointToLayer: function (feature, latlng) {
            let fillColor = "#ff0000"; //default fill color

            // Generate dynamic color for other point type layers
            //fillColor =  "#" + Math.floor(Math.random() * 16777215).toString(16);
            if (colorMap[layerName]) {
              fillColor = colorMap[layerName];
            } else {
              // Generate a new color for the layer
              fillColor =
                "#" + Math.floor(Math.random() * 16777215).toString(16);
              colorMap[layerName] = fillColor;
            }
            // }

            return L.circleMarker(latlng, {
              radius: 5, // Set your desired radius
              fillColor: fillColor, // Set your desired fill color

              color: "#000000", // Set your desired border color
              weight: 1, // Set your desired border weight
              opacity: 1, // Set your desired opacity
              fillOpacity: 0.8, // Set your desired fill opacity
            });
          },
        };
        //
        (this.vectorLayer = L.Proj.geoJson(geojson, options)), {};
        console.log("points", layerName);
      } else {
        const options = {
          style: function (feature) {
            return {
              color: null,
            };
          },
        };

        //
        (this.vectorLayer = L.Proj.geoJson(geojson, options)),
          {
            //     onEachFeature: (feature, layer) => {
            //       const properties = feature.properties; // Access the properties of the feature
            //       let popupContent = `Layer: ${layerName}<br>Feature ID: ${feature.id}<br>`;
            //       // Dynamically add the properties to the popup content
            //       for (const propertyName in properties) {
            //         if (properties.hasOwnProperty(propertyName)) {
            //           popupContent += `${propertyName}: ${properties[propertyName]}<br>`;
            //         }
            //       }
            //       // Bind the customized popup content to the layer
            //       layer.bindPopup(popupContent);
            //     },
            //     coordsToLatLng: (coords: [number, number] | [number, number, number]) => {
            //       if (coords.length >= 2) {
            //         // Ignore the z-coordinate and use only the x and y coordinates for LatLng
            //         return L.CRS.EPSG4326.unproject(L.point(coords[0], coords[1]));
            //       }
            //       throw new Error('Invalid coordinate format');
            //     },
            //     attribution: layerName
          };
        console.log("other", layerName);
      }
    }
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

    // Define your Leaflet CRS with the updated resolutions
    this.EPSG20137 = new L.Proj.CRS(
      "EPSG:20137",
      "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs +type=crs",
      {
        resolutions: resolutions,
        origin: [166600.5155002516, 375771.9736823894],
      }
    );

    const mapContainer = document.getElementById("mapp");
    if (!mapContainer) {
      return;
    }
    this.map = L.map("mapp", {
      crs: this.EPSG20137,
      center: [9.032457, 38.759775],
      zoom: 0, // Set the map CRS to EPSG:20137
      maxZoom: 18,
      minZoom: 3,
    }); // Set an appropriate initial view for Ethiopia
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

    // Create a map event listener to track mouse movements
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.map.on("mousemove", (event) => {
      const latLng = event.latlng;
      const lat = latLng.lat;
      const lng = latLng.lng;
      const UTMvalue = this.conveLatLngToUTM(lat, lng);

      // Update the coordinate information element with the current latitude and longitude
      document.getElementById(
        "coordinateInfo"
      ).innerHTML = `Latitude: ${lat.toFixed(
        6
      )}&nbsp;&nbsp; Longitude: ${lng.toFixed(
        6
      )}<br> Easting: ${UTMvalue.easting.toFixed(
        6
      )} &nbsp;&nbsp; Northing: ${UTMvalue.northing.toFixed(6)} `;
    });
    // Add a tile layer to the map (e.g., OpenStreetMap)
    // const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // L.tileLayer(tileLayerUrl).addTo(this.map);
    // Add base tile layer
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: 'OpenStreetMap'
    // }).addTo(this.map);
    // Configure drawing controls
    // this.drawControl = new L.Control.Draw({
    //   draw: {
    //     marker: false, // Disable marker drawing
    //     polyline: false, // Disable polyline drawing
    //     circle: false, // Disable circle drawing
    //     circlemarker: false, // Disable circlemarker drawing
    //     polygon: {
    //       allowIntersection: false, // Prevents intersecting polygons
    //       drawError: {
    //         color: "#de3214", // Error color
    //         timeout: 1000, // Error message display duration in milliseconds
    //       },
    //       shapeOptions: {
    //         color: "#de3214", // Outline color
    //         fillColor: "#ff0000", // Fill color of the polygon (change this to the desired color)
    //         fillOpacity: 0.6, // Opacity of the fill color (0 to 1)
    //       },
    //       showArea: true, // Display polygon area while drawing
    //     },
    //   },
    //   edit: {
    //     featureGroup: L.featureGroup(), // Create a feature group for drawn items
    //   },
    // });

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
    const drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);

    this.map.on("draw:created", (e) => {
      console.log("Shape created:", e, this.ServiceService.check);
      const layer = e.layer;

      if (!this.ServiceService.check) {
        console.log("Shape created:alllatlong", this.alllatlong);

        // Assuming limited area bounds as a polygon
        const limitedAreaBounds = L.polygon(this.alllatlong[0][0]).addTo(
          this.map
        );

        console.log(limitedAreaBounds);
        if (layer instanceof L.Polygon) {
          if (limitedAreaBounds.getBounds().contains(layer.getBounds())) {
            this.map.addLayer(layer);

            this.coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the polygon
            // Convert the drawn polygon to GeoJSON
            // Convert the drawn polygon to GeoJSON
            // Assuming this.coordinates is an array of L.LatLng objects

            console.log(this.coordinates);
            // Convert each L.LatLng object to [x, y] point
            //this.convertLatLngToUTM(this.coordinates)

            // Assuming you already have the 'points' array from the previous code
            const utmCoordinates = this.convertCoordinatesToUTM(
              this.coordinates
            );
            this.utmCoordinates = utmCoordinates;
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
            utmCoordinates.push(utmCoordinates[0]);
            //points.push(points[0])
            this.sample = this.drawnShape;
            console.log("utmCoordinates", utmCoordinates);
            // Add the coordinates to the array
            //this.drawnShapes.push(this.coordinates);

            // Do something with the coordinates, such as displaying or processing them

            this.ServiceService.coordinate = utmCoordinates;
            //  this.ServiceService.shapes = this.aaa.push(this.drawnShape);
            // Transform GeoJSON to EPSG:20137 CRS
          } else {
            const toast = this.messageService.add({
              severity: "warn",
              summary: "Warn",
              detail:
                "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡",
            });
            this.map.removeLayer(layer);
            this.editableLayers.removeLayer(layer);
            this.removeShape();
            this.ServiceService.disablebutton = false;
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
            utmCoordinates.push(utmCoordinates[0]);
            //points.push(points[0])
            this.sample = this.drawnShape;
            this.ServiceService.centerLatLng =
              this.convertCoordinatesToUTM(coordinatesArray);
            console.log("utmCoordinates", this.ServiceService.centerLatLng);

            this.ServiceService.coordinate = utmCoordinates;
            // Now you can use circleLatLngs as needed
          } else {
            const toast = this.messageService.add({
              severity: "warn",
              summary: "Warn",
              detail:
                "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡",
            });
            this.map.removeLayer(layer);
            this.editableLayers.removeLayer(layer);
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
          console.log(utmCoordinates);

          // const geojson = layer.toGeoJSON();

          // this.drawnShape = L.Proj.geoJson(geojson);
          // console.log(this.drawnShape);

          // this.drawnShape.addTo(this.map);
          utmCoordinates.push(utmCoordinates[0]);

          this.sample = this.drawnShape;
          console.log("utmCoordinates", utmCoordinates);

          this.ServiceService.coordinate = utmCoordinates;

          //this.drawnShape.bindPopup("This is a polyline!");
        }

        this.editableLayers.addLayer(layer);
      } else {
        if (layer instanceof L.Polygon) {
          this.coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the polygon
          let tempcord = this.coordinates;
          // tempcord.push(tempcord[0]);

          // Assuming you already have the 'points' array from the previous code
          const utmCoordinates = this.convertCoordinatesToUTM(this.coordinates);
          this.utmCoordinates = utmCoordinates;
          if (this.drawnShape) {
            this.map.removeLayer(this.drawnShape);
            this.map.removeLayer(layer);
            this.editableLayers.removeLayer(layer);
            this.removeShape();
          }
          console.log("utmCoordinatescreate", utmCoordinates);

          const area = this.calculateUTMPolygonArea(utmCoordinates);
          this.ServiceService.Totalarea = parseInt(area.toFixed(2));
          // Show the area in a popup
          localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
          console.log(
            "Totalarea",
            area,
            this.ServiceService.Totalarea,
            environment.Totalareatolerance
          );
          const maxAreaDifference =
            environment.Totalareatolerance * this.ServiceService.Totalarea;

          const areaDifference = Math.abs(this.ServiceService.Totalarea - area);
          console.log("Totalareatolerance", areaDifference, maxAreaDifference);
          const popupContent = `Area: ${area.toFixed(
            2
          )} square meters, Tolerance:${maxAreaDifference} square meters `;
          layer.bindPopup(popupContent).openPopup();

          if (
            areaDifference >= maxAreaDifference &&
            this.ServiceService.Totalarea != 0
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

            //this.onDatumChange();
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
            utmCoordinates.push(utmCoordinates[0]);
            //points.push(points[0])
            this.sample = this.drawnShape;
            console.log("utmCoordinates", utmCoordinates);
            // Add the coordinates to the array
            //this.drawnShapes.push(this.coordinates);

            // Do something with the coordinates, such as displaying or processing them

            this.ServiceService.coordinate = utmCoordinates;
            //  this.ServiceService.shapes = this.aaa.push(this.drawnShape);
            // Transform GeoJSON to EPSG:20137 CRS
            this.editableLayers.addLayer(layer);
          }
        } else if (layer instanceof L.Circle) {
          // Get the center LatLng of the circle
          const centerLatLng = layer.getLatLng();

          // Get the radius of the circle in meters
          const radiusMeters = layer.getRadius();

          // Calculate the LatLng coordinates of the circle
          const circleLatLngs = this.calculateCircleCoordinates(
            centerLatLng,
            radiusMeters
          );

          console.log("Circle LatLngs:", circleLatLngs);
          const utmCoordinates = this.convertCoordinatesToUTM(circleLatLngs);
          this.utmCoordinates = utmCoordinates;
          const area = this.calculateUTMPolygonArea(utmCoordinates);
          this.ServiceService.Totalarea = parseInt(area.toFixed(2));
          localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
          // Show the area in a popup
          console.log("Totalarea", area, utmCoordinates);
          const maxAreaDifference =
            environment.Totalareatolerance * this.ServiceService.Totalarea;
          const areaDifference = Math.abs(this.ServiceService.Totalarea - area);
          console.log("Totalareatolerance", areaDifference, maxAreaDifference);
          const popupContent = `Area: ${area.toFixed(
            2
          )} square meters, Tolerance:${maxAreaDifference} square meters `;
          layer.bindPopup(popupContent).openPopup();
          if (
            areaDifference >= maxAreaDifference &&
            this.ServiceService.Totalarea != 0
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

            console.log(this.drawnShape);

            // Add the transformed GeoJSON layer to the map

            this.drawnShape.addTo(this.map);
            utmCoordinates.push(utmCoordinates[0]);
            //points.push(points[0])
            this.sample = this.drawnShape;
            console.log("utmCoordinates", utmCoordinates);
            // Add the coordinates to the array
            //this.drawnShapes.push(this.coordinates);

            // Do something with the coordinates, such as displaying or processing them
            this.editableLayers.addLayer(layer);
            this.ServiceService.coordinate = utmCoordinates;
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
          console.log(utmCoordinates);

          // const geojson = layer.toGeoJSON();

          // this.drawnShape = L.Proj.geoJson(geojson);
          // console.log(this.drawnShape);

          this.drawnShape.addTo(this.map);
          utmCoordinates.push(utmCoordinates[0]);

          this.sample = this.drawnShape;
          // console.log("utmCoordinates", utmCoordinates);

          this.ServiceService.coordinate = utmCoordinates;

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
          const coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the edited polygon

          // Assuming you have a function to convert coordinates to UTM
          const utmCoordinates = this.convertCoordinatesToUTM(coordinates);
          console.log("UTM Coordinates:", utmCoordinates);
          const area = this.calculateUTMPolygonArea(utmCoordinates);
          localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
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
              utmCoordinates.push(utmCoordinates[0]);
              // Convert the edited polygon to GeoJSON
              const geojson = layer.toGeoJSON();

              // Create a layer with the transformed GeoJSON
              const drawnShape = L.Proj.geoJson(geojson);

              // Add the transformed GeoJSON layer to the map
              drawnShape.addTo(this.map);
              // this.editableLayers.addLayer(this.drawnShape);
              // Do something with the coordinates, such as displaying or processing them
              // For example, you can set them in a service or perform other actions
              this.ServiceService.coordinate = utmCoordinates;
              console.log("utmCoordinates", utmCoordinates);
              // this.ServiceService.shapes.push(drawnShape);

              // Transform GeoJSON to EPSG:20137 CRS if needed
            }
          } else {
            const coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the edited polygon

            // Assuming you have a function to convert coordinates to UTM
            const utmCoordinates = this.convertCoordinatesToUTM(coordinates);
            utmCoordinates.push(utmCoordinates[0]);
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
            this.ServiceService.coordinate = utmCoordinates;
            // this.ServiceService.shapes.push(drawnShape);

            // Transform GeoJSON to EPSG:20137 CRS if needed
          }
        }
      });
    });

    // Handle draw events
    // this.map.on(L.Draw.Event.CREATED, (event: L.DrawEvents.Created) => {
    //   const layer: L.Layer = event.layer;
    //   console.log(layer);
    //   if (layer instanceof L.Polygon) {
    //     this.coordinates = layer.getLatLngs()[0] as L.LatLng[]; // Get the coordinates of the polygon
    //     // Convert the drawn polygon to GeoJSON
    //     // Convert the drawn polygon to GeoJSON
    //     // Assuming this.coordinates is an array of L.LatLng objects

    //     console.log(this.coordinates);
    //     // Convert each L.LatLng object to [x, y] point
    //     //this.convertLatLngToUTM(this.coordinates)

    //     // Assuming you already have the 'points' array from the previous code
    //     const utmCoordinates = this.convertCoordinatesToUTM(this.coordinates);
    //     this.utmCoordinates = utmCoordinates;
    //     console.log(utmCoordinates);
    //     // Convert each L.LatLng object to [x, y] point
    //     // Assuming this.coordinates is an array of L.LatLng objects
    //     // Convert each L.LatLng object to [x, y] point

    //     const geojson = layer.toGeoJSON();

    //     // Create a layer with the transformed GeoJSON
    //     this.drawnShape = L.Proj.geoJson(geojson);
    //     console.log(this.drawnShape);

    //     // Add the transformed GeoJSON layer to the map

    //     this.drawnShape.addTo(this.map);
    //     utmCoordinates.push(utmCoordinates[0]);
    //     //points.push(points[0])
    //     this.sample = this.drawnShape;
    //     console.log("utmCoordinates", utmCoordinates);
    //     // Add the coordinates to the array
    //     //this.drawnShapes.push(this.coordinates);

    //     // Do something with the coordinates, such as displaying or processing them

    //     this.ServiceService.coordinate = utmCoordinates;
    //     this.ServiceService.shapes = this.aaa.push(this.drawnShape);
    //     // Transform GeoJSON to EPSG:20137 CRS
    //   }

    //   // Add the layer to the map
    // });

    // Geoserver information
    // const geoserverUrl = environment.geoserverUrl;
    // const groupLayerName = environment.groupLayerName;
    // const geoserverUrlwfs = environment.geoserverUrlwfs;
    // console.log(geoserverUrl, groupLayerName);

    // // GetCapabilities request to retrieve layer names within the group
    // const capabilitiesUrl = `${geoserverUrl}?service=WMS&version=1.1.0&request=GetCapabilities`;

    // fetch(capabilitiesUrl)
    //   .then((response) => response.text())
    //   .then((data) => {
    //     const parser = new DOMParser();
    //     const xmlDoc = parser.parseFromString(data, "application/xml");
    //     const layers = xmlDoc.getElementsByTagName("Layer");

    //     for (let i = 0; i < layers.length; i++) {
    //       const layer = layers[i];
    //       let layerName = layer.getElementsByTagName("Name")[0].textContent;
    //       console.log("layerName", layerName, layer);

    //       if (layerName === environment.groupName) {
    //         continue; // Skip this layer if it doesn't belong to the desired group
    //       }

    //       // Create a new layer object and push it to the layers array
    //       const newLayer: Layer = {
    //         name: layerName,
    //         vectorLayer: null,
    //       };

    //       // Add each layer to the map as a vector layer
    //       const getFeatureUrl = `${geoserverUrlwfs}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application/json`;
    //       fetch(getFeatureUrl)
    //         .then((response) => response.json())
    //         .then((geojson) => {
    //           // Create a new vector layer using the fetched GeoJSON data
    //           const vectorLayer = L.Proj.geoJson(geojson, {
    //             style: (feature) => {
    //               // Generate a random color in hexadecimal format
    //               let randomColor =
    //                 "#" + Math.floor(Math.random() * 16777215).toString(16);
    //               if (
    //                 layerName == "Oromiya_woredas" ||
    //                 layerName == "Oromia_Zones"
    //               ) {
    //               } else {
    //                 randomColor = "#8f8686";
    //               }
    //               // Return the style object with the random color
    //               return {
    //                 color: randomColor,
    //                 fillColor: randomColor,
    //                 fillOpacity: 0.5,
    //               };
    //             },

    //             onEachFeature: (feature, layer) => {
    //               const properties = feature.properties; // Access the properties of the feature
    //               let popupContent = `Layer: ${layerName}<br>Feature ID: ${feature.id}<br>`;

    //               // Dynamically add the properties to the popup content
    //               if (layerName == "Oromiya_woredas") {
    //                 console.log(properties);
    //               }

    //               for (const propertyName in properties) {
    //                 if (properties.hasOwnProperty(propertyName)) {
    //                   popupContent += `${propertyName}: ${properties[propertyName]}<br>`;
    //                 }
    //               }

    //               // Bind the customized popup content to the layer
    //               layer.bindPopup(popupContent);
    //             },
    //             coordsToLatLng: (
    //               coords: [number, number] | [number, number, number]
    //             ) => {
    //               if (coords.length >= 2) {
    //                 // Ignore the z-coordinate and use only the x and y coordinates for LatLng
    //                 return L.CRS.EPSG4326.unproject(
    //                   L.point(coords[0], coords[1])
    //                 );
    //               }
    //               throw new Error("Invalid coordinate format");
    //             },
    //             attribution: layerName,
    //           });
    //           vectorLayer.on("click", (event: L.LeafletEvent) => {
    //             const clickedLayer = event.layer;
    //             const clickedFeature = clickedLayer.feature;

    //             if (clickedFeature && clickedFeature.properties) {
    //               let popupContent = "<div>";
    //               for (const key in clickedFeature.properties) {
    //                 if (clickedFeature.properties.hasOwnProperty(key)) {
    //                   popupContent += `<div><strong>${key}:</strong> ${clickedFeature.properties[key]}</div>`;
    //                 }
    //               }
    //               popupContent += "</div>";

    //               // Bind the customized popup content to the layer
    //               clickedLayer.bindPopup(popupContent).openPopup();
    //             }
    //           });

    //           // Store the vector layer reference in the newLayer object
    //           newLayer.vectorLayer = vectorLayer;
    //           console.log(vectorLayer);
    //           if (
    //             layerName === "Oromiya_woredas" &&
    //             this.ServiceService.check
    //           ) {
    //             this.toggleLayer(true, "Oromiya_woredas");
    //           }

    //           // Add the vector layer to the map
    //           // vectorLayer.addTo(this.map);
    //         })
    //         .catch((error) => {
    //           console.error("Error fetching GeoJSON:", error);
    //         });
    //       this.layers.push(newLayer);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching GetCapabilities:", error);
    //   });
  }
  // handleLayerSelection(
  //   checked: boolean,
  //   event: any,
  //   targetArray: TreeNode[]
  // ): void {
  //   if (checked) {
  //     this.geoser.getLayersFromGeoserver(event).subscribe(
  //       (data: any) => {
  //         const layersData = [data.layerGroup.publishables.published];
  //         console.log("handleLayerSelection", layersData);

  //         if (Array.isArray(layersData)) {
  //           // If layersData is an array, map it to match the Layer interface
  //           const layers: TreeNode[] = layersData.map((layerData: any) => {
  //             return {
  //               href: layerData.href,
  //               lable: layerData.name,
  //               name: layerData.name,
  //               // You can set tileLayer and vectorLayer properties here if applicable
  //             };
  //           });

  //           // Handle the fetched layers here
  //           console.log("handleLayerSelection", layers);

  //           // Add the layers to the targetArray
  //           console.log("Before push:", this.targetArray);
  //           this.targetArray.push(...layers);
  //           console.log("After push:", this.targetArray);

  //           for (let index = 0; index < this.targetArray.length; index++) {
  //             const element = this.targetArray[index].name.split(":");
  //             this.targetArray[index].lable = element[1];
  //           }
  //         } else {
  //           // If layersData is not an array, handle it accordingly
  //           // You might need to create a single Layer object here or handle it in a way that matches your requirements
  //         }
  //       },
  //       (error: any) => {
  //         console.error("Error fetching data:", error);
  //         // Handle the error, e.g., show an error message to the user
  //       }
  //     );
  //   } else {
  //     // Clear the targetArray when unchecked
  //     this.targetArray.length = 0;
  //   }
  // }

  // Example usage in your existing functions:
  // ParentGroupLayerSelected(checked: boolean, event: any): void {
  //   this.handleLayerSelection(checked, event, this.subcities);
  // }

  // SubcitiesSelected(checked: boolean, event: any): void {
  //   this.handleLayerSelection(checked, event, this.woredas);
  // }

  // WoredasSelected(checked: boolean, event: any): void {
  //   this.handleLayerSelection(checked, event, this.woredaLayers);
  // }

  // WoredaLayersSelected(checked: boolean, event: any): void {
  //   this.handleLayerSelection(checked, event, this.woredaLayersOneByOne);
  // }
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

  // Function to convert latitude and longitude to UTM
  // Function to convert latitude and longitude to UTM
  //  convertLatLngToUTM(latitude: number, longitude: number): { northing: number, easting: number, zone: number, hemisphere: string } {
  //   const degToRad = (deg: number) => deg * (Math.PI / 180);
  //   const radToDeg = (rad: number) => rad * (180 / Math.PI);

  //   const WGS84_A = 6378137.0; // WGS 84 semi-major axis
  //   const WGS84_E = 0.08181919104281579; // WGS 84 first eccentricity

  //   const utmScaleFactor = 0.9996; // UTM scale factor for most zones

  //   const zone = Math.floor((longitude + 180) / 6) + 1; // UTM zone is based on longitude

  //   // Convert latitude and longitude to radians
  //   const phi = degToRad(latitude);
  //   const lambda = degToRad(longitude);

  //   // Calculate UTM parameters
  //   const lambda0 = degToRad((zone - 1) * 6 - 180 + 3); // Central meridian for the zone

  //   const N = WGS84_A / Math.sqrt(1 - WGS84_E * WGS84_E * Math.sin(phi) * Math.sin(phi));
  //   const T = Math.tan(phi) * Math.tan(phi);
  //   const C = WGS84_E * WGS84_E * Math.cos(phi) * Math.cos(phi) / (1 - WGS84_E * WGS84_E);

  //   const A = (lambda - lambda0) * Math.cos(phi);
  //   const M = WGS84_A * ((1 - WGS84_E * WGS84_E / 4 - 3 * WGS84_E * WGS84_E * WGS84_E * WGS84_E / 64 - 5 * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E / 256) * phi
  //     - (3 * WGS84_E * WGS84_E / 8 + 3 * WGS84_E * WGS84_E * WGS84_E * WGS84_E / 32 + 45 * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E / 1024) * Math.sin(2 * phi)
  //     + (15 * WGS84_E * WGS84_E * WGS84_E * WGS84_E / 256 + 45 * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E / 1024) * Math.sin(4 * phi)
  //     - (35 * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E * WGS84_E / 3072) * Math.sin(6 * phi));

  //   const Easting = utmScaleFactor * N * (A + (1 - T + C) * A * A * A / 6 + (5 - 18 * T + T * T + 72 * C - 58 * WGS84_E * WGS84_E) * A * A * A * A * A / 120);
  //   const Northing = utmScaleFactor * (M + N * Math.tan(phi) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24 + (61 - 58 * T + T * T + 600 * C - 330 * WGS84_E * WGS84_E) * A * A * A * A * A * A / 720));

  //   // Determine the hemisphere (Northern or Southern)
  //   const hemisphere = latitude >= 0 ? 'N' : 'S';

  //   return {
  //     northing: Northing,
  //     easting: Easting,
  //     zone: zone,
  //     hemisphere: hemisphere,
  //   };
  // }

  //  convertLatLngToUTM(latitude: number, longitude: number): { northing: number, easting: number, zone: number, hemisphere: string } {
  //   const degToRad = (deg: number) => deg * (Math.PI / 180);

  //   // Replace the following values with the Adindan ellipsoid parameters
  //   const ADINDAN_A = 6378249.145; // Adindan semi-major axis
  //   const ADINDAN_E = 0.006803511; // Adindan first eccentricity

  //   // Replace the following values with the UTM parameters for zone 37N
  //   const ZONE_37N_CENTRAL_MERIDIAN = degToRad(37 * 6 - 183); // Central meridian for UTM zone 37N
  //   const utmScaleFactor = 0.9996; // UTM scale factor for most zones

  //   // Convert latitude and longitude to radians
  //   const phi = degToRad(latitude);
  //   const lambda = degToRad(longitude);

  //   // Calculate UTM parameters using Adindan ellipsoid
  //   const N = ADINDAN_A / Math.sqrt(1 - ADINDAN_E * ADINDAN_E * Math.sin(phi) * Math.sin(phi));
  //   const T = Math.tan(phi) * Math.tan(phi);
  //   const C = ADINDAN_E * ADINDAN_E * Math.cos(phi) * Math.cos(phi) / (1 - ADINDAN_E * ADINDAN_E);
  //   const A = (lambda - ZONE_37N_CENTRAL_MERIDIAN) * Math.cos(phi);
  //   const M = ADINDAN_A * ((1 - ADINDAN_E * ADINDAN_E / 4 - 3 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 64 - 5 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 256) * phi
  //     - (3 * ADINDAN_E * ADINDAN_E / 8 + 3 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 32 + 45 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 1024) * Math.sin(2 * phi)
  //     + (15 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 256 + 45 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 1024) * Math.sin(4 * phi)
  //     - (35 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 3072) * Math.sin(6 * phi));

  //   const Easting = utmScaleFactor * N * (A + (1 - T + C) * A * A * A / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ADINDAN_E * ADINDAN_E) * A * A * A * A * A / 120);
  //   const Northing = utmScaleFactor * (M + N * Math.tan(phi) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24 + (61 - 58 * T + T * T + 600 * C - 330 * ADINDAN_E * ADINDAN_E) * A * A * A * A * A * A / 720));

  //   // Determine the hemisphere (Northern or Southern)
  //   const hemisphere = latitude >= 0 ? 'N' : 'S';

  //   return {
  //     northing: Northing,
  //     easting: Easting,
  //     zone: 37, // UTM zone 37N
  //     hemisphere: hemisphere,
  //   };
  // }
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

  // convertUTMToLatLng(northing: number, easting: number): { lat: number, lng: number } {
  //   // Replace the following values with the UTM parameters for zone 37N
  //  let hemisphere = 'n'
  //    const degToRad = (deg: number) => deg * (Math.PI / 180);
  //     const radToDeg = (rad: number) => rad * (180 / Math.PI)
  //   const ZONE_37N_CENTRAL_MERIDIAN = degToRad(37 * 6 - 183); // Central meridian for UTM zone 37N
  //   const utmScaleFactor = 0.9996; // UTM scale factor for most zones
  //   const ADINDAN_A = 6378249.145; // Adindan semi-major axis6378249.145
  //   const ADINDAN_E = 0.006803511; // Adindan first eccentricity0.006803511

  //   // Convert UTM coordinates to latitude and longitude
  //   const x = easting / utmScaleFactor;
  //   let y = northing;
  //   if (hemisphere === 'S' || hemisphere === 's') {
  //     y -= 10000000.0; // Southern hemisphere offset
  //   }

  //   const M = y / utmScaleFactor;
  //   const mu = M / (ADINDAN_A * (1 - ADINDAN_E * ADINDAN_E / 4 - 3 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 64 - 5 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 256));
  //   const phi1Rad = mu + (3 * ADINDAN_E / 2 - 27 * ADINDAN_E * ADINDAN_E * ADINDAN_E / 32) * Math.sin(2 * mu) + (21 * ADINDAN_E * ADINDAN_E / 16 - 55 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 32) * Math.sin(4 * mu) + (151 * ADINDAN_E * ADINDAN_E * ADINDAN_E / 96) * Math.sin(6 * mu) + (1097 * ADINDAN_E * ADINDAN_E * ADINDAN_E * ADINDAN_E / 512) * Math.sin(8 * mu);
  //   const phi1 = radToDeg(phi1Rad);

  //   const N1 = ADINDAN_A / Math.sqrt(1 - ADINDAN_E * ADINDAN_E * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  //   const T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  //   const C1 = ADINDAN_E * ADINDAN_E * Math.cos(phi1Rad) * Math.cos(phi1Rad) / (1 - ADINDAN_E * ADINDAN_E);
  //   const R1 = ADINDAN_A * (1 - ADINDAN_E * ADINDAN_E) / Math.pow(1 - ADINDAN_E * ADINDAN_E * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  //   const D = x / (N1 * utmScaleFactor);

  //   const latRad = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * ADINDAN_E * ADINDAN_E) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * ADINDAN_E * ADINDAN_E - 3 * C1 * C1) * D * D * D * D * D * D / 720);
  //   const lngRad = ZONE_37N_CENTRAL_MERIDIAN + (1 / Math.cos(phi1Rad)) * (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * ADINDAN_E * ADINDAN_E + 24 * T1 * T1) * D * D * D * D * D / 120);

  //   const latitude = radToDeg(latRad);
  //   const longitude = radToDeg(lngRad);

  //   return {
  //     lat: latitude,
  //     lng: longitude,
  //   };
  // }
  convertUTMToLatLng(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: string
  ): { lat: number; lng: number } {
    // Constants for WGS84 datum
    const WGS84_A = 6378137.0; // WGS 84 semi-major axis
    const WGS84_E = 0.08181919104281579; // WGS 84 first eccentricity

    // Constants for UTM
    const UTM_K0 = 0.9996; // UTM scale factor for most zones
    const UTM_FE = 500000.0; // False easting for UTM
    const UTM_FN_N = 0.0; // False northing for northern hemisphere
    const UTM_FN_S = 10000000.0; // False northing for southern hemisphere

    // Check if the hemisphere is southern (negative northing) and adjust northing accordingly
    if (hemisphere === "S" || hemisphere === "s") {
      northing -= UTM_FN_S; // Southern hemisphere offset
    } else {
      northing -= UTM_FN_N; // Northern hemisphere offset
    }

    const eccPrimeSquared = (WGS84_E * WGS84_E) / (1 - WGS84_E * WGS84_E);
    const M = northing / UTM_K0;

    const mu =
      M /
      (WGS84_A *
        (1 -
          WGS84_E / 4 -
          (3 * WGS84_E * WGS84_E) / 64 -
          (5 * WGS84_E * WGS84_E * WGS84_E) / 256));
    const phi1Rad =
      mu +
      ((3 * WGS84_E) / 2 - (27 * WGS84_E * WGS84_E * WGS84_E) / 32) *
        Math.sin(2 * mu) +
      ((21 * WGS84_E * WGS84_E) / 16 -
        (55 * WGS84_E * WGS84_E * WGS84_E * WGS84_E) / 32) *
        Math.sin(4 * mu) +
      ((151 * WGS84_E * WGS84_E * WGS84_E) / 96) * Math.sin(6 * mu) +
      ((1097 * WGS84_E * WGS84_E * WGS84_E * WGS84_E) / 512) * Math.sin(8 * mu);
    const phi1 = (phi1Rad * 180) / Math.PI;

    const N1 =
      WGS84_A /
      Math.sqrt(1 - WGS84_E * WGS84_E * Math.sin(phi1Rad) * Math.sin(phi1Rad));
    const T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
    const C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
    const R1 =
      (WGS84_A * (1 - WGS84_E * WGS84_E)) /
      Math.pow(
        1 - WGS84_E * WGS84_E * Math.sin(phi1Rad) * Math.sin(phi1Rad),
        1.5
      );
    const D = (easting - UTM_FE) / (N1 * UTM_K0);

    const latRad =
      phi1Rad -
      ((N1 * Math.tan(phi1Rad)) / R1) *
        ((D * D) / 2 -
          ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) *
            D *
            D *
            D *
            D) /
            24 +
          ((61 +
            90 * T1 +
            298 * C1 +
            45 * T1 * T1 -
            252 * eccPrimeSquared -
            3 * C1 * C1) *
            D *
            D *
            D *
            D *
            D *
            D) /
            720);
    const lat = (latRad * 180) / Math.PI;

    let lng =
      (D -
        ((1 + 2 * T1 + C1) * D * D * D) / 6 +
        ((5 -
          2 * C1 +
          28 * T1 -
          3 * C1 * C1 +
          8 * eccPrimeSquared +
          24 * T1 * T1) *
          D *
          D *
          D *
          D *
          D) /
          120) /
      Math.cos(phi1Rad);
    lng = zone * 6 - 183.0 + lng;

    return {
      lat,
      lng,
    };
  }

  // toggleLayer(visibility: boolean, layerName: string) {
  //   const layer = this.layers.find((l) => l.name === layerName);
  //   console.log(layer);

  //   if (layer && layer.vectorLayer) {
  //     if (visibility) {
  //       console.log(layer.vectorLayer);
  //       this.map.addLayer(layer.vectorLayer);
  //     } else {
  //       console.log(layer.vectorLayer);

  //       this.map.removeLayer(layer.vectorLayer);
  //     }
  //   }
  // }

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
      let isNorthernHemisphere: any = "N";
      let zone = 37;
      const latLng = this.conveUTMToLatLng(
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
    }
  }

  drawPolygon() {
    console.log(this.pinpointedPoints);
    this.coordinates = this.pinpointedPoints;
    this.coordinates.push(this.coordinates[0]);
    this.drawnShape = L.polygon(this.pinpointedPoints).addTo(this.map);

    const utmCoordinates = this.convertCoordinatesToUTM(this.pinpointedPoints);
    const area = this.calculateUTMPolygonArea(utmCoordinates);
    this.ServiceService.Totalarea = parseInt(area.toFixed(2));
    // Show the area in a popup
    localStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
    this.utmCoordinates = utmCoordinates;
    utmCoordinates.push(utmCoordinates[0]);
    this.ServiceService.coordinate = utmCoordinates;
    console.log(utmCoordinates);

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
    this.fileInput.nativeElement.value = "";
    this.map.removeLayer(this.sample);
    this.map.removeLayer(this.drawnShape);
    this.removeLayerFromMap();
  }

  importShapes(event: any): void {
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const arrayBuffer: ArrayBuffer = e.target.result;
      const data: Uint8Array = new Uint8Array(arrayBuffer);
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: "array" });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      console.log("jsonData", jsonData);

      // Process the imported shapes and add them to the map
      this.processImportedShapes(jsonData);
      this.fromexcel = true;
    };
    fileReader.readAsArrayBuffer(file);
  }
  async addShapefileToMap(event: any) {
    console.log(event.target.files[0]);
    const geo = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75407386550595, 9.039506462634483, 0],
                [38.75415290737265, 9.039428138933948, 0],
                [38.75422678428948, 9.0393449817289, 0],
                [38.75422697890963, 9.03934512477016, 0],
                [38.754226947946286, 9.03934516454739, 0],
                [38.75437879443044, 9.039456785574144, 0],
                [38.75444612667708, 9.039506280527556, 0],
                [38.75444365298967, 9.039509848930724, 0],
                [38.75437770814936, 9.03959089586566, 0],
                [38.754377429490404, 9.039591237579838, 0],
                [38.75418968781345, 9.039633720995313, 0],
                [38.75407386550595, 9.039506462634483, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 1,
            OBJECTID: 32,
            x: 472899.209016,
            y: 999022.882743,
            parcel_cod: "0505109",
            SHAPE_Leng: 106.709383185,
            Shape_Le_1: 106.709383187,
            Shape_Area: 727.498171977,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75440143382939, 9.039093610780556, 0],
                [38.75440779573345, 9.039082958227757, 0],
                [38.7544407694081, 9.03902774975848, 0],
                [38.754510448771335, 9.03891110421062, 0],
                [38.754537603083165, 9.038926630923864, 0],
                [38.754632488116044, 9.038980886564488, 0],
                [38.75464406201476, 9.038987504385608, 0],
                [38.754720119592875, 9.039030994725055, 0],
                [38.754693836454315, 9.039075361841935, 0],
                [38.75466754693326, 9.039119738901855, 0],
                [38.75461169033327, 9.039214025454738, 0],
                [38.754531272442826, 9.039167969728759, 0],
                [38.7544778224257, 9.039137358269146, 0],
                [38.754428730930556, 9.039109244328406, 0],
                [38.75440143382939, 9.039093610780556, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 2,
            OBJECTID: 33,
            x: 472932.863875,
            y: 998974.000993,
            parcel_cod: "0505114",
            SHAPE_Leng: 100.202563599,
            Shape_Le_1: 100.202563605,
            Shape_Area: 625.014723779,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75496585294843, 9.039171506468282, 0],
                [38.75483002059979, 9.039406892186951, 0],
                [38.75459291734975, 9.039271943368318, 0],
                [38.754683324283384, 9.039113288612237, 0],
                [38.754709072954824, 9.03906811523006, 0],
                [38.75472774608966, 9.039035354987806, 0],
                [38.7547505437208, 9.039048391399945, 0],
                [38.75478000737716, 9.039065238399317, 0],
                [38.75487366824109, 9.039118794887353, 0],
                [38.75496585294843, 9.039171506468282, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 3,
            OBJECTID: 34,
            x: 472956.86165,
            y: 998991.542123,
            parcel_cod: "0505115",
            SHAPE_Leng: 120.280592154,
            Shape_Le_1: 120.280592149,
            Shape_Area: 904.216433226,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75513130579881, 9.039266111788086, 0],
                [38.75507643161325, 9.039360939055303, 0],
                [38.75503005935973, 9.039441074779644, 0],
                [38.75499519612004, 9.039501321910633, 0],
                [38.75499171528279, 9.039499361345026, 0],
                [38.75496174676136, 9.039482261669333, 0],
                [38.75491959136145, 9.039458091519743, 0],
                [38.75491452430467, 9.039455193736975, 0],
                [38.754881950887885, 9.03943656823342, 0],
                [38.754876993773394, 9.039433900266445, 0],
                [38.75487878744875, 9.039430800841028, 0],
                [38.75489502526555, 9.039402741456094, 0],
                [38.75493540526784, 9.039332960978138, 0],
                [38.75501317637692, 9.039198565416024, 0],
                [38.75513130579881, 9.039266111788086, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 4,
            OBJECTID: 35,
            x: 472981.602477,
            y: 999005.749945,
            parcel_cod: "0505116",
            SHAPE_Leng: 89.9709311049,
            Shape_Le_1: 89.970931111,
            Shape_Area: 449.360302518,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75377991910275, 9.04005291318418, 0],
                [38.75379057872243, 9.040083429098106, 0],
                [38.75383837539895, 9.040220254925929, 0],
                [38.753844572478215, 9.040237994505429, 0],
                [38.753780252374725, 9.040260196596666, 0],
                [38.75359141663044, 9.040325381889932, 0],
                [38.7535613256974, 9.040335768845386, 0],
                [38.753524622705854, 9.040237529139304, 0],
                [38.75351108535484, 9.040201294849812, 0],
                [38.753471111812644, 9.040094299197323, 0],
                [38.75352465126324, 9.040087123598928, 0],
                [38.75377071831896, 9.040054147077539, 0],
                [38.75377991910275, 9.04005291318418, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 5,
            OBJECTID: 36,
            x: 472833.658,
            y: 999097.786769,
            parcel_cod: "0505118",
            SHAPE_Leng: 117.337979085,
            Shape_Le_1: 117.337979089,
            Shape_Area: 832.601678761,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75404035560779, 9.040798458582623, 0],
                [38.75419353987435, 9.040745479815987, 0],
                [38.75424546892533, 9.0407275195956, 0],
                [38.754250902280816, 9.040725640972548, 0],
                [38.75428097959028, 9.040715238575444, 0],
                [38.75428172607729, 9.04071737459821, 0],
                [38.75428226187366, 9.040718912605849, 0],
                [38.75429622353464, 9.040758875498499, 0],
                [38.75429618258197, 9.040758886325062, 0],
                [38.754333262418065, 9.040865348108543, 0],
                [38.75430355228113, 9.040876362196984, 0],
                [38.75430276684249, 9.040876653824165, 0],
                [38.75425020435879, 9.0408961413269, 0],
                [38.754218788641005, 9.040907788319696, 0],
                [38.75409461471548, 9.040953825516869, 0],
                [38.75390518289062, 9.041024055858301, 0],
                [38.75385118327542, 9.04104407689753, 0],
                [38.753821502234175, 9.041055080111564, 0],
                [38.753821330220056, 9.041055144215592, 0],
                [38.753809162768185, 9.041019421898493, 0],
                [38.753799628768924, 9.040991431198718, 0],
                [38.753784330240286, 9.040946516162851, 0],
                [38.75374352540315, 9.040826717700385, 0],
                [38.753773610002035, 9.040816332535886, 0],
                [38.75381081803027, 9.040803488293749, 0],
                [38.753952500294936, 9.040754580296436, 0],
                [38.754017229116904, 9.040732236445274, 0],
                [38.75404035560779, 9.040798458582623, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 6,
            OBJECTID: 37,
            x: 472873.400899,
            y: 999173.915441,
            parcel_cod: "0505119",
            SHAPE_Leng: 171.871475231,
            Shape_Le_1: 171.871475235,
            Shape_Area: 1340.34646228,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.74798749002226, 9.039014057685781, 0],
                [38.74799622253716, 9.039017576757482, 0],
                [38.748147844498085, 9.03907867122842, 0],
                [38.748077281663335, 9.039277437076143, 0],
                [38.74791869661253, 9.039215788759982, 0],
                [38.74791531363738, 9.039214474007764, 0],
                [38.74798749002226, 9.039014057685781, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 7,
            OBJECTID: 38,
            x: 472215.302492,
            y: 998983.745089,
            parcel_cod: "0505123",
            SHAPE_Leng: 84.9680388543,
            Shape_Le_1: 84.9680388558,
            Shape_Area: 446.160578806,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.74804226237229, 9.038858825397451, 0],
                [38.74811503870019, 9.038884319825211, 0],
                [38.74824481172249, 9.038820460815582, 0],
                [38.74834726291652, 9.038811046521188, 0],
                [38.7484378620433, 9.038802683240585, 0],
                [38.748482409531974, 9.03879857117499, 0],
                [38.74848409804399, 9.038798925991518, 0],
                [38.74849376801783, 9.038799430998964, 0],
                [38.748493764507245, 9.039066833452333, 0],
                [38.748370037597944, 9.039091464957291, 0],
                [38.74835406093322, 9.039092590955004, 0],
                [38.7481681700025, 9.03910569351799, 0],
                [38.74815812294839, 9.039083463083031, 0],
                [38.74815675946208, 9.039082827188867, 0],
                [38.748156452927894, 9.039082684067653, 0],
                [38.748147844498085, 9.03907867122842, 0],
                [38.74799622253716, 9.039017576757482, 0],
                [38.74798749002226, 9.039014057685781, 0],
                [38.74804226237229, 9.038858825397451, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 8,
            OBJECTID: 39,
            x: 472241.906514,
            y: 998962.806811,
            parcel_cod: "0505125",
            SHAPE_Leng: 158.69218223,
            Shape_Le_1: 158.692182233,
            Shape_Area: 1439.03273205,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.747644119301405, 9.041968498261337, 0],
                [38.74761038542076, 9.042001567041991, 0],
                [38.74758380731731, 9.042027621833476, 0],
                [38.747571550795044, 9.042039636900496, 0],
                [38.74752230004278, 9.04210846701405, 0],
                [38.747496604030566, 9.04214437782421, 0],
                [38.74744761703257, 9.042115398328457, 0],
                [38.747342771604515, 9.042053374289846, 0],
                [38.74734810347978, 9.042017018922468, 0],
                [38.74750928011044, 9.041844882593756, 0],
                [38.747644119301405, 9.041968498261337, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 9,
            OBJECTID: 40,
            x: 472155.948727,
            y: 999299.088132,
            parcel_cod: "0505126",
            SHAPE_Leng: 95.305719586,
            Shape_Le_1: 95.3057195901,
            Shape_Area: 558.010842191,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75429112097232, 9.041433869108673, 0],
                [38.75421655373608, 9.041459609138409, 0],
                [38.754186048624035, 9.041470138775864, 0],
                [38.753986183577375, 9.041539131135284, 0],
                [38.75395615852944, 9.041450982021944, 0],
                [38.75394927885059, 9.041430784462658, 0],
                [38.753982360260615, 9.041418364360505, 0],
                [38.754018921792344, 9.041403611172148, 0],
                [38.754054374571986, 9.041388243986185, 0],
                [38.754089058969335, 9.041372162631745, 0],
                [38.754129130741646, 9.041352246190328, 0],
                [38.75414228797177, 9.04134538443315, 0],
                [38.75415709101153, 9.041337469132442, 0],
                [38.75420961871465, 9.041307650431891, 0],
                [38.754240456084034, 9.041288833992727, 0],
                [38.75429112097232, 9.041433869108673, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 10,
            OBJECTID: 41,
            x: 472885.162567,
            y: 999234.974078,
            parcel_cod: "05051136",
            SHAPE_Leng: 100.805681859,
            Shape_Le_1: 100.805681857,
            Shape_Area: 502.399891324,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.756366601287546, 9.028270901046223, 0],
                [38.75639212443567, 9.028392157154173, 0],
                [38.75640023456313, 9.028430739457662, 0],
                [38.75616375386569, 9.028470347085825, 0],
                [38.75615988100395, 9.028445315191421, 0],
                [38.756140910681275, 9.028316082112013, 0],
                [38.756366601287546, 9.028270901046223, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 11,
            OBJECTID: 44,
            x: 473119.780741,
            y: 997791.996703,
            parcel_cod: "0501207",
            SHAPE_Leng: 86.9529248483,
            Shape_Le_1: 86.9529248476,
            Shape_Area: 455.70171029,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.756366601287546, 9.028270901046223, 0],
                [38.75645179977562, 9.028253858876607, 0],
                [38.75647600308333, 9.028377310230448, 0],
                [38.75639212443567, 9.028392157154173, 0],
                [38.756366601287546, 9.028270901046223, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 12,
            OBJECTID: 45,
            x: 473136.578189,
            y: 997786.560266,
            parcel_cod: "0501208",
            SHAPE_Leng: 46.51693374,
            Shape_Le_1: 46.5169337411,
            Shape_Area: 130.502973676,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75583654200505, 9.028103071883098, 0],
                [38.75587107582328, 9.02827775649466, 0],
                [38.755676843490804, 9.028316573314495, 0],
                [38.75564877150155, 9.028166402221355, 0],
                [38.75576742164691, 9.028128382685388, 0],
                [38.75583654200505, 9.028103071883098, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 13,
            OBJECTID: 46,
            x: 473063.936967,
            y: 997774.730585,
            parcel_cod: "0501209",
            SHAPE_Leng: 80.1405418629,
            Shape_Le_1: 80.1405418653,
            Shape_Area: 394.121225617,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75661673144154, 9.027042699713508, 0],
                [38.75665223931475, 9.02685462701505, 0],
                [38.75679656978926, 9.026899447404631, 0],
                [38.75676043567946, 9.027089356743435, 0],
                [38.75661673144154, 9.027042699713508, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 14,
            OBJECTID: 47,
            x: 473167.793474,
            y: 997637.087924,
            parcel_cod: "0501218",
            SHAPE_Leng: 75.7583475954,
            Shape_Le_1: 75.7583475917,
            Shape_Area: 350.637235268,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7562516540129, 9.027122265330355, 0],
                [38.75631509335217, 9.026971664739897, 0],
                [38.756606043327444, 9.027082001301544, 0],
                [38.75654574966859, 9.027245892943604, 0],
                [38.756518170652036, 9.027273272877524, 0],
                [38.7562516540129, 9.027122265330355, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 15,
            OBJECTID: 48,
            x: 473137.603751,
            y: 997653.174263,
            parcel_cod: "0501219",
            SHAPE_Leng: 109.569016513,
            Shape_Le_1: 109.569016514,
            Shape_Area: 716.505477891,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75651804682824, 9.027273395807441, 0],
                [38.75629438595841, 9.027477007845736, 0],
                [38.756285696914546, 9.027484914647685, 0],
                [38.75617348400457, 9.027423146952422, 0],
                [38.75616617112978, 9.027418180915953, 0],
                [38.7561597615851, 9.027412104752896, 0],
                [38.7561544244981, 9.027405077767558, 0],
                [38.75614970487563, 9.027395836975952, 0],
                [38.75614816474117, 9.027391380386417, 0],
                [38.75614693885931, 9.027386403013512, 0],
                [38.75614593170549, 9.027376824594143, 0],
                [38.756146353532635, 9.027369217124342, 0],
                [38.75614757618206, 9.027362751665189, 0],
                [38.75615042783269, 9.027354415876705, 0],
                [38.7562516540129, 9.027122265330355, 0],
                [38.75651804682824, 9.027273395807441, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 16,
            OBJECTID: 49,
            x: 473123.722032,
            y: 997674.359805,
            parcel_cod: "0501220",
            SHAPE_Leng: 119.169565995,
            Shape_Le_1: 119.169565995,
            Shape_Area: 873.250652981,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75589148968637, 9.026744444456396, 0],
                [38.7558695829415, 9.026965019370316, 0],
                [38.75567248494527, 9.026947502947525, 0],
                [38.755677985022956, 9.026892124973182, 0],
                [38.75569440096649, 9.026726839413383, 0],
                [38.75577465593222, 9.026734008474138, 0],
                [38.75589148968637, 9.026744444456396, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 17,
            OBJECTID: 50,
            x: 473066.160174,
            y: 997623.270546,
            parcel_cod: "0501222",
            SHAPE_Leng: 92.5172571766,
            Shape_Le_1: 92.5172571773,
            Shape_Area: 533.037174456,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.755677985022956, 9.026892124973182, 0],
                [38.75567248494527, 9.026947502947525, 0],
                [38.75565320533555, 9.027141633818164, 0],
                [38.755507790621714, 9.02709507742855, 0],
                [38.75553082845858, 9.026889508047127, 0],
                [38.755677985022956, 9.026892124973182, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 18,
            OBJECTID: 51,
            x: 473045.592951,
            y: 997640.906489,
            parcel_cod: "0501224",
            SHAPE_Leng: 83.5539844397,
            Shape_Le_1: 83.5539844371,
            Shape_Area: 411.600771327,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75569440096649, 9.026726839413383, 0],
                [38.755677985022956, 9.026892124973182, 0],
                [38.75553082845858, 9.026889508047127, 0],
                [38.755510434079135, 9.026887898937456, 0],
                [38.75552723762166, 9.026711918836648, 0],
                [38.75569440096649, 9.026726839413383, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 19,
            OBJECTID: 52,
            x: 473046.327172,
            y: 997618.741063,
            parcel_cod: "0501225",
            SHAPE_Leng: 74.7770091701,
            Shape_Le_1: 74.7770091718,
            Shape_Area: 350.041442072,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75553082845858, 9.026889508047127, 0],
                [38.755507790621714, 9.02709507742855, 0],
                [38.75548314418653, 9.027087095998217, 0],
                [38.755422209997135, 9.027073291660178, 0],
                [38.75529307533889, 9.027055331842684, 0],
                [38.75530561708386, 9.026870079601782, 0],
                [38.755510434079135, 9.026887898937456, 0],
                [38.75553082845858, 9.026889508047127, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 20,
            OBJECTID: 53,
            x: 473025.433315,
            y: 997637.624653,
            parcel_cod: "0501226",
            SHAPE_Leng: 92.2895783652,
            Shape_Le_1: 92.2895783677,
            Shape_Area: 519.842095925,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75552723762166, 9.026711918836648, 0],
                [38.755510434079135, 9.026887898937456, 0],
                [38.75530561708386, 9.026870079601782, 0],
                [38.75529711219541, 9.026869338578525, 0],
                [38.7552962560628, 9.026869268361816, 0],
                [38.7553032013905, 9.026691893299928, 0],
                [38.75552723762166, 9.026711918836648, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 21,
            OBJECTID: 54,
            x: 473025.19267,
            y: 997617.065066,
            parcel_cod: "0501229",
            SHAPE_Leng: 87.5206984156,
            Shape_Le_1: 87.5206984184,
            Shape_Area: 473.170440874,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75530561708204, 9.026870082315295, 0],
                [38.75529307533889, 9.027055331842684, 0],
                [38.755244249443734, 9.02704852099392, 0],
                [38.75514407631172, 9.027040472934544, 0],
                [38.755153457090564, 9.02685953758137, 0],
                [38.7552962560628, 9.026869268361816, 0],
                [38.755297112194796, 9.026869339483039, 0],
                [38.75530561708204, 9.026870082315295, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 22,
            OBJECTID: 55,
            x: 473004.884417,
            y: 997635.430439,
            parcel_cod: "0501228",
            SHAPE_Leng: 73.7863315137,
            Shape_Le_1: 73.7863315159,
            Shape_Area: 335.092841419,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7553032013905, 9.026691893299928, 0],
                [38.7552962560628, 9.026869268361816, 0],
                [38.755153457090564, 9.02685953758137, 0],
                [38.755135789297356, 9.026858333675118, 0],
                [38.755142868008036, 9.026677570450104, 0],
                [38.7553032013905, 9.026691893299928, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 23,
            OBJECTID: 56,
            x: 473004.309501,
            y: 997615.384423,
            parcel_cod: "0501229",
            SHAPE_Leng: 74.9956913908,
            Shape_Le_1: 74.9956913925,
            Shape_Area: 350.089014801,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75514407631172, 9.027040472934544, 0],
                [38.75499357650155, 9.027027605578832, 0],
                [38.75499790700244, 9.026848937158393, 0],
                [38.755135789297356, 9.026858333675118, 0],
                [38.755153457090564, 9.02685953758137, 0],
                [38.75514407631172, 9.027040472934544, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 24,
            OBJECTID: 57,
            x: 472988.186049,
            y: 997634.1262,
            parcel_cod: "0501255",
            SHAPE_Leng: 73.5276359943,
            Shape_Le_1: 73.5276359944,
            Shape_Area: 335.30526511,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.755142868008036, 9.026677570450104, 0],
                [38.755135789297356, 9.026858333675118, 0],
                [38.75499790700244, 9.026848937158393, 0],
                [38.754985032141256, 9.026848060252204, 0],
                [38.75496587406433, 9.026846754944367, 0],
                [38.7549710980513, 9.026736854444088, 0],
                [38.754971666593676, 9.02672490004692, 0],
                [38.75497459700689, 9.026663253090819, 0],
                [38.754974622856565, 9.02666269955404, 0],
                [38.75500017396656, 9.026664823174508, 0],
                [38.755142868008036, 9.026677570450104, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 25,
            OBJECTID: 58,
            x: 472986.200065,
            y: 997613.978664,
            parcel_cod: "0501231",
            SHAPE_Leng: 77.6545491463,
            Shape_Le_1: 77.6545491459,
            Shape_Area: 376.170968176,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7551539277157, 9.02737457284852, 0],
                [38.75499707105501, 9.02735152562946, 0],
                [38.75486684545018, 9.027136746646267, 0],
                [38.75486538589221, 9.027130214278099, 0],
                [38.754866098257864, 9.027123560347196, 0],
                [38.75486890928844, 9.027117480365101, 0],
                [38.75487352375989, 9.027112609093795, 0],
                [38.7548794600114, 9.027109455445254, 0],
                [38.754886099114636, 9.027108348244475, 0],
                [38.75517338880859, 9.027134362383123, 0],
                [38.7551539277157, 9.02737457284852, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 26,
            OBJECTID: 59,
            x: 472984.779576,
            y: 997665.529518,
            parcel_cod: "0501232",
            SHAPE_Leng: 107.940306199,
            Shape_Le_1: 107.9403062,
            Shape_Area: 688.727134831,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.754929647174684, 9.026660494233116, 0],
                [38.75497459700689, 9.026663253090819, 0],
                [38.754971666593676, 9.02672490004692, 0],
                [38.7549710980513, 9.026736854444088, 0],
                [38.75496587406433, 9.026846754944367, 0],
                [38.75496559995066, 9.02685251099945, 0],
                [38.754901397059506, 9.026848940622555, 0],
                [38.75487800084425, 9.026847639718708, 0],
                [38.75483657769651, 9.02684745379103, 0],
                [38.7548240589469, 9.026847398402767, 0],
                [38.75481689655502, 9.026735511498128, 0],
                [38.75481161549078, 9.026657705598724, 0],
                [38.75484815732715, 9.026657720034523, 0],
                [38.754884698253136, 9.026657735370575, 0],
                [38.754929647174684, 9.026660494233116, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 27,
            OBJECTID: 60,
            x: 472968.558667,
            y: 997612.943109,
            parcel_cod: "0501233",
            SHAPE_Leng: 75.4671413807,
            Shape_Le_1: 75.4671413814,
            Shape_Area: 351.207110154,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75487800084425, 9.026847639718708, 0],
                [38.754878553330606, 9.027018494705509, 0],
                [38.75479419240621, 9.027016286603248, 0],
                [38.75468597693638, 9.02684677890369, 0],
                [38.7548240589469, 9.026847398402767, 0],
                [38.75483657769651, 9.02684745379103, 0],
                [38.75487800084425, 9.026847639718708, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 28,
            OBJECTID: 61,
            x: 472958.876161,
            y: 997631.658464,
            parcel_cod: "0501234",
            SHAPE_Leng: 71.4655887186,
            Shape_Le_1: 71.4655887184,
            Shape_Area: 284.752792662,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.754685318310614, 9.026845263426456, 0],
                [38.75464020404335, 9.026777480825087, 0],
                [38.75460962401469, 9.026735132516016, 0],
                [38.754606059468955, 9.026729316913865, 0],
                [38.75460341419835, 9.026723035203705, 0],
                [38.75460174724782, 9.026716429431476, 0],
                [38.75460109672937, 9.026709650674226, 0],
                [38.75460147800787, 9.026702850898142, 0],
                [38.754602881879514, 9.026696185671069, 0],
                [38.75460527639764, 9.026689805118714, 0],
                [38.75460856313154, 9.02668395429472, 0],
                [38.75461268656625, 9.026678653061056, 0],
                [38.754617554726934, 9.026674018036685, 0],
                [38.75462306199944, 9.026670153168597, 0],
                [38.75462908458526, 9.026667143397095, 0],
                [38.75463548960013, 9.026665054661835, 0],
                [38.75473118564387, 9.026658957106559, 0],
                [38.75473362597302, 9.026658836628204, 0],
                [38.754736915231625, 9.02665867330056, 0],
                [38.754769018923724, 9.026657105524418, 0],
                [38.75481157749836, 9.026657377239893, 0],
                [38.75481689655502, 9.026735511498128, 0],
                [38.7548240589469, 9.026847398402767, 0],
                [38.75468597693638, 9.02684677890369, 0],
                [38.754685318310614, 9.026845263426456, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 29,
            OBJECTID: 62,
            x: 472949.910363,
            y: 997612.502192,
            parcel_cod: "0501235",
            SHAPE_Leng: 80.2568127265,
            Shape_Le_1: 80.2568127228,
            Shape_Area: 420.378304015,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75455534337647, 9.027126970861332, 0],
                [38.7545598639062, 9.027302785152818, 0],
                [38.75455899593293, 9.027302732111933, 0],
                [38.75451992530552, 9.027305731558688, 0],
                [38.7544645895982, 9.027307935024742, 0],
                [38.75438900525735, 9.027310945326674, 0],
                [38.75438788028459, 9.027146085895133, 0],
                [38.75455534337647, 9.027126970861332, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 30,
            OBJECTID: 63,
            x: 472922.431651,
            y: 997664.958207,
            parcel_cod: "0501236",
            SHAPE_Leng: 75.0003663449,
            Shape_Le_1: 75.0003663397,
            Shape_Area: 351.643677272,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75439641522664, 9.026872412531961, 0],
                [38.754410512149555, 9.026959199680512, 0],
                [38.754426494756096, 9.027049367300554, 0],
                [38.754426573613074, 9.027049812367224, 0],
                [38.75437515848853, 9.027056127584673, 0],
                [38.75432374245252, 9.027062442794296, 0],
                [38.75426152504035, 9.027070693637608, 0],
                [38.75423950290356, 9.026894362925797, 0],
                [38.75427841388981, 9.02688922516305, 0],
                [38.75431732487509, 9.02688408739617, 0],
                [38.754395307242575, 9.026873421213192, 0],
                [38.75439641522664, 9.026872412531961, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 31,
            OBJECTID: 64,
            x: 472906.705476,
            y: 997637.390924,
            parcel_cod: "0501237",
            SHAPE_Leng: 75.2675819476,
            Shape_Le_1: 75.2675819466,
            Shape_Area: 350.677016954,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.753873151083845, 9.026762274146883, 0],
                [38.75403819077284, 9.026746266487276, 0],
                [38.75405547690913, 9.026918663082625, 0],
                [38.75396815812044, 9.026928445575638, 0],
                [38.753895794386, 9.026937388740812, 0],
                [38.75389098090191, 9.02690563937844, 0],
                [38.753886221933634, 9.026874003114935, 0],
                [38.75387597352444, 9.026795754293204, 0],
                [38.753873151083845, 9.026762274146883, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 32,
            OBJECTID: 65,
            x: 472866.440676,
            y: 997622.816185,
            parcel_cod: "0501258",
            SHAPE_Leng: 74.5765499727,
            Shape_Le_1: 74.57654997,
            Shape_Area: 348.780894204,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.754239420553105, 9.026893702585767, 0],
                [38.75423950290356, 9.026894362925797, 0],
                [38.75426152504035, 9.027070693637608, 0],
                [38.754102480070806, 9.027092402851226, 0],
                [38.754078587809644, 9.0269153707973, 0],
                [38.754239420553105, 9.026893702585767, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 33,
            OBJECTID: 66,
            x: 472889.053898,
            y: 997639.634008,
            parcel_cod: "0501238",
            SHAPE_Leng: 74.9481504802,
            Shape_Le_1: 74.9481504781,
            Shape_Area: 350.071432245,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75394866883852, 9.027568884480173, 0],
                [38.753898398391094, 9.027434048666056, 0],
                [38.7540855763535, 9.027366865651837, 0],
                [38.754121659199846, 9.027507317936069, 0],
                [38.75394866883852, 9.027568884480173, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 34,
            OBJECTID: 67,
            x: 472871.820883,
            y: 997692.212016,
            parcel_cod: "0501240",
            SHAPE_Leng: 73.9911665797,
            Shape_Le_1: 73.9911665839,
            Shape_Area: 334.969363286,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7544645895982, 9.027307935024742, 0],
                [38.75446467378436, 9.027309917744821, 0],
                [38.75447094085871, 9.027457995807346, 0],
                [38.754405235354575, 9.027458946836504, 0],
                [38.75437622408894, 9.027460702069051, 0],
                [38.75432410274927, 9.027465823770143, 0],
                [38.75429967425878, 9.02746922644219, 0],
                [38.75428653921222, 9.027325768493128, 0],
                [38.75438900525735, 9.027310945326674, 0],
                [38.754404974911516, 9.02730863686541, 0],
                [38.75446451168198, 9.02730609883778, 0],
                [38.7544645895982, 9.027307935024742, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 35,
            OBJECTID: 68,
            x: 472912.242967,
            y: 997683.20229,
            parcel_cod: "0501241",
            SHAPE_Leng: 71.3219847513,
            Shape_Le_1: 71.3219847505,
            Shape_Area: 315.056301043,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75528282155279, 9.027651414016363, 0],
                [38.75527497394689, 9.027835021375934, 0],
                [38.75527494992152, 9.027835568582391, 0],
                [38.75523659264393, 9.027833066505954, 0],
                [38.75522288716037, 9.027832012676285, 0],
                [38.75522179362793, 9.027831828334142, 0],
                [38.75512561644411, 9.027815627955597, 0],
                [38.75512997814686, 9.027764645105508, 0],
                [38.75513202447766, 9.027710618878448, 0],
                [38.75512841230964, 9.027656674806899, 0],
                [38.75512857458602, 9.027654850538692, 0],
                [38.755129027985696, 9.027653075307496, 0],
                [38.75512975883026, 9.027651394329252, 0],
                [38.75513075071343, 9.027649850104474, 0],
                [38.755131976311915, 9.027648483317492, 0],
                [38.755133406486856, 9.027647328319894, 0],
                [38.75513500209463, 9.027646414029503, 0],
                [38.7551367249045, 9.027645764842406, 0],
                [38.755138529412946, 9.027645396104722, 0],
                [38.75514037012009, 9.027645317735653, 0],
                [38.755259226164725, 9.027651253577261, 0],
                [38.75528282155279, 9.027651414016363, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 36,
            OBJECTID: 69,
            x: 473002.841484,
            y: 997721.907333,
            parcel_cod: "0501242",
            SHAPE_Leng: 72.2659549816,
            Shape_Le_1: 72.2659549801,
            Shape_Area: 324.99148101,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.755390811815104, 9.027838586280414, 0],
                [38.755371431251035, 9.028028294049715, 0],
                [38.755332500735264, 9.028028495151412, 0],
                [38.755302540497055, 9.028028812573531, 0],
                [38.75527373770732, 9.028027631103393, 0],
                [38.75524593633686, 9.02802560730425, 0],
                [38.75522128157442, 9.02802314510836, 0],
                [38.75522935271067, 9.027923692576982, 0],
                [38.75523657516928, 9.027834693689762, 0],
                [38.75523659264393, 9.027833066505954, 0],
                [38.75527494992152, 9.027835568582391, 0],
                [38.75527497630636, 9.02783557040897, 0],
                [38.75534060577173, 9.027839545082095, 0],
                [38.755355079301154, 9.02784042123245, 0],
                [38.755390811815104, 9.027838586280414, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 37,
            OBJECTID: 70,
            x: 473013.792948,
            y: 997743.3778,
            parcel_cod: "0501243",
            SHAPE_Leng: 75.6716460862,
            Shape_Le_1: 75.6716460897,
            Shape_Area: 352.250231309,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75368101998019, 9.026790761044467, 0],
                [38.753723272702295, 9.027097077458249, 0],
                [38.75356811773542, 9.027118228257134, 0],
                [38.75354020778404, 9.026921091874684, 0],
                [38.753540170713705, 9.026901982480643, 0],
                [38.75354328432348, 9.026883124842204, 0],
                [38.75354946364893, 9.026865029944688, 0],
                [38.75355854185349, 9.02684818610598, 0],
                [38.75357027296555, 9.026833048124269, 0],
                [38.75358434098504, 9.02682002552585, 0],
                [38.75360036535064, 9.02680947081019, 0],
                [38.75361791277594, 9.02680166769938, 0],
                [38.75363650816887, 9.026796829336638, 0],
                [38.75368101998019, 9.026790761044467, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 38,
            OBJECTID: 71,
            x: 472829.517914,
            y: 997636.273885,
            parcel_cod: "0501245",
            SHAPE_Leng: 97.3569998976,
            Shape_Le_1: 97.3569998991,
            Shape_Area: 554.506525109,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75299483240981, 9.026881834822218, 0],
                [38.75318262949532, 9.026856672125168, 0],
                [38.75320315480627, 9.026855711767597, 0],
                [38.753223538497764, 9.026858297857771, 0],
                [38.75324316282816, 9.026864351289271, 0],
                [38.753261438330824, 9.02687369076643, 0],
                [38.75327781200286, 9.026886032809537, 0],
                [38.75329178913252, 9.026901005337251, 0],
                [38.753302949670534, 9.026918156722303, 0],
                [38.753310955499806, 9.026936969364023, 0],
                [38.75331556589196, 9.026956875979456, 0],
                [38.75333937601988, 9.027125687923057, 0],
                [38.75302752345493, 9.027163135450014, 0],
                [38.75299483240981, 9.026881834822218, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 39,
            OBJECTID: 72,
            x: 472778.196435,
            y: 997641.386738,
            parcel_cod: "0501246",
            SHAPE_Leng: 125.829295426,
            Shape_Le_1: 125.829295428,
            Shape_Area: 1040.27961874,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.752796099680864, 9.025811152294636, 0],
                [38.752701290807344, 9.02576001952672, 0],
                [38.752645117736556, 9.025732274169842, 0],
                [38.752587005581056, 9.025708805783296, 0],
                [38.752695288246876, 9.025311463131384, 0],
                [38.75280771621632, 9.025353511196737, 0],
                [38.752893477763706, 9.025393374114133, 0],
                [38.75298577156234, 9.025444743928881, 0],
                [38.75289853706787, 9.025613263255229, 0],
                [38.752796099680864, 9.025811152294636, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 40,
            OBJECTID: 73,
            x: 472735.236697,
            y: 997480.79401,
            parcel_cod: "0501248",
            SHAPE_Leng: 151.947214913,
            Shape_Le_1: 151.94721491,
            Shape_Area: 1385.80289867,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.752077255912326, 9.025552197170644, 0],
                [38.75211559954956, 9.025133106743203, 0],
                [38.75227727554199, 9.025181381298504, 0],
                [38.752287280811196, 9.025188683739762, 0],
                [38.7522942342486, 9.025198903849066, 0],
                [38.752297328711826, 9.025210852569648, 0],
                [38.752297299013215, 9.025217042946876, 0],
                [38.7522834917216, 9.02536805979405, 0],
                [38.752264570984565, 9.02556979754444, 0],
                [38.75225985974361, 9.025580458421434, 0],
                [38.752247106343404, 9.02559233675963, 0],
                [38.75223609616139, 9.025596316370939, 0],
                [38.75222438426349, 9.025596610576287, 0],
                [38.752077255912326, 9.025552197170644, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 41,
            OBJECTID: 74,
            x: 472671.04194,
            y: 997460.286722,
            parcel_cod: "0501250",
            SHAPE_Leng: 131.704087382,
            Shape_Le_1: 131.704087382,
            Shape_Area: 956.939155323,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75271110854884, 9.026896358358217, 0],
                [38.752761436153115, 9.027199027020341, 0],
                [38.75241253987742, 9.027245020129804, 0],
                [38.75237358136242, 9.02694623668204, 0],
                [38.75271110854884, 9.026896358358217, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 42,
            OBJECTID: 75,
            x: 472712.640746,
            y: 997648.540055,
            parcel_cod: "0501251",
            SHAPE_Leng: 143.411902261,
            Shape_Le_1: 143.411902262,
            Shape_Area: 1280.15288158,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75755165650224, 9.026898772446563, 0],
                [38.75758646539712, 9.02668436827809, 0],
                [38.75766068440192, 9.026699684300358, 0],
                [38.75775207770184, 9.026719478054298, 0],
                [38.75775378344589, 9.026719847310574, 0],
                [38.75773512953018, 9.026800198945583, 0],
                [38.75770418078264, 9.02693350999983, 0],
                [38.75770377655311, 9.026935249087044, 0],
                [38.75755165650224, 9.026898772446563, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 43,
            OBJECTID: 76,
            x: 473271.412144,
            y: 997618.927299,
            parcel_cod: "0501278",
            SHAPE_Leng: 84.4531966973,
            Shape_Le_1: 84.4531966973,
            Shape_Area: 436.044921746,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.757874855261015, 9.026952885663633, 0],
                [38.75782691838792, 9.026949971425315, 0],
                [38.757796997625775, 9.026947162222195, 0],
                [38.75776125569216, 9.026942800674128, 0],
                [38.757741936650135, 9.026939983080322, 0],
                [38.75773144432257, 9.026938316403513, 0],
                [38.75770418078264, 9.02693350999983, 0],
                [38.75773512953018, 9.026800198945583, 0],
                [38.757900273737775, 9.026833324778927, 0],
                [38.757874855261015, 9.026952885663633, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 44,
            OBJECTID: 77,
            x: 473288.15456,
            y: 997626.983834,
            parcel_cod: "0501279",
            SHAPE_Leng: 66.0491346103,
            Shape_Le_1: 66.0491346086,
            Shape_Area: 271.122919625,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75819146954728, 9.026193984256677, 0],
                [38.758098570011285, 9.026180437005575, 0],
                [38.75801774684111, 9.026168579150884, 0],
                [38.75799748349858, 9.026165618038426, 0],
                [38.75801732154563, 9.025945262289081, 0],
                [38.75803718238227, 9.025959650590933, 0],
                [38.758047955139766, 9.025969180263518, 0],
                [38.75807009171732, 9.025988761893592, 0],
                [38.75808965807088, 9.026010883475742, 0],
                [38.758109223516925, 9.026033005056302, 0],
                [38.75812592689389, 9.026057336254771, 0],
                [38.758142630273056, 9.026081667452507, 0],
                [38.75816981204782, 9.026134018823, 0],
                [38.75818008598453, 9.02616164811751, 0],
                [38.75819146954728, 9.026193984256677, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 45,
            OBJECTID: 78,
            x: 473318.335666,
            y: 997539.984806,
            parcel_cod: "0501281",
            SHAPE_Leng: 80.1365347645,
            Shape_Le_1: 80.1365347671,
            Shape_Area: 325.160255356,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75773472364223, 9.02578715213396, 0],
                [38.75748535919654, 9.025771165207194, 0],
                [38.757477344059, 9.025631132431489, 0],
                [38.75773300830516, 9.025622521109133, 0],
                [38.75773472364223, 9.02578715213396, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 46,
            OBJECTID: 79,
            x: 473267.098758,
            y: 997496.739212,
            parcel_cod: "0501282",
            SHAPE_Leng: 89.2884648993,
            Shape_Le_1: 89.2884649011,
            Shape_Area: 467.18804124,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75700864858992, 9.024117564971032, 0],
                [38.75691084865043, 9.023929416700499, 0],
                [38.757027390456294, 9.023864956772385, 0],
                [38.75712969731299, 9.02405800676567, 0],
                [38.75700864858992, 9.024117564971032, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 47,
            OBJECTID: 80,
            x: 473201.967192,
            y: 997307.71099,
            parcel_cod: "0501283",
            SHAPE_Leng: 77.0409230295,
            Shape_Le_1: 77.0409230262,
            Shape_Area: 350.519731525,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75725571785347, 9.023702430569834, 0],
                [38.75743262228272, 9.023608876419297, 0],
                [38.757466489052554, 9.023673987516972, 0],
                [38.75747093440876, 9.023706973054109, 0],
                [38.757464670068366, 9.023739666605845, 0],
                [38.757457680441014, 9.023754845839491, 0],
                [38.757436882865626, 9.023780925137702, 0],
                [38.75740136511715, 9.023810549403949, 0],
                [38.757376003103296, 9.023834805830694, 0],
                [38.75735117491488, 9.023862168662065, 0],
                [38.75725571785347, 9.023702430569834, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 48,
            OBJECTID: 81,
            x: 473240.994428,
            y: 997278.347429,
            parcel_cod: "0501284",
            SHAPE_Leng: 76.5906027399,
            Shape_Le_1: 76.5906027372,
            Shape_Area: 362.271916214,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75656698052766, 9.023692519358914, 0],
                [38.7566450096503, 9.023829590160126, 0],
                [38.756399544831446, 9.023996133257675, 0],
                [38.75638244785033, 9.023966146787085, 0],
                [38.75631199891695, 9.023842455804111, 0],
                [38.75656698052766, 9.023692519358914, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 49,
            OBJECTID: 82,
            x: 473142.49001,
            y: 997291.072716,
            parcel_cod: "0501287",
            SHAPE_Leng: 102.161373495,
            Shape_Le_1: 102.161373493,
            Shape_Area: 601.210158253,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.756860386272145, 9.02423252838321, 0],
                [38.756600799603945, 9.024351254000019, 0],
                [38.75650450585868, 9.024161406164751, 0],
                [38.75674354193596, 9.024002679054007, 0],
                [38.756762541006125, 9.02403605321637, 0],
                [38.75681966608914, 9.024143623437329, 0],
                [38.756860386272145, 9.02423252838321, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 50,
            OBJECTID: 83,
            x: 473164.919777,
            y: 997328.925868,
            parcel_cod: "0501288",
            SHAPE_Leng: 114.99364203,
            Shape_Le_1: 114.993642029,
            Shape_Area: 822.447549994,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.756605420357026, 9.024349140530013, 0],
                [38.756600799603945, 9.024351254000019, 0],
                [38.75649468792138, 9.024399776167066, 0],
                [38.75649416998435, 9.024398760974638, 0],
                [38.75639960913598, 9.024213611331303, 0],
                [38.75639860052158, 9.02421163613878, 0],
                [38.75649663574754, 9.024166632579249, 0],
                [38.75650033868711, 9.024164172983255, 0],
                [38.75650450585868, 9.024161406164751, 0],
                [38.756605420357026, 9.024349140530013, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 51,
            OBJECTID: 84,
            x: 473145.027921,
            y: 997339.680844,
            parcel_cod: "0501289",
            SHAPE_Leng: 73.1655280285,
            Shape_Le_1: 73.1655280285,
            Shape_Area: 306.765859144,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75649416998435, 9.024398760974638, 0],
                [38.756494690647315, 9.024399781595882, 0],
                [38.75636763490105, 9.024457895638562, 0],
                [38.75636062366932, 9.024460433540169, 0],
                [38.75635328840617, 9.024461798090087, 0],
                [38.75634582839489, 9.024461952335907, 0],
                [38.75633844289692, 9.024460891887198, 0],
                [38.7562689987745, 9.024445052357086, 0],
                [38.75626081010074, 9.02422674580454, 0],
                [38.75633056152168, 9.024242869552136, 0],
                [38.75639860052158, 9.02421163613878, 0],
                [38.75639960913598, 9.024213611331303, 0],
                [38.75649416998435, 9.024398760974638, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 52,
            OBJECTID: 87,
            x: 473129.447408,
            y: 997346.64114,
            parcel_cod: "0501290",
            SHAPE_Leng: 90.0712159784,
            Shape_Le_1: 90.0712159768,
            Shape_Area: 497.379899221,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75572568127759, 9.023926758524379, 0],
                [38.755714363337255, 9.024055653129968, 0],
                [38.75557101997911, 9.024052031170896, 0],
                [38.75558193978008, 9.023924003721886, 0],
                [38.75572568127759, 9.023926758524379, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 53,
            OBJECTID: 88,
            x: 473051.26005,
            y: 997307.48586,
            parcel_cod: "0501291",
            SHAPE_Leng: 60.0707102303,
            Shape_Le_1: 60.0707102228,
            Shape_Area: 224.494335523,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75529790829348, 9.026464384502653, 0],
                [38.75533348205122, 9.026138941946755, 0],
                [38.75554806594791, 9.026156814789337, 0],
                [38.7555246318999, 9.026486077916509, 0],
                [38.75529790829348, 9.026464384502653, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 54,
            OBJECTID: 89,
            x: 473026.999756,
            y: 997564.385548,
            parcel_cod: "0501292",
            SHAPE_Leng: 121.386549143,
            Shape_Le_1: 121.386549141,
            Shape_Area: 884.788683663,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75488791785981, 9.026202767687112, 0],
                [38.75491960518654, 9.026024032486928, 0],
                [38.75508492277809, 9.0260365660304, 0],
                [38.7550652351779, 9.026162088465249, 0],
                [38.75508039170943, 9.026164661922103, 0],
                [38.75507947546104, 9.026167388378887, 0],
                [38.755062157908036, 9.026218919768235, 0],
                [38.75506132926166, 9.026222615907384, 0],
                [38.755059485116945, 9.026222405738453, 0],
                [38.75488791785981, 9.026202767687112, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 55,
            OBJECTID: 90,
            x: 472978.959191,
            y: 997543.403292,
            parcel_cod: "0501293",
            SHAPE_Leng: 79.9509794692,
            Shape_Le_1: 79.9509794693,
            Shape_Area: 382.034864557,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.755521853071095, 9.02591869856122, 0],
                [38.75537187018353, 9.025904961586267, 0],
                [38.75540023059738, 9.025729227060141, 0],
                [38.75541774167762, 9.025706359387721, 0],
                [38.75543849638299, 9.025699731458623, 0],
                [38.755549384228104, 9.025705573245833, 0],
                [38.755521853071095, 9.02591869856122, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 56,
            OBJECTID: 91,
            x: 473031.010167,
            y: 997508.62175,
            parcel_cod: "0501296",
            SHAPE_Leng: 77.7654146127,
            Shape_Le_1: 77.7654146113,
            Shape_Area: 375.086305207,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7563540393644, 9.025966546753, 0],
                [38.75636245098832, 9.02574284502886, 0],
                [38.75674561437021, 9.025782372296975, 0],
                [38.756663790447234, 9.026017686238495, 0],
                [38.7563540393644, 9.025966546753, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 57,
            OBJECTID: 92,
            x: 473148.831383,
            y: 997515.744217,
            parcel_cod: "0501297",
            SHAPE_Leng: 129.124427606,
            Shape_Le_1: 129.124427605,
            Shape_Area: 991.04741022,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.756652088424104, 9.024477141935792, 0],
                [38.75671247764371, 9.024687260235167, 0],
                [38.75657162446491, 9.024726817529752, 0],
                [38.75652717331432, 9.024534273354629, 0],
                [38.756652088424104, 9.024477141935792, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 58,
            OBJECTID: 93,
            x: 473157.80848,
            y: 997375.702986,
            parcel_cod: "0501298",
            SHAPE_Leng: 77.1998043067,
            Shape_Le_1: 77.1998043073,
            Shape_Area: 355.883397512,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75710037239563, 9.024890980547728, 0],
                [38.756803024887915, 9.024981851668084, 0],
                [38.756756962937374, 9.02484666171562, 0],
                [38.75705047645542, 9.02474998120302, 0],
                [38.75710037239563, 9.024890980547728, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 59,
            OBJECTID: 94,
            x: 473192.064111,
            y: 997404.405214,
            parcel_cod: "0501299",
            SHAPE_Leng: 100.479707749,
            Shape_Le_1: 100.479707749,
            Shape_Area: 550.407586052,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75713214010591, 9.025500364238239, 0],
                [38.75727734889098, 9.025495034996954, 0],
                [38.75729292758174, 9.025610601519382, 0],
                [38.75729562286929, 9.025630592754084, 0],
                [38.757302080260175, 9.025748841424951, 0],
                [38.75714625306922, 9.025732775843945, 0],
                [38.75713214010591, 9.025500364238239, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 60,
            OBJECTID: 95,
            x: 473223.783348,
            y: 997487.689392,
            parcel_cod: "05012100",
            SHAPE_Leng: 87.1442008334,
            Shape_Le_1: 87.1442008289,
            Shape_Area: 451.181567933,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.756894167259865, 9.026689858823833, 0],
                [38.75689413633125, 9.026689848853898, 0],
                [38.75695728165549, 9.02652125834252, 0],
                [38.756991579508394, 9.0265325339159, 0],
                [38.75703081994359, 9.026546207871226, 0],
                [38.75709664396581, 9.026569145199419, 0],
                [38.75713287601316, 9.02658340960259, 0],
                [38.75719260905039, 9.026606926289947, 0],
                [38.75720373872208, 9.02661063576434, 0],
                [38.75720897022738, 9.026612290838862, 0],
                [38.75720213004139, 9.026636555866226, 0],
                [38.75719130019319, 9.026659339398945, 0],
                [38.75717678682501, 9.02667999944391, 0],
                [38.75715899976357, 9.026697953773478, 0],
                [38.757138440682304, 9.026712694389722, 0],
                [38.75711568944129, 9.026723805605508, 0],
                [38.75709138770254, 9.026730974887654, 0],
                [38.7570662225487, 9.026733998273123, 0],
                [38.75704090281877, 9.026732792112089, 0],
                [38.75701614273279, 9.026727389438893, 0],
                [38.75695239913504, 9.026707776605596, 0],
                [38.756894167259865, 9.026689858823833, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 61,
            OBJECTID: 96,
            x: 473204.834282,
            y: 997600.282519,
            parcel_cod: "05012101",
            SHAPE_Leng: 91.2305409639,
            Shape_Le_1: 91.2305409653,
            Shape_Area: 519.200477968,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.752406164717094, 9.021957228748068, 0],
                [38.75243397579261, 9.021653248624999, 0],
                [38.752521869236666, 9.021616810326602, 0],
                [38.75254537628619, 9.021655244792907, 0],
                [38.75256669369104, 9.021647738224582, 0],
                [38.75264818533333, 9.021859983362498, 0],
                [38.752637887911405, 9.02195047709276, 0],
                [38.75263279365219, 9.021986572262456, 0],
                [38.75242919579595, 9.021958469858266, 0],
                [38.752406164717094, 9.021957228748068, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 62,
            OBJECTID: 97,
            x: 472707.547929,
            y: 997067.916942,
            parcel_cod: "05012102",
            SHAPE_Leng: 116.013349242,
            Shape_Le_1: 116.013349245,
            Shape_Area: 800.002888306,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75390380929288, 9.028082406843222, 0],
                [38.75385980737628, 9.027903856224942, 0],
                [38.754018005920834, 9.027850834583608, 0],
                [38.75406194339346, 9.028023889400938, 0],
                [38.75390380929288, 9.028082406843222, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 63,
            OBJECTID: 98,
            x: 472866.054471,
            y: 997747.179526,
            parcel_cod: "05012103",
            SHAPE_Leng: 76.9503671007,
            Shape_Le_1: 76.9503671019,
            Shape_Area: 367.67038731,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75099513370118, 9.031859870086937, 0],
                [38.750698083574, 9.031838571075184, 0],
                [38.75072262672536, 9.031587934654397, 0],
                [38.75072546447221, 9.031588150042694, 0],
                [38.750725438798206, 9.031588437656092, 0],
                [38.750777403691906, 9.03159210720797, 0],
                [38.75101286658955, 9.031608735166692, 0],
                [38.75099513370118, 9.031859870086937, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 64,
            OBJECTID: 99,
            x: 472525.256396,
            y: 998162.982674,
            parcel_cod: "05012127",
            SHAPE_Leng: 120.420748878,
            Shape_Le_1: 120.420748871,
            Shape_Area: 900.057864686,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75050500003501, 9.031949878784818, 0],
                [38.750505353157784, 9.03191666309172, 0],
                [38.75072065080149, 9.031931829436711, 0],
                [38.750714305374856, 9.032077461299181, 0],
                [38.750615432506976, 9.03207016178145, 0],
                [38.75050500003501, 9.031949878784818, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 65,
            OBJECTID: 100,
            x: 472500.171842,
            y: 998192.256658,
            parcel_cod: "05012128",
            SHAPE_Leng: 72.4109607959,
            Shape_Le_1: 72.4109607983,
            Shape_Area: 300.94474812,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75084923345775, 9.031940889342776, 0],
                [38.75083747052157, 9.032088090457139, 0],
                [38.750714305374856, 9.032077461299181, 0],
                [38.75072065080149, 9.031931829436711, 0],
                [38.75084923345775, 9.031940889342776, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 66,
            OBJECTID: 101,
            x: 472516.862442,
            y: 998194.467396,
            parcel_cod: "05012129",
            SHAPE_Leng: 60.1963004662,
            Shape_Le_1: 60.1963004683,
            Shape_Area: 225.025370092,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.750974782479034, 9.032099940293525, 0],
                [38.75083747052157, 9.032088090457139, 0],
                [38.75084923345775, 9.031940889342776, 0],
                [38.75098769596772, 9.031950646037421, 0],
                [38.750974782479034, 9.032099940293525, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 67,
            OBJECTID: 102,
            x: 472531.357793,
            y: 998195.646259,
            parcel_cod: "05012130",
            SHAPE_Leng: 63.2962499271,
            Shape_Le_1: 63.2962499313,
            Shape_Area: 250.002953753,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75096516978469, 9.0322111094208, 0],
                [38.75070947788773, 9.03218826010834, 0],
                [38.750714305374856, 9.032077461299181, 0],
                [38.75083747052157, 9.032088090457139, 0],
                [38.750974782479034, 9.032099940293525, 0],
                [38.75096516978469, 9.0322111094208, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 68,
            OBJECTID: 103,
            x: 472523.522817,
            y: 998209.385037,
            parcel_cod: "05012131",
            SHAPE_Leng: 81.5479105879,
            Shape_Le_1: 81.5479105878,
            Shape_Area: 350.030894374,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75123703410497, 9.029187248703185, 0],
                [38.7510236153434, 9.029060323097658, 0],
                [38.75098920244041, 9.029052239772831, 0],
                [38.75098930331728, 9.028905192624478, 0],
                [38.75126556322733, 9.028873555893325, 0],
                [38.75123703410497, 9.029187248703185, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 69,
            OBJECTID: 104,
            x: 472555.880366,
            y: 997862.245955,
            parcel_cod: "05012132",
            SHAPE_Leng: 112.863125881,
            Shape_Le_1: 112.863125882,
            Shape_Area: 726.462896428,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75085923131262, 9.02983205550153, 0],
                [38.75064326907339, 9.029909311486437, 0],
                [38.75049287440991, 9.029546181213478, 0],
                [38.75047460890867, 9.029503680842215, 0],
                [38.750682557138695, 9.029415365620052, 0],
                [38.75069421707379, 9.0294458642156, 0],
                [38.75079557298536, 9.029678714107549, 0],
                [38.75085174094025, 9.029813982136835, 0],
                [38.75085923131262, 9.02983205550153, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 70,
            OBJECTID: 105,
            x: 472504.091487,
            y: 997935.386184,
            parcel_cod: "05012134",
            SHAPE_Leng: 148.602595643,
            Shape_Le_1: 148.60259565,
            Shape_Area: 1232.32354405,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.752568009142536, 9.02475198404418, 0],
                [38.75248956437664, 9.024710139700781, 0],
                [38.75243842205811, 9.024702443231208, 0],
                [38.75245149551528, 9.024463907366687, 0],
                [38.75251498138378, 9.02446555561526, 0],
                [38.75271050386508, 9.024569812371428, 0],
                [38.75276267554781, 9.024607764114366, 0],
                [38.752675397556104, 9.024702707725583, 0],
                [38.752474007152294, 9.024921787630735, 0],
                [38.75242083821358, 9.025034700333553, 0],
                [38.752343526057565, 9.025011709213132, 0],
                [38.75254633322173, 9.024776627020756, 0],
                [38.752568009142536, 9.02475198404418, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 71,
            OBJECTID: 106,
            x: 472710.88295,
            y: 997383.557148,
            parcel_cod: "05012303",
            SHAPE_Leng: 187.89385603,
            Shape_Le_1: 187.89385603,
            Shape_Area: 952.393853505,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.77549010841035, 9.034756599979263, 0],
                [38.77544797034487, 9.03476913862586, 0],
                [38.775411251199465, 9.034779286369302, 0],
                [38.77541609000416, 9.034740999094915, 0],
                [38.775422724013595, 9.034718866399558, 0],
                [38.77542815647038, 9.034693143005045, 0],
                [38.775446865827966, 9.03460879527274, 0],
                [38.77560573787431, 9.034636413673024, 0],
                [38.77560209879379, 9.034681283736898, 0],
                [38.775599654604534, 9.03474051257796, 0],
                [38.77557618125671, 9.034742293661706, 0],
                [38.77554006705086, 9.034748253949019, 0],
                [38.775523215118085, 9.034748243643962, 0],
                [38.77549010841035, 9.034756599979263, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 72,
            OBJECTID: 107,
            x: 475234.696289,
            y: 998489.202627,
            parcel_cod: "05072252",
            SHAPE_Leng: 69.7707882039,
            Shape_Le_1: 69.7707881993,
            Shape_Area: 280.6561092,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.758105957265954, 9.034334229134913, 0],
                [38.75803980928082, 9.03442648160594, 0],
                [38.757833352644575, 9.034278084380503, 0],
                [38.75785716272532, 9.03424487871361, 0],
                [38.75789717920831, 9.03418906852494, 0],
                [38.757898344205465, 9.034189906860064, 0],
                [38.75790120040438, 9.034187053237822, 0],
                [38.7579743350381, 9.034239828374744, 0],
                [38.758105957265954, 9.034334229134913, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 73,
            OBJECTID: 108,
            x: 473307.146942,
            y: 998447.905738,
            parcel_cod: "05092146",
            SHAPE_Leng: 80.9845855836,
            Shape_Le_1: 80.9845855785,
            Shape_Area: 350.359589112,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7577111253224, 9.034139642394235, 0],
                [38.75775113453089, 9.034083840357114, 0],
                [38.757835713602866, 9.034144780756646, 0],
                [38.75789717920831, 9.03418906852494, 0],
                [38.75785716272532, 9.03424487871361, 0],
                [38.75772594650605, 9.034150323464726, 0],
                [38.7577111253224, 9.034139642394235, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 74,
            OBJECTID: 109,
            x: 473288.947104,
            y: 998432.233422,
            parcel_cod: "05092147",
            SHAPE_Leng: 54.8006653367,
            Shape_Le_1: 54.8006653347,
            Shape_Area: 150.193532399,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75747227793506, 9.034469305996087, 0],
                [38.75751890184947, 9.034404277032555, 0],
                [38.757664942936785, 9.03450951614414, 0],
                [38.75763626770172, 9.03454950776033, 0],
                [38.757618316305646, 9.034574543315331, 0],
                [38.757506944078955, 9.034494286760017, 0],
                [38.75747227793506, 9.034469305996087, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 75,
            OBJECTID: 110,
            x: 473263.083789,
            y: 998468.18779,
            parcel_cod: "05092148",
            SHAPE_Leng: 57.3053016724,
            Shape_Le_1: 57.305301675,
            Shape_Area: 175.014132174,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75851580320365, 9.032556879015102, 0],
                [38.75849171154895, 9.032584145600383, 0],
                [38.75846039283452, 9.032618107965064, 0],
                [38.758435819893556, 9.032643937883885, 0],
                [38.75843100796992, 9.032640584450228, 0],
                [38.75835738694031, 9.032572570071492, 0],
                [38.75842870018149, 9.032490770609321, 0],
                [38.75851580320365, 9.032556879015102, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 76,
            OBJECTID: 111,
            x: 473358.194002,
            y: 998255.54766,
            parcel_cod: "05092150",
            SHAPE_Leng: 48.7398828321,
            Shape_Le_1: 48.7398828379,
            Shape_Area: 149.246002207,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7588126492602, 9.032069819099283, 0],
                [38.75875288455367, 9.032163591860197, 0],
                [38.75866047855923, 9.032106094482677, 0],
                [38.75872313176751, 9.032014238461374, 0],
                [38.7588126492602, 9.032069819099283, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 77,
            OBJECTID: 112,
            x: 473391.333689,
            y: 998202.683107,
            parcel_cod: "05092151",
            SHAPE_Leng: 48.1239180088,
            Shape_Le_1: 48.1239180121,
            Shape_Area: 144.635703327,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75891247170219, 9.030453674272973, 0],
                [38.75897473663944, 9.030355430357158, 0],
                [38.75899653086208, 9.030321042904447, 0],
                [38.7591525132127, 9.030416275124646, 0],
                [38.75906999296468, 9.030549845505249, 0],
                [38.75906940815432, 9.030549488748598, 0],
                [38.75892024248876, 9.030458418050051, 0],
                [38.75891247170219, 9.030453674272973, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 78,
            OBJECTID: 114,
            x: 473423.709922,
            y: 998019.867561,
            parcel_cod: "05092153",
            SHAPE_Leng: 75.0963429044,
            Shape_Le_1: 75.0963429022,
            Shape_Area: 350.370993313,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7591525132127, 9.030416275124646, 0],
                [38.75899653086208, 9.030321042904447, 0],
                [38.7590633243731, 9.030215652774919, 0],
                [38.75908141334616, 9.030187110478662, 0],
                [38.759235842233366, 9.030281394632588, 0],
                [38.7591525132127, 9.030416275124646, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 79,
            OBJECTID: 115,
            x: 473432.898801,
            y: 998005.074276,
            parcel_cod: "05092154",
            SHAPE_Leng: 75.0374412532,
            Shape_Le_1: 75.0374412481,
            Shape_Area: 350.317225212,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75931998184517, 9.030145203125116, 0],
                [38.75930545837348, 9.030168711513923, 0],
                [38.759235842233366, 9.030281394632588, 0],
                [38.75908141334616, 9.030187110478662, 0],
                [38.759112589950675, 9.030137914365987, 0],
                [38.75916712097239, 9.030051876996094, 0],
                [38.75931998184517, 9.030145203125116, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 80,
            OBJECTID: 116,
            x: 473442.177321,
            y: 997990.136543,
            parcel_cod: "05092155",
            SHAPE_Leng: 74.9750101832,
            Shape_Le_1: 74.9750101858,
            Shape_Area: 350.167446131,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759409103343856, 9.03003858477706, 0],
                [38.75927379737066, 9.029911185914507, 0],
                [38.75935005483789, 9.029839253961931, 0],
                [38.75947627601878, 9.02998136849116, 0],
                [38.75941703096766, 9.030031832449957, 0],
                [38.759409103343856, 9.03003858477706, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 81,
            OBJECTID: 117,
            x: 473461.345013,
            y: 997965.13716,
            parcel_cod: "05092156",
            SHAPE_Leng: 62.7180001153,
            Shape_Le_1: 62.7180001151,
            Shape_Area: 220.030923925,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759548879998796, 9.029919558174093, 0],
                [38.75947627601878, 9.02998136849116, 0],
                [38.75935005483789, 9.029839253961931, 0],
                [38.759419737125604, 9.029772094350541, 0],
                [38.759548879998796, 9.029919558174093, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 82,
            OBJECTID: 118,
            x: 473469.38575,
            y: 997958.191898,
            parcel_cod: "05092157",
            SHAPE_Leng: 63.7486452581,
            Shape_Le_1: 63.7486452582,
            Shape_Area: 225.210804534,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75919915749874, 9.030001131125877, 0],
                [38.75918330823087, 9.030026182622425, 0],
                [38.75916317899275, 9.030057998781256, 0],
                [38.75900725298507, 9.029968575304103, 0],
                [38.759044001119314, 9.029909171950788, 0],
                [38.75919915749874, 9.030001131125877, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 83,
            OBJECTID: 119,
            x: 473431.382772,
            y: 997969.956244,
            parcel_cod: "05092158",
            SHAPE_Leng: 54.775196189,
            Shape_Le_1: 54.7751961887,
            Shape_Area: 149.947154471,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75895342049096, 9.029938508764104, 0],
                [38.75894629637063, 9.029934158869818, 0],
                [38.75879835699248, 9.029843836952404, 0],
                [38.758840021961795, 9.029776396747438, 0],
                [38.75884597344918, 9.02976676230236, 0],
                [38.75900103783809, 9.029861434094379, 0],
                [38.75895342049096, 9.029938508764104, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 84,
            OBJECTID: 120,
            x: 473409.037646,
            y: 997955.456801,
            parcel_cod: "05092159",
            SHAPE_Leng: 59.9998788009,
            Shape_Le_1: 59.9998788044,
            Shape_Area: 199.998689728,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75924216751716, 9.03039818330792, 0],
                [38.75928285866214, 9.030423026750716, 0],
                [38.75939832914022, 9.030493524083345, 0],
                [38.75933921232111, 9.030589212209371, 0],
                [38.759183050673755, 9.030493871408634, 0],
                [38.75924216751716, 9.03039818330792, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 85,
            OBJECTID: 121,
            x: 473452.056747,
            y: 998026.30321,
            parcel_cod: "05092160",
            SHAPE_Leng: 65.1128681503,
            Shape_Le_1: 65.112868149,
            Shape_Area: 250.055546106,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75913302237353, 9.030574675579627, 0],
                [38.759182980641896, 9.0304938288512, 0],
                [38.759183050673755, 9.030493871408634, 0],
                [38.759339137630725, 9.030589334267912, 0],
                [38.75929451785981, 9.030661557395213, 0],
                [38.75916236252726, 9.030590460258443, 0],
                [38.75913302237353, 9.030574675579627, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 86,
            OBJECTID: 122,
            x: 473446.043702,
            y: 998035.737221,
            parcel_cod: "05092161",
            SHAPE_Leng: 60.1928193433,
            Shape_Le_1: 60.1928193496,
            Shape_Area: 200.105467789,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.761187406640026, 9.030509317624107, 0],
                [38.76118736073386, 9.030579079885616, 0],
                [38.76106275389233, 9.030578998833462, 0],
                [38.76106279982246, 9.030509236572586, 0],
                [38.761187406640026, 9.030509317624107, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 87,
            OBJECTID: 123,
            x: 473653.6703,
            y: 998031.7496,
            parcel_cod: "05092162",
            SHAPE_Leng: 42.8155999985,
            Shape_Le_1: 42.8156000022,
            Shape_Area: 105.626796019,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.76079358018677, 9.030624658243244, 0],
                [38.760793502722585, 9.030742182613011, 0],
                [38.76065323694124, 9.030742091220278, 0],
                [38.760653314450835, 9.030624566851717, 0],
                [38.76079358018677, 9.030624658243244, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 88,
            OBJECTID: 124,
            x: 473609.5344,
            y: 998047.17005,
            parcel_cod: "05092163",
            SHAPE_Leng: 56.8186000008,
            Shape_Le_1: 56.8185999952,
            Shape_Area: 200.304712765,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.760512971161354, 9.030741999773964, 0],
                [38.76051297463824, 9.030736731062921, 0],
                [38.76051304871638, 9.030624475406617, 0],
                [38.760653314450835, 9.030624566851717, 0],
                [38.76065323694124, 9.030742091220278, 0],
                [38.760512971161354, 9.030741999773964, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 89,
            OBJECTID: 125,
            x: 473594.1184,
            y: 998047.17005,
            parcel_cod: "05092164",
            SHAPE_Leng: 56.818599999,
            Shape_Le_1: 56.8185999971,
            Shape_Area: 200.304712777,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75937603410476, 9.031347755518144, 0],
                [38.759533304085984, 9.031421589766579, 0],
                [38.75947781101336, 9.03152026151232, 0],
                [38.75932657558306, 9.031447346548957, 0],
                [38.75937603410476, 9.031347755518144, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 90,
            OBJECTID: 126,
            x: 473467.302257,
            y: 998130.257559,
            parcel_cod: "05092166",
            SHAPE_Leng: 62.3661703486,
            Shape_Le_1: 62.3661703461,
            Shape_Area: 232.589733914,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759654593995606, 9.031499685921968, 0],
                [38.759613939462405, 9.031582802763657, 0],
                [38.75960939081912, 9.031591321080834, 0],
                [38.759599337357734, 9.031610948481617, 0],
                [38.75952204129929, 9.0315704350591, 0],
                [38.75958086075146, 9.031465069470848, 0],
                [38.759654593995606, 9.031499685921968, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 91,
            OBJECTID: 127,
            x: 473484.937933,
            y: 998141.665114,
            parcel_cod: "05092167",
            SHAPE_Leng: 45.6075456038,
            Shape_Le_1: 45.6075456084,
            Shape_Area: 125.821026107,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75958437971269, 9.031640131427595, 0],
                [38.759559560853674, 9.031688533064207, 0],
                [38.759539781116175, 9.031725581096367, 0],
                [38.75953501564896, 9.03173450719997, 0],
                [38.75947249049771, 9.031698068262756, 0],
                [38.759455419664306, 9.03168812024291, 0],
                [38.759497450465204, 9.03161387384925, 0],
                [38.75952204129929, 9.0315704350591, 0],
                [38.75954136667692, 9.031580563643262, 0],
                [38.759599337357734, 9.031610948481617, 0],
                [38.759597810427415, 9.031613939568068, 0],
                [38.75958437971269, 9.031640131427595, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 92,
            OBJECTID: 128,
            x: 473478.219036,
            y: 998154.316079,
            parcel_cod: "05092168",
            SHAPE_Leng: 50.055806657,
            Shape_Le_1: 50.0558066571,
            Shape_Area: 150.005170443,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75966396980928, 9.031681681086882, 0],
                [38.75961956864812, 9.031767161647757, 0],
                [38.759539781116175, 9.031725581096367, 0],
                [38.759559560853674, 9.031688533064207, 0],
                [38.75958437971269, 9.031640131427595, 0],
                [38.759602549981715, 9.031649617057292, 0],
                [38.75966396980928, 9.031681681086882, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 93,
            OBJECTID: 129,
            x: 473486.359785,
            y: 998160.055678,
            parcel_cod: "05092169",
            SHAPE_Leng: 41.0607588351,
            Shape_Le_1: 41.0607588322,
            Shape_Area: 105.000232962,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75929349867806, 9.031513599394556, 0],
                [38.7593265301038, 9.031447324811152, 0],
                [38.75932657558306, 9.031447346548957, 0],
                [38.75947781101336, 9.03152026151232, 0],
                [38.75944115630616, 9.031585441099912, 0],
                [38.75932591065708, 9.031529369794292, 0],
                [38.75929349867806, 9.031513599394556, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 94,
            OBJECTID: 130,
            x: 473462.486983,
            y: 998139.384768,
            parcel_cod: "05092170",
            SHAPE_Leng: 52.9796853948,
            Shape_Le_1: 52.9796853937,
            Shape_Area: 150.021780431,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759383852217276, 9.031687333471975, 0],
                [38.75924319111489, 9.031614686803053, 0],
                [38.75929349867806, 9.031513599394556, 0],
                [38.75932591065708, 9.031529369794292, 0],
                [38.75944115630616, 9.031585441099912, 0],
                [38.759383852217276, 9.031687333471975, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 95,
            OBJECTID: 131,
            x: 473457.665571,
            y: 998148.62847,
            parcel_cod: "05092171",
            SHAPE_Leng: 60.864140472,
            Shape_Le_1: 60.864140472,
            Shape_Area: 225.009345962,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75957515380079, 9.03185266751933, 0],
                [38.75956453941236, 9.031846860914952, 0],
                [38.75949526666961, 9.031808959508881, 0],
                [38.75953501564896, 9.03173450719997, 0],
                [38.759539781116175, 9.031725581096367, 0],
                [38.75961956864812, 9.031767161647757, 0],
                [38.75957515380079, 9.03185266751933, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 96,
            OBJECTID: 132,
            x: 473481.477844,
            y: 998169.462073,
            parcel_cod: "05092172",
            SHAPE_Leng: 40.9982693764,
            Shape_Le_1: 40.9982693725,
            Shape_Area: 104.957785333,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75938988058793, 9.031804656502585, 0],
                [38.759455419664306, 9.03168812024291, 0],
                [38.75947249049771, 9.031698068262756, 0],
                [38.75953501564896, 9.03173450719997, 0],
                [38.75949526666961, 9.031808959508881, 0],
                [38.75947362391246, 9.031849496782206, 0],
                [38.759418872542966, 9.031820179534014, 0],
                [38.75938988058793, 9.031804656502585, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 97,
            OBJECTID: 133,
            x: 473471.103772,
            y: 998167.329779,
            parcel_cod: "05092173",
            SHAPE_Leng: 49.7480086397,
            Shape_Le_1: 49.7480086352,
            Shape_Area: 150.054685013,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75950325202841, 9.031991090341743, 0],
                [38.75942116272902, 9.031947759858049, 0],
                [38.75947362391246, 9.031849496782206, 0],
                [38.75949526666961, 9.031808959508881, 0],
                [38.75956453941236, 9.031846860914952, 0],
                [38.75957515380079, 9.03185266751933, 0],
                [38.75950325202841, 9.031991090341743, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 98,
            OBJECTID: 134,
            x: 473475.002245,
            y: 998181.800848,
            parcel_cod: "05092174",
            SHAPE_Leng: 54.8335043285,
            Shape_Le_1: 54.833504325,
            Shape_Area: 175.009198729,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75933537670458, 9.031901571426909, 0],
                [38.75938988058793, 9.031804656502585, 0],
                [38.759418872542966, 9.031820179534014, 0],
                [38.75947362391246, 9.031849496782206, 0],
                [38.75942116272902, 9.031947759858049, 0],
                [38.75933537670458, 9.031901571426909, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 99,
            OBJECTID: 135,
            x: 473464.711148,
            y: 998179.129297,
            parcel_cod: "05092175",
            SHAPE_Leng: 45.7510384568,
            Shape_Le_1: 45.751038458,
            Shape_Area: 130.092293583,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75932527914386, 9.031791482633952, 0],
                [38.759270327059404, 9.03188919321455, 0],
                [38.759134584192395, 9.031806322546252, 0],
                [38.75916413342361, 9.031764969193484, 0],
                [38.75919001651221, 9.031721254497766, 0],
                [38.75932527914386, 9.031791482633952, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 100,
            OBJECTID: 136,
            x: 473445.640653,
            y: 998171.095787,
            parcel_cod: "05092176",
            SHAPE_Leng: 57.8715814773,
            Shape_Le_1: 57.8715814787,
            Shape_Area: 200.463210009,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.758911679543125, 9.030123069028695, 0],
                [38.7589604718478, 9.030044200609035, 0],
                [38.759103208475594, 9.030132134788355, 0],
                [38.759112589950675, 9.030137914365987, 0],
                [38.75908141334616, 9.030187110478662, 0],
                [38.7590633243731, 9.030215652774919, 0],
                [38.759060684089285, 9.03021404103259, 0],
                [38.758973044512366, 9.030160533902405, 0],
                [38.758911679543125, 9.030123069028695, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 101,
            OBJECTID: 137,
            x: 473421.394182,
            y: 997986.126036,
            parcel_cod: "05092178",
            SHAPE_Leng: 59.6222860768,
            Shape_Le_1: 59.6222860778,
            Shape_Area: 200.003571425,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75881056923651, 9.030169732731641, 0],
                [38.75876890512458, 9.030237172931097, 0],
                [38.758613840640876, 9.030142501040347, 0],
                [38.75865550476983, 9.030075060858612, 0],
                [38.75881056923651, 9.030169732731641, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 102,
            OBJECTID: 138,
            x: 473388.4533,
            y: 997989.0228,
            parcel_cod: "50092179",
            SHAPE_Leng: 57.4998592818,
            Shape_Le_1: 57.4998592845,
            Shape_Area: 174.998727644,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7587272400871, 9.030304613124567, 0],
                [38.75857217558638, 9.030209941216135, 0],
                [38.75859598341072, 9.03017140436063, 0],
                [38.758613840640876, 9.030142501040347, 0],
                [38.75876890512458, 9.030237172931097, 0],
                [38.7587272400871, 9.030304613124567, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 103,
            OBJECTID: 139,
            x: 473383.879039,
            y: 997996.481893,
            parcel_cod: "05092180",
            SHAPE_Leng: 57.4999638382,
            Shape_Le_1: 57.4999638401,
            Shape_Area: 174.999994854,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7586915265349, 9.03036241977528, 0],
                [38.7585364620202, 9.030267746947159, 0],
                [38.75857217558638, 9.030209941216135, 0],
                [38.7587272400871, 9.030304613124567, 0],
                [38.7586915265349, 9.03036241977528, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 104,
            OBJECTID: 140,
            x: 473379.631465,
            y: 998003.408236,
            parcel_cod: "05092181",
            SHAPE_Leng: 55.0001534309,
            Shape_Le_1: 55.0001534343,
            Shape_Area: 150.0013574,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.758467761030516, 9.030378949848123, 0],
                [38.7585364620202, 9.030267746947159, 0],
                [38.7586915265349, 9.03036241977528, 0],
                [38.75861995092639, 9.03047827446873, 0],
                [38.75849742999409, 9.03040234887669, 0],
                [38.758482073265355, 9.030391303877277, 0],
                [38.758467761030516, 9.030378949848123, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 105,
            OBJECTID: 141,
            x: 473373.801546,
            y: 998012.987181,
            parcel_cod: "05092182",
            SHAPE_Leng: 69.4937475048,
            Shape_Le_1: 69.493747503,
            Shape_Area: 298.518077098,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75844342371433, 9.03021094376257, 0],
                [38.758502945119425, 9.030114601191228, 0],
                [38.75859598341072, 9.03017140436063, 0],
                [38.75857217558638, 9.030209941216135, 0],
                [38.7585364620202, 9.030267746947159, 0],
                [38.75844342371433, 9.03021094376257, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 106,
            OBJECTID: 142,
            x: 473367.298863,
            y: 997992.912657,
            parcel_cod: "05092184",
            SHAPE_Leng: 48.9997876386,
            Shape_Le_1: 48.9997876389,
            Shape_Area: 149.999066076,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75856246649312, 9.030018257704393, 0],
                [38.75865550476983, 9.030075060858612, 0],
                [38.758613840640876, 9.030142501040347, 0],
                [38.75859598341072, 9.03017140436063, 0],
                [38.758502945119425, 9.030114601191228, 0],
                [38.75856246649312, 9.030018257704393, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 107,
            OBJECTID: 143,
            x: 473373.833562,
            y: 997982.25681,
            parcel_cod: "05092185",
            SHAPE_Leng: 48.9999581346,
            Shape_Le_1: 48.9999581385,
            Shape_Area: 150.000109662,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75862198783478, 9.029921914206609, 0],
                [38.75871502609691, 9.029978717345644, 0],
                [38.75865550476983, 9.030075060858612, 0],
                [38.75856246649312, 9.030018257704393, 0],
                [38.75862198783478, 9.029921914206609, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 108,
            OBJECTID: 144,
            x: 473380.36825,
            y: 997971.6009,
            parcel_cod: "05092186",
            SHAPE_Leng: 48.9999581333,
            Shape_Le_1: 48.9999581327,
            Shape_Area: 149.999728151,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75894799461729, 9.029390995010914, 0],
                [38.7590413691264, 9.02944965613065, 0],
                [38.75897303643368, 9.029560262410584, 0],
                [38.75887985459476, 9.029503280152074, 0],
                [38.75894799461729, 9.029390995010914, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 109,
            OBJECTID: 145,
            x: 473415.696978,
            y: 997913.802409,
            parcel_cod: "05092187",
            SHAPE_Leng: 53.01233585,
            Shape_Le_1: 53.0123358493,
            Shape_Area: 174.257774059,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75958676984899, 9.029970159912574, 0],
                [38.759644113437645, 9.030034804985384, 0],
                [38.75956782681557, 9.030099950515265, 0],
                [38.75951081108417, 9.030034852490953, 0],
                [38.75958676984899, 9.029970159912574, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 110,
            OBJECTID: 146,
            x: 473483.534045,
            y: 997975.567345,
            parcel_cod: "05092188",
            SHAPE_Leng: 41.1180704979,
            Shape_Le_1: 41.1180704967,
            Shape_Area: 105.109192651,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759673320616564, 9.030064502557284, 0],
                [38.759678504746155, 9.030129553076174, 0],
                [38.7596305558714, 9.03017157281179, 0],
                [38.75956782681557, 9.030099950515265, 0],
                [38.759644113437645, 9.030034804985384, 0],
                [38.759673320616564, 9.030064502557284, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 111,
            OBJECTID: 147,
            x: 473489.552684,
            y: 997983.074701,
            parcel_cod: "05092189",
            SHAPE_Leng: 40.3836973585,
            Shape_Le_1: 40.3836973573,
            Shape_Area: 105.012036356,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.7593426113378, 9.030235600127039, 0],
                [38.75949867560237, 9.030330882003271, 0],
                [38.759457348610525, 9.030397777090233, 0],
                [38.759301283419724, 9.030302494291258, 0],
                [38.7593426113378, 9.030235600127039, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 112,
            OBJECTID: 148,
            x: 473464.055428,
            y: 998006.725433,
            parcel_cod: "05092190",
            SHAPE_Leng: 57.6163136507,
            Shape_Le_1: 57.616313653,
            Shape_Area: 174.702995718,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75924216751716, 9.03039818330792, 0],
                [38.759301283419724, 9.030302494291258, 0],
                [38.759457348610525, 9.030397777090233, 0],
                [38.75945744501784, 9.030397835945903, 0],
                [38.75939832914022, 9.030493524083345, 0],
                [38.75928285866214, 9.030423026750716, 0],
                [38.75924216751716, 9.03039818330792, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 113,
            OBJECTID: 149,
            x: 473458.546984,
            y: 998015.719774,
            parcel_cod: "05092191",
            SHAPE_Leng: 65.112901119,
            Shape_Le_1: 65.1129011206,
            Shape_Area: 250.056465772,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75907123994699, 9.031886721791963, 0],
                [38.759133111679695, 9.031808199322334, 0],
                [38.759134584192395, 9.031806322546252, 0],
                [38.759270327059404, 9.03188919321455, 0],
                [38.75922354616199, 9.031972376542363, 0],
                [38.759134265777796, 9.031922771285885, 0],
                [38.75907123994699, 9.031886721791963, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 114,
            OBJECTID: 150,
            x: 473439.299642,
            y: 998180.569795,
            parcel_cod: "05092192",
            SHAPE_Leng: 58.5671029946,
            Shape_Le_1: 58.5671029957,
            Shape_Area: 200.071104233,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759461503732396, 9.032071463097115, 0],
                [38.759377522663364, 9.032025579769684, 0],
                [38.759418367661965, 9.031946284596176, 0],
                [38.75942116272902, 9.031947759858049, 0],
                [38.75950325202841, 9.031991090341743, 0],
                [38.759461503732396, 9.032071463097115, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 115,
            OBJECTID: 151,
            x: 473468.607962,
            y: 998193.78193,
            parcel_cod: "05092193",
            SHAPE_Leng: 40.9447708582,
            Shape_Le_1: 40.9447708574,
            Shape_Area: 104.658243805,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759420387677935, 9.032150618804138, 0],
                [38.75933527052826, 9.032106927230572, 0],
                [38.75937724479655, 9.032026115051579, 0],
                [38.759377522663364, 9.032025579769684, 0],
                [38.759461503732396, 9.032071463097115, 0],
                [38.759420387677935, 9.032150618804138, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 116,
            OBJECTID: 152,
            x: 473464.01959,
            y: 998202.619036,
            parcel_cod: "05092194",
            SHAPE_Leng: 41.0313544673,
            Shape_Le_1: 41.0313544656,
            Shape_Area: 105.131350338,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759291646596445, 9.03197931981369, 0],
                [38.759377522663364, 9.032025579769684, 0],
                [38.75937724479655, 9.032026115051579, 0],
                [38.75933527052826, 9.032106927230572, 0],
                [38.75931951503085, 9.032137254737993, 0],
                [38.75923301674918, 9.032092127698723, 0],
                [38.75929116014388, 9.03198019324181, 0],
                [38.759291646596445, 9.03197931981369, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 117,
            OBJECTID: 153,
            x: 473453.781597,
            y: 998199.307203,
            parcel_cod: "05092195",
            SHAPE_Leng: 49.404755635,
            Shape_Le_1: 49.4047556413,
            Shape_Area: 149.949060781,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75911351340798, 9.03216802550847, 0],
                [38.75903533936861, 9.032119127596786, 0],
                [38.75906106370628, 9.032073386727893, 0],
                [38.7590970226713, 9.032010657016968, 0],
                [38.75910063362995, 9.032004308891581, 0],
                [38.75918061036427, 9.03204872074714, 0],
                [38.75913923773957, 9.032122284634074, 0],
                [38.75911351340798, 9.03216802550847, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 118,
            OBJECTID: 154,
            x: 473432.057435,
            y: 998202.273538,
            parcel_cod: "05092196",
            SHAPE_Leng: 49.9132005895,
            Shape_Le_1: 49.9132005916,
            Shape_Area: 150.193419525,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75894845054952, 9.032064777953353, 0],
                [38.75896982027597, 9.032029929838934, 0],
                [38.75901490280186, 9.031961365768636, 0],
                [38.7590970226713, 9.032010657016968, 0],
                [38.75903533936861, 9.032119127596786, 0],
                [38.75894845054952, 9.032064777953353, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 119,
            OBJECTID: 155,
            x: 473422.801054,
            y: 998197.229634,
            parcel_cod: "05092197",
            SHAPE_Leng: 49.1698316569,
            Shape_Le_1: 49.1698316582,
            Shape_Area: 149.765823897,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75916315623214, 9.032220075867823, 0],
                [38.7592076625325, 9.032140939600337, 0],
                [38.75923301674918, 9.032092127698723, 0],
                [38.75931951503085, 9.032137254737993, 0],
                [38.75929364791351, 9.03218704497842, 0],
                [38.75925266125034, 9.032267211980711, 0],
                [38.75916315623214, 9.032220075867823, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 120,
            OBJECTID: 156,
            x: 473446.837295,
            y: 998212.709503,
            parcel_cod: "05092198",
            SHAPE_Leng: 54.1033650401,
            Shape_Le_1: 54.1033650368,
            Shape_Area: 174.997748013,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759336476470494, 9.032312160879926, 0],
                [38.75925266125034, 9.032267211980711, 0],
                [38.75929364791351, 9.03218704497842, 0],
                [38.75937849904562, 9.032231260093, 0],
                [38.759336476470494, 9.032312160879926, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 121,
            OBJECTID: 157,
            x: 473454.903839,
            y: 998220.41163,
            parcel_cod: "05092199",
            SHAPE_Leng: 41.0042816329,
            Shape_Le_1: 41.0042816288,
            Shape_Area: 105.00883167,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.759420387677935, 9.032150618804138, 0],
                [38.75937849904562, 9.032231260093, 0],
                [38.75929364791351, 9.03218704497842, 0],
                [38.75931951503085, 9.032137254737993, 0],
                [38.75933527052826, 9.032106927230572, 0],
                [38.759420387677935, 9.032150618804138, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 122,
            OBJECTID: 158,
            x: 473459.466381,
            y: 998211.51554,
            parcel_cod: "05092200",
            SHAPE_Leng: 41.0607165528,
            Shape_Le_1: 41.0607165498,
            Shape_Area: 105.303365478,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75877697132387, 9.034690296509941, 0],
                [38.75887755603206, 9.03454242259926, 0],
                [38.759002876673506, 9.034631493210536, 0],
                [38.758901089359476, 9.034791336516571, 0],
                [38.75877697132387, 9.034690296509941, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 123,
            OBJECTID: 159,
            x: 473408.312607,
            y: 998487.480779,
            parcel_cod: "05092203",
            SHAPE_Leng: 75.2135967694,
            Shape_Le_1: 75.2135967656,
            Shape_Area: 350.034676367,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.75693424501437, 9.027912687151945, 0],
                [38.756987260912524, 9.028029706647656, 0],
                [38.75679545095194, 9.028092858528668, 0],
                [38.756741274681765, 9.028000799726293, 0],
                [38.75693424501437, 9.027912687151945, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 124,
            OBJECTID: 160,
            x: 473185.542114,
            y: 997751.583024,
            parcel_cod: "0501203",
            SHAPE_Leng: 71.5269532773,
            Shape_Le_1: 71.5269532828,
            Shape_Area: 293.641622375,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [38.758826605395235, 9.030263298418113, 0],
                [38.758911679543125, 9.030123069028695, 0],
                [38.758973044512366, 9.030160533902405, 0],
                [38.759060684089285, 9.03021404103259, 0],
                [38.7590633243731, 9.030215652774919, 0],
                [38.75899653086208, 9.030321042904447, 0],
                [38.75897473663944, 9.030355430357158, 0],
                [38.758826605395235, 9.030263298418113, 0],
              ],
            ],
          },
          properties: {
            OBJECTID_1: 125,
            OBJECTID: 161,
            x: 473413.971211,
            y: 997998.193369,
            parcel_cod: "05092225",
            SHAPE_Leng: 75.1330472722,
            Shape_Le_1: 75.1330472726,
            Shape_Area: 352.432420288,
          },
        },
        {
          type: "Feature",
          geometry: null,
          properties: {
            OBJECTID_1: null,
            OBJECTID: null,
            x: null,
            y: null,
            parcel_cod: null,
            SHAPE_Leng: null,
            Shape_Le_1: null,
            Shape_Area: null,
          },
        },
      ],
    };
    try {
      const geoJsonAll = await this.geoser.readAndConvertShapefiles(
        event.target.files[0]
      );
      L.geoJSON(geoJsonAll).addTo(this.map);
      // geo.forEach((geoJsonFeature) => {
      //   console.log(geoJsonFeature);
      //   L.Proj.geoJson(geoJsonFeature, {
      //     style: (feature) => {
      //       // Generate a random color in hexadecimal format
      //       let randomColor =
      //         "#" + Math.floor(Math.random() * 16777215).toString(16);

      //       // Return the style object with the random color
      //       return {
      //         color: randomColor,
      //         fillColor: randomColor,
      //         fillOpacity: 0.5,
      //       };
      //     },

      //     onEachFeature: (feature, layer) => {
      //       const properties = feature.properties; // Access the properties of the feature
      //       let popupContent = `Layer:<br>Feature ID: ${feature.id}<br>`;

      //       // Dynamically add the properties to the popup content

      //       for (const propertyName in properties) {
      //         if (properties.hasOwnProperty(propertyName)) {
      //           popupContent += `${propertyName}: ${properties[propertyName]}<br>`;
      //         }
      //       }

      //       // Bind the customized popup content to the layer
      //       layer.bindPopup(popupContent);
      //     },
      //     coordsToLatLng: (
      //       coords: [number, number] | [number, number, number]
      //     ) => {
      //       if (coords.length >= 2) {
      //         // Ignore the z-coordinate and use only the x and y coordinates for LatLng
      //         return L.CRS.EPSG4326.unproject(L.point(coords[0], coords[1]));
      //       }
      //       throw new Error("Invalid coordinate format");
      //     },
      //     attribution: "power By xoka",
      //   });
      // });

      // You can add these features to your Leaflet map using L.geoJSON
      // geoJsonAll
      //   .then((geojson) => {
      //     // Create a new vector layer using the fetched GeoJSON data
      // const vectorLayer = L.Proj.geoJson(geojson, {
      //   style: (feature) => {
      //     // Generate a random color in hexadecimal format
      //     let randomColor =
      //       "#" + Math.floor(Math.random() * 16777215).toString(16);

      //     // Return the style object with the random color
      //     return {
      //       color: randomColor,
      //       fillColor: randomColor,
      //       fillOpacity: 0.5,
      //     };
      //   },

      //   onEachFeature: (feature, layer) => {
      //     const properties = feature.properties; // Access the properties of the feature
      //     let popupContent = `Layer:<br>Feature ID: ${feature.id}<br>`;

      //     // Dynamically add the properties to the popup content

      //     for (const propertyName in properties) {
      //       if (properties.hasOwnProperty(propertyName)) {
      //         popupContent += `${propertyName}: ${properties[propertyName]}<br>`;
      //       }
      //     }

      //     // Bind the customized popup content to the layer
      //     layer.bindPopup(popupContent);
      //   },
      //   coordsToLatLng: (
      //     coords: [number, number] | [number, number, number]
      //   ) => {
      //     if (coords.length >= 2) {
      //       // Ignore the z-coordinate and use only the x and y coordinates for LatLng
      //       return L.CRS.EPSG4326.unproject(L.point(coords[0], coords[1]));
      //     }
      //     throw new Error("Invalid coordinate format");
      //   },
      //   attribution: "power By xoka",
      // });

      //     vectorLayer.on("click", (event: L.LeafletEvent) => {
      //       const clickedLayer = event.layer;
      //       const clickedFeature = clickedLayer.feature;

      //       if (clickedFeature && clickedFeature.properties) {
      //         let popupContent = "<div>";
      //         for (const key in clickedFeature.properties) {
      //           if (clickedFeature.properties.hasOwnProperty(key)) {
      //             popupContent += `<div><strong>${key}:</strong> ${clickedFeature.properties[key]}</div>`;
      //           }
      //         }
      //         popupContent += "</div>";

      //         // Bind the customized popup content to the layer
      //         clickedLayer.bindPopup(popupContent).openPopup();
      //       }
      //       vectorLayer.addTo(this.map);
      //     });
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching GeoJSON:", error);
      //   });
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

        const geoJSONData = shp.combine([
          shp.parseShp(shpBuffer),
          shp.parseDbf(dbfBuffer),
        ]);
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
          console.error("Invalid GeoJSON data.");
        }
      } else {
        console.error("Missing one or more required files in the zip archive.");
      }
    } catch (error) {
      console.error("Error while extracting files from the zip:", error);
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
    // Remove the header row from the data
    const coordinates = data.slice(1);
    console.log("coordinates", coordinates);
    // Map the data to LatLng objects and their associated shape properties
    const combinedData = [];

    const latLngs = coordinates.map((row) =>
      this.conveUTMToLatLng(row[0], row[1], row[3], row[2])
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

    // Now, combinedData contains the latLng and shapeProperties in each object

    console.log("shapeProperties", combinedData);

    this.alllatlong.push(combinedData);
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
        (dataofproperty.ploteId == null &&
          dataofproperty.property_ID == this.ServiceService.selectedproperty)
      ) {
        this.editableLayers.addLayer(this.drawnShape);
      }
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

  public processImportedShapes(data: any[]): void {
    // Event handler for when a shape is drawn

    console.log("dataaaa", data);
    // Remove the header row from the data
    const coordinates = data.slice(1);
    console.log("coordinates", coordinates);

    // if (this.fromexcel) {
    //   const utmPoints = coordinates.map((point) => ({
    //     northing: point[1], // The second element is northing
    //     easting: point[0], // The first element is easting
    //   }));

    //   let PolygonArea = this.calculateUTMPolygonArea(utmPoints).toFixed(2);
    //   console.log("dataaaa", PolygonArea);
    //   if (PolygonArea) {
    //     this.ServiceService.Totalarea = parseInt(PolygonArea);

    //     localStorage.setItem("PolygonAreaname", "" + PolygonArea);
    //   }
    // } else {
    //   let PolygonArea = this.calculateUTMPolygonArea(coordinates).toFixed(2);
    //   if (PolygonArea) {
    //     localStorage.setItem("PolygonAreaname", "" + PolygonArea);
    //   }
    // }

    // Map the data to LatLng objects
    const latLngs = coordinates.map((row) =>
      this.conveUTMToLatLng(row[0], row[1], row[3], row[2])
    );

    console.log("latLngs", latLngs);
    this.alllatlong.push(latLngs);

    // Remove the previously drawn shape, if any
    if (this.drawnShape) {
      this.map.removeLayer(this.drawnShape);
    }

    console.log("alllatlong", this.alllatlong);
    // Create a polygon shape with the mapped LatLng objects
    //this.drawnShape = L.polygon(this.alllatlong[0]).addTo(this.map);

    this.alllatlong.forEach((shape, index) => {
      let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

      this.drawnShape = L.polygon(shape, { color: randomColor }).addTo(
        this.map
      );
      this.editableLayers.addLayer(this.drawnShape);

      shape.forEach((point, pointIndex) => {
        const markerLatLng = L.latLng(point); // Create a LatLng object for the point
        // Add a marker with a character label to the polygon
        this.addMarkerWithCharacter(
          this.drawnShape,
          markerLatLng,
          String.fromCharCode(65 + pointIndex)
        );
      });
    });

    //this.ServiceService.coordinate.push(latLngs[0])
    console.log("alllatlong", latLngs);

    const utmCoordinates = this.convertCoordinatesToUTM(latLngs);
    utmCoordinates.push(utmCoordinates[0]);
    this.ServiceService.coordinate = utmCoordinates;
    console.log(utmCoordinates);

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
      const zoomLevel = 6; // Adjust this to your desired zoom level

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
    selectedShape.setStyle({ fillColor: "red" });

    // You can also select multiple shapes if needed
    // Just loop through the array and apply changes to each selected shape
  }
  convertToExcel(data: any[]): void {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

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

    // Remove existing rectangle overlay if present
    // if (this.rectangleOverlay) {
    //   this.rectangleOverlay.removeFrom(this.map);
    //   this.rectangleOverlay = null;
    // }

    // Add rectangle overlay for Ethiopia in the selected projection
    // if (
    //   selectedProjection === adindanZone36Projection ||
    //   selectedProjection === adindanZone37Projection ||
    //   selectedProjection === adindanZone38Projection ||
    //   selectedProjection === wgs84Zone36Projection ||
    //   selectedProjection === wgs84Zone37Projection ||
    //   selectedProjection === wgs84Zone38Projection ||
    //   selectedProjection === gcsWgs84Projection ||
    //   selectedProjection === gseWgs84Projection
    // ) {
    //   const rectangleBounds = L.latLngBounds(L.latLng(-168914.58, 375600.56), L.latLng(1502637.63 ,1665634.17));
    //   this.rectangleOverlay = L.rectangle(rectangleBounds, { color: 'red', weight: 2 }).addTo(this.map);
    //   const centerr = rectangleBounds.getCenter();
    //    this.addCenterMarker(centerr);
    // }
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

  clickto() {
    const utmEasting = 514703;
    const utmNorthing = 1013516;
    const utmZone = 37;
    const isNorthernHemisphere = "n";

    const latLngCoords = this.convertUTMToLatLng(
      utmNorthing,
      utmEasting,
      utmZone,
      isNorthernHemisphere
    );
    console.log("Latitude, Longitude:", latLngCoords);
  }

  conveLatLngToUTM(
    latitude: number,
    longitude: number
  ): { northing: number; easting: number; hemisphere: string; zone: number } {
    // Determine the hemisphere (northern or southern)
    const hemisphere = latitude >= 0 ? "N" : "S";

    // Calculate the UTM zone
    const zone = Math.floor((longitude + 180) / 6) + 1;

    // Convert latitude and longitude to UTM coordinates
    const utmCoords = utm.fromLatLon(latitude, longitude, zone, hemisphere);

    return {
      northing: utmCoords.northing,
      easting: utmCoords.easting,
      hemisphere: hemisphere,
      zone: zone,
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
    console.log("Latitude, Longitude:", latLngCoords);
    return { lat: latLngCoords.latitude, lng: latLngCoords.longitude };
  }

  conveUTMToLatLngforshapefile(
    northing: number,
    easting: number,
    zone: number,
    hemisphere: boolean
  ): [number, number, number] {
    console.log(easting, northing, zone, hemisphere);

    const latLngCoords = utm.toLatLon(easting, northing, zone, hemisphere);
    console.log("Latitude, Longitude:", latLngCoords);

    return [latLngCoords.longitude, latLngCoords.latitude, 0];
  }
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
