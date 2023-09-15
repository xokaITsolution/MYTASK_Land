import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  name = 'Angular';
  pdfSrc 

  contentLoaded() {
    console.log('File loaded');
  }
  globvar
  getdata(globvar){
    console.log(globvar)
    this.pdfSrc = 'http://localhost/cdn/json/'+globvar;
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
  constructor() { }

  ngOnInit() {
  }

}
