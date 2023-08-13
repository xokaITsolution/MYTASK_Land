import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class PopupService {
  constructor(private data: DataService) {}

  popup(data: any): string {
    return (
      `` +
      `<div>Name: ${data.properties.Name}</div>` +
      `<div>Name: ${data.geometry.coordinates}</div>` +
      `<div>Name: ${data.geometry_name}</div>`
    );
  }
}
