//// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  rootPath: window["rootPath"],
  rootPathApi: window["rootPathApi"],
  // formPath: '',

  imagepath: window["_imagepath"],
  //username: "BL_Tech_Officer",
  iconpath: window["iconpath"],
  formPath: window["formPath"],

  //username: "0945845912",
  // username: "BL_Doc_Verifier",
  //username: "BL_Data_Encoder",
  username: "0911153139",

  // username: "BL_Cashier",
  phisicalPath: "./assets/i18n/",
  Lang_code: window["lang"],
  localGisServer: window["local_GIS_server"],
  wfsGeoServer: window["wfs_geoserver"],
  PaymentReportPath: window["PaymentReportPath"],
  certReportPath: window["certReportPath"],
  LetterReportPath: window["LetterReportPath"],

  resourcePath: "",
  overlayLayer: window["overlayLayer"],
  layerConfig: window["layerConfig"],
  rootPath2: window["rootPath2"],
  rootPath3: window["rootPath3"],
  groupLayerName: window["groupLayerName"],
  geoserverUrl: window["geoserverUrl"],
  geoserverUrlwfs: window["geoserverUrlwfs"],
  groupName: window["groupName"],
  multipleplotcanbeadd: window["multipleplotcanbeadd"],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
