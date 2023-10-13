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
import "proj4leaflet";
import { environment } from "../../../environments/environment";
import { ServiceService } from "../../service/service.service";
import * as utm from "utm";
import { Subject } from "rxjs";
import { BsModalService } from "ngx-bootstrap";
import { CustomAlertComponent } from "./CustomAlertComponent";
import { NotificationsService } from "angular2-notifications";
import { MessageService } from "primeng/api";
import { ApiService } from "../testgismap/api.service";

@Component({
  selector: "app-gis-map",
  templateUrl: "./gis-map.component.html",
  styleUrls: ["./gis-map.component.css"],
})
export class GisMapComponent implements AfterViewInit {
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
  targetArray: TreeNode[] = [];

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
    this.getcapablities();

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

  getGroupLayers(): void {
    this.geoser.fetchGroupLayers().subscribe((data: any) => {
      // debugger
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
          if (this.groupLayer.length > 0) {
            const firstElementValue = this.groupLayer[0].href;
            this.ParentGroupLayerSelected(true, firstElementValue);
          }
          console.log("AddisLand", this.groupLayers[index]);
        }
      }
    });
  }
  json2array(json) {
    var result = [];
    result.push(json);

    return result;
  }

  fetchTileLayer(layerName, newLayer) {
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
    const TileLayer = L.tileLayer.wms(`${this.geoserverUrlwfs}`, {
      layers: layerName,
      format: "image/png",
      transparent: true,
      maxZoom: 22,
      tileSize: 512,
      zoomOffset: -1,
      tms: true,
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
          this.getGroupLayers();
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
      // debugger
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
              //debugger;
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
              //   debugger
              //    this.toggleLayer(true, 'AddisLand');
              //  }
            });
        });
      }
    });

    // })
  }

  ParentGroupLayerSelected(checked: boolean, event: any): void {
    if (checked) {
      //Call Geoserver API to fetch layers for the selected group layer
      this.geoser.getLayersFromGeoserver(event).subscribe((data: any) => {
        if (data != undefined) {
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
              if (this.subcities.length > 0) {
                const firstElementValue = this.subcities[0].href;
                this.SubcitiesSelected(true, firstElementValue);
              }
            }
          }
          for (let index = 0; index <= this.subcities.length; index++) {
            const element = this.subcities[index].name.split(":");

            this.subcities[index].names = element[1];
          }
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
    console.log("subcitie", event);

    if (checked) {
      //debugger
      //Call Geoserver API to fetch layers for the selected group layer
      this.geoser.getLayersFromGeoserver(event).subscribe((data: any) => {
        // Handle the fetched layers here
        if (data != undefined) {
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
          if (this.woredas.length > 0) {
            const firstElementValue = this.woredas[0].href;
            const firstElementname = this.woredas[0].names;
            console.log("firstElementname", firstElementname);
            this.WoredasSelected(true, firstElementValue);
            this.toggleLayer(true, firstElementname);
          }
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
        if (data) {
          this.woredaLayers = data.layerGroup.publishables.published;
          console.log("woredaslayers", this.woredaLayers);
          if (typeof this.woredaLayers === "object") {
            if (Array.isArray(this.woredaLayers)) {
              console.log("Variable is an array");
            } else {
              this.woredaLayers = this.json2array(
                data.layerGroup.publishables.published
              );
              if (this.woredaLayers.length > 0) {
                const firstElementValue = this.woredaLayers[0].href;
                this.WoredaLayersSelected(true, firstElementValue);
              }
              console.log("woredaLayers", this.woredaLayers);
            }
          }
          for (let index = 0; index < this.woredaLayers.length; index++) {
            const element = this.woredaLayers[index].name.split(":");
            this.woredaLayers[index].names = element[1];
          }
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
        if (data != undefined) {
          this.woredaLayersOneByOne = data.layerGroup.publishables.published;
          if (typeof this.woredaLayersOneByOne === "object") {
            if (Array.isArray(this.woredaLayersOneByOne)) {
            } else {
              this.woredaLayersOneByOne = this.json2array(
                data.layerGroup.publishables.published
              );
            }
          }
          for (
            let index = 0;
            index < this.woredaLayersOneByOne.length;
            index++
          ) {
            const element = this.woredaLayersOneByOne[index].name.split(":");
            this.woredaLayersOneByOne[index].names = element[1];
            this.woredaLayersOneByOne[index].visibility = false;
            console.log("visiblity check", this.woredaLayersOneByOne[index]);
          }
        }
      });
    } else {
      this.woredaLayersOneByOne = null;
    }
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
  Bind_Features(geojson, layerName) {
    // debugger
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
        console.log("Shape created:alllatlong", this.alllatlong[0]);

        // Assuming limited area bounds as a polygon
        const limitedAreaBounds = L.polygon(this.alllatlong[0]).addTo(this.map);

        // Check if the drawn shape intersects with the limited area bounds
        if (limitedAreaBounds.getBounds().contains(layer.getBounds())) {
          this.map.addLayer(layer);

          console.log(layer);
          if (layer instanceof L.Polygon) {
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
            // const area = this.calculateUTMPolygonArea(utmCoordinates);
            // // Show the area in a popup
            // const maxAreaDifference = 0.05 * this.ServiceService.Totalarea;
            // const areaDifference = Math.abs(
            //   this.ServiceService.Totalarea - area
            // );
            // console.log(
            //   "Totalareatolerance",
            //   areaDifference,
            //   maxAreaDifference
            // );
            // const popupContent = `Area: ${area.toFixed(
            //   2
            // )} square meters, Tolerance:${maxAreaDifference} square meters `;
            // layer.bindPopup(popupContent).openPopup();

            // if (areaDifference >= maxAreaDifference) {
            //   const warningMessage =
            //     "በካርታው ላይ የሚሳሉት ቅርፅ አካባቢው ከሊዝ መያዣ ጋር እኩል መሆን አለበት/the shape you draw on map  the area must be equal to Lease hold";
            //   const toastWarning = this.notificationsService.warn(
            //     "Warning",
            //     warningMessage + popupContent
            //   );
            //   this.ServiceService.areaVerified = false;
            // } else {
            //   this.ServiceService.areaVerified = true;
            // }
            // Add the coordinates to the array
            //this.drawnShapes.push(this.coordinates);

            // Do something with the coordinates, such as displaying or processing them

            this.ServiceService.coordinate = utmCoordinates;
            // Now you can use circleLatLngs as needed
          } else if (layer instanceof L.Polyline) {
            this.coordinates = layer.getLatLngs(); // Get the coordinates of the polygon

            const polyline = L.polyline(this.coordinates, {
              color: "blue",
            }).addTo(this.map);
            console.log(this.coordinates);

            const utmCoordinates = this.convertCoordinatesToUTM(
              this.coordinates
            );
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

            polyline.bindPopup("This is a polyline!");
          }

          this.editableLayers.addLayer(layer);
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
          const area = this.calculateUTMPolygonArea(utmCoordinates);
          // Show the area in a popup
          console.log("Totalarea", area, utmCoordinates);
          const maxAreaDifference = 0.05 * this.ServiceService.Totalarea;
          const areaDifference = Math.abs(this.ServiceService.Totalarea - area);
          console.log("Totalareatolerance", areaDifference, maxAreaDifference);
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
          // Show the area in a popup
          console.log("Totalarea", area, utmCoordinates);
          const maxAreaDifference = 0.05 * this.ServiceService.Totalarea;
          const areaDifference = Math.abs(this.ServiceService.Totalarea - area);
          console.log("Totalareatolerance", areaDifference, maxAreaDifference);
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

          const polyline = L.polyline(this.coordinates, {
            color: "blue",
          }).addTo(this.map);
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

          polyline.bindPopup("This is a polyline!");
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
          // Show the area in a popup
          console.log("Totalarea", area, utmCoordinates);
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
              // this.ServiceService.shapes.push(drawnShape);

              // Transform GeoJSON to EPSG:20137 CRS if needed
            }
          } else {
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
    //debugger;
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

      // Remove the previously drawn shape, if any
      if (this.drawnShape) {
        this.map.removeLayer(this.drawnShape);
      }
      this.addMarkerToMap(latLng.lat, latLng.lng);
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

  drawPolygon() {
    console.log(this.pinpointedPoints);
    this.coordinates = this.pinpointedPoints;
    this.coordinates.push(this.coordinates[0]);
    this.drawnShape = L.polygon(this.pinpointedPoints).addTo(this.map);

    const utmCoordinates = this.convertCoordinatesToUTM(this.pinpointedPoints);
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
      this.sample = this.drawnShape;
      this.map.fitBounds(this.drawnShape.getBounds());
      this.onDatumChange();
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
    };
    fileReader.readAsArrayBuffer(file);
  }
  public processcoordinates(data: any[]): void {
    console.log("dataaaa", data);

    // Remove the header row from the data
    const coordinates = data.slice(1);
    console.log("coordinates", coordinates);

    // Map the data to LatLng objects
    const latLngs = coordinates.map((row) =>
      this.conveUTMToLatLng(row[0], row[1], row[3], row[2])
    );

    console.log("latLngs", latLngs);
    this.alllatlong.push(latLngs);
  }
  public drawnshapeAfterProcess() {
    console.log("this.alllatlong", this.alllatlong);

    this.alllatlong.forEach((shape) => {
      const randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      const polygonOptions = {
        color: randomColor,
      };

      this.drawnShape = L.polygon(shape).addTo(this.map);
      this.arrayFoPolygonarea.push(this.calculatePolygonArea(L.polygon(shape)));
      console.log("this.alllatlong", this.arrayFoPolygonarea);
      this.editableLayers.addLayer(this.drawnShape);
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

      // const customIcon = new L.Icon({
      //   iconUrl: environment.iconpath, // Replace with the actual path to your icon image
      //   iconSize: [50, 50], // Adjust the size as needed
      //   iconAnchor: [25, 50], // Adjust the anchor point if necessary
      //   popupAnchor: [0, -50], // Adjust the popup anchor if needed
      //   className: "custom-icon-class", // You can also add a custom CSS class
      // });
      // Calculate the center of the bounds
      const center = drawnShapeBounds.getCenter();
      console.log("center", center);

      // var marker = new L.Marker(center, {
      //   icon: customIcon,
      // });
      // this.addCenterMarker(center);
      // marker.addTo(this.map);

      // Fit the map bounds to the drawn shape with a specific maxZoom level
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

      //  if (this.ServiceService.check == true) {
      // this.map.on(L.Draw.Event.CREATED, (e: any) => {
      //   const layer = e.layer;
      //   console.log("alllatlong", this.alllatlong[0]);

      //   // Assuming limited area bounds as a polygon
      //   const limitedAreaBounds = L.polygon(this.alllatlong[0]).addTo(this.map);

      //   // Check if the drawn shape intersects with the limited area bounds
      //   if (limitedAreaBounds.getBounds().contains(layer.getBounds())) {
      //     this.map.addLayer(layer);
      //     this.ServiceService.disablebutton = true;
      //   } else {
      //     const toast = this.messageService.add({
      //       severity: "warn",
      //       summary: "Warn",
      //       detail:
      //         "Property Location cannot be outside of the Plot or Compound Area./ቤቱ ያረፈበት ቦታ ከግቢው ውጪ ሊሆን አይችልም፡፡",
      //     });
      //     this.map.removeLayer(layer);
      //     this.removeShape();
      //     this.ServiceService.disablebutton = false;
      //   }
      // });
      //}
      // Set the map view to the calculated center and zoom level
      // Fit the bounds with the new maxZoom level
    }
  }
  // calculatePolygonArea(polygon) {
  //   const result = [];
  //   // Assuming 'polygon' is an L.Polygon instance
  //   const latLngs = polygon.getLatLngs()[0]; // Get the coordinates of the polygon
  //   let area = 0;

  //   for (let i = 0; i < latLngs.length - 1; i++) {
  //     const lat1 = latLngs[i].lat;
  //     const lon1 = latLngs[i].lng;
  //     const lat2 = latLngs[i + 1].lat;
  //     const lon2 = latLngs[i + 1].lng;

  //     area += lon1 * lat2 - lon2 * lat1;
  //   }
  //   let final = parseInt(area.toFixed(3));
  //   result.push({
  //     Name: "shape",
  //     area: Math.abs(final) * 0.5,
  //     mesurment: "M2",
  //   });
  //   return result; // Take the absolute value and divide by 2 to get the area in square meters
  // }

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
      // if (Array.isArray(shape) && shape.length > 2) {
      //   // Check if shape is a valid array of coordinates
      this.drawnShape = L.polygon(shape, { color: randomColor }).addTo(
        this.map
      );
      this.editableLayers.addLayer(this.drawnShape);
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
          const limitedAreaBounds = L.polygon(this.alllatlong[0]).addTo(
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
}

// Define the Layer interface
interface Layer {
  name: string; // Name of the layer
  tileLayer?: L.TileLayer.WMS | null; // Tile layer (if it's a tile layer)
  vectorLayer?: L.Proj.GeoJSON | null; // Vector layer (if it's a vector layer)
}

interface TreeNode {
  name: string;
  children?: TreeNode[];
  href?: string;
  lable: string;
}
