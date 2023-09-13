// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  rootPath: window["rootPath"],
  // formPath: '',
  username: "BL_Info_Mgr",
  // username: 'BL_Tech_Officer',
  // username: 'BL_Data_Encoder',
  phisicalPath: "./assets/i18n/",
  Lang_code: (window["lang"] as string).toLowerCase(),
  localGisServer: window["local_GIS_server"],
  wfsGeoServer: window["wfs_geoserver"],
  PaymentReportPath: window["PaymentReportPath"],
  certReportPath: window["certReportPath"],
  LetterReportPath: window["LetterReportPath"],
  resourcePath: "",
  overlayLayer: window["overlayLayer"],
  layerConfig: window["layerConfig"],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
