export const environment = {
  production: true,
  rootPath: window['rootPath'],
  //formPath: '/DesktopModules/MVC/XOKA_SW_DNNModuleMyTask/Views/Item/assets/',
  username: window['_UserName'],
  phisicalPath: window['phisicalPath'],
  Lang_code: (window['lang'] as string).toLowerCase(),
  localGisServer: window['local_GIS_server'],
  wfsGeoServer: window['wfs_geoserver'],
  PaymentReportPath: window["PaymentReportPath"],
  certReportPath: window["certReportPath"],
  LetterReportPath: window["LetterReportPath"],
  resourcePath: window["resourcePath"],
  overlayLayer: window['overlayLayer'],
  layerConfig: window['layerConfig']
};
