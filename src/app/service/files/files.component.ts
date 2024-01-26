import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
// import { ServiceComponent } from "../service.component";
import { ServiceService } from "../service.service";

import { NotificationsService } from "angular2-notifications";
import { environment } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
// import { TranslateModule } from "@ngx-translate/core";
import { RecordComponent } from "../record/record.component";
@Component({
  selector: "app-files",
  templateUrl: "./files.component.html",
  styles: ["./files.component.css"],
})
export class FilesComponent implements OnChanges {
  @Output() updated = new EventEmitter();
  @Output() getalldoc = new EventEmitter<{ Licence_ID: any; DocID: any }>();
  @Input() RequiredDocs;
  @Input() AppNo;
  @Output() Upload;
  @Input() DocID;
  @Input() hide;
  @Input() licenceData;
  @Input() disabled: boolean;
  hideCloseBtn = true;
  hideDiv = true;
  // RequiredDocs = [];
  @Input() DocIDlist;
  File;
  language = "english";
  public mimeExtension = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      extension: "xlsx",
      previewable: false,
    },
    "application/vnd.ms-excel": {
      extension: "xls",
      previewable: false,
    },
    "text/csv": {
      extension: "csv",
      previewable: false,
    },
    "application/pdf": {
      extension: "pdf",
      previewable: true,
    },
    "image/jpeg": {
      extension: "jpg",
      previewable: true,
    },
    "image/png": {
      extension: "png",
      previewable: true,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      extension: "docx",
      previewable: false,
    },
    "application/msword": {
      extension: "doc",
      previewable: false,
    },
    "image/gif": {
      extension: "gif",
      previewable: true,
    },
    "application/geojson": {
      extension: "geojson",
      previewable: false,
    },
    "application/x-zip-compressed": {
      extension: "zip",
      previewable: false,
    },
  };
  SavedFilespre: any[];
  fileUploadRequired: boolean = true;
  SavedFiles: any;

  licenceService: any;
  loadingPreDoc: boolean;
  mimeType: any;
  selectedRowIndex: any;
  fileupload: string;
  documentupload: any;
  uploadedDocumnet: boolean;
  disDocument: boolean;
  PreviewshowdialogeArray: boolean[] = [];
  PreviewshowdialogeArrayFor: boolean[] = [];
  selectdiv: any;
  hid = [];
  constructor(
    public serviceService: ServiceService,
    // public serviceComponent: ServiceComponent,
    public RecordComponent: RecordComponent,
    private notificationsService: NotificationsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (
      environment.Lang_code === "am-et" ||
      environment.Lang_code === "am-ET"
    ) {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
  }

  ngOnChanges(changes) {
    console.log("appppppppno", this.AppNo);
    console.log("DocdddIDD", this.DocIDlist, this.RequiredDocs, this.hide);
    console.log(
      "this.RecordComponent.RequerdDocspre",
      this.RecordComponent.RequerdDocspre[0].hidden
    );

    if (this.DocIDlist != null || this.DocIDlist != undefined) {
      this.serviceService
        .getLicenceService(this.AppNo)
        .subscribe((licenceService) => {
          this.licenceService = licenceService;
          console.log("Licence Service", this.licenceService);
          this.licenceData = this.licenceService.list[0];

          console.log("DocIDD", this.DocIDlist, this.licenceData);
          this.getRequiredDocs(
            this.DocIDlist.task_code,
            this.DocIDlist.application_detail_id
          );
        });
    }
    if (this.RequiredDocs) {
      this.RecordComponent.RequerdDocspre = this.RequiredDocs;
      console.log("DocIDD", this.RecordComponent.RequerdDocspre, this.DocID);
      this.serviceService
        .getLicenceService(this.AppNo)
        .subscribe((licenceService) => {
          this.licenceService = licenceService;
          console.log("Licence Service", this.licenceService);
          this.licenceData = this.licenceService.list[0];
          this.getAllDocumentpre(
            this.licenceData.Licence_Service_ID,
            this.DocID
          );
        });
    }

    if (this.RecordComponent.RequerdDocspre != undefined) {
      for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
        console.log(
          "this.RequiredDocs[i].description_en.indexOf('*')",
          this.RecordComponent.RequerdDocspre[i].description_en.indexOf("*")
        );
        if (
          this.RecordComponent.RequerdDocspre[i].description_en.indexOf("*") !==
          -1
        ) {
          const descriptionEn =
            this.RecordComponent.RequerdDocspre[i].description_en;
          this.RecordComponent.RequerdDocspre[i].description_en =
            descriptionEn.slice(0, descriptionEn.length - 1);

          this.RecordComponent.RequerdDocspre[i].required = true;
        }
      }
      this.updated.emit({ docs: this.RecordComponent.RequerdDocspre });
      // }
    }
  }
  getAllDocument() {
    this.serviceService
      .getAllDocument(this.licenceData.Licence_Service_ID, this.DocID)
      .subscribe(
        (SavedFiles) => {
          this.SavedFiles = SavedFiles;
          if (this.RequiredDocs != null) {
            for (let i = 0; i < this.RequiredDocs.length; i++) {
              for (let j = 0; j < SavedFiles.length; j++) {
                //this.RequiredDocs[i].mimeType = "pdf";
                if (
                  this.RecordComponent.RequerdDocspre[i].requirement_code ==
                  SavedFiles[j].requirement_code
                ) {
                  this.RecordComponent.RequerdDocspre[i].File =
                    "data:image/jpg;base64, " + SavedFiles[j].document;
                  this.RequiredDocs[i].File =
                    this.sanitizer.bypassSecurityTrustResourceUrl(
                      this.RecordComponent.RequerdDocspre[i].File
                    );

                  this.RequiredDocs[i].document_code =
                    SavedFiles[j].document_code;
                }
              }
            }

            console.log("SavedFiles", this.RecordComponent.RequerdDocspre);
          }
        },
        (error) => {
          console.log("error");
        }
      );
  }
  extractExtensionFromFileName(fileName) {
    if (fileName) {
      let fileNameSegment = (fileName as string).split(".");
      return `application/${fileNameSegment[fileNameSegment.length - 1]}`;
    }
    return "";
  }
  getRequiredDocs(taskID, application_detail_id) {
    this.serviceService.getRequerdDocs(taskID).subscribe(
      (RequerdDocs) => {
        this.RecordComponent.RequerdDocspre = RequerdDocs;
        this.RecordComponent.RequerdDocspre = RequerdDocs;
        console.log(
          " this.RecordComponent.RequerdDocspre",
          this.RecordComponent.RequerdDocspre
        );

        for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
          if (
            this.RecordComponent.RequerdDocspre[i].description_en == "Dummy"
          ) {
            this.RecordComponent.RequerdDocspre.splice(i, 1);
            break;
          }
        }

        console.log("RequerdDocs", this.RecordComponent.RequerdDocspre);
        console.log("trying geting documents by ", this.licenceData);
        if (this.licenceData) {
          console.log(
            "trying geting documents by ",
            this.licenceData.Licence_Service_ID
          );
          console.log("geting documents");
          if (this.licenceData.Licence_Service_ID) {
            console.log("geting documents");
            this.getAllDocumentpre(
              this.licenceData.Licence_Service_ID,
              application_detail_id
            );
          }
        }
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getAllDocumentpre(Licence_Service_ID, DocID) {
    this.loadingPreDoc = true;
    this.serviceService.getAllDocument(Licence_Service_ID, DocID).subscribe(
      (SavedFiles) => {
        this.loadingPreDoc = false;
        console.log("pdf file", SavedFiles);
        this.SavedFilespre = SavedFiles;
        for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
          for (let j = 0; j < SavedFiles.length; j++) {
            if (
              this.RecordComponent.RequerdDocspre[i].requirement_code ==
              SavedFiles[j].requirement_code
            ) {
              try {
                let fileData = JSON.parse(atob(SavedFiles[j].document));

                let { type, data } = fileData;

                this.RecordComponent.RequerdDocspre[i].mimeType = type;
                this.RecordComponent.RequerdDocspre[i].File =
                  "data:" + type + ";base64, " + data;
                this.RecordComponent.RequerdDocspre[i].File =
                  this.sanitizer.bypassSecurityTrustResourceUrl(
                    this.RecordComponent.RequerdDocspre[i].File
                  );

                this.RecordComponent.RequerdDocspre[i].document_code =
                  SavedFiles[j].document_code;
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
        console.log("SavedFiles", this.SavedFiles);
        console.log("SavedFilesPre", this.RecordComponent.RequerdDocspre);
        this.RecordComponent.RequerdDocspre.forEach((item, index) => {
          this.PreviewshowdialogeArray[index] = false; // Initialize all dialog variables to false
        });
        this.RecordComponent.RequerdDocspre.forEach((item, index) => {
          this.PreviewshowdialogeArrayFor[index] = false; // Initialize all dialog variables to false
        });
      },
      (error) => {
        console.log("error");
      }
    );
  }
  showdiv(i) {
    this.selectdiv = i;
    console.log("this.selectdiv", this.selectdiv);
  }

  Uploader(File, RequiredDoc, fild) {
    console.log("RequiredDoc", RequiredDoc);
    console.log("File ", File);
    let base64file;
    let fullbase64;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      fullbase64 = base64file;
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      base64file = base64file.split(";")[1];
      let type =
        File.type != ""
          ? File.type
          : this.extractExtensionFromFileName(File.name);
      let base64FileData = btoa(
        JSON.stringify({
          type,
          data: base64file,
        })
      );
      for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
        try {
          this.disDocument = false;
          let fileData = JSON.parse(window.atob(base64FileData));
          let { type, data } = fileData;
          this.mimeType = type;
          this.fileupload = "data:" + type + ";base64, " + data;
          this.uploadedDocumnet = true;

          this.documentupload = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.fileupload
          );
          console.log(this.documentupload);
        } catch (e) {
          console.error(e);
        }
      }

      console.log("this.DocID", this.DocID);
      this.serviceService
        .saveFile(
          base64FileData,
          type,
          this.AppNo,
          RequiredDoc.requirement_code,
          "Start",
          RequiredDoc.description_en,
          this.DocID
        )
        .subscribe(
          (message) => {
            console.log("message", message);
            if (message[0] !== "" || message[1] !== "" || message[2] !== "") {
              RequiredDoc.File =
                this.sanitizer.bypassSecurityTrustResourceUrl(fullbase64);
              RequiredDoc.fileName = File.name;
              RequiredDoc.mimeType = File.type;
              RequiredDoc.document_code = message[2];
              fild.clear();
              // this.RecordComponent.RequerdDocspre.forEach((item, index) => {
              //   this.PreviewshowdialogeArray[index] = true; // Initialize all dialog variables to false
              // });
              console.log("AppNjjjo", this.AppNo);
              this.getalldoc.emit({
                Licence_ID: message[0],
                DocID: this.DocID,
              });
              this.RecordComponent.AppCodeFromFile = this.AppNo;
              this.RecordComponent.DocIdFromFile = this.DocID;
              const toast = this.notificationsService.success(
                "Success",
                "Uploaded successfully"
              );
              this.updated.emit({ docs: this.RecordComponent.RequerdDocspre });
            } else {
              console.log("error");
              const toast = this.notificationsService.error(
                "Error",
                "SomeThing Went Wrong"
              );
            }
          },
          (error) => {
            console.log("error");
            const toast = this.notificationsService.error(
              "Error",
              "SomeThing Went Wrong"
            );
          }
        );
    });
    console.log("this.RequiredDocs", this.RecordComponent.RequerdDocspre);
  }

  previewdocumnet(file) {}

  upload(event, RequiredDoc, fild) {
    this.Uploader(event.files[0], RequiredDoc, fild);
    console.log("event", event);
    console.log("RequiredDoc", RequiredDoc);
    console.log("this.RequiredDocs", this.RecordComponent.RequerdDocspre);
    for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
      if (
        RequiredDoc.requirement_code ===
        this.RecordComponent.RequerdDocspre[i].requirement_code
      ) {
        this.RecordComponent.RequerdDocspre[i].uploded = 1;
      }
    }
    console.log("files", event.files);
  }

  removeUpload(RequiredDoc) {
    this.serviceService.RemoveDoc(RequiredDoc.document_code).subscribe(
      (message) => {
        const toast = this.notificationsService.success("Sucess", message);

        for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
          if (
            this.RecordComponent.RequerdDocspre[i].requirement_code ==
            RequiredDoc.requirement_code
          ) {
            this.RecordComponent.RequerdDocspre[i].File = "";
            this.RecordComponent.RequerdDocspre[i].document_code = "";
            this.updated.emit({ docs: this.RecordComponent.RequerdDocspre });
          }
        }
        console.log("RequiredDocs", this.RecordComponent.RequerdDocspre);
      },
      (error) => {
        console.log("error");
        const toast = this.notificationsService.error(
          "Error",
          "SomeThing Went Wrong"
        );
      }
    );
  }
}
