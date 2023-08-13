import {Component, OnInit, ViewChild} from "@angular/core";

// when the docs use an import:
import "leaflet-geosearch/dist/geosearch.css";
import {featureGroup} from "leaflet";
import * as Draw from "leaflet-draw";
import * as L from "leaflet";
import "leaflet-draw";
import {FormControl} from "@angular/forms";
import {Data} from "@angular/router";
import {DataService} from "src/app/pro-service/data.service";
import {filter, map, skip} from "rxjs/operators";
import {THIS_EXPR} from "@angular/compiler/src/output/output_ast";
// import "leaflet-draw-edit";

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

const iconRetinaUrl = "assets/marker-icon-2x.png";
const iconUrl = "assets/marker-icon.png";
const shadowUrl = "assets/marker-shadow.png";
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [
        25, 41
    ],
    iconAnchor: [
        12, 41
    ],
    popupAnchor: [
        1, -34
    ],
    tooltipAnchor: [
        16, -28
    ],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

const markerIcon = L.icon({
    iconSize: [
        25, 41
    ],
    iconAnchor: [
        10, 41
    ],
    popupAnchor: [
        2, -40
    ],
    // specify the path here
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
});
L.Marker.prototype.options.icon = markerIcon;

export interface PeriodicElement {
    station_Code: string,
    station_Name: string,
    locationName_Locality: string,
    kebele: string,
    coordinate: string,
    altitude: string,
    data_Owner: string,
    data_Quality_Owner: string,
    publish_Owner: string,
    remarks: string,
    site_Status: string,
    license_Service_ID: string
}

@Component({selector: "app-drawmap", templateUrl: "./drawmap.component.html", styleUrls: ["./drawmap.component.css"]})
export class DrawmapComponent implements OnInit {
    name = "Angular";
    map : any;
    maker : L.Marker<any>;
    dbmaker : L.Marker<any> [];

    markers : any[];
    drawnItems = new L.FeatureGroup();

    datachild : any;
    isAddFieldTask : boolean;
    isSave : boolean;

    siteId = new FormControl("");
    stationName = new FormControl("");
    stationCode = new FormControl("");
    dataOwner = new FormControl("");
    basinId = new FormControl("");
    siteType = new FormControl("");

    constructor(private data : DataService) {}
    value = 'Clear me';

    ELEMENT_DATA : PeriodicElement[] = [{
            station_Code: 'data_Owner',
            station_Name: 'station_Name',
            locationName_Locality: 'locationName_Locality',
            kebele: 'kebele',
            coordinate: 'coordinate',
            altitude: 'altitude',
            data_Owner: 'data_Owner',
            data_Quality_Owner: 'data_Owner',
            publish_Owner: 'data_Owner',
            remarks: 'data_Owner',
            site_Status: 'data_Owner',
            license_Service_ID: 'data_Owner'
        },]

    // dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

    displayedColumns : string[] = [
        'station_Code',
        'station_Name',
        'locationName_Locality',
        'kebele',
        'coordinate',
        'altitude',
        'data_Owner',
        'data_Quality_Owner',
        'publish_Owner',
        'remarks',
        'site_Status',
        'license_Service_ID'
    ];
    dataSource : any;
    // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];


    @ViewChild(MatPaginator, {static: true})paginator : MatPaginator;

    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
    }

    model : any;
    list = ["item1", "item2", "item3"];
    dropdownSite_Type : any = new Set();
    dropdownBasin_ID : any = new Set();
    i = 0;

    ngOnInit() {
        this.initmap();

        this.data.getbasinIdAndsiteType().subscribe((res : any) => {
            console.log("res", res);
            // // this.dropdownSite_Type = res.resprocHydro_SiteDo;
            //
            res.procHydro_SiteDo.filter((val) => val.coordinate != null && val.coordinate.startsWith('POINT')).map((map : any) => {
                console.log(map.coordinate, " | ", map.basin_ID, " | ", map.site_Type);
                // console.log(this);

                if (map.site_Type) { // console.log('M_s_TYPE',map.site_Type);
                    this.dropdownSite_Type.add(map.site_Type);
                }


                if (map.basin_ID) {

                    this.dropdownBasin_ID.add(map.basin_ID)
                }
                // console.log(this.dropdownBasin_ID);

                let lat = map.coordinate.slice(7, -1).split(" ")[0];
                let lng = map.coordinate.slice(7, -1).split(" ")[1];

                if (lat == Number && lng == Number) {
                    console.log("the nums", lat, lng);
                }

                // console.log("latlng", lat, "  | ", lng);
                if (lat != null && lng != null)
                    L.marker([lat, lng]).bindPopup(`<b>Site ID: </b>${
                        map.siteId
                    }<br><b>Station Name: </b>${
                        map.stationName
                    }<br><b>Station Code: </b>${
                        map.stationCode
                    }<br><b>Data Owner: </b>${
                        map.dataOwner
                    }<br><b>Basin ID: </b>${
                        map.basinId
                    }<br><b>Site Type: </b>${
                        map.siteType
                    }`).addTo(this.map);


                //     }


            });
        });
    }
    marker : any;
    initmap() {
        this.map = L.map("map", {
            center: [
                9.145, 40.4897
            ],
            zoom: 6
        });

        const baselayers = {
            // openstreetmap: L.tileLayer(
            // "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // ),
            // googleStreets: L.tileLayer(
            // "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            // {
            //     maxZoom: 20,
            //     subdomains: ["mt0", "mt1", "mt2", "mt3"],
            // }
            // ),
            // googleHybrid: L.tileLayer(
            // "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
            // {
            //     maxZoom: 20,
            //     subdomains: ["mt0", "mt1", "mt2", "mt3"],
            // }
            // ),
            // googleSat: L.tileLayer(
            // "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            // {
            //     maxZoom: 20,
            //     subdomains: ["mt0", "mt1", "mt2", "mt3"],
            // }
            // ),
            // googleTerrain: L.tileLayer(
            // "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
            // {
            //     maxZoom: 20,
            //     subdomains: ["mt0", "mt1", "mt2", "mt3"],
            // }
            // ),
            VMap: L.tileLayer("https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=8fb3246c12d442525034be04bcd038f22e34571be4adbd4c")
        };

        var overlays = {};

        L.control.layers(baselayers, overlays).addTo(this.map);

        baselayers["VMap"].addTo(this.map);

        this.map.addLayer(this.drawnItems);

        var drawControl = new L.Control.Draw({
            position: "topright",
            edit: {
                featureGroup: this.drawnItems
            },
            draw: {}
        });
        this.map.addControl(drawControl);

        var app = this;
        this.map.on(L.Draw.Event.CREATED, function (c: any) {
            var type = c.layerType,
                layer = c.layer;

            console.log("the geo data from draw event", c);

            if (type === "marker") {
                layer.bindPopup("A popup!");
                console.log(layer.getLatLng());
            } else {
                console.log(layer.getLatLngs());
            } app.drawnItems.addLayer(layer);
            // TODO: ask yes no
            var r = confirm("Press a button!");
            if (r == true) {
                app.drawnItems.addLayer(layer);
                // app.shareDataService.ShareDataGeometry(c);
            } else {}
        });
        this.map.on(L.Draw.Event.EDITED, (e) => {
            let type = e.layerType;
            let layer = e.layer;
            // console.log("geojson", app.drawnItems.toGeoJSON());

            console.log("the geo data from edit event", e);
        });
    }

    onkeyupSiteID(siteId) {
        console.log("keyup");
        this.data.getSiteID(siteId).subscribe((res) => {
            console.log("res", res);
        });
    }

    // basinId
    // siteType

    keyup($event) {
        console.log($event.target.name);
        if ($event.target.name == 'stationName')
            this.data.getStationName($event.target.value).subscribe((res : any) => {
                console.log(res.procHydro_SiteDo);
                this.dataSource = new MatTableDataSource<PeriodicElement>(res.procHydro_SiteDo);
            });


        if ($event.target.name == 'stationCode')
            this.data.getStationCode($event.target.value).subscribe((res : any) => {
                console.log(res.procHydro_SiteDo);
                this.dataSource = new MatTableDataSource<PeriodicElement>(res.procHydro_SiteDo);
            });


        if ($event.target.name == 'dataOwner')
            this.data.getDataOwner($event.target.value).subscribe((res : any) => {
                console.log(res.procHydro_SiteDo);
                this.dataSource = new MatTableDataSource<PeriodicElement>(res.procHydro_SiteDo);
            });


        if ($event.target.name == 'siteId')
            this.data.getSiteID($event.target.value).subscribe((res : any) => {
                console.log(res.procHydro_SiteDo);
                this.dataSource = new MatTableDataSource<PeriodicElement>(res.procHydro_SiteDo);
            });

    }

    dropdownchangelistener($event) {
      console.log($event.target.name);
        if ($event.target.name == 'basinId') {
          console.log($event.target.value);

            this.data.getBasinID($event.target.value).subscribe((res : any) => {
                console.log(res.procHydro_SiteDo);
                this.dataSource = new MatTableDataSource<PeriodicElement>(res.procHydro_SiteDo);
            })
        }
        if ($event.target.name == 'siteType') {
          console.log($event.target.value);
          this.data.getSiteType($event.target.value).subscribe((res : any) => {
                console.log(res.procHydro_SiteDo);
                this.dataSource = new MatTableDataSource<PeriodicElement>(res.procHydro_SiteDo);
            })
        }
    }

}

// EPSG:4326
