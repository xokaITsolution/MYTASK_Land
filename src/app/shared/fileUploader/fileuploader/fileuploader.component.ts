import { Component, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";


@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.css']
})


 export class FileuploaderComponent {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
 @Output() fileDropped: EventEmitter<any> = new EventEmitter<any>();

  /**
   * on file drop handler
   */
  // onFileDropped($event) {
  //   this.fileDropped.emit($event);
  //   this.prepareFilesList($event);
  //     console.log("uploadfile",$event);
  // }
   onFileDropped(files: FileList) {
   
      this.fileDropped.emit(files);
    this.prepareFilesList(files);
    console.log('Uploaded files:',files);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: FileList) {
    console.log('Uploaded files:', files);
     
    this.fileDropped.emit(files);

    this.prepareFilesList(files);
      
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files) {
    console.log(files);
  
     let   eachfiles= files.target.files
    
    
    for (const item of eachfiles) {
      item.progress = 0;
      this.files.push(item);
    }
   // this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}