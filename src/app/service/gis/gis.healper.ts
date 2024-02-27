import * as FastXml from "fast-xml-parser";

export class GisHelper {
  // public static parseXml(capabilities) {
  //     let isValidXml = FastXml.validate(capabilities);
  //     if (isValidXml) {
  //         let options: FastXml.X2jOptions = {
  //             attributeNamePrefix: "@_",
  //             attrNodeName: "attr", //default is 'false'
  //             textNodeName: "#text",
  //             ignoreAttributes: true,
  //             ignoreNameSpace: false,
  //             allowBooleanAttributes: false,
  //             parseNodeValue: true,
  //             parseAttributeValue: false,
  //             trimValues: true,
  //             cdataTagName: "__cdata", //default is 'false'
  //             cdataPositionChar: "\\c",
  //             parseTrueNumberOnly: false,
  //             arrayMode: false, //"strict"
  //             attrValueProcessor: a => a,
  //             tagValueProcessor: a => a,
  //             stopNodes: ["parse-me-as-string"]
  //         };

  //         let intermidiateObject = FastXml.getTraversalObj(capabilities, options);
  //         let xmlToJsonCapabilities = FastXml.convertToJson(intermidiateObject, options);

  //         let featureList = xmlToJsonCapabilities['wfs:WFS_Capabilities']['FeatureTypeList']['FeatureType'];
  //         return featureList;
  //     }
  // }

  public static area(a) {
    let area = 0;
    let first = a[0];
    let e0 = [0, 0];
    let e1 = [0, 0];

    let l = a.length;
    for (var i = 2; i < l; i++) {
      var p = a[i - 1];
      var c = a[i];
      e0[0] = first[0] - c[0];
      e0[1] = first[1] - c[1];
      e1[0] = first[0] - p[0];
      e1[1] = first[1] - p[1];

      area += e0[0] * e1[1] - e0[1] * e1[0];
    }
    return area / 2;
  }
}

export interface IDMSCoordinate {
  degree: number;
  minute: number;
  second: number;
}

export interface IUTMCoordinate {
  x: number;
  y: number;
  band: string;
  southHemi: boolean;
  zone: number;
}
