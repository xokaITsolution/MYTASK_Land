import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as L from "../../../../node_modules/leaflet";
import * as utm from "utm";
import "leaflet-draw";

import { ApiService } from "./api.service";
import "proj4leaflet";
import { tileLayer, LatLngBounds } from "leaflet";
import { environment } from "../../../environments/environment";
import { ServiceService } from "../../service/service.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TreeNode } from "primeng/api";
interface AssignedBodyTree {
  label: string;
  value: string;
  children: any;
}
interface AssignedBodyTree2 {
  label: string;
  value: string;
}
@Component({
  selector: "app-testgismap",
  templateUrl: "./testgismap.component.html",
  styleUrls: ["./testgismap.component.css"],
})
export class TestgismapComponent implements AfterViewInit, OnInit {
  polylinee: any;
  datum: string;
  defaultLayer: any;
  sample: L.Layer;
  rectangleOverlay: any;
  utmCoordinates: any;
  nodes: TreeNode[];
  latitude: number;
  longitude: number;
  latitudeDegrees: number;
  latitudeSeconds: number;
  latitudeMinutes: number;
  longitudeDegrees: number;
  longitudeMinutes: number;
  longitudeSeconds: number;

  drawnShape: L.Layer;
  drawControl: L.Control.Draw;
  drawnShapes: L.LatLng[][] = []; // Array to store the drawn shapes' coordinates
  pinpointedPoints: any = [];
  coordinates: any = [];
  selectedDatum: string = "Adindan / UTM zone 37N";

  layers: Layer[] = [];

  groupLayer: any;
  layerGroups$: Observable<any>;
  newlayers: any[];
  newlayer: any[];
  groupLayers: any;
  rootLayers: any;
  tileLayerBounds: LatLngBounds;
  map: L.Map;

  private EPSG20137: L.Proj.CRS; // Define the EPSG:20137 CRS
  private markerLayer: L.LayerGroup;
  //xmlParser = new XMLParser();

  // Geoserver information
  private geoserverUrl = environment.geoserverUrl;
  private parentGroupName = environment.parentGroupName;
  private geoserverUrlwfs = environment.geoserverUrlwfs;
  parentgrouplayername: any;
  subcities: any;
  woredas: any;
  woredaLayers: any;
  layername: any;
  subcitylayername: any[];
  woredaLayersOneByOne: any;
  event: any;
  vectorLayer: L.Proj.GeoJSON;
  styleHref: any;

  constructor(
    private ServiceService: ServiceService,
    private cdr: ChangeDetectorRef,
    private geoser: ApiService,
    private http: HttpClient
  ) {
    this.defaultLayer = this.layers[0];
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
  }
  ngOnInit(): void {
    this.initMap();
    this.getcapablities();
    this.getGroupLayers();
  }
  ሽ;
  getGroupLayers(): void {
    this.geoser
      .fetchGroupLayers(environment.SubcityName)
      .subscribe((data: any) => {
        //
        this.groupLayers = data.layerGroups.layerGroup;
        console.log("Agroup", this.groupLayers);
        for (let index = 0; index < this.groupLayers.length; index++) {
          const element = this.groupLayers[index].name;
          // this.subcities[index].name = element[1];
          if (element === this.parentGroupName) {
            if (typeof this.groupLayers[index] === "object") {
              if (Array.isArray(this.groupLayers[index])) {
                console.log("Variable is an array");
              } else {
                this.groupLayer = this.json2array(this.groupLayers[index]);
                console.log("parent", this.groupLayer);
              }
            }
            console.log("AddisLand", this.groupLayers[index]);
            this.getTree(this.groupLayer);
          }
        }
      });
  }

  json2array(json) {
    var result = [];
    result.push(json);

    return result;
  }
  async getTree(grouplist) {
    this.nodes = [];
    //
    console.log("this.groupLayer", this.groupLayer);

    for (let i = 0; i < this.groupLayer.length; i++) {
      let a: AssignedBodyTree = {
        label: "",
        value: "",
        children: "",
      };
      console.log("hhhe", a);
      a["label"] = this.groupLayer[i].name;
      a["value"] = this.groupLayer[i].href;
      a.children = [];
      var sub = await this.geoser
        .getLayersFromGeoserver(this.groupLayer[i].href)
        .toPromise();
      let keys = Object.keys(sub);
      console.log("wor.key", keys);

      if (keys[0] == "layer") {
        console.log("wor.layer.name", sub.layer.name);
        continue;
      }

      this.subcities = sub.layerGroup.publishables.published;

      if (typeof this.subcities === "object") {
        if (Array.isArray(this.subcities)) {
          console.log("Variable is an array");
        } else {
          this.subcities = this.json2array(
            sub.layerGroup.publishables.published
          );
          console.log("subcities", this.subcities);
        }
      }

      // for (let index = 0; index <= this.subcities.length; index++) {
      //   const element = this.subcities[index].name.split(':')
      //   // console.log("element",element);

      //   this.subcities[index].name = element[1];
      //   console.log("element",this.subcities[index].name);
      //   continue;
      // }
      const l11 = Object.assign([], this.subcities);
      console.log("subb", this.subcities.length);

      for (let j = 0; j < this.subcities.length; j++) {
        let b: AssignedBodyTree = {
          label: "",
          value: "",
          children: "",
        };
        const element = this.subcities[j].name.split(":");
        this.subcities[j].name = element[1];
        b["label"] = this.subcities[j].name;
        b["value"] = this.subcities[j].href;
        b.children = [];
        a.children.push(b);
        //
        var wor = await this.geoser
          .getLayersFromGeoserver(this.subcities[j].href)
          .toPromise();
        let keys = Object.keys(wor);
        console.log("wor.key", keys);

        if (keys[0] == "layer") {
          console.log("wor.layer.name", wor.layer.name);
          continue;
        }
        this.woredas = wor.layerGroup.publishables.published;
        if (typeof this.woredas === "object") {
          if (Array.isArray(this.woredas)) {
            console.log("Variable is an array");
          } else {
            this.woredas = this.json2array(
              wor.layerGroup.publishables.published
            );
            console.log("subcities", this.woredas);
          }
        }
        console.log("this.files111", this.woredas);
        const l1 = Object.assign([], this.woredas);

        for (let k = 0; k < this.woredas.length; k++) {
          let c: AssignedBodyTree = {
            label: "",
            value: "",
            children: "",
          };
          const element = this.woredas[k].name.split(":");
          this.woredas[k].name = element[1];
          c["label"] = this.woredas[k].name;
          c["value"] = this.woredas[k].href;
          c.children = [];
          b.children.push(c);
          //
          var worlay = await this.geoser
            .getLayersFromGeoserver(this.woredas[k].href)
            .toPromise();
          // console.log("worlay",worlay.layer.name);
          let keys = Object.keys(worlay);
          console.log("wor.key", keys);

          if (keys[0] == "layer") {
            console.log("wor.layer.name", worlay.layer.name);
            continue;
          }
          console.log("worlay", worlay.layerGroup.publishables.published);
          this.woredaLayers = worlay.layerGroup.publishables.published;
          console.log("ddd", this.woredaLayers);

          if (typeof this.woredaLayers === "object") {
            if (Array.isArray(this.woredaLayers)) {
              console.log("Variable is an array");
            } else {
              this.woredaLayers = this.json2array(
                worlay.layerGroup.publishables.published
              );
              console.log("subcities", this.woredaLayers);
            }
          }
          console.log("this11", this.woredaLayers);
          const l1 = Object.assign([], this.woredaLayers);

          for (let l = 0; l < this.woredaLayers.length; l++) {
            let d: AssignedBodyTree = {
              label: "",
              value: "",
              children: "",
            };
            const element = this.woredaLayers[l].name.split(":");
            this.woredaLayers[l].name = element[1];
            d["label"] = this.woredaLayers[l].name;
            d["value"] = this.woredaLayers[l].href;
            d.children = [];
            c.children.push(d);
            //
            var worlayonebyone = await this.geoser
              .getLayersFromGeoserver(this.woredaLayers[l].href)
              .toPromise();
            // console.log("worlay",worlay.layer.name);
            let keys = Object.keys(worlayonebyone);
            console.log("wor.key", keys);

            if (keys[0] == "layer") {
              console.log("wor.layer.name", worlayonebyone.layer.name);
              continue;
            }
            console.log(
              "worlayonebyone",
              worlayonebyone.layerGroup.publishables.published
            );
            this.woredaLayersOneByOne =
              worlayonebyone.layerGroup.publishables.published;
            console.log("ddd", this.woredaLayersOneByOne);

            if (typeof this.woredaLayersOneByOne === "object") {
              if (Array.isArray(this.woredaLayersOneByOne)) {
                console.log("Variable is an array");
              } else {
                this.woredaLayersOneByOne = this.json2array(
                  worlayonebyone.layerGroup.publishables.published
                );
                console.log("woredaLayersOneByOne", this.woredaLayersOneByOne);
              }
            }
            console.log("this11", this.woredaLayersOneByOne);
            const l1 = Object.assign([], this.woredaLayersOneByOne);

            for (let m = 0; m < this.woredaLayersOneByOne.length; m++) {
              let e: AssignedBodyTree2 = {
                label: "",
                value: "",
              };
              //
              const element = this.woredaLayersOneByOne[m].name.split(":");
              this.woredaLayersOneByOne[m].name = element[1];
              e.label = this.woredaLayersOneByOne[m].name;
              e.value = this.woredaLayersOneByOne[m].href;
              this.woredaLayersOneByOne[l].children = [];
              d.children.push(e);
            }
          }
        }
      }
      this.nodes.push(a);
    }
    // if(this.nodes.length ==7){
    //   this.savedstatuslist=false
    // }else{
    //    this.savedstatuslist=true
    // }
    console.log("this.files", this.nodes);
  }
  ParentGroupLayerSelected(checked: boolean, event: any): void {
    if (checked) {
      //Call Geoserver API to fetch layers for the selected group layer
      this.geoser.getLayersFromGeoserver(event).subscribe((data: any) => {
        this.subcities = data.layerGroup.publishables.published;
        // Handle the fetched layers here
        if (typeof this.subcities === "object") {
          if (Array.isArray(this.subcities)) {
            console.log("Variable is an array");
          } else {
            this.subcities = this.json2array(
              data.layerGroup.publishables.published
            );
            console.log("subcities", this.subcities);
          }
        }

        for (let index = 0; index <= this.subcities.length; index++) {
          const element = this.subcities[index].name.split(":");

          this.subcities[index].names = element[1];
        }
      });
    } else {
      this.subcities = null;
      this.woredas = null;
      this.woredaLayers = null;
      this.woredaLayersOneByOne = null;
    }
  }
  SubcitiesSelected(checked: boolean, event: any) {
    if (checked) {
      //
      //Call Geoserver API to fetch layers for the selected group layer
      this.geoser.getLayersFromGeoserver(event).subscribe((data: any) => {
        // Handle the fetched layers here
        this.woredas = data.layerGroup.publishables.published;
        if (typeof this.woredas === "object") {
          if (Array.isArray(this.woredas)) {
            console.log("Variable is an array");
          } else {
            this.woredas = this.json2array(
              data.layerGroup.publishables.published
            );
            console.log("woredas", this.woredas);
          }
        }

        for (let index = 0; index < this.woredas.length; index++) {
          const element = this.woredas[index].name.split(":");
          this.woredas[index].names = element[1];
        }
      });
    } else {
      this.woredas = null;
      this.woredaLayers = null;
      this.woredaLayersOneByOne = null;
    }
  }
  WoredasSelected(checked: boolean, event: any) {
    if (checked) {
      //Call Geoserver API to fetch layers for the selected group layer
      this.geoser.getLayersFromGeoserver(event).subscribe((data: any) => {
        // Handle the fetched layers here
        this.woredaLayers = data.layerGroup.publishables.published;
        console.log("woredaslayers", this.woredaLayers);
        if (typeof this.woredaLayers === "object") {
          if (Array.isArray(this.woredaLayers)) {
            console.log("Variable is an array");
          } else {
            this.woredaLayers = this.json2array(
              data.layerGroup.publishables.published
            );
            console.log("woredaLayers", this.woredaLayers);
          }
        }
        for (let index = 0; index < this.woredaLayers.length; index++) {
          const element = this.woredaLayers[index].name.split(":");
          this.woredaLayers[index].names = element[1];
        }
      });
    } else {
      this.woredaLayers = null;
      this.woredaLayersOneByOne = null;
    }
  }
  WoredaLayersSelected(checked: boolean, event: any) {
    if (checked) {
      //Call Geoserver API to fetch layers for the selected group layer
      this.geoser.getLayersFromGeoserver(event).subscribe((data: any) => {
        // Handle the fetched layers here
        this.woredaLayersOneByOne = data.layerGroup.publishables.published;
        if (typeof this.woredaLayersOneByOne === "object") {
          if (Array.isArray(this.woredaLayersOneByOne)) {
          } else {
            this.woredaLayersOneByOne = this.json2array(
              data.layerGroup.publishables.published
            );
          }
        }
        for (let index = 0; index < this.woredaLayersOneByOne.length; index++) {
          const element = this.woredaLayersOneByOne[index].name.split(":");
          this.woredaLayersOneByOne[index].names = element[1];
          this.woredaLayersOneByOne[index].visibility = false;
          console.log("visiblity check", this.woredaLayersOneByOne[index]);
        }
      });
    } else {
      this.woredaLayersOneByOne = null;
    }
  }

  initMap(): void {
    this.EPSG20137 = new L.Proj.CRS(
      "EPSG:20137",
      "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-165,-11,206,0,0,0,0 +units=m +no_defs +type=crs",
      {
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
        origin: [166600.5155002516, 375771.9736823894],
      }
    );

    const mapContainer = document.getElementById("mapp");
    if (!mapContainer) {
      return;
    }
    // this.map = L.map('mapp', {
    //   crs: this.EPSG20137, // Set the map CRS to EPSG:20137
    // }).setView([9.145, 40.489],4); // Set an appropriate initial view for Ethiopia
    this.map = L.map("mapp", {
      center: [9.032457, 38.759775],
      zoom: 12,
    });

    this.markerLayer = L.layerGroup().addTo(this.map);
    // Create a map event listener to track mouse movements
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
  }

  fetchTileLayer(layerName, newLayer) {
    //Add your raster layer to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    // 'http://GEOSERVER_URL/gwc/service/wms?SERVICE=WMS&VERSION=1.1.1&TILED=true&...'
    const TileLayer = L.tileLayer.wms(`${this.geoserverUrlwfs}`, {
      layers: layerName,
      format: "image/png",
      transparent: true,
      // styles: ['styleName'],
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
    });

    newLayer.tileLayer = TileLayer;

    // const llsnm = tileLayer
    //   .wms("http://land.xokait.com.et:8080/geoserver/gwc/service/wmts", {
    //     layers: "arada_addisland:points",
    //     format: "image/png",
    //     transparent: true,
    //   })
    //   .addTo(this.map);

    // L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    //   layers: 'workspace:layername',
    //   format: 'image/png',
    //   transparent: true,
    //   version: '1.1.0',
    //   attribution: '© GeoServer'
    // }).addTo(this.map);
    // var layer = L.tileLayer.wmts('http://land.xokait.com.et:8080/geoserver/gwc/service/wmts', {
    //   layer: 'workspace:layer_name', // replace with your layer name
    //   format: 'application/vnd.mapbox-vector-tile',
    //   style: 'default',
    //   tilematrixSet: 'EPSG:3857',
    //   maxZoom: 18,
    //   accessToken: 'your_access_token' // optional, required if your server is secured
    // }).addTo(this.map);
  }

  getcapablities() {
    // GetCapabilities request to retrieve layer names within the group
    const capabilitiesUrl = `${this.geoserverUrl}?service=wms&request=getcapabilities&version=1.1.0&tiled=true`;

    fetch(capabilitiesUrl)
      .then((response) => response.text())
      .then((data) => {
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
          this.GetFeatureCapablities(layerName, newLayer);

          // push all changes on layers
          this.layers.push(newLayer);
        }
      })
      .catch((error) => {
        console.error("Error fetching GetCapabilities:", error);
      });
  }

  GetFeatureCapablities(layerName: string, newLayer: Layer) {
    // Add each layer to the map as a vector layer
    // const getFeatureUrl = `${this.geoserverUrlwfs}?service=WFS&version=1.0.0&request=GetFeature&tiled=true&typeName=${layerName}&outputFormat=application/json`;
    // fetch(getFeatureUrl)
    //   .then(response => response.json())
    //   .then(geojson => {
    //     // Simulate loading the GeoJSON data asynchronously
    //     // call a create vectorLayer method
    //     // Create a new vector layer using the fetched GeoJSON data
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
          const getFeatureUrl = `${this.geoserverUrlwfs}?service=WFS&version=1.0.0&request=GetFeature&tiled=true&typeName=${layerName}&outputFormat=application/json`;
          fetch(getFeatureUrl)
            .then((response) => response.json())
            .then((geojson) => {
              console.log("geojson", geojson);

              // Modify the options color to empty for each feature in the geojson data

              // const vectorLayer = L.geoJSON(geojson).addTo(this.map);
              this.Bind_Features(geojson, layerName);

              // Apply the style to the vector layer
              this.vectorLayer.setStyle(style);

              console.log("vectorlayer", this.vectorLayer);

              this.vectorLayerOnClick();
              // Store the vector layer reference in the newLayer object
              // geojson.features.forEach(feature => {
              //   feature.options = {
              //     color: ''  // Set color to empty
              //   };
              // });
              const options = {
                style: function (feature) {
                  return {
                    color: "#4388ff",
                  };
                },
              };
              //   const lproj = L.Proj.geoJson(geojson,options);
              // //  const lproj= L.Proj.geoJson(geojson, {

              // //  }
              // //   )
              //   console.log("lproj",lproj);
              newLayer.vectorLayer = this.vectorLayer;
              this.fetchTileLayer(layerName, newLayer);

              //console.error('Error fetching GeoJSON:', error);
              // A layer which is not a vector layer can not be fetched as a geojson
              // So here it is fetched as a tileLiyer
            })
            .catch((error) => {
              //console.error('Error fetching GeoJSON:', error);

              // A layer which is not a vector layer can not be fetched as a geojson
              // So here it is fetched as a tileLiyer

              this.fetchTileLayer(layerName, newLayer);

              //  if (layerName === 'AddisLand') {
              //
              //    this.toggleLayer(true, 'AddisLand');
              //  }
            });
        });
      }
    });

    // })
  }

  Bind_Features(geojson, layerName) {
    //
    const options = {
      style: function (feature) {
        return {
          color: null,
        };
      },
    };
    (this.vectorLayer = L.Proj.geoJson(geojson, options)),
      {
        onEachFeature: (feature, layer) => {
          const properties = feature.properties; // Access the properties of the feature
          let popupContent = `Layer: ${layerName}<br>Feature ID: ${feature.id}<br>`;

          // Dynamically add the properties to the popup content
          for (const propertyName in properties) {
            if (properties.hasOwnProperty(propertyName)) {
              popupContent += `${propertyName}: ${properties[propertyName]}<br>`;
            }
          }
          // Bind the customized popup content to the layer
          layer.bindPopup(popupContent);
        },
        coordsToLatLng: (
          coords: [number, number] | [number, number, number]
        ) => {
          if (coords.length >= 2) {
            // Ignore the z-coordinate and use only the x and y coordinates for LatLng
            return L.CRS.EPSG4326.unproject(L.point(coords[0], coords[1]));
          }
          throw new Error("Invalid coordinate format");
        },
        attribution: layerName,
      };
  }
  fetchstylefile(href: string, callback: (style: any) => void) {
    this.geoser.fetchStyleFile(href).subscribe((style: any) => {
      callback(style);
    });
  }

  vectorLayerOnClick() {
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

    coordinates.forEach((coord) => {
      const { lat, lng } = coord;
      const utmPoint = this.conveLatLngToUTM(lat, lng);
      utmCoordinates.push(utmPoint);
    });

    return utmCoordinates;
  }

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
  toggleLayer(visibility: boolean, layerName: string) {
    const layer = this.layers.find((l) => l.name === layerName);
    if (layer && layer.vectorLayer) {
      if (visibility) {
        console.log("vectorlayer", layer.vectorLayer);
        // setTimeout(() => {
        //   // Fetch the GeoJSON data from the server
        //   // Replace this section with your actual API call to fetch the GeoJSON data
        //   this.geoJSONData =layer.vectorLayer
        //   // Add the GeoJSON layer to the map
        //   const geoJSONLayer = new GeoJSON(this.geoJSONData, {
        //     // Configure the layer style and properties
        //   }).addTo(this.map);

        //   // Fit the map to the bounds of the GeoJSON data
        //   const bounds: LatLngBoundsExpression = geoJSONLayer.getBounds();
        //   this.map.fitBounds(bounds);
        // }, 1000); // Simulated delay of 1 second
        this.map.addLayer(layer.tileLayer);
        this.map.addLayer(layer.vectorLayer);
        this.onDatumChange();
      } else {
        console.log("vectorlayer", layer.vectorLayer);
        this.map.removeLayer(layer.tileLayer);
        this.map.removeLayer(layer.vectorLayer);
      }
    } else if (layer && layer.tileLayer) {
      if (visibility) {
        console.log("tilelayer", layer.tileLayer);
        this.map.addLayer(layer.tileLayer);
        this.onDatumChange();
        //this.tileLayerBounds = tileLayer.getTileBounds();
        // this.map.fitBounds(layer.tileLayer.getBounds());
      } else {
        console.log("tilelayer", layer.tileLayer);
        this.map.removeLayer(layer.tileLayer);
      }
    }
  }

  //  toggleLayer(checked: boolean, layerName: string): void {

  //   const layer = this.layers.find(l => l.name === layerName);

  //   if (checked) {
  //     if (!layer.tileLayer) {
  //       layer.tileLayer = L.tileLayer.wms(environment.geoserverUrl, {
  //         layers: layerName,
  //         format: 'image/png',
  //         transparent: true,
  //         attribution: 'this is '+layerName + 'map',
  //          crs: this.EPSG20137, // Set the tile layer CRS to EPSG:20137,
  //       });
  //     }
  //     layer.tileLayer.addTo(this.map);
  //     this.onDatumChange()
  //   } else {
  //     if (layer.tileLayer) {
  //       this.map.removeLayer(layer.tileLayer);
  //     }
  //   }
  // }
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

      // Remove the previously drawn shape, if any
      if (this.drawnShape) {
        this.map.removeLayer(this.drawnShape);
      }
      //this.addMarkerToMap(latLng.lat, latLng.lng)
      // Create a marker at the specified coordinates
      //this.drawnShape = L.marker(latLng).addTo(this.map);

      // Optionally, you can create other types of shapes like circles or polygons
      // based on the user-entered coordinates
      // For example:
      // this.drawnShape = L.circle(latLng, { radius: 100 }).addTo(this.map);
      // this.drawnShape = L.polygon([latLng1, latLng2, latLng3]).addTo(this.map);

      // Fit the map view to the drawn shape
      if (this.drawnShape instanceof L.Marker) {
        this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
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

      // Create a marker at the specified coordinates
      this.drawnShape = L.marker(latLng).addTo(this.map);

      // Optionally, you can create other types of shapes like circles or polygons
      // based on the user-entered coordinates
      // For example:
      // this.drawnShape = L.circle(latLng, { radius: 100 }).addTo(this.map);
      // this.drawnShape = L.polygon([latLng1, latLng2, latLng3]).addTo(this.map);

      // Fit the map view to the drawn shape

      if (this.drawnShape instanceof L.Marker) {
        this.map.setView(this.drawnShape.getLatLng(), this.map.getZoom());
      } else if (
        this.drawnShape instanceof L.Circle ||
        this.drawnShape instanceof L.Polygon
      ) {
        this.drawnShape.addTo(this.map);
        this.map.fitBounds(this.drawnShape.getBounds());
      }
    }
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
      const crs = new L.Proj.CRS("EPSG:20137", selectedProjection, {
        origin: [-180, 90],
        resolutions: [
          //264583.8625007946,
          132291.9312505292, 66145.9656252646, 33072.9828126323,
          16536.49140631615, 1033.5307128947595, 8268.245703158075,
          4134.122851579038, 2067.061425789519, 1033.5307128947597,
          516.7653564473798, 258.3826782236899, 129.19133911184494,
          64.59566955592247, 32.29783477796124, 16.14891738898062,
          8.07445869449031, 4.037229347245155, 2.0186146736225775,
          1.0093073368112888, 1.0093073368112888, 1.0093073368165999,
          1.009307336818619, 1.0093073368193081, 1.0093073368193542,
          1.0093073368193683, 1.0093073368193714, 1.009307336819372,
          1.0093073368193723, 1.0093073368193724,

          0.5046536684056444, 0.5046536684056445, 0.5046536684056446,
          0.5046536684056447, 0.5046536684056448, 0.5046536684056449,
          0.504653668405645, 0.5046536684056451, 0.5046536684056452,
          0.5046536684056453,

          0.5046536684056444,
        ],
        bounds: L.bounds(
          [-36909.130089988816, 376321.5212803309],
          [937040.4635133516, 1148344.584522629]
        ),
      });

      // Set the updated map projection
      this.map.options.crs = crs;
      //this.map.fitBounds(boundingLayer.getBounds());
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
    const zoom = 15; // Update with the desired zoom level for the selected projection
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
}
// Define the Layer interface
interface Layer {
  name: string; // Name of the layer
  tileLayer?: L.TileLayer.WMS | null; // Tile layer (if it's a tile layer)
  vectorLayer?: L.Proj.GeoJSON | null; // Vector layer (if it's a vector layer)
}
