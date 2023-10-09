import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  name = 'Angular';
  pdfSrc :any=''

  contentLoaded() {
    console.log('File loaded');
  }
  woreda
  globvar
  getdata(a,b){
    console.log()
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(environment.folderpath+a+'/'+b);
    return
   
  }

  selectFolder(event: any) {
    const selectedFiles = event.target.files;

    if (selectedFiles.length > 0) {
      // You can access the selected folder(s) here.
      // For example, you can log the names of the selected folders.
      for (let i = 0; i < selectedFiles.length; i++) {
        const folder = selectedFiles[i];
        console.log(`Selected folder: ${folder.webkitRelativePath}`);
      }
    }
  }
  constructor(private sanitizer: DomSanitizer,) { }

  ngOnInit() {
  }

}
