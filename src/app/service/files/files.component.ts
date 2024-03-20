import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
// import { ServiceComponent } from "../service.component";
import { ServiceService } from "../service.service";
import { PDFDocument } from "pdf-lib";
import { NotificationsService } from "angular2-notifications";
import { environment } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
// import { TranslateModule } from "@ngx-translate/core";
import { RecordComponent } from "../record/record.component";
import { jsPDF } from "jspdf";
import * as pako from "pako";

@Component({
  selector: "app-files",
  templateUrl: "./files.component.html",
  styles: ["./files.component.css"],
})
export class FilesComponent implements OnChanges {
  displayu: boolean = false;
  @Output() updated = new EventEmitter();
  @Output() getalldoc = new EventEmitter<{ Licence_ID: any; DocID: any }>();
  @Input() RequiredDocs;
  @Input() AppNo;
  @Output() Upload;
  @Input() DocID;
  @Input() hide;
  @Input() licenceData;
  @Input() disabled: boolean;
  @Input() disable;
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
    "image/tiff": {
      extension: "tiff",
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
  mergedPDFBase64: any;
  currentfild: any;

  currentreuerdoc: any;
  mergedfile: any;
  downloadmergedfile: boolean;
  downloadfile: boolean;
  remove: boolean;
  username: string;
  userid: any;
  documentss: boolean = false;
  mimeTypee: any;
  documents: any;
  preview = false;
  useridfromdoc: any;
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
    this.username = environment.username;
    this.serviceService.getaspnetuser().subscribe((r) => {
      this.userid = r[0].userid;
    });
    console.log("appppppppno", this.AppNo);

    // if (this.RequiredDocs != undefined) {
    //   this.RecordComponent.RequerdDocspre = this.RequiredDocs;
    //   console.log("DocIDD", this.RecordComponent.RequerdDocspre, this.DocID);
    //   this.serviceService
    //     .getLicenceService(this.AppNo)
    //     .subscribe((licenceService) => {
    //       this.licenceService = licenceService;
    //       console.log("Licence Service", this.licenceService);
    //       this.licenceData = this.licenceService.list[0];
    //       if (this.licenceData.length > 0) {
    //         this.getAllDocumentpre(
    //           this.licenceData.Licence_Service_ID,
    //           this.DocID
    //         );
    //       }
    //     });
    // }

    if (this.RecordComponent.RequerdDocspre != undefined) {
      for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
        // console.log(
        //   "this.RequiredDocs[i].description_en.indexOf('*')",
        //   this.RecordComponent.RequerdDocspre[i].description_en.indexOf("*")
        // );
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
  getAllDocumentprebydoc(RequerdDocpre) {
    // this.loadingPreDoc = true;
    console.log("pdf filessss", RequerdDocpre);
  }
  getAllDocumentpre(Licence_Service_ID, DocID) {
    this.loadingPreDoc = true;
    let updatedArray: any[] = [];
    this.serviceService.getAllDocuments(Licence_Service_ID, DocID).subscribe(
      (SavedFiles) => {
        let SavedFile = SavedFiles;
        console.log("SavedFiiiilessssffff", SavedFile);
        if (SavedFile.length > 0) {
          this.processSavedFiles(SavedFile);
        } else {
          //  this.RecordComponent.RequerdDocspre = [""];
          //  this.serviceService.getRequerdDocs(taskid).subscribe((res) => {
          //    this.RecordComponent.RequerdDocspre = res;
          //    for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
          //      if (
          //        this.RecordComponent.RequerdDocspre[i].description_en == "Dummy"
          //      ) {
          //        this.RecordComponent.RequerdDocspre.splice(i, 1);
          //        break;
          //      }
          //    }
          //  });
        }
      },
      (error) => {
        this.loadingPreDoc = false;
        console.log("error");
      }
    );
  }
  processSavedFiles(SavedFiles) {
    let updatedArray: any[] = [];
    this.loadingPreDoc = false;
    this.SavedFilespre = SavedFiles;
    for (let j = 0; j < SavedFiles.length; j++) {
      let updatedObject = {
        // Copy the existing properties from the original object
        is_hidde: this.hid,
      };
      updatedArray.push(updatedObject);
    }
    this.hide = updatedArray;
    if (
      this.RecordComponent.RequerdDocspre != null ||
      this.RecordComponent.RequerdDocspre != undefined
    )
      for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
        // console.log("pdf fileeee", this.RecordComponent.RequerdDocspre[i]);
        for (let j = 0; j < SavedFiles.length; j++) {
          if (
            this.RecordComponent.RequerdDocspre[i].requirement_code ==
            SavedFiles[j].requirement_code
          ) {
            console.log("updatedArray", updatedArray[j]);
            try {
              this.RecordComponent.RequerdDocspre[i].hidden =
                SavedFiles[j].UserId;
              console.log(
                "updatedArrayyyyy",
                this.RecordComponent.RequerdDocspre[i].hidden
              );
              this.RecordComponent.RequerdDocspre[i].document_code =
                SavedFiles[j].document_code;
              this.RequiredDocs = this.RecordComponent.RequerdDocspre;
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    this.hide = updatedArray;
    console.log("SavedFileeeees", updatedArray);
    console.log("RequerdDocspre", this.RecordComponent.RequerdDocspre);
    this.RecordComponent.RequerdDocspre.forEach((item, index) => {
      this.PreviewshowdialogeArray[index] = false; // Initialize all dialog variables to false
    });
  }
  showdiv(doc) {
    this.documentss = false;
    this.serviceService.getAllDocumentt(doc).subscribe((r) => {
      let fileData = JSON.parse(atob(r[0].document));

      let { type, data } = fileData;

      this.mimeTypee = type;
      console.log("mimeTypeemimeTypee", this.mimeTypee);
      let file = "data:" + type + ";base64, " + data;

      this.documents = this.sanitizer.bypassSecurityTrustResourceUrl(file);

      this.documentss = true;
      this.useridfromdoc = r[0].userId;
      console.log("responceses", r[0].userId, this.userid);
    });
    console.log("documentsdoc");
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
              //fild.clear();
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
        this.preview = false;
        for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
          if (
            this.RecordComponent.RequerdDocspre[i].requirement_code ==
            RequiredDoc.requirement_code
          ) {
            this.RecordComponent.RequerdDocspre[i].File = "";
            this.RecordComponent.RequerdDocspre[i].document_code = "";
            this.hideDiv = true;
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
  onFileDropped($file) {
    // Handle the dropped files here
    console.log("Dropped files:", $file.target.files);
    const maxSize = 3 * 1024 * 1024; // 5MB in bytes
    let totalSize = 0;
    for (let i = 0; i < $file.target.files.length; i++) {
      totalSize += $file.target.files[i].size;
    }
    if (totalSize > maxSize) {
      const toast = this.notificationsService.error(
        `The total size of selected files exceeds the maximum allowed size.(3MB)`
      );
      this.serviceService.fileexxcedlimit = true;
      return false;
    } else {
      this.serviceService.fileexxcedlimit = false;
      this.uploadedFile($file);
    }
    // Proceed with uploading the files

    // Perform any necessary operations with the files
  }

  sorereuired(RequerdDocpre, fild) {
    this.currentreuerdoc = RequerdDocpre;
    this.currentfild = fild;
    this.mergedPDFBase64 = null;
  }
  async uploadedFile(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 1) {
      this.mergedfile = await this.mergeFiles(files);
    } else if (files.length === 1) {
      this.mergedfile = await files[0];
      this.downloadmergedfile = false;
    }

    // Convert the merged PDF to base64 string
    const base64String = await this.convertToBase64(this.mergedfile);

    //console.log("Merged PDF Base64:", base64String);
    this.mergedPDFBase64 = base64String;
    if (this.mergedPDFBase64) {
      this.Uploadermlti(
        this.mergedPDFBase64,
        this.currentreuerdoc,
        this.currentfild
      );
    }

    // Enable the download button
    this.enableDownloadButton();
  }
  async convertToBase64(content: File | PDFDocument): Promise<string> {
    if (content instanceof PDFDocument) {
      return content.saveAsBase64({ dataUri: true });
    } else {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(content);
      });
    }
  }

  async mergeFiles(files: FileList): Promise<PDFDocument> {
    const mergedPdf = await PDFDocument.create();

    // Iterate through each file
    for (let i = 0; i < files.length; i++) {
      const fileReader = new FileReader();

      // Read the file as ArrayBuffer
      const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
        fileReader.onload = (e: any) => resolve(e.target.result);
        fileReader.onerror = (e) => reject(e);
        fileReader.readAsArrayBuffer(files[i]);
      });

      // Check if the file is PDF or image
      const fileType = files[i].type;
      if (fileType === "application/pdf") {
        // If the file is PDF, load and merge it
        const pdf = await PDFDocument.load(fileData);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      } else if (fileType.startsWith("image/")) {
        // If the file is an image, convert it to PDF and then merge it
        const imagePdf = await this.imageToPdf(fileData);
        const pages = await mergedPdf.copyPages(
          imagePdf,
          imagePdf.getPageIndices()
        );
        pages.forEach((page) => mergedPdf.addPage(page));
      }
    }
    console.log("mergedPdfmergedPdfmergedPdfmergedPdf", mergedPdf);

    return mergedPdf;
  }

  async imageToPdf(imageData: ArrayBuffer): Promise<PDFDocument> {
    const imagePdf = await PDFDocument.create();
    const image = await imagePdf.embedJpg(imageData);
    const page = imagePdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
    return imagePdf;
  }

  enableDownloadButton() {
    const downloadButton = document.getElementById("downloadButton");
    if (downloadButton) {
      downloadButton.removeAttribute("disabled");
    }
  }

  downloadMergedPdf() {
    if (this.mergedPDFBase64) {
      // Convert the base64 string back to Uint8Array
      const bytes = Uint8Array.from(
        atob(this.mergedPDFBase64.split(",")[1]),
        (c) => c.charCodeAt(0)
      );

      // Create a blob with the PDF data
      const blob = new Blob([bytes], { type: "application/pdf" });

      // Create a download link
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "merged_document.pdf";

      // Click the link to trigger the download
      link.click();
    }
  }
  // uploadedFile(event: any) {
  //   const files: FileList = event.target.files;
  //   const filePromises: Promise<Uint8Array>[] = [];

  //   // Read each file and push the promise to the array
  //   for (let i = 0; i < files.length; i++) {
  //     const fileReader = new FileReader();
  //     const filePromise = new Promise<Uint8Array>((resolve, reject) => {
  //       fileReader.onload = (e: any) =>
  //         resolve(new Uint8Array(e.target.result));
  //       fileReader.onerror = (e) => reject(e);
  //     });

  //     fileReader.readAsArrayBuffer(files[i]);
  //     filePromises.push(filePromise);
  //   }

  //   // Once all files are read, merge them into a single PDF
  //   Promise.all(filePromises)
  //     .then((fileUint8Arrays: Uint8Array[]) => {
  //       const pdfDoc = new jsPDF(); // Create a new instance of jsPDF

  //       // Add each file content to the PDF
  //       for (const uint8Array of fileUint8Arrays) {
  //         pdfDoc.addPage();
  //         pdfDoc.addImage({
  //           imageData: uint8Array,
  //           x: 0,
  //           y: 0,
  //           width: 210, // A4 width in mm
  //           height: 297, // A4 height in mm
  //         });
  //       }

  //       // Convert the merged PDF to base64 string
  //       const base64String = pdfDoc.output("datauristring");

  //       // Now you have the merged PDF as a base64 string
  //       console.log("Merged PDF Base64:", base64String);
  //       this.mergedPDFBase64 = pdfDoc.output("datauristring");
  //       // You can perform further operations with the base64 string if needed

  //       if (this.mergedPDFBase64) {
  //         this.Uploadermlti(
  //           this.mergedPDFBase64,
  //           this.currentreuerdoc,
  //           this.currentfild
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error reading files:", error);
  //     });
  // }

  async Uploadermlti(File, RequiredDoc, fild) {
    console.log("RequiredDoc", RequiredDoc);
    // Step 1: Remove the 'base64,' prefix
    let base64file;
    let fullbase64;

    // Extract the base64 data from this.mergedPDFBase64
    base64file = File.split(",")[1];
    // Remove any potential headers from the base64 data
    const re = /base64,/gi;
    base64file = base64file.replace(re, "");
    console.log("🚀 ~ Uploadermlti ~ base64file:", base64file);

    const typeRegex = /data:([^;]+)/;
    const nameRegex = /filename=([^;]+)/;
    const typeMatch = this.mergedPDFBase64.match(typeRegex);
    const nameMatch = this.mergedPDFBase64.match(nameRegex);
    const type = typeMatch ? typeMatch[1] : "application/pdf";
    const name = nameMatch ? nameMatch[1] : "mergedfile";

    let base64FileData = btoa(
      JSON.stringify({
        type,
        data: base64file,
      })
    );
    fullbase64 = base64FileData;

    console.log("🚀 ~ Uploadermlti ~ base64FileData:", fullbase64);

    for (let i = 0; i < this.RecordComponent.RequerdDocspre.length; i++) {
      try {
        this.disDocument = false;
        let fileData = JSON.parse(window.atob(base64FileData));
        console.log("🚀 ~ Uploadermlti ~ fileData:", fileData);
        let { type, data } = fileData;
        this.mimeType = type;
        this.fileupload = "data:" + type + ";base64, " + fullbase64;
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
              this.sanitizer.bypassSecurityTrustResourceUrl(base64FileData);
            RequiredDoc.fileName = name;
            RequiredDoc.mimeType = type;
            RequiredDoc.document_code = message[2];
            this.getAllDocumentpre(this.AppNo, this.DocID);
            //fild.clear();
            // this.RecordComponent.RequerdDocspre.forEach((item, index) => {
            //   this.PreviewshowdialogeArray[index] = true; // Initialize all dialog variables to false
            // });
            console.log("AppNjjjo", this.AppNo);
            this.getalldoc.emit({
              Licence_ID: message[0],
              DocID: this.DocID,
            });
            this.downloadmergedfile = true;
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
    console.log("this.RequiredDocs", this.RecordComponent.RequerdDocspre);
  }
  async compressBase64File(base64Data: string): Promise<Uint8Array> {
    // Decode base64 data to bytes
    const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Load PDF document
    const pdfDoc = await PDFDocument.load(bytes).catch((error) => {
      console.error("Error loading PDF document:", error);
      throw error; // Re-throw the error to handle it outside
    });

    // Save compressed PDF
    const compressedPdfBytes = await pdfDoc.save();

    return compressedPdfBytes;
  }

  downloadPDF() {
    const link = document.createElement("a");
    link.href = this.mergedPDFBase64;
    link.download = "merged_pdf.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
