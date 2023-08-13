import { analyzeAndValidateNgModules } from "@angular/compiler";
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";

import * as L from "leaflet";
import { interval } from "rxjs";
import { PopupService } from "src/app/pro-service/popup.service";

import { GisService } from "src/app/service/gis/gis.service";

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

@Component({
  selector: "app-geojsondesk",
  templateUrl: "./geojsondesk.component.html",
  styleUrls: ["./geojsondesk.component.css"],
})
export class GeojsondeskComponent implements OnInit {
  private map: any;
  dyCheckbox: any;
  layerCapability: any;
  i = 0;

  mpass = new Map();

  constructor(
    private gisservice: GisService,
    private cd: ChangeDetectorRef,
    private popup: PopupService
  ) {}

  ngOnInit() {
    this.gisservice.getCapabilitiesGeodesk().subscribe((res: any) => {
      // console.log("res from com geodesk ", res);
      // console.log(res.WMS_Capabilities.Capability.Layer.Layer);

      this.dyCheckbox = res.WMS_Capabilities.Capability.Layer.Layer.map(
        (element: any) => {
          this.i++;
          return {
            id: this.i,
            select: false,
            name: element.Name._text,
            layermaker: {},
          };
        }
      );

      console.log("dycheckbox", this.dyCheckbox);
    });
  }

  ngAfterContentInit() {
    this.initmap();
  }

  ngDoCheck() {}

  private highlightFeature(e: any) {
    const layer = e.target;

    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: "#DFA612",
      fillOpacity: 1.0,
      fillColor: "#FAE042",
    });
  }

  private resetFeature(e: any) {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: "#008f68",
      fillOpacity: 0.8,
      fillColor: "#6DB65B",
    });
  }

  onchange($event: any) {
    if ($event.target.checked && !this.mpass.has($event.target.name)) {
      console.log("ckd", $event.target.name);

      this.gisservice
        .getGeodeskFeatures($event.target.name)
        .subscribe((res: any) => {
          console.log(res);
          this.mpass.set($event.target.name, res);
          this.map.addLayer(L.geoJSON(res));
        });
    } else {
      console.log("remove ", this.mpass.get($event.target.name));
      let g = L.geoJSON(this.mpass.get($event.target.name));
      this.map.removeLayer(g);
    }
  }

  public initmap() {
    this.map = L.map("map", {
      center: [9.145, 40.4897],
      zoom: 6,
    });

    var baselayers = {
      geo: L.tileLayer.wms(
        "http://192.168.0.133:8082/geoserver/yaspace/wms/reflect?",
        {
          layers: "yaspace:Eth_geology",
        }
      ),
      osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    };
    var overlays = {};
    L.control.layers(baselayers, overlays).addTo(this.map);
    baselayers["osm"].addTo(this.map);

    // const drawControl = new L.Control.Draw(this.drawPluginOptions);
    // this.map.addControl(drawControl);

    // /* var editableLayers = new L.FeatureGroup() */ this.map.addLayer(
    //   this.editableLayers
    // );

    // this.map.on('draw:created', function (e) {
    //   var type = e.layerType,
    //     layer = e.layer;

    //   if (type === 'marker') {
    //     layer.bindPopup('A popup!');
    //   }
    // });
  }

  private drawTown() {
    // this.twonmarker = L.geoJSON(this.twon, {
    //   onEachFeature: (feature, layer) => {
    //     layer.bindPopup(feature.properties.Name);
    //   },
    // });
    // this.twonmarker.bringToFront();
  }
}
// L.geoJSON(res, {
//   style: (feature) => ({
//     weight: 1,
//     opacity: 0.5,
//     color: "#cf404e",
//     fillOpacity: 0.8,
//     fillColor: "#223344",
//   }),
//   onEachFeature: (feature, layer) => {
//     layer.on({}), layer.bindPopup(this.popup.popup(feature));
//   },
// });
