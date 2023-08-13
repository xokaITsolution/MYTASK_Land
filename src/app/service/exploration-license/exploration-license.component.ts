import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.utm';
import * as Uniqolor from 'uniqolor';
import { GisService } from '../gis/gis.service';
import { GisHelper, IDMSCoordinate, IUTMCoordinate } from '../gis/gis.healper';
import convert from 'geo-coordinates-parser';
import intersect from '@turf/intersect';
import { environment } from 'src/environments/environment';
import { EventEmitter as NativeEmitter } from 'events';

@Component({
  selector: 'app-exploration-license',
  templateUrl: './exploration-license.component.html',
  styleUrls: ['./exploration-license.component.css']
})
export class ExplorationLicenseComponent implements AfterViewInit {

  datums = [
    {
      name: 'GCS Adindan',
      value: 'DATUM_01',
      zone: null
    },
    {
      name: 'Adindan UTM Zone 36',
      value: 'DATUM_02',
      zone: 36
    },
    {
      name: 'Adindan UTM Zone 37',
      value: 'DATUM_03',
      zone: 37
    },
    {
      name: 'Adindan UTM Zone 38',
      value: 'DATUM_04',
      zone: 38
    },
    {
      name: 'WGS 1984',
      value: 'DATUM_05',
      zone: null
    },
    {
      name: 'WGS 1984 UTM Zone 36',
      value: 'DATUM_06',
      zone: 36
    },
    {
      name: 'WGS 1984 UTM Zone 37',
      value: 'DATUM_07',
      zone: 37
    },
    {
      name: 'WGS 1984 UTM Zone 38',
      value: 'DATUM_08',
      zone: 38
    }
  ];

  coordinateSystemEnum = {
    UTM: [
      'DATUM_02',
      'DATUM_03',
      'DATUM_04',
      'DATUM_06',
      'DATUM_07',
      'DATUM_08'
    ],
    DD: [],
    DMS: [
      'DATUM_01',
      'DATUM_05'
    ]
  }
  mapElementId = 'exploration-map';
  selectedDatum: any;
  explorationMap: L.Map;
  private centerCoordinate: L.LatLngExpression = [9.03, 38.74];
  private zoomLevel = 6;
  osmTile;
  showNotification = false;
  notificationMessage = '';
  notificationTypes = {
    INFO: 'info',
    ERROR: 'error',
    WARNING: 'warning'
  };
  notificationType = 'info';
  polygonPoints: any[][] = [];
  tempPoints: L.CircleMarker[] = [];
  listOfLayers: any[] = [];
  layerName = '';
  pointLat: number;
  pointLng: number;
  dmsLat: IDMSCoordinate = <IDMSCoordinate>{};
  dmsLng: IDMSCoordinate = <IDMSCoordinate>{};
  utmCoordinate: IUTMCoordinate = <IUTMCoordinate>{};
  public outputFormats = {
    GML2: 'GML2',
    GML3: 'GML3',
    Shapefile: 'shape-zip',
    JSON: 'application/json',
    JSONP: 'text/javascript',
    CSV: 'csv'
  };
  layerType = {
    BUILTIN: 'built-in',
    CUSTOM: 'custom'
  }
  ddDmsChecked: boolean = false;
  intersectingAreaDialog: boolean = false;
  checkingIntersection: boolean = false;
  intersectingFeatures: any[];
  gotoMarker: L.Marker;
  areaPopup: L.Popup;
  private mapViewEvents = new NativeEmitter();
  public geoJsonLayers = [];
  tempPolygon: L.Polygon;
  tempPolyline: L.Polyline;
  intersectionLayer: L.GeoJSON;

  constructor(
    private _gisService: GisService
  ) { }

  ngAfterViewInit() {
    this.initWhenReady();
  }

  removeIntersectionLayer() {
    if (this.intersectionLayer) {
      this.explorationMap.removeLayer(this.intersectionLayer);
      this.intersectionLayer = null;
    }
  }

  intersectionMouseOver(intersectingFeature) {
    this.removeIntersectionLayer();
    this.intersectionLayer = L.geoJSON(
      intersectingFeature['intersection']
    ).addTo(this.explorationMap);
  }

  intersectionMouseOut() {
    this.removeIntersectionLayer();
  }

  layerMouseOver(layer) {
    if (layer['laterType'] == this.layerType.CUSTOM) {
      let hoverOption: L.PathOptions = {
        fillOpacity: 0.8,
        weight: 5
      };
      layer['layer'].setStyle(hoverOption);
    }
  }

  layerMouseOut(layer) {
    if (layer['laterType'] == this.layerType.CUSTOM) {
      let resetOption: L.PathOptions = {
        fillOpacity: 0.2,
        weight: 3
      };
      layer['layer'].setStyle(resetOption);
    }
  }

  datumSelected(event) {
    this.datums.some(
      datum => {
        if (datum['value'] == event.target.value) {
          this.utmCoordinate.zone = datum['zone'];
          return true;
        }
        return false;
      }
    );
  }

  utmProvided() {
    return (
      (
        this.utmCoordinate.x == null ||
        this.utmCoordinate.x == undefined ||
        this.utmCoordinate.y == null ||
        this.utmCoordinate.y == undefined
      )
    );
  }

  dmsProvided() {
    return (
      this.dmsLat.degree == null ||
      this.dmsLat.degree == undefined ||
      this.dmsLat.minute == null ||
      this.dmsLat.minute == undefined ||
      this.dmsLat.second == null ||
      this.dmsLat.second == undefined ||
      this.dmsLng.degree == null ||
      this.dmsLng.degree == undefined ||
      this.dmsLng.minute == null ||
      this.dmsLng.minute == undefined ||
      this.dmsLng.second == null ||
      this.dmsLng.second == undefined
    );
  }

  goto(lng, lat, showMarker = true) {
    if (this.explorationMap) {
      let latLng = {
        lat: lat,
        lng: lng
      };
      this.explorationMap.setView(
        latLng,
        8,
        {
          animate: true,
          duration: 1
        }
      );
      if (showMarker) {
        this.setMarker(latLng);
      }
    }
  }

  setMarker(latLng) {
    let markerIcon = L.icon({
      iconUrl: `${environment.resourcePath}assets/marker-icon.png`,
      shadowUrl: `${environment.resourcePath}assets/marker-shadow.png`
    });
    if (this.gotoMarker) {
      this.explorationMap.removeLayer(this.gotoMarker);
    }
    this.gotoMarker = L.marker(
      latLng,
      {
        icon: markerIcon
      }).addTo(this.explorationMap);
  }

  checkFeatures(layer, checkWith) {
    return new Promise((resolve, reject) => {
      if (layer['layer'].toGeoJSON) {
        let intersectionFeatures = [];
        let layerOne = layer['layer'].toGeoJSON();
        let layerTwo = this.listOfLayers.find(
          value => value['layerName'] == checkWith
        );
        if (layerTwo) {
          if (layerTwo['layer']['_layers']) {
            for (let feature in layerTwo['layer']['_layers']) {
              let intersection;
              try {
                intersection = intersect(layerOne, layerTwo['layer']['_layers'][feature]['feature']);
                if (intersection) {
                  intersectionFeatures.push({
                    'feature': layerTwo['layer']['_layers'][feature]['feature'],
                    intersection
                  });
                }
              }
              catch (e) {
                console.error('error', e);
              }
            }
            resolve(intersectionFeatures);
          }
          else {
            reject({
              message: 'not a geojson'
            });
          }
        }
        else {
          reject({
            message: 'no layer found'
          });
        }
      }
      else {
        reject({
          message: 'not a polygon'
        });
      }
    });
  }

  layerSelected(layer) {
    let center;
    this.explorationMap.fitBounds(layer['layer'].getBounds());

    if (layer['layer'].getBounds) {
      center = layer['layer'].getBounds().getCenter();
    }

    let popUpMessage = this.getAreaOfShape(layer);

    if (center) {
      this.areaPopup = L.popup()
        .setLatLng(center)
        .setContent(popUpMessage)
        .openOn(this.explorationMap);
    }

    if (layer['laterType'] == 'custom') {
      this.showIntersectionDialog(layer);
    }
  }

  pointSelected(pointIndex) {
    let lat = this.polygonPoints[pointIndex][0];
    let lng = this.polygonPoints[pointIndex][1];
    this.goto(lng, lat, false);
  }

  deletePoint(pointIndex) {
    this.polygonPoints.splice(pointIndex, 1);
    this.explorationMap.removeLayer(this.tempPoints[pointIndex]);
    this.tempPoints.splice(pointIndex, 1);
    this.drawTempPolygon();
  }

  deleteLayer(layer, layerIndex) {
    this.listOfLayers.splice(layerIndex, 1);
    this.explorationMap.removeLayer(layer['layer']);
  }

  calculateArea(coordinates) {
    let latLng: L.LatLngLiteral[] = [];
    coordinates.forEach(
      (coordinate, index) => {
        if (index < (coordinates.length - 1)) {
          latLng.unshift(L.latLng((Array.from(coordinate) as any).reverse()));
        }
      }
    );
    return L.GeometryUtil.geodesicArea(latLng);
  }

  calculateHoleArea(coordinates) {
    return this.calculateArea(coordinates);
  }

  showIntersectionDialog(layer) {
    this.intersectingAreaDialog = !this.intersectingAreaDialog;
    this.checkingIntersection = true;
    if (!layer['intersections']) {
      this.checkFeatures(layer, environment.overlayLayer).then(
        value => {
          this.intersectingFeatures = value as any[];
          this.intersectingFeatures.map(
            intersectingFeature => {
              intersectingFeature['area'] = 0;
              (intersectingFeature['intersection']['geometry']['coordinates'] as number[][] | number[][][]).forEach(
                (coordinates, index) => {
                  if (intersectingFeature['intersection']['geometry']['type'] == 'MultiPolygon') {
                    coordinates.forEach(
                      (innerCoordinates, index) => {
                        if (index == 0) {
                          intersectingFeature['area'] += this.calculateArea(innerCoordinates);
                        }
                        else {
                          intersectingFeature['area'] -= this.calculateHoleArea(innerCoordinates);
                        }
                      }
                    );
                  }
                  else {
                    if (index == 0) {
                      intersectingFeature['area'] = this.calculateArea(coordinates);
                    }
                    else {
                      intersectingFeature['area'] -= this.calculateHoleArea(coordinates);
                    }
                  }
                }
              );
              return intersectingFeature;
            }
          );
          layer['intersections'] = this.intersectingFeatures;
          this.checkingIntersection = false;
        }
      ).catch(
        reason => {
          console.error('error while checking :: ', reason);
          this.checkingIntersection = false;
        }
      );
    }
    else {
      this.intersectingFeatures = layer['intersections'];
      this.checkingIntersection = false;
    }
  }

  meterToKiloMeter(value: number) {
    return (value / (1000 ** 2)).toFixed(2);
  }

  getAreaOfShape(layer) {
    let message = `<span>Layer : ${layer['layerName']}</span><br/>`;
    if (layer['layer']['_latlngs']) {
      let area = L.GeometryUtil.geodesicArea(layer['layer']['_latlngs'][0]);
      message += `<span>Area: ${(area / (1000 ** 2)).toFixed(2)} km<sup>2</sup></span>`;
    }
    return message;
  }

  toogleLayer(event, layer) {
    this.listOfLayers.some(
      mapLayer => {
        if (mapLayer['layerId'] == layer['layerId']) {
          if (event.target.checked) {
            this.explorationMap.addLayer(mapLayer.layer);
          }
          else {
            this.explorationMap.removeLayer(mapLayer.layer);
          }
          return true;
        }
        return false;
      }
    )
  }

  notify(message, type) {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(
      _ => {
        this.showNotification = false;
      },
      5000
    );
  }

  clearInput() {
    this.pointLat =
      this.pointLng = null;
    this.dmsLat = <IDMSCoordinate>{};
    this.dmsLng = <IDMSCoordinate>{};
    this.utmCoordinate.x =
      this.utmCoordinate.y = null;
  }

  clearShape() {
    this.polygonPoints = [];
    this.layerName = null;

    this.clearInput();

    this.clearPointMarker();
    this.clearTempPolygon();
  }

  mapClicked(event) {
    let latLong = this.explorationMap.mouseEventToLatLng(event);
    this.pointLng = latLong['lng'];
    this.pointLat = latLong['lat'];

    this.convertDD(this.pointLat, this.pointLng);
  }

  convertDD(lat: number, lng: number) {
    let converted;
    try {
      converted = convert(`${lat}, ${lng}`).toCoordinateFormat(convert.to.DMS);
    }
    catch (error) {
      console.error('dd convertion :: ', error);
    }
    return converted;
  }

  randomColor() {
    let options = {
      format: "hex" as any
    };
    return Uniqolor.random(options);
  }

  colorFromText(text) {
    let options = {
      format: "hex" as any
    };

    return Uniqolor(text, options);
  }

  addShape() {
    if (this.polygonPoints.length >= 3 && this.explorationMap) {
      let options = {
        fillColor: this.randomColor().color,
        color: '#686868'
      };
      let polygon = L.polygon(this.polygonPoints, options).addTo(this.explorationMap);
      this.listOfLayers.push(
        {
          layerName: this.layerName,
          layer: polygon,
          layerId: this.randomId(),
          laterType: 'custom'
        }
      );
      this.clearPointMarker();
      this.clearTempPolygon();
      this.clearShape();
    }
    else {
      this.notify("Please add atleast three points!", this.notificationTypes.ERROR);
    }
  }

  clearTempPolygon() {
    if (this.tempPolygon) {
      this.explorationMap.removeLayer(this.tempPolygon);
    }

    if (this.tempPolyline) {
      this.explorationMap.removeLayer(this.tempPolyline);
    }
  }

  clearPointMarker() {
    for (let pointCircle of this.tempPoints) {
      this.explorationMap.removeLayer(pointCircle);
    }
    this.tempPoints = [];
  }

  convertDms(lat: IDMSCoordinate, lng: IDMSCoordinate) {
    let converted;
    try {
      converted = convert(`${lat.degree}° ${lat.minute}' ${lat.second}", ${lng.degree}° ${lng.minute}' ${lng.second}"`);
    }
    catch (error) {
      console.error('utm conversion :: ', error);
    }
    return converted;
  }

  hemiSelected(event) {
    this.utmCoordinate.southHemi = event.target.value == 'true';
  }

  convertUtm() {
    return L.utm({ x: this.utmCoordinate.x, y: this.utmCoordinate.y, zone: this.utmCoordinate.zone, band: 'n', southHemi: false });
  }

  addPoint(coordSystem) {
    switch (coordSystem) {
      case 'UTM':
        let utmLatLng = this.convertUtm().latLng();
        if (utmLatLng) {
          this.pointLat = utmLatLng['lat'];
          this.pointLng = utmLatLng['lng'];
          this.drawAssignPoints();
        }
        break;
      case 'DMS':
        let dmsLatLng = this.convertDms(this.dmsLat, this.dmsLng);
        if (dmsLatLng) {
          this.pointLat = dmsLatLng['decimalLatitude'];
          this.pointLng = dmsLatLng['decimalLongitude'];
          this.drawAssignPoints();
        }
        break;
      case 'DD':
        this.drawAssignPoints();
        break;
      default:
        break;
    }
    this.drawTempPolygon();
    this.clearInput();
  }

  drawTempPolygon() {
    if (this.tempPolyline) {
      this.explorationMap.removeLayer(this.tempPolyline);
      this.tempPolyline = null;
    }

    if (this.tempPolygon) {
      this.explorationMap.removeLayer(this.tempPolygon);
      this.tempPolygon = null;
    }

    if (this.polygonPoints.length > 2) {
      this.tempPolygon = L.polygon(
        this.polygonPoints,
      ).addTo(this.explorationMap);
    }
    else {
      this.tempPolyline = L.polyline(
        this.polygonPoints
      ).addTo(this.explorationMap);
    }
  }

  pointMouseOut(pointIndex) {
    this.tempPoints[pointIndex].setRadius(6);
  }

  pointHovered(pointIndex) {
    this.tempPoints[pointIndex].setRadius(8);
  }

  drawAssignPoints() {
    this.polygonPoints.push([
      this.pointLat,
      this.pointLng
    ]);

    this.tempPoints.push(
      L.circleMarker({
        lat: this.pointLat,
        lng: this.pointLng
      } as L.LatLngLiteral, {
        radius: 6,
        weight: 2,
        fillColor: '#fff',
        fillOpacity: 1,
        opacity: 1
      }).addTo(this.explorationMap)
    );
  }

  private initWhenReady() {
    let checkMapElement = setInterval(() => {
      let mapElement = document.getElementById(this.mapElementId);
      if (mapElement) {
        this.initMap();
        clearInterval(checkMapElement);
      }
    }, 500);
  }

  public initMap() {
    this.explorationMap = L.map(
      this.mapElementId,
      {
        renderer: L.svg()
      }
    ).setView(this.centerCoordinate, this.zoomLevel);
    this.wfsCapabilities();
    this.loadTileLayer();
  }

  loadGeoJsonList() {
    this._gisService.getListOfGeoJson().subscribe(
      listOfGeoJson => {
        this.geoJsonLayers = listOfGeoJson as any;
        this.mapViewEvents.emit('onListLoad');
      },
      error => {
        console.error('error getting geojson :: ', error);
      }
    );
  }

  private populateFeatures() {
    for (let layer of this.geoJsonLayers) {
      this.loadGeoJsonLayer(layer);
    }
  }

  loadGeoJsonLayer(whichGeoJson) {
    this._gisService.getGeoJsonData(whichGeoJson).subscribe(
      geoJsonData => {
        this.configFeature(geoJsonData, whichGeoJson, whichGeoJson);
      },
      error => {
        console.error('unable to retrieve geo json data ::', error);
      }
    )
  }

  wfsCapabilities() {
    this._gisService.getCapabilities().subscribe(
      capabilities => {
        let featureList = GisHelper.parseXml(capabilities);
        if (featureList) {
          if (featureList instanceof Array) {
            (featureList as Array<any>).forEach(
              (feature) => {
                this.loadFeatures(feature['Name'], feature['Title'], this.outputFormats.JSON);
              }
            );
          }
          else {
            this.loadFeatures(featureList['Name'], featureList['Title'], this.outputFormats.JSON);
          }
        }
      },
      error => {
        console.error('error getting capabilities, falling back to geojson files :: ', error);
        this.loadGeoJsonList();
        this.mapViewEvents.addListener('onListLoad', () => {
          this.populateFeatures();
        });
      }
    );
  }

  loadFeatures(typeName, typeTitle, outputFormat) {
    this._gisService.getFeatures(typeName, outputFormat).subscribe(
      feature => {
        this.configFeature(feature, typeName, typeTitle);
      },
      error => {
        console.error('error getting feature :: ', error);
      }
    );
  }

  randomId() {
    let idSegments = {
      segment_one: Math.floor(Math.random() * 10000),
      segment_two: Math.floor(Math.random() * 10000),
      segment_three: Math.floor(Math.random() * 10000)
    }

    return `${idSegments.segment_one}-${idSegments.segment_two}-${idSegments.segment_three}`;
  }

  configFeature(selectedfeature, featureName, featureTitle) {
    let layerColor = this.colorFromText(featureName).color;
    let layer = L.geoJSON(
      selectedfeature as any,
      {
        style: () => {
          let layer = (environment.layerConfig as any[]).find(
            layer => layer['name'] === featureName
          );

          return {
            color: layer ?
              layer['color'] ?
                layer['color'] :
                layerColor :
              layerColor,
            weight: layer ?
              layer['weight'] ?
                layer['weight'] :
                1 :
              1
          };
        }
      }
    ).addTo(this.explorationMap);

    this.listOfLayers.push(
      {
        layerName: featureTitle,
        layer: layer,
        layerId: this.randomId(),
        laterType: 'built-in'
      }
    );
  }

  loadTileLayer() {
    let layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(this.explorationMap);

    this.osmTile = layer;

    L.control.layers(
      {},
      {
        'Open street map': layer
      }
    ).addTo(this.explorationMap);
  }

  checkCoordinateSystem(coordinateSystem) {
    return (this.coordinateSystemEnum[coordinateSystem] as any[]).some(
      datum => datum == this.selectedDatum
    );
  }
}
