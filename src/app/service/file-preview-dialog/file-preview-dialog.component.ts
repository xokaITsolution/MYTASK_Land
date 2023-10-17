import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";

@Component({
  selector: "app-file-preview-dialog",
  templateUrl: "./file-preview-dialog.component.html",
  styleUrls: ["./file-preview-dialog.component.css"],
})
export class FilePreviewDialogComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}
  ngOnInit() {
    console.log(this.config.data);
  }
}
