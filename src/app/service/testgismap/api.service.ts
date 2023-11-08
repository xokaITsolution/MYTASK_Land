import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import * as JSZip from "jszip";
import * as shp from "../../../../node_modules/shapefile/dist/Shapefile.js";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  private subcityGroupName = environment.SubcityName;
  private geourl = environment.geoser;

  constructor(private http: HttpClient) {}

  fetchStyleLayers(layername) {
    // http://<geoserver-url>/rest/layers/${layerName}.json
    const url = `${this.geourl}/rest/layers/${layername}.json`;
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    //return this.http.get(url, { headers });
    return this.http.get(url, { headers }).pipe(catchError(this.handleError));
  }
  fetchStyleFile(href: any) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    //return this.http.get(href, { headers });
    return this.http.get(href, { headers });
  }
  fetchGroupLayers(subcityGroupName): Observable<any> {
    const url = `${this.geourl}/rest/workspaces/${subcityGroupName}/layergroups.json`;
    // Set the required headers
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));

    // return this.http.get(url, { headers });
    return this.http.get(url, { headers }).pipe(catchError(this.handleError));
  }
  handleError(error: any) {
    // You can customize the error handling logic here.
    // For example, log the error for debugging purposes.
    console.error("HTTP Error:", error);

    // Rethrow the error so it can be caught by the component.
    return throwError(error);
  }
  getLayersFromGeoserver(url: any): Observable<any> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Basic " + btoa("admin:geoserver"));
    //return this.http.get<any>(url, { headers });
    return this.http.get(url, { headers }).pipe(catchError(this.handleError));
  }
  async readAndConvertShapefiles(zipFile: Blob): Promise<any> {
    const zip = new JSZip();

    try {
      const zipData = await zip.loadAsync(zipFile);
      console.log(zipData);

      const shpFile = zipData.file("Relocation.shp");
      const shxFile = zipData.file("Relocation.shx");
      const dbfFile = zipData.file("Relocation.dbf");

      if (shpFile && shxFile && dbfFile) {
        const [shpData, shxData, dbfData] = await Promise.all([
          shpFile.async("arraybuffer"),
          shxFile.async("arraybuffer"),
          dbfFile.async("arraybuffer"),
        ]);
        console.log(shpData);
        console.log(shxData);
        console.log(dbfData);

        // const shpReader = shp.parseShp(shpData);
        // const shxReader = shp.parseShx(shxData);
        // const dbfReader = shp.parseDbf(dbfData);

        // const features = shp.combine([shpReader, shxReader, dbfReader]);
        const features = await shp.open(shpData, dbfData);
        console.log(features);

        // Now you can access the GeoJSON features
        let { value, done } = await features.read();
        const geoJsonFeatures = [];

        while (!done) {
          geoJsonFeatures.push(value);
          const result = await features.read();
          value = result.value;
          done = result.done;
        }
        console.log(geoJsonFeatures);

        return geoJsonFeatures;
      } else {
        throw new Error("Shapefile components not found in the zip archive.");
      }
    } catch (error) {
      console.error("Error reading shapefile:", error);
      throw error;
    }
  }
}
