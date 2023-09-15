import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {GisMapComponent} from './gis-map.component'
@Injectable({
  providedIn: 'root'
})
export class GisMapService {

  constructor(private http: HttpClient ,) { }

// call(a){
//     console.log("here");
    
//      this.GisMapComponent.processImportedShapes(a)
// }
}
  