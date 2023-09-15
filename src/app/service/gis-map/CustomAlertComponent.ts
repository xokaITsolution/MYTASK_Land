import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-custom-alert',
  template: `
<!-- //aa -->
    <div class="modal-header">
    <h4 > ማስጠንቀቂያ </h4>
      <button type="button" class="close" (click)="bsModalRef.hide()">
        <span>&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <h4>  {{ message }} </h4>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="bsModalRef.hide()">ዝጋ</button>
    </div>
  `,
  styleUrls: ['gis-map.component.css'],
})
export class CustomAlertComponent {
  title: string;
  message: any;

  constructor(public bsModalRef: BsModalRef) {}
}